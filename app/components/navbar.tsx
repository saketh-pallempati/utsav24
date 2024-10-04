import React from 'react';
import Image from "next/image";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { cookies } from "next/headers";
import { Noto_Color_Emoji } from "next/font/google";

const notoColorEmoji = Noto_Color_Emoji({
  weight: "400",
  subsets: ["emoji"],
});

export default async function Navbar() {
  const session = await getServerSession(options);
  const csrf = cookies().get("next-auth.csrf-token")?.value.split("|")[0];

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2 group">
          <h1 className={`text-4xl ${notoColorEmoji.className} transition-transform group-hover:scale-110`}>
            💣
          </h1>
          <h1 className="text-3xl font-bold text-white tracking-wide group-hover:text-yellow-300 transition-colors duration-300">
            UTSAVxAZAC!
          </h1>
        </a>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <h1 className="text-lg font-semibold text-white">
              {session ? session.user?.name : "Guest"}
            </h1>
            <form
              action={session ? `/api/auth/signout` : `/api/auth/signin/discord`}
              method="POST"
              className="mt-1"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrf} />
              <input
                name="callbackUrl"
                type="hidden"
                defaultValue={process.env["NEXTAUTH_URL"] || "localhost:3000"}
              />
              <button
                className="text-sm text-indigo-200 hover:text-white transition-colors duration-300"
                type="submit"
              >
                {session ? "Log out" : "Sign in"}
              </button>
            </form>
          </div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-inner">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-inner">
              <Image
                src={session ? session.user?.image! : "/images/guest.png"}
                fill
                alt="User avatar"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}