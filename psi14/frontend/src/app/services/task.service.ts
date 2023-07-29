import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of, Subject} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Task} from '../models/task';

@Injectable({providedIn: 'root'})
export class TaskService {

  private taskUrl = '/api/task'
  private tasksUrl = '/api/tasks';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  private _refreshrequired = new Subject<void>();

  get Refreshrequired() {
    return this._refreshrequired;
  }

  /** GET: Get tasks from the server */
  getTasks(idUser: string): Observable<Task[]> {
    const url = `${this.tasksUrl}/${idUser}`;

    return this.http
      .get<Task[]>(url)
      .pipe(catchError(this.handleError<Task[]>('getTasks')));
  }

  /** POST: Add a new task to the server */
  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(this.tasksUrl, task, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('addTask')));
  }

  /** DELETE: Delete the task from the server */
  deleteTask(id: string): Observable<Task> {
    const url = `${this.tasksUrl}/${id}`;

    return this.http
      .delete<Task>(url, this.httpOptions)
      .pipe(catchError(this.handleError<Task>('deleteTask')));
  }

  /**
   * Handle http operation that failed and let the app continue
   * @param operation - Name of the operation that failed
   * @param result - Optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  /** GET team by id. Return `undefined` when id not found */
  getTaskNo404<Data>(id: number): Observable<Task> {
    const url = `${this.taskUrl}/?id=${id}`;
    return this.http.get<Task[]>(url)
      .pipe(
        map(tasks => tasks[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
        }),
        catchError(this.handleError<Task>(`getTask id=${id}`))
      );
  }

  /** PUT: */
  addUserToTask(id: string, team: string): Observable<any> {
    const url = `${this.taskUrl}/${team}/add/user`;
    return this.http.put(url, {user: {_id: id}}, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateTask'))
    );
  }

  removeUserToTask(id: string, team: string): Observable<any> {
    const url = `${this.taskUrl}/${team}/remove/user`;
    return this.http.put(url, {user: {_id: id}}, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateTask'))
    );
  }

  /** PUT: */
  addProjectTask(projectId: any, taskId: string): Observable<any> {
    const fullUrl = `${this.taskUrl}/${taskId}`
    const body = {project: projectId}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('addProjectTask'))
    );
  }

  /** PUT: */
  removeProjectTask(task: Task): Observable<any> {
    const fullUrl = `${this.taskUrl}/${task._id}`
    const body = {project: null}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('removeProjectTask'))
    );
  }


  updatePercentageTask(percentage: number, taskId: string): Observable<any> {
    const fullUrl = `${this.taskUrl}/${taskId}/percentage`
    const body = {percentage: percentage}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('addProjectTask'))
    );
  }

  updateInfoTask(info: any, taskId: string): Observable<any> {
    const fullUrl = `${this.taskUrl}/${taskId}/info`
    const body = {
      percentage: info.percentage,
      begin_date: info.begin_date,
      end_date: info.end_date,
    }
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateInfoTask'))
    );
  }

  updateBeginDateTask(beginDate: Date, taskId: string): Observable<any> {
    const fullUrl = `${this.taskUrl}/${taskId}/update/begin_date`
    const body = {begin_date: beginDate}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateBeginDate'))
    );
  }

  updateEndDateTask(endDate: Date, taskId: string): Observable<any> {
    const fullUrl = `${this.taskUrl}/${taskId}/update/end_date`
    const body = {end_date: endDate}
    return this.http.put(fullUrl, body, this.httpOptions).pipe(
      tap(() => {
        this._refreshrequired.next();
      }),
      catchError(this.handleError<any>('updateEndDate'))
    );
  }


  /** GET team by id. Will 404 if id not found */
  getTask(id: string): Observable<Task> {
    const url = `${this.taskUrl}/${id}`;
    return this.http.get<Task>(url).pipe(
      catchError(this.handleError<Task>(`getTask id=${id}`))
    );
  }


}
