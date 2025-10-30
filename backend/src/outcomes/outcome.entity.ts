import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "outcomes" })
export class Outcome {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string; // e.g., "interested", "callback"

  @Column({ type: "enum", enum: ["positive", "neutral", "negative"] })
  category: "positive" | "neutral" | "negative"; // new field

  @Column({ type: "boolean", default: true })
  isDefault: boolean; // system default or client custom

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
