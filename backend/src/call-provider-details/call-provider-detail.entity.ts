import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { CallProvider } from "../call-providers/call-provider.entity";
import { Call } from "../calls/call.entity";

@Entity({ name: "call_provider_details" })
export class CallProviderDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Call)
  call: Call;

  @ManyToOne(() => CallProvider)
  provider: CallProvider;

  @Column({ nullable: true })
  providerCallId: string; // e.g., Twilio SID or Zoom call ID

  @Column({
    type: "enum",
    enum: [
      "queued",
      "ringing",
      "in-progress",
      "completed",
      "failed",
      "no-answer",
    ],
    nullable: true,
  })
  providerStatus: string;

  @Column({ type: "int", nullable: true })
  duration: number; // duration reported by provider in seconds

  @Column({ type: "text", nullable: true })
  providerNotes: string; // optional notes / error messages

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
