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
import { TableRow } from 'src/app/datatable/models/table-row.interface';
import { ScanQrcodeModalComponent } from 'src/app/shared/modals/scan-qrcode-modal/scan-qrcode-modal.component';

import { BloodPackDeleteModalComponent } from '../../modals/blood-pack-delete-modal/blood-pack-delete-modal.component';
import {
  BloodSeparationCenterBloodPackManagerTableService,
} from '../../services/blood-separation-center-blood-pack-manager-table.service';

@Component({
  selector: 'app-blood-separation-center-blood-pack-manager',
  templateUrl: './blood-separation-center-blood-pack-manager.component.html',
  styleUrls: ['./blood-separation-center-blood-pack-manager.component.scss'],
  providers: [BloodSeparationCenterBloodPackManagerTableService]
})
export class BloodSeparationCenterBloodPackManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('search') search: ElementRef;

  searchSubscription: Subscription;
  modalRef: MDBModalRef;

  constructor(
    public bloodSeparationCenterBloodPackManagerTableService: BloodSeparationCenterBloodPackManagerTableService,
    private router: Router,
    private renderer: Renderer2,
    private modalService: MDBModalService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'grey-background');
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        tap((value: string) => this.searchBloodPack(value))
      )
      .subscribe();
  }

  searchBloodPack(value: string) {
    if (value.length === 0 || value.length === 24) {
      this.bloodSeparationCenterBloodPackManagerTableService.pagination.page = 1;
      this.bloodSeparationCenterBloodPackManagerTableService.filterMode._id = value;
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
      .subscribe((bloodPackId: string) => this.onQrCodeScanSuccess(bloodPackId));
  }

  onQrCodeScanSuccess(bloodPackId: string) {
    this.bloodSeparationCenterBloodPackManagerTableService.filterMode._id = bloodPackId;
    this.datatable.refresh();
  }

  onTableCellChanged(tableCellChange: TableCellChange) {
    const action = tableCellChange.newValue;
    switch (action.type) {
      case TableActionType.GetDetail:
        this.navigateToBloodPackDetail(tableCellChange.row.cells._id.value);
        break;
      case TableActionType.Update:
        this.navigateToUpdateBloodPackResult(tableCellChange.row);
        break;
    }
  }

  navigateToBloodPackDetail(id: string) {
    const url = this.router.createUrlTree(['/manager', 'blood-packs', id]);
    window.open(url.toString(), '_blank');
  }

  navigateToUpdateBloodPackResult(rowData?: TableRow) {
    if (!rowData) {
      this.router.navigate(['/manager', 'blood-separation-center', 'blood-packs', 'update'], {
        state: { bloodPackId: null }
      });
      return;
    }

    if (rowData.cells.separated && rowData.cells.separated.value) {
      this.alertService.error('bloodPackManager.alert.alreadySeparated');
      return;
    }

    if (rowData.cells.disposed && rowData.cells.disposed.value) {
      this.alertService.error('bloodPackManager.alert.alreadyDisposed');
      return;
    }

    this.router.navigate(['/manager', 'blood-separation-center', 'blood-packs', 'update'], {
      state: { bloodPackId: rowData.cells._id.value }
    });
  }

  openBloodPackDeleteModal() {
    const selectedIds = Array.from(this.datatable.getSelectedRowIds().selectedIds);
    if (!selectedIds || selectedIds.length <= 0) {
      this.alertService.error('bloodPackManager.alert.noBloodPack');
      return;
    }

    this.modalRef = this.modalService.show(BloodPackDeleteModalComponent, {
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
        bloodPackIds: selectedIds
      }
    });

    this.modalRef.content.bloodPackDeleted
      .subscribe(() => this.onBloodPackDeleted());
  }

  onBloodPackDeleted() {
    this.modalRef.hide();
    this.datatable.refresh();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
    this.searchSubscription.unsubscribe();
  }

}
