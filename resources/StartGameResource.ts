import { Drash, startGame, LobbyPlayer } from "../deps.ts";

export class StartGameResource extends Drash.Http.Resource {
  static paths = ["/start-game"];
  public PUT() {
    const players: [
      LobbyPlayer,
      LobbyPlayer,
      LobbyPlayer,
      LobbyPlayer,
    ] = this.request.getBodyParam("players");
    const result = startGame(players);
    this.response.body = Array.isArray(result)
      ? { error: result[1] }
      : { response: result };
    return this.response;
  }
}
