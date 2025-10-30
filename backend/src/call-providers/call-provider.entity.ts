import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "call_providers" })
export class CallProvider {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string; // e.g., "Twilio", "Zoom", "Internal PBX"

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
