import { Status, TokenType } from "../src/users/user.entity";
import { v4 as uuid } from "uuid";

export default class TestData {
  static users = [
    {
      id: uuid(),
      firstName: "Samuel",
      lastName: "Mutemi",
      email: "mtsammy40@gmail.com",
      updatedAt: new Date(),
      activeTokens: [{
        type: TokenType.VERIFY_EMAIL,
        tokenString: 'Token'
      }],
      status: Status.ACTIVE,
      passwordData: {
        password: "hashed",
        salt: "salt"
      }
    },
    {
      id: uuid(),
      firstName: "Jane",
      lastName: "Doe",
      email: "test@gmail.com",
      updatedAt: new Date(),
      activeTokens: [{ type: TokenType.VERIFY_EMAIL, tokenString: "AT" }, { tokenString: "Token" }],
      status: Status.ACTIVE,
      passwordData: {
        password: "hashed",
        salt: "salt"
      }
    }
  ];
}
