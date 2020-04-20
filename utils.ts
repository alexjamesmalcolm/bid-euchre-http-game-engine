import { PlayerPosition } from "./deps.ts";

export const isPlayerPosition = (a: any): a is PlayerPosition => {
  return a === "1" || a === "2" || a === "3" || a === "4";
};
