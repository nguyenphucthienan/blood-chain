import { NgModule } from '@angular/core';

import { DatatableModule } from '../datatable/datatable.module';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminBloodBankManagerComponent } from './components/admin-blood-bank-manager/admin-blood-bank-manager.component';
import { AdminBloodCampManagerComponent } from './components/admin-blood-camp-manager/admin-blood-camp-manager.component';
import {
  AdminBloodSeparationCenterManagerComponent,
} from './components/admin-blood-separation-center-manager/admin-blood-separation-center-manager.component';
import {
  AdminBloodTestCenterManagerComponent,
} from './components/admin-blood-test-center-manager/admin-blood-test-center-manager.component';
import { AdminHospitalManagerComponent } from './components/admin-hospital-manager/admin-hospital-manager.component';
import { AdminUserManagerComponent } from './components/admin-user-manager/admin-user-manager.component';
import {
  BloodTestCenterAddModalComponent,
} from './components/blood-test-center-add-modal/blood-test-center-add-modal.component';
import { BloodCampAddModalComponent } from './modals/blood-camp-add-modal/blood-camp-add-modal.component';
import {
  BloodCampAssignStaffsModalComponent,
} from './modals/blood-camp-assign-staffs-modal/blood-camp-assign-staffs-modal.component';
import { BloodCampDeleteModalComponent } from './modals/blood-camp-delete-modal/blood-camp-delete-modal.component';
import { BloodCampUpdateModalComponent } from './modals/blood-camp-update-modal/blood-camp-update-modal.component';
import {
  BloodTestCenterAssignStaffsModalComponent,
} from './modals/blood-test-center-assign-staffs-modal/blood-test-center-assign-staffs-modal.component';
import {
  BloodTestCenterDeleteModalComponent,
} from './modals/blood-test-center-delete-modal/blood-test-center-delete-modal.component';
import {
  BloodTestCenterUpdateModalComponent,
} from './modals/blood-test-center-update-modal/blood-test-center-update-modal.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminUserManagerComponent,
    AdminBloodCampManagerComponent,
    AdminBloodTestCenterManagerComponent,
    AdminBloodSeparationCenterManagerComponent,
    AdminBloodBankManagerComponent,
    AdminHospitalManagerComponent,
    BloodCampAddModalComponent,
    BloodCampUpdateModalComponent,
    BloodCampDeleteModalComponent,
    BloodCampAssignStaffsModalComponent,
    BloodTestCenterAddModalComponent,
    BloodTestCenterUpdateModalComponent,
    BloodTestCenterDeleteModalComponent,
    BloodTestCenterAssignStaffsModalComponent
  ],
  imports: [
    SharedModule,
    DatatableModule,
    AdminRoutingModule
  ],
  entryComponents: [
    BloodCampAddModalComponent,
    BloodCampUpdateModalComponent,
    BloodCampDeleteModalComponent,
    BloodCampAssignStaffsModalComponent,
    BloodTestCenterAddModalComponent,
    BloodTestCenterUpdateModalComponent,
    BloodTestCenterDeleteModalComponent,
    BloodTestCenterAssignStaffsModalComponent
  ]
})
export class AdminModule { }
