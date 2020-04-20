import {
  Drash,
  chooseOption,
  determineIfPhaseIsLegal,
  isLegalOption,
  Option,
  Phase,
  PlayerPosition,
} from "../deps.ts";

export class ChooseOptionResource extends Drash.Http.Resource {
  static paths = ["/choose-option"];
  public PUT() {
    const phase: Phase = this.request.getBodyParam("phase");
    const [isPhaseLegal, error] = determineIfPhaseIsLegal(phase);
    if (!isPhaseLegal) return { error };
    const option: Option = this.request.getBodyParam("option");
    const currentPlayer: PlayerPosition = this.request.getBodyParam(
      "currentPlayer",
    );
    if (!isLegalOption(option, phase, currentPlayer)) {
      return { error: "Not a legal option" };
    }
    this.response.body = { phase: chooseOption(option, phase, currentPlayer) };
    return this.response;
  }
}
