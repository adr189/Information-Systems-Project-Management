import {User} from "./user";
import {Project} from "./project";

export interface Task {
  _id: string;
  name: string;
  priority: string;
  percentage: number;
  begin_date?: Date;
  end_date?: Date;
  project?: string;
  assignedUsers?: User[];
}
