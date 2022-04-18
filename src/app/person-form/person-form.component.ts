import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Apartment } from '../apartment';
import { ApartmentService } from '../apartment.service';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { Person } from '../person';
import { PersonService } from '../person.service';

@Component({
	selector: 'app-person-form',
	templateUrl: './person-form.component.html',
	styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
	@Input() visible = false;
	@Output() visibilityEvent = new EventEmitter<boolean>();
	@Output() submitEvent = new EventEmitter<boolean>();

	validateForm!: FormGroup;
	person?: Person;
	
	fullApartmentList: Apartment[] = [];
	apartmentList: Apartment[] = [];
	homeList: Home[] = [];

	formName: string = 'Add new record';
	confirmBtnText: string = 'Save';
	allowEdit: boolean = true
	showId: boolean = false;
	isConfirmModalLoading = false;

	constructor(private fb: FormBuilder,
		private apartmentService: ApartmentService,
		private homeService: HomeService,
		private personService: PersonService,
		private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.validateForm = this.fb.group({
			id: { value: 0, disabled: true },
			name: [null, [Validators.required, Validators.minLength(3)]],
			lastName: [null, [Validators.required, Validators.minLength(3)]],
			genre: [null, [Validators.required, Validators.pattern('[mf]+')]],
			homeId: { value: -1, disabled: true },
			home: [null, [Validators.required]],
			apartmentId: { value: -1, disabled: true},
			apartment: [null, Validators.required]
		});

		this.homeService.getHouses()
			.subscribe(home => this.homeList = home);

		this.apartmentService.getApartments()
			.subscribe(apartments => this.fullApartmentList = apartments);
	}

	getApartmentMockInfo(apartment: Apartment | undefined) : string {
		return `Ph: ${apartment?.phone}, Size: ${apartment?.size}, Rooms: ${apartment?.rooms}`
	}

	showModal(): void {
		this.visible = true;
	}

	handleCancel(): void {
		this.updateVisibility(false);
		this.resetForm();

		setTimeout(() => {

			this.showId = false;
			this.allowEdit = true;
			this.isConfirmModalLoading = false;
		}, 100);
	}

	handleSubmit(): void {
		if (!this.validateForm.valid) {
			this.validateForm.get('name')?.markAsDirty()
			this.validateForm.get('lastName')?.markAsDirty();
			this.validateForm.get('genre')?.markAsDirty();
			this.validateForm.get('home')?.markAsDirty();
			this.validateForm.get('apartment')?.markAsDirty();
			this.validateForm.updateValueAndValidity();
			return;
		}
		this.isConfirmModalLoading = true;
		this.addPerson();
	}



	/**
	 * Tell to parent that modal visibility has changed, and have been submited or not
	 */
	updateVisibility(value: boolean, submited: boolean = false): void {
		this.visible = value;
		if (submited) {
			this.submitEvent.emit(true);
		} else {
			this.visibilityEvent.emit(value);
		}
	}

	/**
	 * Save or update object, depending of form state
	 */
	addPerson(): void {
		var person: { [k: string]: any } = {
			name: this.validateForm.value.name,
			lastName: this.validateForm.value.lastName,
			genre: this.validateForm.value.genre,
			apartment: { id: this.validateForm.getRawValue().apartment?.id }
		};

		var response: Observable<any>;


		if (this.confirmBtnText === 'Save') {
			console.log(person)
			response = this.personService.addPerson(person);
		} else {
			console.log(person)
			person['id'] = this.validateForm.getRawValue().id;
			response = this.personService.updatePerson(person);
		}

		response.subscribe(apartment => {
			this.notify('', `Person have been ${this.confirmBtnText === "Save" ? "saved" : "updated"}`);
			this.updateVisibility(false, true);
			this.resetForm();
		});
	}

	public updatePerson(person: Person): void {
		this.setUpForm(person, true);
		this.confirmBtnText = "Update"
		this.formName = "Update record";
	}

	public viewPerson(person: Person): void {
		this.setUpForm(person, false);
		this.formName = "View record";
	}

	private resetForm(): void {
		this.validateForm.reset();

		this.validateForm.get('name')?.enable();
		this.validateForm.get('lastName')?.enable();
		this.validateForm.get('genre')?.enable();
		this.validateForm.get('home')?.enable();
		this.validateForm.get('apartment')?.enable();

		this.formName = 'Add new record';
		this.confirmBtnText = 'Save';
	}

	private setUpForm(person: Person, enabled: boolean): void {
		var home = this.homeList.find(home => home.address = person.apartment.home.address);
		var apartment = this.fullApartmentList.find(apartment => apartment.id === person.apartment.id);

		console.log(apartment);

		if (!enabled) {
			this.validateForm.get('name')?.disable();
			this.validateForm.get('lastName')?.disable();
			this.validateForm.get('genre')?.disable();
			this.validateForm.get('home')?.disable();
			this.validateForm.get('apartment')?.disable();
		}

		this.validateForm.get('id')?.setValue(person.id);
		this.validateForm.get('name')?.setValue(person.name);
		this.validateForm.get('lastName')?.setValue(person.lastName);
		this.validateForm.get('genre')?.setValue(person.genre);
		this.validateForm.get('homeId')?.setValue(home?.id);
		this.validateForm.get('home')?.setValue(home);
		this.validateForm.get('apartmentId')?.setValue(apartment?.id);

		// console.log("deb");
		// console.log(person);
		// console.log(apartment);
		// console.log(this.validateForm);
		this.validateForm.get('apartment')?.setValue(apartment);
		// console.log(this.validateForm);
		

		this.showId = true;
		this.visible = true;
		this.allowEdit = enabled;
	}

	addressChanged(): void {
		this.validateForm.get('homeId')?.setValue(this.validateForm.getRawValue().home?.id);
		this.apartmentList = this.fullApartmentList.filter(ap => ap.home.id === this.validateForm.getRawValue().home.id);
		this.validateForm.get('apartment')?.reset();
	}

	apartmentChanged(): void {
		this.validateForm.get('apartmentId')?.setValue(this.validateForm.getRawValue().apartment?.id);
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
