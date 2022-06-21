import { It, Mock, Times } from "moq.ts";
import { ReservationResolver } from "../ReservationResolver";
import { ReservationService, UserService } from "../../../services";
import { createFakeApiContext } from "../../../utils/testUtils";
import { ForbiddenError } from "apollo-server-express";
import { Reservation, User } from "../../../entities";
import { ReservationInput } from "../ReservationResolver.types";

describe("ReservationResolver - deleteAllReservations() - ", () => {
  let reservationServiceMock: Mock<ReservationService>;
  let userServiceMock: Mock<UserService>;

  beforeEach(() => {
    reservationServiceMock = new Mock<ReservationService>();
    userServiceMock = new Mock<UserService>();
  });

  it("should call deleteAll on ReservationService", async () => {
    // Arrange
    const mockedReservationService = reservationServiceMock
      .setup((i) => i.deleteAllReservations())
      .returnsAsync(void null)
      .object();

    const mockedUserService = userServiceMock.object();

    const sut = new ReservationResolver(
      mockedReservationService,
      mockedUserService
    );

    // Act
    await sut.deleteAllReservations();

    // Assert
    reservationServiceMock.verify(
      (instance) => instance.deleteAllReservations(),
      Times.Once()
    );
  });
});

describe("ReservationResolver - deleteReservation() - ", () => {
  let reservationServiceMock: Mock<ReservationService>;
  let userServiceMock: Mock<UserService>;

  beforeEach(() => {
    reservationServiceMock = new Mock<ReservationService>();
    userServiceMock = new Mock<UserService>();
  });

  it("should throw forbidden if reservation doesn't belong to user", async () => {
    // Arrange
    const authId = "123";
    const fakeApiContext = createFakeApiContext(undefined, authId);

    const mockedReservationService = reservationServiceMock
      .setup((i) => i.deleteReservation(It.IsAny<string>()))
      .returnsAsync(void null)
      .object();

    const mockedUserService = userServiceMock
      .setup((s) => s.getCurrentUserReservations(authId))
      .returnsAsync([])
      .object();

    const sut = new ReservationResolver(
      mockedReservationService,
      mockedUserService
    );

    // Act
    try {
      await sut.deleteReservation(fakeApiContext, "000000");
    } catch (e: unknown) {
      // Assert
      const ex = e as ForbiddenError;

      expect(ex.message.includes("Access denied")).toBeTruthy;

      userServiceMock.verify(
        (i) => i.getCurrentUserReservations(authId),
        Times.Once()
      );

      reservationServiceMock.verify(
        (instance) => instance.deleteReservation(It.IsAny<string>()),
        Times.Never()
      );
    }
  });

  it("should delete reservation", async () => {
    // Arrange
    const authId = "123";
    const fakeApiContext = createFakeApiContext(undefined, authId);
    const reservation = new Reservation();
    reservation.id = "345";

    const mockedReservationService = reservationServiceMock
      .setup((i) => i.deleteReservation("345"))
      .returnsAsync()
      .object();

    const mockedUserService = userServiceMock
      .setup((s) => s.getCurrentUserReservations(authId))
      .returnsAsync([reservation])
      .object();

    const sut = new ReservationResolver(
      mockedReservationService,
      mockedUserService
    );

    // Act
    await sut.deleteReservation(fakeApiContext, "345");
    // Assert

    userServiceMock.verify(
      (i) => i.getCurrentUserReservations(authId),
      Times.Once()
    );

    reservationServiceMock.verify(
      (instance) => instance.deleteReservation("345"),
      Times.Once()
    );
  });
});

describe("ReservationResolver - createReservation() - ", () => {
  let reservationServiceMock: Mock<ReservationService>;
  let userServiceMock: Mock<UserService>;

  beforeEach(() => {
    reservationServiceMock = new Mock<ReservationService>();
    userServiceMock = new Mock<UserService>();
  });

  it("should throw forbidden if reservation doesn't belong to user", async () => {
    // Arrange
    const authId = "123";
    const fakeApiContext = createFakeApiContext(undefined, authId);
    const user = new User();
    user.id = "345";

    const mockedReservationService = reservationServiceMock
      .setup((i) =>
        i.createReservation(
          It.IsAny<ReservationInput>(),
          It.IsAny<Reservation[]>()
        )
      )
      .returnsAsync(new Reservation())
      .object();

    const mockedUserService = userServiceMock
      .setup((s) => s.getOrCreateUserByAuthId(authId))
      .returnsAsync(user)
      .object();

    const sut = new ReservationResolver(
      mockedReservationService,
      mockedUserService
    );

    // Act
    try {
      const reservation = new Reservation();
      reservation.userId = "456";
      await sut.createReservationForCurrentUser(fakeApiContext, reservation);
    } catch (e: unknown) {
      // Assert
      const ex = e as ForbiddenError;

      expect(ex.message.includes("Access denied")).toBeTruthy;

      userServiceMock.verify(
        (i) => i.getOrCreateUserByAuthId(authId),
        Times.Once()
      );

      reservationServiceMock.verify(
        (instance) =>
          instance.createReservation(
            It.IsAny<Reservation>(),
            It.IsAny<Reservation[]>()
          ),
        Times.Never()
      );
    }
  });

  it("should create reservation", async () => {
    // Arrange
    const authId = "123";
    const fakeApiContext = createFakeApiContext(undefined, authId);
    const user = new User();
    user.id = "345";
    user.reservations = [];

    const mockedReservationService = reservationServiceMock
      .setup((i) =>
        i.createReservation(
          It.IsAny<ReservationInput>(),
          It.IsAny<Reservation[]>()
        )
      )
      .returnsAsync(new Reservation())
      .object();

    const mockedUserService = userServiceMock
      .setup((s) => s.getOrCreateUserByAuthId(authId))
      .returnsAsync(user)
      .object();

    const sut = new ReservationResolver(
      mockedReservationService,
      mockedUserService
    );

    // Act
    const reservation = new ReservationInput();
    reservation.userId = user.id;

    const result = await sut.createReservationForCurrentUser(
      fakeApiContext,
      reservation
    );

    // Assert
    userServiceMock.verify(
      (i) => i.getOrCreateUserByAuthId(authId),
      Times.Once()
    );

    reservationServiceMock.verify(
      (instance) => instance.createReservation(reservation, user.reservations),
      Times.Once()
    );

    expect(result).not.toBeNull();
  });
});
