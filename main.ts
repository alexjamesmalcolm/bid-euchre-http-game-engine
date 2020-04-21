import { Drash } from "./deps.ts";
import { LobbyResource } from "./resources/LobbyResource.ts";
import { GameResource } from "./resources/GameResource.ts";
import { StatusResource } from "./resources/StatusResource.ts";

class CorsMiddleWare extends Drash.Http.Middleware {
  run() {
    if (typeof this.response?.body !== "object" && this.response) {
      this.response.body = {
        path: this.request.url_path,
        message: this.response.getStatusMessage(),
        status_code: this.response.status_code,
      };
    }
    this.response?.headers.append("Access-Control-Allow-Origin", "*");
    this.response?.headers.append("Access-Control-Allow-Methods", "*");
    this.response?.headers.append("Access-Control-Allow-Headers", "*");
  }
}

const server = new Drash.Http.Server({
  address: "0.0.0.0:3000",
  response_output: "application/json",
  resources: [GameResource, LobbyResource, StatusResource],
  middleware: {
    server_level: {
      after_request: [CorsMiddleWare],
    },
  },
});

server.run();
