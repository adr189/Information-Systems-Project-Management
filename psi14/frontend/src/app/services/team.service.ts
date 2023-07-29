import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Team} from '../models/team';
import {User} from "../models/user";
import {Task} from "../models/task";


@Injectable({providedIn: 'root'})
export class TeamService {

  private teamUrl = '/api/team';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient) {
  }

  private _refreshrequired = new Subject<void>();

  get Refreshrequired() {
    return this._refreshrequired;
  }

  /** GET team by id. Return `undefined` when id not found */
  getTeamNo404<Data>(id: number): Observable<Team> {
    const url = `${this.teamUrl}/?id=${id}`;
    return this.http.get<Team[]>(url)
      .pipe(
        map(teams => teams[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
        }),
        catchError(this.handleError<Team>(`getTeam id=${id}`))
      );
  }

  /** PUT: */
  addUserToTeam(id: string, team: string): Observable<any> {
    const url = `${this.teamUrl}/${team}/add/user`;
    return this.http.put(url, {user: {_id: id}}, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateTeam'))
    );
  }

  removeUserToTeam(id: string, team: string): Observable<any> {
    const url = `${this.teamUrl}/${team}/remove/user`;
    return this.http.put(url, {user: {_id: id}}, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateTeam'))
    );
  }

  /** GET team by id. Will 404 if id not found */
  getTeam(id: string): Observable<Team> {
    const url = `${this.teamUrl}/${id}`;
    return this.http.get<Team>(url).pipe(
      catchError(this.handleError<Team>(`getTeam id=${id}`))
    );
  }

  /** GET: Get teams from the server */
  getTeams(): Observable<Team[]> {
    const url = `${this.teamUrl}s`;
    return this.http
      .get<Team[]>(url)
      .pipe(catchError(this.handleError<Team[]>('getTeams')));
  }

  /** GET: Get teams from the server */
  getTeamsFromUser(id: string): Observable<Team[]> {
    const url = `${this.teamUrl}s/${id}`;
    return this.http
      .get<Team[]>(url)
      .pipe(catchError(this.handleError<Team[]>('getTeams')));
  }

  /** POST: Add a new team to the server */
  addTeam(team: Team): Observable<Team> {
    const url = `${this.teamUrl}s`;

    return this.http
      .post<Team>(url, team, this.httpOptions)
      .pipe(catchError(this.handleError<Team>('addTeam')));
  }

  addProjectTeam(projectId: any, teamId: string): Observable<any> {
    const fullUrl = `${this.teamUrl}/${teamId}/add`
    const body = {project: projectId}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('addProjectTask'))
    );
  }

  /** PUT: */
  removeProjectTeam(projectId: any, teamId: string): Observable<any> {
    const fullUrl = `${this.teamUrl}/${teamId}/remove`
    const body = {project: projectId}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('removeProjectTask'))
    );
  }

  existsTeamWithName(name: string) {
    if (!name.trim()) {
      return of(false);
    }
    const url = `${this.teamUrl}/?name=${name}`;
    return this.http.get<boolean>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('existsUserWithName'))
      );
  }

  /* GET user whose name contains search term */
  searchTeams(term: string): Observable<Team[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Team[]>(`${this.teamUrl}s/?name=${term}`).pipe(
      catchError(this.handleError<Team[]>('searchUsers', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead
      return of(result as T);
    };
  }


}
