import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { RoleName } from 'src/app/core/constant/role-name';
import { AlertService } from 'src/app/core/services/alert.service';
import { DatatableComponent } from 'src/app/datatable/datatable.component';
import { TableActionType } from 'src/app/datatable/models/table-action.interface';
import { TableCellChange } from 'src/app/datatable/models/table-cell-change.interface';
import { ScanQrcodeModalComponent } from 'src/app/shared/modals/scan-qrcode-modal/scan-qrcode-modal.component';

import {
  BloodProductDeleteModalComponent,
} from '../../modals/blood-product-delete-modal/blood-product-delete-modal.component';
import {
  BloodSeparationCenterBloodProductManagerTableService,
} from '../../services/blood-separation-center-blood-product-manager-table.service';

@Component({
  selector: 'app-blood-separation-center-blood-product-manager',
  templateUrl: './blood-separation-center-blood-product-manager.component.html',
  styleUrls: ['./blood-separation-center-blood-product-manager.component.scss'],
  providers: [BloodSeparationCenterBloodProductManagerTableService]
})
export class BloodSeparationCenterBloodProductManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('search') search: ElementRef;

  searchSubscription: Subscription;
  modalRef: MDBModalRef;

  constructor(
    public bloodSeparationCenterBloodProductManagerTableService: BloodSeparationCenterBloodProductManagerTableService,
    private router: Router,
    private renderer: Renderer2,
    private modalService: MDBModalService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'grey-background');
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        tap((value: string) => this.searchBloodProduct(value))
      )
      .subscribe();
  }

  searchBloodProduct(value: string) {
    if (value.length === 0 || value.length === 24) {
      this.bloodSeparationCenterBloodProductManagerTableService.pagination.page = 1;
      this.bloodSeparationCenterBloodProductManagerTableService.filterMode._id = value;
      this.datatable.refresh();
    }
  }

  openScanQrCodeModal() {
    this.modalRef = this.modalService.show(ScanQrcodeModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
      containerClass: 'top',
      animated: true
    });

    this.modalRef.content.scanSuccess
      .subscribe((bloodProductId: string) => this.onQrCodeScanSuccess(bloodProductId));
  }

  onQrCodeScanSuccess(bloodProductId: string) {
    this.bloodSeparationCenterBloodProductManagerTableService.filterMode._id = bloodProductId;
    this.datatable.refresh();
  }

  onTableCellChanged(tableCellChange: TableCellChange) {
    const action = tableCellChange.newValue;
    switch (action.type) {
      case TableActionType.GetDetail:
        this.navigateToBloodProductDetail(tableCellChange.row.cells._id.value);
        break;
    }
  }

  navigateToTransferBloodProduct() {
    const selectedIds = Array.from(this.datatable.getSelectedRowIds().selectedIds);
    const selectedRows = this.datatable.rows
      .filter(row => selectedIds.includes(row.cells._id.value)
        && !row.cells.disposed.value);

    this.router.navigate(['/manager', 'blood-separation-center', 'blood-products', 'transfer'], {
      state: { bloodProducts: selectedRows }
    });
  }

  navigateToBloodProductDetail(id: string) {
    const url = this.router.createUrlTree(['/manager', 'blood-products', id]);
    window.open(url.toString(), '_blank');
  }

  openBloodProductDeleteModal() {
    const selectedIds = Array.from(this.datatable.getSelectedRowIds().selectedIds);
    if (!selectedIds || selectedIds.length <= 0) {
      this.alertService.error('bloodProductManager.alert.noBloodProduct');
      return;
    }

    this.modalRef = this.modalService.show(BloodProductDeleteModalComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      containerClass: 'top',
      animated: true,
      data: {
        organizationType: RoleName.BLOOD_SEPARATION_CENTER,
        bloodProductIds: selectedIds
      }
    });

    this.modalRef.content.bloodProductDeleted
      .subscribe(() => this.onBloodProductDeleted());
  }

  onBloodProductDeleted() {
    this.modalRef.hide();
    this.datatable.refresh();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
    this.searchSubscription.unsubscribe();
  }

}
