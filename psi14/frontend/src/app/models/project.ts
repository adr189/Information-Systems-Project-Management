export interface Project {
  _id: string;
  name: string;
  acronym: string;
  begin_date: Date;
  end_date?: Date;
}
