import { Mock, Times } from "moq.ts";
import { MeetingRoom } from "../../../entities";
import { MeetingRoomResolver } from "../..";
import { MeetingRoomService } from "../../../services";

describe("MeetingRoomResolver - getMeetingRooms() - ", () => {
  let mrServiceMock: Mock<MeetingRoomService>;

  beforeEach(() => {
    mrServiceMock = new Mock<MeetingRoomService>();
  });

  it("should get all meeting rooms", async () => {
    // Arrange
    const mockedService = mrServiceMock
      .setup((i) => i.getMeetingRooms())
      .returnsAsync([new MeetingRoom()])
      .object();

    const sut = new MeetingRoomResolver(mockedService);

    // Act
    const response = await sut.getMeetingRooms();

    // Assert
    mrServiceMock.verify((i) => i.getMeetingRooms(), Times.Once());
    expect(response.meetingRooms.length).toBe(1);
  });
});
