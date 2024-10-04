import { GameTurn } from "../../types";
import { getLobby, updateLobby } from "../lobbyUtils";

export default async function startBombTimer(
  lobbyId: string,
  turnWhenBombStart: GameTurn
) {
  return new Promise<{
    isExploded: boolean;
    prompt?: string;
    times?: number;
  }>(async (resolve) => {
    // Generate a random number between 10 and 20 seconds
    const randomTimeout = Math.floor(Math.random() * 11) + 10;

    setTimeout(async () => {
      let lobby = await getLobby(lobbyId);
      if (!lobby) {
        resolve({ isExploded: false });
        return;
      }

      if (
        lobby.currentTurn?.username != turnWhenBombStart.username ||
        lobby.currentTurn?.prompt != turnWhenBombStart.prompt
      ) {
        resolve({ isExploded: false });
        return;
      }

      lobby = {
        ...lobby,
        playersStatistics: lobby.playersStatistics?.map((player) =>
          player.username === turnWhenBombStart.username
            ? { ...player, lives: player.lives - 1 }
            : player
        ),
      };

      await updateLobby(lobbyId, lobby);
      resolve({
        isExploded: true,
        prompt: lobby.currentTurn?.prompt,
      });
    }, 1000 * randomTimeout);
  });
}
