import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Apartment } from '../apartment';
import { ApartmentService } from '../apartment.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-apartment-form',
	templateUrl: './apartment-form.component.html',
	styleUrls: ['./apartment-form.component.css']
})
export class ApartmentFormComponent implements OnInit {
	@Input() visible = false;
	@Output() visibilityEvent = new EventEmitter<boolean>();
	@Output() submitEvent = new EventEmitter<boolean>();

	validateForm!: FormGroup;
	apartment?: Apartment;
	homeList: Home[] = [];
	formName: string = 'Add new record';
	confirmBtnText: string = 'Save';
	allowEdit: boolean = true
	showId: boolean = false;
	isConfirmModalLoading = false;

	constructor(private fb: FormBuilder,
		private apartmentService: ApartmentService,
		private homeService: HomeService,
		private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.validateForm = this.fb.group({
			id: { value: 0, disabled: true },
			size: [null, [Validators.required, Validators.pattern('\\d{2,3}')]],
			rooms: [null, [Validators.required, Validators.pattern('\\d')]],
			phone: [null, [Validators.required, Validators.minLength(5)]],
			haveInternet: [null, [Validators.required]],
			homeId: { value: -1, disabled: true },
			home: [null, [Validators.required]]
		});

		this.homeService.getHouses()
			.subscribe(houses => this.homeList = houses);
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
			this.validateForm.get('size')?.markAsDirty()
			this.validateForm.get('phone')?.markAsDirty();
			this.validateForm.get('rooms')?.markAsDirty();
			this.validateForm.get('phone')?.markAsDirty();
			this.validateForm.get('haveInternet')?.markAsDirty();
			this.validateForm.updateValueAndValidity();
			return;
		}
		this.isConfirmModalLoading = true;
		this.addApartment();
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
	addApartment(): void {
		var apartment: { [k: string]: any } = {
			size: this.validateForm.value.size,
			phone: this.validateForm.value.phone,
			rooms: this.validateForm.value.rooms,
			haveInternet: this.validateForm.value.haveInternet,
			home: { id: this.validateForm.getRawValue().home?.id }
		};

		var response: Observable<any>;

		if (this.confirmBtnText === 'Save') {
			response = this.apartmentService.addApartment(apartment);
		} else {
			apartment['id'] = this.validateForm.getRawValue().id;
			response = this.apartmentService.updateApartment(apartment);
		}

		response.subscribe(apartment => {
				this.notify('', `Apartment have been ${this.confirmBtnText === "Save" ? "saved" : "updated"}`);
				this.updateVisibility(false, true);
				this.resetForm();
			});
	}

	public updateApartment(apartment: Apartment): void {
		this.setUpForm(apartment, true);
		this.confirmBtnText = "Update"
		this.formName = "Update record";
	}

	public viewApartment(apartment: Apartment): void {
		this.setUpForm(apartment, false);
		this.formName = "View record";
	}

	private resetForm(): void {
		this.validateForm.reset();

		this.validateForm.get('size')?.enable();
		this.validateForm.get('rooms')?.enable();
		this.validateForm.get('phone')?.enable();
		this.validateForm.get('haveInternet')?.enable();
		this.validateForm.get('home')?.enable();

		this.formName = 'Add new record';
		this.confirmBtnText = 'Save';
	}

	private setUpForm(apartment: Apartment, enabled: boolean): void {
		var home = this.homeList.find(home => home.address === apartment.home.address);

		if (!enabled) {
			this.validateForm.get('size')?.disable();
			this.validateForm.get('rooms')?.disable();
			this.validateForm.get('phone')?.disable();
			this.validateForm.get('haveInternet')?.disable();
			this.validateForm.get('home')?.disable();
		}

		this.validateForm.get('id')?.setValue(apartment.id);
		this.validateForm.get('size')?.setValue(apartment.size);
		this.validateForm.get('rooms')?.setValue(apartment.rooms);
		this.validateForm.get('phone')?.setValue(apartment.phone);
		this.validateForm.get('haveInternet')?.setValue(apartment.haveInternet.toString());
		this.validateForm.get('homeId')?.setValue(home?.id)
		this.validateForm.get('home')?.setValue(home);
		
		this.showId = true;
		this.visible = true;
		this.allowEdit = enabled;
	}

	addressChanged(): void {
		this.validateForm.get('homeId')?.setValue(this.validateForm.getRawValue().home?.id);
		console.log(this.validateForm.getRawValue());
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
