import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {Project} from '../models/project';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectsUrl = '/api/projects';  // URL to web api
  private projectUrl = '/api/project';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  /** POST a new project to the server */
  createProject(name: string, acronym: string, begin_date: Date, end_date: Date): Observable<Project> {
    const project = {
      name: name,
      acronym: acronym,
      begin_date: begin_date,
      end_date: end_date,
      team: null
    };
    return this.http.post<Project>(this.projectsUrl, project, this.httpOptions);
  }


  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl)
      .pipe(catchError(this.handleError<Project[]>('getProjects', [])));
  }

  getAvailableProjects(): Observable<Project[]> {
    const url = `${this.projectUrl}s/available`;
    return this.http.get<Project[]>(url)
      .pipe(catchError(this.handleError<Project[]>('getProjects', [])));
  }

  getProjectNo404<Data>(id: string): Observable<Project> {
    const url = `${this.projectUrl}/?id=${id}`;
    return this.http.get<Project[]>(url)
      .pipe(
        map(tasks => tasks[0]), // returns a {0|1} element array
        catchError(this.handleError<Project>(`getProject id=${id}`))
      );
  }

  getProject(id: string): Observable<Project> {
    const url = `${this.projectUrl}/${id}`;
    return this.http.get<Project>(url).pipe(
      catchError(this.handleError<Project>(`getProject id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  existsProjectWithAcronym(acronym: string) {
    if (!acronym.trim()) {
      return of(false);
    }
    const url = `${this.projectUrl}/?acronym=${acronym}`;
    return this.http.get<boolean>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('existsProjectWithAcronym'))
      );
  }

}
