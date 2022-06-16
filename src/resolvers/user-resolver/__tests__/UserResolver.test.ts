import { Mock, Times } from "moq.ts";
import { User } from "../../../entities/User";
import { UserResolver } from "../..";
import { UserService } from "../../../services";
import { createFakeApiContext } from "../../../utils/testUtils";

describe("UserResolver - getOrCreate() - ", () => {
  let userServiceMock: Mock<UserService>;

  beforeEach(() => {
    userServiceMock = new Mock<UserService>();
  });

  it("should get a user by authId", async () => {
    // Arrange
    const authId = "123";
    const fakeApiContext = createFakeApiContext(undefined, "123");
    const mockUser = new User();
    mockUser.id = "456";

    const mockedService = userServiceMock
      .setup((i) => i.getOrCreateUserByAuthId(authId))
      .returnsAsync(mockUser)
      .object();

    const sut = new UserResolver(mockedService);

    // Act
    const userResponse = await sut.getCurrentUser(fakeApiContext);

    // Assert
    userServiceMock.verify(
      (instance) => instance.getOrCreateUserByAuthId(authId),
      Times.Once()
    );
    expect(userResponse.user?.id).toBe(mockUser.id);
  });
});
