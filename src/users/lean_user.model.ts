import { User } from './user.entity';

export class LeanUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;

  static fromUser(user: User): LeanUser {
    const leanUserData = new LeanUser();
    leanUserData.email = user.email;
    leanUserData.first_name = user.firstName;
    leanUserData.last_name = user.lastName;
    leanUserData.user_id = user.id;
    return leanUserData;
  }
}
