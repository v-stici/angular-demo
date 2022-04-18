import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Apartment } from '../apartment';
import { ApartmentFormComponent } from '../apartment-form/apartment-form.component';
import { ApartmentService } from '../apartment.service';
import { ColumnItem } from '../column-item';


@Component({
	selector: 'app-apartments',
	templateUrl: './apartments.component.html',
	styleUrls: ['./apartments.component.css']
})
export class ApartmentsComponent implements OnInit {
	apartments: Apartment[] = [];
	visible = false;
	isConfirmModalLoading = false;

	@ViewChild(ApartmentFormComponent, { static: true }) child: ApartmentFormComponent | undefined;

	columnsList: ColumnItem<Apartment>[] = [
		{
			name: 'Id',
			sortOrder: 'ascend',
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Apartment, b: Apartment) => a.id - b.id,
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 1
		},
		{
			name: 'size',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Apartment, b: Apartment) => a.size - b.size,
			filterMultiple: false,
			listOfFilter: [
				{ text: '< 49', value: 49 },
				{ text: '50-99 ', value: 99 },
				{ text: '100-199', value: 199 },
				{ text: '200+', value: 2000 },
			],
			filterFn: (size: number, apartment: Apartment) => {
				if (size < 50) {
					return apartment.size <= size;
				} else if (size < 100) {
					return apartment.size < size && apartment.size >= 50;
				} else if (size < 200) {
					return apartment.size < size && apartment.size >= 100;
				}

				return apartment.size < size && apartment.size >= 200;
			},
			priority: 2
		},
		{
			name: 'rooms',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Apartment, b: Apartment) => a.rooms - b.rooms,
			filterMultiple: false,
			listOfFilter: [
				{ text: '1', value: 1 },
				{ text: '2', value: 2 },
				{ text: '3', value: 3 },
				{ text: '4', value: 4 },
				{ text: '5', value: 5 },
				{ text: '6', value: 6 },
			],
			filterFn: (rooms: number, apartment: Apartment) => apartment.rooms == rooms,
			priority: 3
		},
		{
			name: 'phone',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 0
		},
		{
			name: 'have internet',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: false,
			listOfFilter: [
				{ text: 'True', value: true },
				{ text: 'False', value: false }
			],
			filterFn: (haveInternet: boolean, apartment: Apartment) => apartment.haveInternet == haveInternet,
			priority: 0
		},
		{
			name: 'home address',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: false,
			listOfFilter: [
				{ text: 'bd. Dacia', value: 'bd Dacia' },
				{ text: 'str. Stefan Cel Mare', value: 'str. Stefan cel Mare' }
			],
			filterFn: (address: string, apartment: Apartment) => apartment.home.address.indexOf(address) !== -1,
			priority: 0
		},
		{
			name: 'Actions',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 0
		},
	];




	constructor(private apartmentService: ApartmentService, private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.getApartments();
	}


	/**
	* CRUD
	*/
	getApartments(): void {
		this.apartmentService.getApartments()
			.subscribe(apartments => this.apartments = apartments);
	}

	deleteById(id: number): void {
		this.apartmentService.deleteApartment(id)
			.subscribe(() => {
				this.notify('', `Deleted apartment with id ${id}`);
				this.apartments = this.apartments.filter(element => element.id != id);
			})
	}
	show(apartment: Apartment): void {
		this.child?.viewApartment(apartment);
	}

	update(apartment: Apartment): void {
		this.child?.updateApartment(apartment);
	}


	/**
	   * Modal View
	   */
	updateVisibility(visibility: boolean) {
		this.visible = visibility;
	}

	submit(submited: boolean) {
		if (submited) {
			this.getApartments();
			this.visible = false;
		}
	}

	showModal(): void {
		this.visible = true;
	}


	/**
	 * Notifications
	 */
	notify(title: string, content: string): void {
		this.notification
			.blank(title, content)
			.onClick.subscribe(() => {
				console.log('notification clicked!');
			});
	}
}
