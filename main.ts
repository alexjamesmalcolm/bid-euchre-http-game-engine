import {
  Drash,
  startGame,
  getOptions,
  chooseOption,
  determineIfPhaseIsLegal,
  isLegalOption,
  LobbyPlayer,
  Option,
  Phase,
  PlayerPosition,
} from "./deps.ts";

class ChooseOptionResource extends Drash.Http.Resource {
  static paths = ["/choose-option"];
  public PUT() {
    const phase: Phase = this.request.getBodyParam("phase");
    const [isPhaseLegal, error] = determineIfPhaseIsLegal(phase);
    if (!isPhaseLegal) return { error };
    const option: Option = this.request.getBodyParam("option");
    const currentPlayer: PlayerPosition = this.request.getBodyParam(
      "currentPlayer"
    );
    if (!isLegalOption(option, phase, currentPlayer)) {
      return { error: "Not a legal option" };
    }
    this.response.body = { phase: chooseOption(option, phase, currentPlayer) };
    return this.response;
  }
}

class GetOptionsResource extends Drash.Http.Resource {
  static paths = ["/get-options"];
  public PUT() {
    const phase: Phase = this.request.getBodyParam("phase");
    const currentPlayer: PlayerPosition = this.request.getBodyParam(
      "currentPlayer"
    );
    this.response.body = { options: getOptions(phase, currentPlayer) };
    return this.response;
  }
}

class StartGameResource extends Drash.Http.Resource {
  static paths = ["/start-game"];
  public PUT() {
    const players: [
      LobbyPlayer,
      LobbyPlayer,
      LobbyPlayer,
      LobbyPlayer
    ] = this.request.getBodyParam("players");
    const result = startGame(players);
    this.response.body = Array.isArray(result)
      ? { error: result[1] }
      : { response: result };
    return this.response;
  }
}

const server = new Drash.Http.Server({
  address: "0.0.0.0:3000",
  response_output: "application/json",
  resources: [ChooseOptionResource, GetOptionsResource, StartGameResource],
});

server.run();
