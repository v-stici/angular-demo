import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ColumnItem } from '../column-item';
import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
	selector: 'app-person',
	templateUrl: './person.component.html',
	styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
	people: Person[] = [];
	visible = false;
	isConfirmModalLoading = false;
	// @ViewChild(ApartmentFormComponent, { static: true }) child: ApartmentFormComponent | undefined;

	columnsList: ColumnItem<Person>[] = [
		{
			name: 'Id',
			sortOrder: 'ascend',
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Person, b: Person) => a.id - b.id,
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 1
		},
		{
			name: 'name',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Person, b: Person) => a.name.localeCompare(b.name),
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 2
		},
		{
			name: 'lastName',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Person, b: Person) => a.lastName.localeCompare(b.lastName),
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 3
		},
		{
			name: 'genre',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: false,
			listOfFilter: [
				{ text: 'Male', value: 'm' },
				{ text: 'Female', value: 'f' }
			],
			filterFn: (genre: string, person: Person) => person.genre == genre,
			priority: 0
		},
		{
			name: 'address',
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
			filterFn: (haveInternet: boolean, person: Person) => person.apartment.haveInternet == haveInternet,
			priority: 0
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

	constructor(private personService: PersonService,private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.getPeople();
	}


	/**
	* CRUD
	*/
	getPeople(): void {
		this.personService.getPeople()
			.subscribe(people => this.people = people);
	}

	deleteById(id: number): void {
		this.personService.deletePerson(id)
			.subscribe(() => {
				this.notify('', `Deleted person with id ${id}`);
				this.people = this.people.filter(element => element.id != id);
			})
	}
	show(person: Person): void {
		// this.child?.viewPerson(person);
	}

	update(person: Person): void {
		// this.child?.updatePerson(person);
	}

	/**
	 * Modal View
	 */
	updateVisibility(visibility: boolean) {
		this.visible = visibility;
	}

	submit(submited: boolean) {
		if (submited) {
			this.getPeople();
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
