import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Person } from './person';

@Injectable({
	providedIn: 'root'
})
export class PersonService {
	private apiUrl = 'http://localhost:8080/person/';

	constructor(private http: HttpClient) { }

	getPeople(): Observable<Person[]> {
		return this.http.get<Person[]>(this.apiUrl)
			.pipe(
				catchError(this.handleError<Person[]>('getPeople', []))
			);
	}

	addPerson(person: any): Observable<any> {
		return this.http.post<any>(this.apiUrl, person).pipe(
			catchError(this.handleError<any>('addPerson'))
		);
	}

	deletePerson(id: number): Observable<any> {
		const url = `${this.apiUrl}${id}`;

		return this.http.delete(url)
			.pipe(
				catchError(this.handleError<any>(`deletePerson-${id}`))
			);
	}
	
	updatePerson(person: any): Observable<any> {
		const url = `${this.apiUrl}${person.id}`;

		return this.http.patch(url, person)
			.pipe(
				catchError(this.handleError<any>(`updatePerson-${person}`))
			);
	}



	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any) :Observable<T> => {
		  //TODO: send the error to notification logger
		  console.error(`${operation} failed: ${error.message}`);
		  return of(result as T);
		};
	  }
}
