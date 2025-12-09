import { Server } from "ws";

import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

@WebSocketGateway({ path: "/twilio-audio" })
export class FrontendAudioGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.server.on("connection", (ws) => {
      ws.on("message", (message) => {
        let msgString: string;
        if (typeof message === "string") {
          msgString = message; // already a string
        } else if (message instanceof Buffer) {
          msgString = message.toString("utf8"); // decode buffer
        } else {
          // fallback for other types
          msgString = JSON.stringify(message);
        }
        console.log("Received message from client:", msgString);
      });
      ws.send(
        JSON.stringify({ message: "Welcome to the Twilio Stream Gateway!" }),
      );
    });
  }

  broadcastAudio(audioBuffer: Buffer) {
    // console.log("AUDIO BUFFER SIZE:", audioBuffer);
    this.server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(audioBuffer); // send raw PCM
      }
    });
  }

  broadcastAudio2(audioBuffer: string) {
    // console.log("AUDIO BUFFER SIZE:", audioBuffer);
    this.server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(audioBuffer); // send raw PCM
      }
    });
  }

  broadcastAudio3(audioBuffer: Buffer<ArrayBuffer>) {
    console.log("AUDIO BUFFER SIZE:", audioBuffer);
    this.server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(audioBuffer); // send raw PCM
      }
    });
  }

  broadcastAudio4(audioBuffer: ArrayBuffer) {
    console.log("AUDIO BUFFER SIZE:", audioBuffer);
    this.server.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(audioBuffer); // send raw PCM
      }
    });
  }
}
