import { Drash, getOptions, Phase, PlayerPosition } from "../deps.ts";

export class GetOptionsResource extends Drash.Http.Resource {
  static paths = ["/get-options"];
  public PUT() {
    const phase: Phase = this.request.getBodyParam("phase");
    const currentPlayer: PlayerPosition = this.request.getBodyParam(
      "currentPlayer",
    );
    this.response.body = { options: getOptions(phase, currentPlayer) };
    return this.response;
  }
}
