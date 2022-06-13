import { MeetingRoom } from "../../entities";

export const createMeetingRooms = (): MeetingRoom[] => {
  const rooms: MeetingRoom[] = [];
  for (let i = 1; i <= 10; i++) {
    const room = new MeetingRoom();
    room.name = `C${i < 10 ? `0${i}` : i}`;

    rooms.push(room);
  }
  for (let i = 1; i <= 10; i++) {
    const room = new MeetingRoom();
    room.name = `P${i < 10 ? `0${i}` : i}`;
    rooms.push(room);
  }

  return rooms;
};
