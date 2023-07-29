import {Role} from "../_models";
import {User} from "./user";

export enum MEETING_TYPE {
  USER = "USER", TEAM = "TEAM", OCCUPIED = "OCCUPIED"
}


export interface Meeting {
  begin: Date,
  end: Date,
  users?: User[]
  type?: MEETING_TYPE
}
