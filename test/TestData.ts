import { randomUUID } from "crypto";
import { Status } from "../src/users/user.entity";

export default class TestData {
  static users = [
    {
      id: "uuid_3049_uuid_3049",
      firstName: "Samuel",
      lastName: "Mutemi",
      email: "mtsammy40@gmail.com",
      updatedAt: new Date(),
      activeTokens: [],
      status: Status.ACTIVE
    },
    {
      id: "uuid_3049_uuid_3049",
      firstName: "Jane",
      lastName: "Doe",
      email: "mtsammy40@gmail.com",
      updatedAt: new Date(),
      activeTokens: [{ type: "AT" }, { tokenString: "Token" }],
      status: Status.ACTIVE
    }
  ];
}
