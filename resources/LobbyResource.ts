import { Drash, LobbyPlayer } from "../deps.ts";
import { lobbyStore, Lobby } from "../store/lobby.ts";

export class LobbyResource extends Drash.Http.Resource {
  static paths = ["/lobby", "/lobby/", "/lobby/:lobby_id", "/lobby/:lobby_id/"];
  public GET() {
    const lobbyId: string = this.request.getPathParam("lobby_id");
    if (lobbyId) {
      this.response.body = lobbyStore.get(lobbyId);
    } else {
      this.response.body = lobbyStore.getAll();
    }
    return this.response;
  }
  public POST() {
    const lobbyId: string = this.request.getPathParam("lobby_id");
    if (lobbyId) {
      this.response.status_code = 405;
      return this.response;
    }
    const name = this.request.getBodyParam("name");
    const leader: LobbyPlayer = { name, position: "1" };
    const lobby = new Lobby(leader);
    lobbyStore.put(lobby);
    this.response.body = lobby;
    return this.response;
  }
  public PUT() {
    const lobby: Lobby = this.request.getBodyParam("lobby");
    if (lobby) {
      lobbyStore.put(lobby);
      this.response.body = lobby;
    } else {
      this.response.status_code = 400;
      this.response.body = { error: "Expected a lobby param on JSON body" };
    }
    return this.response;
  }
  public DELETE() {
    const lobbyId: string = this.request.getPathParam("lobby_id");
    if (lobbyId) {
      lobbyStore.delete(lobbyId);
      this.response.status_code = 204;
      return this.response;
    }
    this.response.status_code = 405;
    return this.response;
  }
}