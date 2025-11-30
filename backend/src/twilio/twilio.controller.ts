import { map, Subject } from "rxjs";
import twilio, { twiml } from "twilio";
import { VoiceGrant } from "twilio/lib/jwt/AccessToken";

import { Body, Controller, Get, Header, Post, Sse } from "@nestjs/common";

import { Public } from "../common/decorators/is-public.decorator";

@Public()
@Controller("twilio")
export class TwilioController {
  private stream$ = new Subject<string>();

  @Get("token")
  @Header("Content-Type", "application/json")
  getToken() {
    console.log("Getting Twilio Token...");
    const accountSid = process.env.TWILIO_ACCOUNT_SID || "";

    const keyId = process.env.TWILIO_KEY_ID || "";
    const secretKey = process.env.TWILIO_SECRET_KEY || "";

    const appId = process.env.TWILIO_VOICE_APP_ID || "";

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appId,
      incomingAllow: true,
    });

    const token = new twilio.jwt.AccessToken(accountSid, keyId, secretKey, {
      identity: "anthony",
    });

    token.addGrant(voiceGrant);

    return { token: token.toJwt() };
  }

  // FRONTEND CONNECTS HERE
  @Public()
  @Sse()
  sendEvents() {
    return this.stream$.pipe(
      map((data) => ({ data })), // SSE format
    );
  }

  @Post("call-status")
  handleCallStatus(@Body() body: any) {
    console.log("Received call status update from Twilio:", body);
    this.stream$.next(JSON.stringify(body));
  }

  @Post("call")
  @Header("Content-Type", "text/xml")
  makeCall(@Body() body: { To: string }) {
    console.log("Making a call via Twilio...");
    console.log("Body:", body);
    const voiceResponse = new twiml.VoiceResponse();

    voiceResponse.dial().number(body.To);
    voiceResponse.start().stream({
      name: "Twilio Stream",
      url: "wss://epiploic-temperance-unwhimperingly.ngrok-free.dev/twilio-stream",
    });

    console.log("Voice Response:", voiceResponse.toString());

    return voiceResponse.toString();
  }
}
