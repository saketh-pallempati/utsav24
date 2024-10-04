import { Lobby, Player } from "@/types";
import fs from "fs";
import generatePrompt from "./game/generatePrompt";
import { v4 as uuidv4 } from "uuid";

export async function getLobby(id: string) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === id);
  return lobby || null;
}


export async function createLobby() {
  const newLobby: Lobby = {
    id: uuidv4(),
    name: "New Lobby",
    maxPlayers: 16,
    players: [],
    status: "waiting",
    dictionary: "english",
    host: "saketh",
    createdAt: new Date().toISOString(),
    isPrivate: false,
    lastGameStartedAt: undefined,
    lastGameEndedAt: undefined,
  };

  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  lobbies.push(newLobby);
  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));

  setInterval(() => {
    const now = Date.now();
    const updatedLobbies = lobbies.filter((lobby) => {
      if (lobby.lastGameEndedAt && now - lobby.lastGameEndedAt > 1000 * 60 * 30) {
        console.log(`Deleting inactive lobby: ${lobby.id}`);
        return false;
      }
      return true;
    });

    if (updatedLobbies.length !== lobbies.length) {
      fs.writeFileSync("./lobbies.json", JSON.stringify(updatedLobbies));
    }
  }, 1000 * 60 * 30);

  return newLobby;
}
export async function addPlayerToLobby(lobbyId: string, player: Player) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  lobbies[lobbies.indexOf(lobby)].players = [...lobby.players, player];
  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
  return lobby;
}

export async function removePlayerFromLobby(lobbyId: string, player: Player) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  lobbies[lobbies.indexOf(lobby)].players = lobby.players.filter(
    (cPlayer) => cPlayer.username !== player.username
  );
  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
  return lobby;
}

export async function startGameInLobby(lobbyId: string) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  lobbies[lobbies.indexOf(lobby)].status = "playing";
  lobbies[lobbies.indexOf(lobby)].gameStartedAt = Date.now();
  lobbies[lobbies.indexOf(lobby)].lastGameStartedAt = Date.now();

  lobbies[lobbies.indexOf(lobby)].words = {
    wordsUsed: [],
  };

  if (lobby.players.length < 1) {
    return console.log("Not enough players");
  }

  lobbies[lobbies.indexOf(lobby)].playersStatistics = lobby.players.map(
    (player) => ({
      username: player.username,
      lives: 3,
      wordsFound: 0,
    })
  );

  lobbies[lobbies.indexOf(lobby)].currentTurn = {
    username: lobby.playersStatistics![0].username,
    prompt: (await generatePrompt(lobbyId)) || "",
  };

  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
  return lobby;
}

export async function updateLobby(lobbyId: string, lobbyNew: Lobby) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  lobbies[lobbies.indexOf(lobby)] = lobbyNew;
  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
  return lobbyNew;
}

export async function clearLobby(lobbyId: string, finishedAt?: number) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  const cleanLobby = {
    ...lobby,
    players: [],
    words: undefined,
    playersStatistics: undefined,
    currentTurn: undefined,
    gameStartedAt: undefined,
    lastGameEndedAt: finishedAt || undefined,
    status: "waiting",
  } as Lobby;

  lobbies[lobbies.indexOf(lobby)] = cleanLobby;
  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
  return cleanLobby;
}

export async function deleteLobby(lobbyId: string) {
  const lobbies = JSON.parse(
    fs.readFileSync("./lobbies.json", "utf8")
  ) as Lobby[];

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) return console.log("Lobby not found");

  lobbies.splice(lobbies.indexOf(lobby), 1);

  fs.writeFileSync("./lobbies.json", JSON.stringify(lobbies));
}
