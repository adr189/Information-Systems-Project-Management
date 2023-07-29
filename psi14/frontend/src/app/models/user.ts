import {Role} from "../_models";
import {Meeting} from "./meeting";

export interface User {
  _id: string;
  name: string;
  password?: string;
  role?: Role;
  meetings?: Meeting[];
}
