import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { BloodTestCenter } from 'src/app/core/models/blood-test-center.interface';
import { DatatableComponent } from 'src/app/datatable/datatable.component';
import { TableActionType } from 'src/app/datatable/models/table-action.interface';
import { TableCellChange } from 'src/app/datatable/models/table-cell-change.interface';
import { TableRow } from 'src/app/datatable/models/table-row.interface';

import {
  BloodTestCenterAddModalComponent,
} from '../../modals/blood-test-center-add-modal/blood-test-center-add-modal.component';
import {
  BloodTestCenterAssignStaffsModalComponent,
} from '../../modals/blood-test-center-assign-staffs-modal/blood-test-center-assign-staffs-modal.component';
import {
  BloodTestCenterDeleteModalComponent,
} from '../../modals/blood-test-center-delete-modal/blood-test-center-delete-modal.component';
import {
  BloodTestCenterPhotoManagerModalComponent,
} from '../../modals/blood-test-center-photo-manager-modal/blood-test-center-photo-manager-modal.component';
import {
  BloodTestCenterUpdateModalComponent,
} from '../../modals/blood-test-center-update-modal/blood-test-center-update-modal.component';
import { BloodTestCenterManagerTableService } from '../../services/blood-test-center-manager-table.service';

@Component({
  selector: 'app-admin-blood-test-center-manager',
  templateUrl: './admin-blood-test-center-manager.component.html',
  styleUrls: ['./admin-blood-test-center-manager.component.scss'],
  providers: [BloodTestCenterManagerTableService]
})
export class AdminBloodTestCenterManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('search') search: ElementRef;

  searchSubscription: Subscription;
  modalRef: MDBModalRef;

  constructor(
    public bloodTestCenterManagerTableService: BloodTestCenterManagerTableService,
    private router: Router,
    private renderer: Renderer2,
    private modalService: MDBModalService
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'grey-background');
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        tap((value: string) => this.searchBloodTestCenter(value))
      )
      .subscribe();
  }

  searchBloodTestCenter(value: string) {
    if (value.length === 0 || value.length > 2) {
      this.bloodTestCenterManagerTableService.pagination.page = 1;
      this.bloodTestCenterManagerTableService.filterMode.name = value;
      this.datatable.refresh();
    }
  }

  onTableCellChanged(tableCellChange: TableCellChange) {
    const action = tableCellChange.newValue;
    switch (action.type) {
      case TableActionType.GetDetail:
        this.navigateToBloodTestCenterDetail(tableCellChange.row.cells._id.value);
        break;
      case TableActionType.Assign:
        this.openBloodTestCenterAssignStaffsModal(tableCellChange.row.cells._id.value);
        break;
      case TableActionType.ManagePhotos:
        this.openBloodTestCenterPhotoManagerModal(tableCellChange.row.cells._id.value);
        break;
      case TableActionType.Update:
        this.openBloodTestCenterUpdateModal(tableCellChange.row);
        break;
      case TableActionType.Delete:
        this.openBloodTestCenterDeleteModal(tableCellChange.row);
        break;
    }
  }

  navigateToBloodTestCenterDetail(id: string) {
    const url = this.router.createUrlTree(['/blood-test-centers', id]);
    window.open(url.toString(), '_blank');
  }

  openBloodTestCenterAddModal() {
    this.modalRef = this.modalService.show(BloodTestCenterAddModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
      containerClass: 'top',
      animated: true
    });

    this.modalRef.content.bloodTestCenterAdded
      .subscribe((bloodTestCenter: BloodTestCenter) => this.onBloodTestCenterAdded(bloodTestCenter));
  }

  onBloodTestCenterAdded(bloodTestCenter: BloodTestCenter) {
    this.modalRef.hide();
    this.datatable.refresh();
  }

  openBloodTestCenterAssignStaffsModal(id: string) {
    this.modalRef = this.modalService.show(BloodTestCenterAssignStaffsModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        bloodTestCenterId: id,
      }
    });

    this.modalRef.content.bloodTestCenterStaffUpdated
      .subscribe((result: any) => this.onBloodTestCenterAssignedStaffs(result));
  }

  onBloodTestCenterAssignedStaffs(result: any) {
    this.modalRef.hide();
  }

  openBloodTestCenterPhotoManagerModal(id: string) {
    this.modalRef = this.modalService.show(BloodTestCenterPhotoManagerModalComponent, {
      backdrop: true,
      keyboard: false,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        bloodTestCenterId: id,
      }
    });
  }

  openBloodTestCenterUpdateModal(rowData: TableRow) {
    this.modalRef = this.modalService.show(BloodTestCenterUpdateModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        rowData,
      }
    });

    this.modalRef.content.bloodTestCenterUpdated
      .subscribe((bloodTestCenter: BloodTestCenter) => this.onBloodTestCenterUpdated(bloodTestCenter));
  }

  onBloodTestCenterUpdated(bloodTestCenter: BloodTestCenter) {
    this.modalRef.hide();
    this.datatable.refresh();
  }

  openBloodTestCenterDeleteModal(rowData: TableRow) {
    this.modalRef = this.modalService.show(BloodTestCenterDeleteModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        rowData
      }
    });

    this.modalRef.content.bloodTestCenterDeleted
      .subscribe(() => this.onBloodTestCenterDeleted());
  }

  onBloodTestCenterDeleted() {
    this.modalRef.hide();
    this.datatable.refresh();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
    this.searchSubscription.unsubscribe();
  }

}
