import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  PrimaryColumn,
  Column,
  BaseEntity,
} from "typeorm";
import { User } from "./User";
import { MeetingRoom } from "./MeetingRoom";

@ObjectType()
@Entity()
export class Reservation extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => User, (user: User) => user.reservations, {
    onDelete: "CASCADE",
  })
  user: User;

  @PrimaryColumn()
  meetingRoomId: string;

  @Field(() => MeetingRoom)
  @ManyToOne(() => MeetingRoom, (room) => room.reservations, {
    onDelete: "CASCADE",
  })
  meetingRoom: MeetingRoom;

  @Field(() => Number)
  @Column({ type: Number })
  startTimeHr: number;

  @Field(() => Number)
  @Column({ type: Number })
  endTimeHr: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
