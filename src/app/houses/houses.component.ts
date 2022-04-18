import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { ColumnItem } from '../column-item';
import { HomeFormComponent } from '../home-form/home-form.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
	selector: 'app-houses',
	templateUrl: './houses.component.html',
	styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit {
	houses: Home[] = [];
	visible = false;
	isConfirmModalLoading = false;

	@ViewChild(HomeFormComponent, {static : true}) child : HomeFormComponent | undefined;

	columnsList: ColumnItem<Home>[] = [
		{
			name: 'Id',
			sortOrder: 'ascend',
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Home, b: Home) => a.id - b.id,
			filterMultiple: false,
			listOfFilter: [],
			filterFn: null,
			priority: 1
		},
		{
			name: 'Year',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Home, b: Home) => a.year - b.year,
			filterMultiple: true,
			listOfFilter: [],
			filterFn: null,
			priority: 2
		},
		{
			name: 'Address',
			sortOrder: null,
			sortDirections: ['ascend', 'descend', null],
			sortFn: (a: Home, b: Home) => a.address.localeCompare(b.address),
			filterMultiple: true,
			listOfFilter: [
				{ text: 'bd. Dacia', value: 'bd Dacia' },
				{ text: 'str. Stefan Cel Mare', value: 'str. Stefan cel Mare' }
			],
			filterFn: (address: string, item: Home) => item.address.indexOf(address) !== -1,
			priority: 3
		},
		{
			name: 'Actions',
			sortOrder: null,
			sortDirections: [null],
			sortFn: null,
			filterMultiple: true,
			listOfFilter: [],
			filterFn: null,
			priority: 0
		}
	];
	

	constructor(private homeService: HomeService, private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.getHouses();
	}

	/**
	 * CRUD
	 */
	getHouses(): void {
		this.homeService.getHouses()
			.subscribe(houses => this.houses = houses);
	}

	deleteById(id: number): void {
		this.homeService.deleteHouse(id)
			.subscribe(() => {
				this.notify('', `Deleted home with id ${id}`)
				this.houses = this.houses.filter(element => element.id != id);
			});
	}

	show(home: Home): void {
		this.child?.viewHouse(home);
	}

	update(home: Home): void {
		this.child?.updateHouse(home);
	}

	/**
	 * Modal View
	 */
	updateVisibility(visibility: boolean) {
		this.visible = visibility;
	}

	submit(submited: boolean) {
		if (submited) {
			this.getHouses();
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
		  .blank( title, content)
		  .onClick.subscribe(() => {
			console.log('notification clicked!');
		  });
	  }
}
