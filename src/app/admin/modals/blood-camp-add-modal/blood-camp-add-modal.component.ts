import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { BloodCamp } from 'src/app/core/models/blood-camp.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { BloodCampService } from 'src/app/core/services/blood-camp.service';

@Component({
  selector: 'app-blood-camp-add-modal',
  templateUrl: './blood-camp-add-modal.component.html',
  styleUrls: ['./blood-camp-add-modal.component.scss']
})
export class BloodCampAddModalComponent implements OnInit {

  @Output() bloodCampAdded = new EventEmitter();

  addForm: FormGroup;

  constructor(
    public modalRef: MDBModalRef,
    private fb: FormBuilder,
    private bloodCampService: BloodCampService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      location: [null, Validators.required]
    });
  }

  addBloodCamp() {
    this.bloodCampService.createBloodCamp(this.addForm.value)
      .subscribe(
        (bloodCamp: BloodCamp) => {
          this.bloodCampAdded.emit(bloodCamp);
          this.alertService.success('bloodCampManager.alert.addSuccess');
        },
        error => this.alertService.error('bloodCampManager.alert.addFailed')
      );
  }

  onLocationChanged(location: any) {
    this.addForm.patchValue({
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    });
  }

  controlHasError(controlName: string, errorName: string): boolean {
    return this.addForm.get(controlName).touched
      && this.addForm.get(controlName).hasError(errorName);
  }

}
