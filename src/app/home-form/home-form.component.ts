import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
	selector: 'app-home-form',
	templateUrl: './home-form.component.html',
	styleUrls: ['./home-form.component.css']
})
export class HomeFormComponent implements OnInit {
	@Input() visible = false;
	@Output() visibilityEvent = new EventEmitter<boolean>();
	@Output() submitEvent = new EventEmitter<boolean>();

	validateForm!: FormGroup;
	isConfirmModalLoading = false;
	home?: Home;
	formName: string = 'Add new record';
	confirmBtnText: string = 'Save';
	allowEdit: boolean = true
	showId: boolean = false;

	yearValidator = (control: FormControl): { [s: string]: boolean } => {
		if (!control.value) {
			return { required: true };
		} else if (!isNaN(control.value) && control.value >= 1900 && control.value <= 2022) {
			return {};
		}
		return { confirm: false, error: true };
	}

	constructor(private fb: FormBuilder, private homeService: HomeService,  private notification: NzNotificationService) { }

	ngOnInit(): void {
		this.validateForm = this.fb.group({
			id: { value: 0, disabled: true },
			year: [null, [Validators.required, this.yearValidator]],
			address: [null, [Validators.required, Validators.minLength(3)]]
		});
	}

	showModal(): void {
		this.visible = true;
	}

	handleSubmit(): void {
		if (!this.validateForm.valid) {
			this.validateForm.get('year')?.markAsDirty()
			this.validateForm.get('year')?.updateValueAndValidity();

			this.validateForm.get('address')?.markAsDirty();
			this.validateForm.get('address')?.updateValueAndValidity();
			return;
		}

		this.isConfirmModalLoading = true;
		//TODO: send request
		console.log('next');

		this.addHouse();
	}

	handleCancel(): void {
		this.updateVisibility(false);

		setTimeout(() => {
			this.validateForm.get('year')?.enable();
			this.validateForm.get('address')?.enable();

			this.validateForm.get('year')?.setValue('');
			this.validateForm.get('address')?.setValue('');

			this.formName = 'Add new record';
			this.confirmBtnText = 'Save';

			this.showId = false;
			this.allowEdit = true;
			this.isConfirmModalLoading = false;
		}, 100);
	}

	updateVisibility(value: boolean, submited: boolean = false): void {
		this.visible = value;
		if (submited) {
			this.submitEvent.emit(true);
		} else {
			this.visibilityEvent.emit(value);
		}
	}

	addHouse(): void {
		if (this.confirmBtnText === 'Save') {

			this.homeService.addHouse({
				year: parseInt(this.validateForm.value.year),
				address: this.validateForm.value.address
			})
			.subscribe(home => {
				console.log('succes');
				this.notify('', 'House have been saved');
				this.updateVisibility(false, true);
			});
		} else if (this.confirmBtnText === 'Update') {
			var home = {
				id: this.validateForm.getRawValue().id,
				year: parseInt(this.validateForm.value.year),
				address: this.validateForm.value.address
			} 
			

			this.homeService.updateHouse(home)
			.subscribe(home => {
				this.notify('', 'House have been updated');
				this.updateVisibility(false, true);
			});
		}
	}

	public updateHouse(home: Home): void {
		this.setUpForm(home, true);
		this.confirmBtnText = "Update"
		this.formName = "Update record";
	}

	public viewHouse(home: Home): void {
		this.setUpForm(home, false);
		this.formName = "View record";
	}

	private setUpForm(home: Home, enabled: boolean): void {
		this.validateForm.get('id')?.setValue(home.id);
		this.validateForm.get('year')?.setValue(home.year);
		this.validateForm.get('address')?.setValue(home.address);

		this.showId = true;

		if (enabled) {
			this.validateForm.get('year')?.enable();
			this.validateForm.get('address')?.enable();
		} else {
			this.validateForm.get('year')?.disable();
			this.validateForm.get('address')?.disable();
		}
		this.allowEdit = enabled;

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
