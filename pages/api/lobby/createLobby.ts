import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { Lobby } from "@/types";

export default async function createLobby(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return new Response("Method not allowed", {
      status: 405,
    });

  try {
    const { name, maxPlayers } = req.body;
    if (!name || !maxPlayers) {
      return res.status(400).json({
        error: "Missing name or maxPlayers",
      });
    }
    const lobbies = JSON.parse(
      fs.readFileSync("./lobbies.json", "utf8")
    ) as Lobby[];

    const lobby = {
      id: Math.random().toString(36).substring(7),
      name,
      maxPlayers,
      players: [],
      host: "host",
      createdAt: new Date().toISOString(),
      status: "waiting" as "waiting",
      dictionary: "english" as "english",
      isPrivate: false,
    };

    lobbies.push(lobby);

    res.status(200).json({
      lobby,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
