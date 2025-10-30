import twilio, { twiml } from "twilio";
import { VoiceGrant } from "twilio/lib/jwt/AccessToken";

import { Body, Controller, Get, Header, Post } from "@nestjs/common";

@Controller("twilio")
export class TwilioController {
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

  @Post("call")
  @Header("Content-Type", "text/xml")
  makeCall(@Body() body: { To: string }) {
    console.log("Making a call via Twilio...");
    console.log("Body:", body);
    const voiceResponse = new twiml.VoiceResponse();

    voiceResponse.dial().number(body.To);

    console.log("Voice Response:", voiceResponse.toString());

    return voiceResponse.toString();
  }
}

// backend_service  | Body: {
// backend_service  |   ApplicationSid: 'APab0dad0b28675787f164557faabb5374',
// backend_service  |   ApiVersion: '2010-04-01',
// backend_service  |   Called: '',
// backend_service  |   Caller: 'client:anthony',
// backend_service  |   CallStatus: 'ringing',
// backend_service  |   From: '+61468167473',
// backend_service  |   To: '+61493233059',
// backend_service  |   CallSid: 'CAa8434805d9ff71ce48a346232c99b070',
// backend_service  |   Direction: 'inbound',
// backend_service  |   AccountSid: 'AC8e7ea42e23ccd3e369665d9d3ea0d9f2'
// backend_service  | }
