import { Drash } from "../deps.ts";

export class StatusResource extends Drash.Http.Resource {
  static paths = ["/status", "/status/"];
  public GET() {
    this.response.body = { status: "UP" };
    return this.response;
  }
}
