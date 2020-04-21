import { Drash } from "../deps.ts";

export class StatusResource extends Drash.Http.Resource {
  static paths = ["/api/status", "/api/status/"];
  public OPTIONS() {
    this.response.status_code = 200;
    this.response.headers.append("Allow", "*");
    return this.response;
  }
  public GET() {
    this.response.body = { status: "UP" };
    return this.response;
  }
}
