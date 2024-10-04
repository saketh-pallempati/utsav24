import { dictionaryType } from "@/types";
import fs from "fs";

const dictionaryCache: { [key: string]: string[] } = {};

export default function getWordsFromDictionary(dictionary: dictionaryType) {
  if (!dictionaryCache[dictionary]) {
    const data = fs.readFileSync(`./utils/dictionaries/${dictionary}.json`, "utf8");
    dictionaryCache[dictionary] = Object.keys(JSON.parse(data));
  }
  return dictionaryCache[dictionary];
}