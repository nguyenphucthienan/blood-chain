import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { DatatableComponent } from 'src/app/datatable/datatable.component';
import { TableActionType } from 'src/app/datatable/models/table-action.interface';
import { TableCellChange } from 'src/app/datatable/models/table-cell-change.interface';
import { ScanQrcodeModalComponent } from 'src/app/shared/modals/scan-qrcode-modal/scan-qrcode-modal.component';

import { UserManagerLiteTableService } from '../../services/user-manager-lite-table.service';

@Component({
  selector: 'app-manager-user-manager',
  templateUrl: './manager-user-manager.component.html',
  styleUrls: ['./manager-user-manager.component.scss'],
  providers: [UserManagerLiteTableService]
})
export class ManagerUserManagerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;
  @ViewChild('search') search: ElementRef;

  searchSubscription: Subscription;
  modalRef: MDBModalRef;

  constructor(
    public userManagerLiteTableService: UserManagerLiteTableService,
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
        tap((value: string) => this.searchUser(value))
      )
      .subscribe();
  }

  searchUser(value: string) {
    if (value.length === 0 || value.length > 2) {
      this.userManagerLiteTableService.pagination.page = 1;
      this.userManagerLiteTableService.filterMode.username = value;
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
      .subscribe((userId: string) => this.onQrCodeScanSuccess(userId));
  }

  onQrCodeScanSuccess(userId: string) {
    this.userManagerLiteTableService.filterMode._id = userId;
    this.datatable.refresh();
  }

  onTableCellChanged(tableCellChange: TableCellChange) {
    const action = tableCellChange.newValue;
    switch (action.type) {
      case TableActionType.GetDetail:
        this.navigateToUserDetail(tableCellChange.row.cells._id.value);
        break;
    }
  }

  navigateToUserDetail(id: string) {
    const url = this.router.createUrlTree(['/manager', 'users', id]);
    window.open(url.toString(), '_blank');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
    this.searchSubscription.unsubscribe();
  }

}
