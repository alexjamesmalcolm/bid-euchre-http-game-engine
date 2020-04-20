import { uuid, Phase, startGame } from "../deps.ts";
import { Lobby } from "./lobby.ts";
import { Store, StoredObject } from "./base.ts";

export class Game implements StoredObject {
  readonly id: string = uuid.generate();
  phase: Phase;
  constructor(lobby: Lobby) {
    const players = lobby.getPlayersIfReady();
    if (players) {
      const phase = startGame(players);
      if (Array.isArray(phase)) {
        throw phase[1];
      } else {
        this.phase = phase;
      }
    } else {
      throw "The lobby is not ready";
    }
  }
}

export const gameStore = new Store<Game>();
