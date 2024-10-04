import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(options);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="px-6 mx-auto text-center mb-12 my-5 max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-300">Bomb Party!</span>
        </h1>
        <p className="text-lg leading-relaxed mb-8">
          Bomb Party is a fast-paced word game where players take turns creating
          words from a set of letter tiles while racing against a bomb&apos;s
          countdown timer. The player holding the bomb when it explodes loses
          the round.
        </p>

        {session ? (
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-12 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            <a href="/lobby/public">Join a Public Lobby</a>
          </button>
        ) : (
          <button className="bg-gray-700 text-gray-400 font-bold py-3 px-12 rounded-full cursor-not-allowed shadow-lg">
            <span>
              You need to sign in first
              <br />👀👉Top right
            </span>
          </button>
        )}
      </div>

    </div>
  );
}