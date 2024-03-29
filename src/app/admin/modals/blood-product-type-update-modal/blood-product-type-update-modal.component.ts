import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MDBModalRef } from 'angular-bootstrap-md';
import { BloodProductType } from 'src/app/core/models/blood-product-type.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { BloodProductTypeService } from 'src/app/core/services/blood-product-type.service';
import { TableRow } from 'src/app/datatable/models/table-row.interface';

@Component({
  selector: 'app-blood-product-type-update-modal',
  templateUrl: './blood-product-type-update-modal.component.html',
  styleUrls: ['./blood-product-type-update-modal.component.scss']
})
export class BloodProductTypeUpdateModalComponent implements OnInit {


  @Input() rowData: TableRow;

  @Output() bloodProductTypeUpdated = new EventEmitter();

  updateForm: FormGroup;

  constructor(
    public modalRef: MDBModalRef,
    private fb: FormBuilder,
    private bloodProductTypeService: BloodProductTypeService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [this.rowData.cells.name.value, Validators.required],
      description: [this.rowData.cells.description.value, Validators.required],
    });
  }

  updateBloodProductType() {
    this.bloodProductTypeService.updateBloodProductType(
      this.rowData.cells._id.value,
      this.updateForm.value
    ).subscribe(
      (bloodProductType: BloodProductType) => {
        this.bloodProductTypeUpdated.emit(bloodProductType);
        this.alertService.success('bloodProductTypeManager.alert.updateSuccess');
      },
      error => this.alertService.error('bloodProductTypeManager.alert.updateFailed')
    );
  }

  controlHasError(controlName: string, errorName: string): boolean {
    return this.updateForm.get(controlName).touched
      && this.updateForm.get(controlName).hasError(errorName);
  }

}
