import { MeetingRoomRepository, ReservationRepository } from "../repositories";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ReservationInput } from "../resolvers";
import { MeetingRoom, Reservation } from "../entities";
import { EntityNotFoundError } from "typeorm";
import { UserInputError } from "apollo-server-express";

@Service()
export class ReservationService {
  private rRepo: ReservationRepository;
  private mrRepo: MeetingRoomRepository;

  constructor(
    @InjectRepository(ReservationRepository)
    reservationRepository: ReservationRepository,
    @InjectRepository(MeetingRoomRepository)
    meetingRoomRepository: MeetingRoomRepository
  ) {
    this.rRepo = reservationRepository;
    this.mrRepo = meetingRoomRepository;
  }

  async deleteAllReservations(): Promise<void> {
    return await this.rRepo.deleteAllReservations();
  }

  async deleteReservation(id: string): Promise<void> {
    return await this.rRepo.deleteReservation(id);
  }

  async createReservation(
    reservationInput: ReservationInput,
    existingUserReservations: Reservation[]
  ): Promise<Reservation> {
    const meetingRoom = await this.mrRepo.getMeetingRoomById(
      reservationInput.meetingRoomId,
      ["reservations"]
    );

    if (!meetingRoom)
      throw new EntityNotFoundError(MeetingRoom, "meetingRoomId");

    /** check if user has already booked a room */
    if (existingUserReservations.length > 0) {
      throw new UserInputError(
        "Only one reservation at a time. Delete the current reservation and retry."
      );
    }

    /** check if meeting room is full */
    const totalSlots =
      (meetingRoom.endTimeHr - meetingRoom.startTimeHr) /
      meetingRoom.reservationIntervalHr;
    if (meetingRoom.reservations.length >= totalSlots) {
      throw new UserInputError("This meeting room is full.");
    }

    /** check if the reservation interval is valid against the meeting room settings */
    if (
      reservationInput.endTimeHr - reservationInput.startTimeHr !==
      meetingRoom.reservationIntervalHr
    ) {
      throw new UserInputError("Invalid start and end times", {
        endTimeHr: `Must be ${meetingRoom.reservationIntervalHr} greater than the startTimeHr`,
        startTimeHr: `Must be ${meetingRoom.reservationIntervalHr} less than the endTimeHr`,
      });
    }

    const model = new Reservation();
    model.userId = reservationInput.userId;
    model.meetingRoomId = reservationInput.meetingRoomId;
    model.startTimeHr = reservationInput.startTimeHr;
    model.endTimeHr = reservationInput.endTimeHr;

    return await this.rRepo.createReservation(model);
  }
}
