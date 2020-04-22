import { Store, StoredObject } from "./base.ts";
import { uuid, LobbyPlayer } from "../deps.ts";
import { Game } from "./game.ts";

export interface LobbyData extends StoredObject {
  id: string;
  players: LobbyPlayer[];
  lobbyLeader: string;
  game?: Game;
}

export class Lobby implements LobbyData {
  readonly id: string = uuid.generate();
  players: LobbyPlayer[] = [];
  lobbyLeader: string;
  game?: Game;
  constructor(leader: LobbyPlayer) {
    this.players = [leader];
    this.lobbyLeader = leader.name;
  }

  public setPlayers(players: LobbyPlayer[]) {
    this.players = players;
  }

  public get isReady(): boolean {
    if (this.players.length !== 4) {
      return false;
    }
    const uniquePositions = [
      ...new Set(this.players.map((player: LobbyPlayer) => player.position)),
    ];
    if (uniquePositions.length !== 4) {
      return false;
    }
    return true;
  }

  public getPlayersIfReady():
    | [LobbyPlayer, LobbyPlayer, LobbyPlayer, LobbyPlayer]
    | false {
    if (this.isReady) {
      return [
        this.players[0],
        this.players[1],
        this.players[2],
        this.players[3],
      ];
    }
    return false;
  }

  getPlayerByNickname(name: string): LobbyPlayer | undefined {
    return this.players.find((player: LobbyPlayer) => player.name === name);
  }
  updatePlayerPosition(player: LobbyPlayer) {
    const isPlayerInGame: boolean = !!this.getPlayerByNickname(player.name);
    if (isPlayerInGame) {
      this.removePlayer(player);
      this.addPlayer(player);
    } else {
      this.addPlayer(player);
    }
  }
  addPlayer(player: LobbyPlayer) {
    this.players = this.players.concat([player]);
  }
  removePlayer(player: LobbyPlayer) {
    this.players = this.players.filter(
      (p: LobbyPlayer) => p.name !== player.name
    );
  }
  swapPlayers(a: LobbyPlayer, b: LobbyPlayer) {
    const aSwapped: LobbyPlayer = { ...a, position: b.position };
    const bSwapped: LobbyPlayer = { ...b, position: a.position };
    this.updatePlayerPosition(aSwapped);
    this.updatePlayerPosition(bSwapped);
  }

  startGame(): Game {
    this.game = new Game(this);
    return this.game;
  }
}

export const lobbyStore = new Store<Lobby>();
