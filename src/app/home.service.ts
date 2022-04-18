import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Home } from './home';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HomeService {
	private apiUrl = 'http://localhost:8080/home/';

	constructor(private http: HttpClient) { }

	getHouses(): Observable<Home[]> {
		return this.http.get<Home[]>(this.apiUrl)
			.pipe(
				catchError(this.handleError<Home[]>('getHouses', []))
			);
	}

	addHouse(house: any): Observable<any> {
		console.log(house);

		return this.http.post<any>(this.apiUrl, house).pipe(
			tap((newHouse: any) => console.log('added home')),
			catchError(this.handleError<any>('addHouse'))
		);
	}

	deleteHouse(id: number): Observable<any> {
		const url = `${this.apiUrl}${id}`;

		return this.http.delete(url)
			.pipe(
				catchError(this.handleError<any>(`deleteHouse-${id}`))
			);
	}
	
	updateHouse(home: Home): Observable<any> {
		const url = `${this.apiUrl}${home.id}`;

		return this.http.patch(url, home)
			.pipe(
				catchError(this.handleError<any>(`updateHouse-${home}`))
			);
	}
	

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			//TODO: send the error to notification logger
			console.error(`${operation} failed: ${error.message}`);
			console.log(error);
			return of(result as T);
		};
	}
}
