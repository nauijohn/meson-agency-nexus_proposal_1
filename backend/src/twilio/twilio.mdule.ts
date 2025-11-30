import { Module } from "@nestjs/common";

import { FrontendAudioGateway } from "./frontend.gateway";
import { TwilioController } from "./twilio.controller";
import { TwilioStreamGateway } from "./twilio.gateway";

@Module({
  controllers: [TwilioController],
  providers: [TwilioStreamGateway, FrontendAudioGateway],
})
export class TwilioModule {}
