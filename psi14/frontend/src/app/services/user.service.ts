import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {delay, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {User} from '../models/user';
import {Meeting} from '../models/meeting';


@Injectable({providedIn: 'root'})
export class UserService {

  private userUrl = '/api/user';  // URL to web api
  private usersUrl = '/api/users';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient) {
  }


  createUser(name: string, password: string, role: string) {
    const user = {
      name: name,
      password: password,
      role: role
    };
    return this.http.post<User>(this.userUrl, user, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('createUser'))
      );
  }


  addMeetingToUser(name: string, meeting: Meeting) {
    const body = {
      user: name,
      newMeeting: meeting
    };
    const url = `${this.userUrl}/meeting/add`
    return this.http.post<User>(url, body, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('createUser'))
      );
  }


  getMeetingsFromUser(user: string) {
    const url = `${this.userUrl}/meetings/${user}`
    return this.http.get<Meeting[]>(url)
      .pipe(
        catchError(this.handleError<Meeting[]>('createUser'))
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }


  /** GET User by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.userUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(Users => Users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET User by id. Will 404 if id not found */
  getUser(id: string): Observable<User> {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }


  /* GET user whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.userUrl}s/?name=${term}`).pipe(
      catchError(this.handleError<User[]>('searchUsers', []))
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


  existsUserWithName(name: string) {
    if (!name.trim()) {
      return of(false);
    }
    const url = `${this.userUrl}/?name=${name}`;
    return this.http.get<boolean>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('existsUserWithName'))
      );
  }


}
