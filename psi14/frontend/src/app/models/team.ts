import {User} from "./user";

export interface Team {
  _id: string;
  name: string;
  project: string,
  users: User []
}
