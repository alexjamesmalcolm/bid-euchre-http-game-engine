import { Drash, Option, getOptions, chooseOption, Phase } from "../deps.ts";
import { gameStore, Game } from "../store/game.ts";
import { lobbyStore, Lobby } from "../store/lobby.ts";
import { isPlayerPosition } from "../utils.ts";
export class GameResource extends Drash.Http.Resource {
  static gameIdKey = "game_id";
  static paths = [
    "/game",
    "/game/",
    `/game/:${GameResource.gameIdKey}`,
    `/game/:${GameResource.gameIdKey}/`,
  ];
  public GET() {
    const gameId: string = this.request.getPathParam(GameResource.gameIdKey);
    if (gameId) {
      const game = gameStore.get(gameId);
      if (!game) {
        this.response.status_code = 404;
        return this.response;
      }
      const position: string = this.request.getUrlQueryParam("position");
      if (position) {
        if (isPlayerPosition(position)) {
          const options = getOptions(game.phase, position);
          this.response.body = { game, options };
        } else {
          this.response.body = {
            error: `${position} is not a valid player position`,
          };
        }
      } else {
        this.response.body = { game };
      }
    } else {
      this.response.body = { games: gameStore.getAll() };
    }
    return this.response;
  }
  public POST() {
    const gameId: string = this.request.getPathParam(GameResource.gameIdKey);
    if (gameId) {
      this.response.status_code = 405;
      return this.response;
    }
    const lobbyId = this.request.getBodyParam("lobbyId");
    if (!lobbyId) {
      this.response.status_code = 400;
      this.response.body = { error: `Body missing "lobbyId" param` };
      return this.response;
    }
    const lobby: Lobby | undefined = lobbyStore.get(lobbyId);
    if (!lobby) {
      this.response.status_code = 404;
      this.response.body = { error: `Could not find lobby of id: ${lobbyId}` };
      return this.response;
    }
    const game = new Game(lobby);
    gameStore.put(game);
    this.response.body = { game };
    return this.response;
  }
  public PATCH() {
    const gameId: string = this.request.getPathParam(GameResource.gameIdKey);
    if (!gameId) {
      this.response.status_code = 405;
      return this.response;
    }
    const game = gameStore.get(gameId);
    if (!game) {
      this.response.status_code = 404;
      return this.response;
    }
    const option: Option = this.request.getBodyParam("option");
    if (!option) {
      this.response.status_code = 400;
      this.response.body = { error: `Body missing "option" param` };
      return this.response;
    }
    const position: string = this.request.getBodyParam("position");
    if (!isPlayerPosition(position)) {
      this.response.status_code = 400;
      this.response.body = {
        error: `${position} is not a valid player position`,
      };
      return this.response;
    }
    const nextPhase = chooseOption(option, game.phase, position);
    if (nextPhase.name === "Game Over") {
      gameStore.delete(gameId);
      this.response.body = {
        isGameOver: true,
      };
      return this.response;
    }
    game.phase = nextPhase;
    gameStore.put(game);
    this.response.body = { game };
    return this.response;
  }
}
