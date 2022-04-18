import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Apartment } from './apartment';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private apiUrl = 'http://localhost:8080/apartment/';  
  
  constructor(private http: HttpClient) { }

  getApartments(): Observable<Apartment[]> {
    return this.http.get<Apartment[]>(this.apiUrl)
    .pipe(
      catchError(this.handleError<Apartment[]>('getApartments', []))
    );
  }

  addApartment(apartment: any): Observable<any> {
		console.log(apartment);

		return this.http.post<any>(this.apiUrl, apartment).pipe(
			tap((newApartment: any) => console.log('added apartment')),
			catchError(this.handleError<any>('addApartment'))
		);
	}

	deleteApartment(id: number): Observable<any> {
		const url = `${this.apiUrl}${id}`;

		return this.http.delete(url)
			.pipe(
				catchError(this.handleError<any>(`deleteApartment-${id}`))
			);
	}
	
	updateApartment(apartment: any): Observable<any> {
		const url = `${this.apiUrl}${apartment.id}`;

		return this.http.patch(url, apartment)
			.pipe(
				catchError(this.handleError<any>(`updateApartment-${apartment}`))
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
