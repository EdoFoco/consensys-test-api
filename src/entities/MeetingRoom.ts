import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  Column,
} from "typeorm";
import { Reservation } from "./Reservation";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class MeetingRoom extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column({ type: String })
  name: string;

  @Field(() => Number)
  @Column({ type: Number, default: 1 })
  reservationIntervalHr: number;

  @Field(() => Number)
  @Column({ type: Number, default: 9 })
  startTimeHr: number;

  @Field(() => Number)
  @Column({ type: Number, default: 20 })
  endTimeHr: number;

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.meetingRoom)
  reservations: Reservation[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
