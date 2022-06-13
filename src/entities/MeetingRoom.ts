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
  @Column({ type: Number })
  reservationIntervalHr: number;

  @Field(() => Number)
  @Column({ type: Number })
  startTimeHr: Number;

  @Field(() => Number)
  @Column({ type: Number })
  endTimeHr: Number;

  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
