import { It, Mock, Times } from "moq.ts";
import { UserInputError } from "apollo-server-express";
import { MeetingRoom, Reservation } from "../../entities";
import { ReservationService } from "../ReservationService";
import {
  ReservationRepository,
  MeetingRoomRepository,
} from "../../repositories";

describe("ReservationService - createReservation() - ", () => {
  let reservationRepoMock: Mock<ReservationRepository>;
  let mrRepoMock: Mock<MeetingRoomRepository>;

  beforeEach(() => {
    reservationRepoMock = new Mock<ReservationRepository>();
    mrRepoMock = new Mock<MeetingRoomRepository>();
  });

  it("should throw invalid user input error if meeting room not found", async () => {
    // Arrange
    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRoomById("123", It.IsAny<string[]>()))
      .returnsAsync(void null)
      .object();

    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.createReservation(It.IsAny<Reservation>()))
      .returnsAsync(new Reservation())
      .object();
    const reservation = new Reservation();
    reservation.meetingRoomId = "123";

    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    try {
      await sut.createReservation(reservation, []);
    } catch (e) {
      // Assert
      expect(
        e.message.toLowerCase().includes("could not find any entity")
      ).toBe(true);

      mrRepoMock.verify(
        (i) => i.getMeetingRoomById("123", It.IsAny<string[]>()),
        Times.Once()
      );
      reservationRepoMock.verify(
        (i) => i.createReservation(It.IsAny<Reservation>()),
        Times.Never()
      );
    }
  });

  it("should throw invalid user input error if user has one or more reservations", async () => {
    // Arrange
    const meetingRoom = new MeetingRoom();
    meetingRoom.id = "123";

    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()))
      .returnsAsync(meetingRoom)
      .object();

    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.createReservation(It.IsAny<Reservation>()))
      .returnsAsync(new Reservation())
      .object();

    const reservation = new Reservation();
    reservation.meetingRoomId = meetingRoom.id;

    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    try {
      await sut.createReservation(reservation, [new Reservation()]);
    } catch (e) {
      // Assert
      const ex = e as UserInputError;
      expect(ex.extensions.code).toBe("BAD_USER_INPUT");

      mrRepoMock.verify(
        (i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()),
        Times.Once()
      );
      reservationRepoMock.verify(
        (i) => i.createReservation(It.IsAny<Reservation>()),
        Times.Never()
      );
    }
  });

  it("should throw invalid user input error if meeting room is full", async () => {
    // Arrange
    const meetingRoom = new MeetingRoom();
    meetingRoom.id = "123";
    meetingRoom.reservations = [new Reservation()];
    meetingRoom.startTimeHr = 9;
    meetingRoom.endTimeHr = 10;
    meetingRoom.reservationIntervalHr = 1;

    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()))
      .returnsAsync(meetingRoom)
      .object();

    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.createReservation(It.IsAny<Reservation>()))
      .returnsAsync(new Reservation())
      .object();

    const reservation = new Reservation();
    reservation.meetingRoomId = meetingRoom.id;

    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    try {
      await sut.createReservation(reservation, []);
    } catch (e) {
      // Assert
      const ex = e as UserInputError;
      expect(ex.extensions.code).toBe("BAD_USER_INPUT");

      mrRepoMock.verify(
        (i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()),
        Times.Once()
      );
      reservationRepoMock.verify(
        (i) => i.createReservation(It.IsAny<Reservation>()),
        Times.Never()
      );
    }
  });

  it("should throw invalid user input error if meeting room is full", async () => {
    // Arrange
    const meetingRoom = new MeetingRoom();
    meetingRoom.id = "123";
    meetingRoom.reservations = [];
    meetingRoom.startTimeHr = 9;
    meetingRoom.endTimeHr = 10;
    meetingRoom.reservationIntervalHr = 1;

    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()))
      .returnsAsync(meetingRoom)
      .object();

    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.createReservation(It.IsAny<Reservation>()))
      .returnsAsync(new Reservation())
      .object();

    const reservation = new Reservation();
    reservation.meetingRoomId = meetingRoom.id;
    reservation.startTimeHr = 11;
    reservation.endTimeHr = 12;

    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    try {
      await sut.createReservation(reservation, []);
    } catch (e) {
      // Assert
      const ex = e as UserInputError;
      expect(ex.extensions.code).toBe("BAD_USER_INPUT");

      mrRepoMock.verify(
        (i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()),
        Times.Once()
      );
      reservationRepoMock.verify(
        (i) => i.createReservation(It.IsAny<Reservation>()),
        Times.Never()
      );
    }
  });

  it("should create reservation", async () => {
    // Arrange
    const meetingRoom = new MeetingRoom();
    meetingRoom.id = "123";
    meetingRoom.reservations = [];
    meetingRoom.startTimeHr = 9;
    meetingRoom.endTimeHr = 12;
    meetingRoom.reservationIntervalHr = 1;

    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()))
      .returnsAsync(meetingRoom)
      .object();

    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.createReservation(It.IsAny<Reservation>()))
      .returnsAsync(new Reservation())
      .object();

    const reservation = new Reservation();
    reservation.meetingRoomId = meetingRoom.id;
    reservation.startTimeHr = 11;
    reservation.endTimeHr = 12;
    reservation.userId = "456";

    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    await sut.createReservation(reservation, []);

    // Assert
    mrRepoMock.verify(
      (i) => i.getMeetingRoomById(meetingRoom.id, It.IsAny<string[]>()),
      Times.Once()
    );
    reservationRepoMock.verify(
      (i) => i.createReservation(It.IsAny<Reservation>()),
      Times.Once()
    );
  });
});

describe("ReservationService - deleteAllReservations() - ", () => {
  let reservationRepoMock: Mock<ReservationRepository>;
  let mrRepoMock: Mock<MeetingRoomRepository>;

  beforeEach(() => {
    reservationRepoMock = new Mock<ReservationRepository>();
    mrRepoMock = new Mock<MeetingRoomRepository>();
  });

  it("should call repository", async () => {
    // Arrange
    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.deleteAllReservations())
      .returnsAsync(void null)
      .object();
    const mockedMrRepo = mrRepoMock.object();
    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    await sut.deleteAllReservations();

    // Assert
    reservationRepoMock.verify((i) => i.deleteAllReservations(), Times.Once());
  });
});

describe("ReservationService - deleteReservation() - ", () => {
  let reservationRepoMock: Mock<ReservationRepository>;
  let mrRepoMock: Mock<MeetingRoomRepository>;

  beforeEach(() => {
    reservationRepoMock = new Mock<ReservationRepository>();
    mrRepoMock = new Mock<MeetingRoomRepository>();
  });

  it("should call repository", async () => {
    // Arrange
    const mockedReservationRepo = reservationRepoMock
      .setup((i) => i.deleteReservation("123"))
      .returnsAsync(void null)
      .object();
    const mockedMrRepo = mrRepoMock.object();
    const sut = new ReservationService(mockedReservationRepo, mockedMrRepo);

    // Act
    await sut.deleteReservation("123");

    // Assert
    reservationRepoMock.verify((i) => i.deleteReservation("123"), Times.Once());
  });
});
