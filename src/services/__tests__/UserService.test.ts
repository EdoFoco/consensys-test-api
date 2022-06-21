import { It, Mock, Times, PlayTimes } from "moq.ts";
import { Reservation, User } from "../../entities";
import { UserRepository } from "../../repositories";
import { UserService } from "../UserService";

describe("UserService - getCurrentUserReservations() - ", () => {
  let userRepoMock: Mock<UserRepository>;

  beforeEach(() => {
    userRepoMock = new Mock<UserRepository>();
  });

  it("should throw invalid user input error if user does not exist", async () => {
    // Arrange
    const authId = "123";
    const mockedUserRepo = userRepoMock
      .setup((i) => i.getUserByAuthId(authId, It.IsAny<string[]>()))
      .returnsAsync(undefined)
      .object();

    const sut = new UserService(mockedUserRepo);

    // Act
    try {
      await sut.getCurrentUserReservations(authId);
    } catch (e) {
      // Assert
      expect(
        e.message.toLowerCase().includes("could not find any entity")
      ).toBe(true);

      userRepoMock.verify(
        (i) => i.getUserByAuthId(authId, It.IsAny<string[]>()),
        Times.Once()
      );
    }
  });

  it("should return a user's reservation", async () => {
    // Arrange
    const user = new User();
    user.authId = "123";
    user.reservations = [new Reservation()];

    const mockedUserRepo = userRepoMock
      .setup((i) => i.getUserByAuthId(user.authId, It.IsAny<string[]>()))
      .returnsAsync(user)
      .object();

    const sut = new UserService(mockedUserRepo);

    // Act
    const reservations = await sut.getCurrentUserReservations(user.authId);

    // Assert
    expect(reservations.length).toBe(1);

    userRepoMock.verify(
      (i) => i.getUserByAuthId(user.authId, It.IsAny<string[]>()),
      Times.Once()
    );
  });
});

describe("UserService - getOrCreateUser() - ", () => {
  let userRepoMock: Mock<UserRepository>;

  beforeEach(() => {
    userRepoMock = new Mock<UserRepository>();
  });
  2;

  it("should create user if user does not exist", async () => {
    // Arrange
    const user = new User();
    user.authId = "123";
    user.reservations = [new Reservation()];
    const mockedUserRepo = userRepoMock
      .setup((i) => i.getUserByAuthId(user.authId, It.IsAny<string>()))
      .returnsAsync(user)
      .setup((i) => i.getUserByAuthId(user.authId, It.IsAny<string[]>()))
      .play(PlayTimes.Once())
      .returnsAsync(undefined)
      .setup((i) => i.createUser(user.authId))
      .returnsAsync(user)
      .object();

    const sut = new UserService(mockedUserRepo);

    // Act
    const result = await sut.getOrCreateUserByAuthId(user.authId);

    // Assert
    expect(result.authId).toBe(user.authId);

    userRepoMock.verify(
      (i) => i.getUserByAuthId(user.authId, It.IsAny<String[]>()),
      Times.Exactly(2)
    );
    userRepoMock.verify((i) => i.createUser(user.authId), Times.Once());
  });
});
