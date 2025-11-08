import { IsNotEmpty, IsString } from "class-validator";

export class CreateCampaignContactFlowStepDto {
  @IsNotEmpty()
  @IsString()
  clientContactId: string;

  // @Column({
  //   type: "enum",
  //   enum: ["none", "no_answer", "busy", "voicemail", "connect"],
  //   default: "none",
  // })
  // callResult: "none" | "no_answer" | "busy" | "voicemail" | "connect";
}
