import { It, Mock, Times } from "moq.ts";
import { MeetingRoom } from "../../entities";
import { MeetingRoomRepository } from "../../repositories";
import { MeetingRoomService } from "../MeetingRoomService";

describe("MeetingRoomService - getMeetingRooms() - ", () => {
  let mrRepoMock: Mock<MeetingRoomRepository>;

  beforeEach(() => {
    mrRepoMock = new Mock<MeetingRoomRepository>();
  });

  it("should return meeting rooms", async () => {
    // Arrange
    const mockedMrRepo = mrRepoMock
      .setup((i) => i.getMeetingRooms(It.IsAny<string[]>()))
      .returnsAsync([new MeetingRoom()])
      .object();

    const sut = new MeetingRoomService(mockedMrRepo);

    // Act
    const result = await sut.getMeetingRooms();

    // Assert
    expect(result.length).toBe(1);
    mrRepoMock.verify(
      (i) => i.getMeetingRooms(It.IsAny<string[]>()),
      Times.Once()
    );
  });
});

describe("MeetingRoomService - resetMeetingRooms() - ", () => {
  let mrRepoMock: Mock<MeetingRoomRepository>;

  beforeEach(() => {
    mrRepoMock = new Mock<MeetingRoomRepository>();
  });

  it("should create 10 C rooms and 10 P rooms", async () => {
    // Arrange
    const mockedMrRepo = mrRepoMock
      .setup((i) => i.deleteAll())
      .returnsAsync(void null)
      .setup((i) =>
        i.createBulkMeetingRooms(
          It.Is<MeetingRoom[]>(
            (rooms) =>
              rooms.filter((r) => r.name.startsWith("C")).length === 10 &&
              rooms.filter((r) => r.name.startsWith("P")).length === 10
          )
        )
      )
      .returnsAsync([new MeetingRoom()])
      .object();

    const sut = new MeetingRoomService(mockedMrRepo);

    // Act
    await sut.resetMeetingRooms();

    // Assert
    mrRepoMock.verify(
      (i) =>
        i.createBulkMeetingRooms(
          It.Is<MeetingRoom[]>(
            (rooms) =>
              rooms.filter((r) => r.name.startsWith("C")).length === 10 &&
              rooms.filter((r) => r.name.startsWith("P")).length === 10
          )
        ),
      Times.Once()
    );
  });
});
