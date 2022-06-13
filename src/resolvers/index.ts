import { MeetingRoomResolver } from "./meeting-room/MeetingRoomResolver";
import { ReservationResolver } from "./reservation/ReservationResolver";
import { UserResolver } from "./user-resolver/UserResolver";
import { MeetingRoomsResponse } from "./meeting-room/MeetingRoomResolver.types";
import { UserResponse } from "./user-resolver/UserResolver.types";
import { ReservationInput } from "./reservation/ReservationResolver.types";

export { MeetingRoomResolver, ReservationResolver, UserResolver };
export type { MeetingRoomsResponse, UserResponse, ReservationInput };
