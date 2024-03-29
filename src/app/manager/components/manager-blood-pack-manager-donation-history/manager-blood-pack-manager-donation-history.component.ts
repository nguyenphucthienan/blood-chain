import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDBModalRef } from 'angular-bootstrap-md';
import { User } from 'src/app/core/models/user.interface';
import { DatatableComponent } from 'src/app/datatable/datatable.component';
import { TableActionType } from 'src/app/datatable/models/table-action.interface';
import { TableCellChange } from 'src/app/datatable/models/table-cell-change.interface';

import { BloodDonationHistoryLiteTableService } from '../../services/blood-donation-history-lite-table.service';

@Component({
  selector: 'app-manager-blood-pack-manager-donation-history',
  templateUrl: './manager-blood-pack-manager-donation-history.component.html',
  styleUrls: ['./manager-blood-pack-manager-donation-history.component.scss'],
  providers: [BloodDonationHistoryLiteTableService]
})
export class ManagerBloodPackManagerDonationHistoryComponent implements OnInit {

  @ViewChild(DatatableComponent) datatable: DatatableComponent;

  modalRef: MDBModalRef;

  constructor(
    public bloodDonationHistoryLiteTableService: BloodDonationHistoryLiteTableService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  changeUser(user: User) {
    this.bloodDonationHistoryLiteTableService.filterMode.donor = user && user._id;
    this.bloodDonationHistoryLiteTableService.pagination = {
      ...this.bloodDonationHistoryLiteTableService.pagination,
      page: 1
    };
    this.datatable.refresh();
  }

  onTableCellChanged(tableCellChange: TableCellChange) {
    const action = tableCellChange.newValue;
    switch (action.type) {
      case TableActionType.GetDetail:
        this.navigateToBloodPackDetail(tableCellChange.row.cells._id.value);
        break;
    }
  }

  navigateToBloodPackDetail(id: string) {
    const url = this.router.createUrlTree(['/manager', 'blood-packs', id]);
    window.open(url.toString(), '_blank');
  }

}
