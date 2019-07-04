import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { FilterMode } from 'src/app/core/models/filter-mode.interface';
import { Pagination } from 'src/app/core/models/pagination.interface';
import { SortMode } from 'src/app/core/models/sort-mode.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { TableAction, TableActionType } from 'src/app/datatable/models/table-action.interface';
import { TableCell } from 'src/app/datatable/models/table-cell.interface';
import { TableColumn } from 'src/app/datatable/models/table-column.interface';
import { TableRow } from 'src/app/datatable/models/table-row.interface';
import { TableService } from 'src/app/datatable/services/table.service';

@Injectable()
export class UserManagerTableService implements TableService {

  columns: TableColumn[] = [
    { name: '_id', text: 'common.column.id', type: 'IdTableCellComponent', center: true, sortable: true },
    { name: 'username', text: 'common.column.username', type: 'TextTableCellComponent', sortable: true },
    { name: 'roles', text: 'userManager.column.roles', type: 'ArrayListTableCellComponent', sortable: true },
    { name: 'email', text: 'common.column.email', type: 'TextTableCellComponent', sortable: true },
    { name: 'firstName', text: 'common.column.firstName', type: 'TextTableCellComponent', sortable: true },
    { name: 'lastName', text: 'common.column.lastName', type: 'TextTableCellComponent', sortable: true },
    { name: 'actions', text: 'common.column.actions', type: 'ActionsTableCellComponent', center: true }
  ];

  rows: TableRow[];

  pagination: Pagination = {
    page: 1,
    size: 10
  };

  sortMode: SortMode = {
    sortBy: 'createdAt',
    isSortAscending: false
  };

  filterMode: FilterMode = {};

  actions: TableAction[] = [
    { class: 'btn-info', icon: 'fa fa-info-circle', text: 'common.tooltip.detail', type: TableActionType.GetDetail },
    { class: 'btn-dark', icon: 'fa fa-edit', text: 'common.tooltip.update', type: TableActionType.Update },
    { class: 'btn-danger', icon: 'fa fa-trash-alt', text: 'common.tooltip.delete', type: TableActionType.Delete }
  ];

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  getDataColumns() {
    return this.columns;
  }

  getRawData() {
    return this.userService.getUsers(
      this.pagination,
      this.sortMode,
      this.filterMode
    ).pipe(
      map((response: any) => {
        this.pagination = response.pagination;
        return response.items;
      })
    ).toPromise();
  }

  async getDataRows() {
    return await this.getRawData()
      .then(data => {
        this.rows = data.map(row => {
          const cells: TableCell = {} as any;

          for (const key in row) {
            if (!row.hasOwnProperty(key)) {
              continue;
            }

            if (key === 'roles') {
              cells[key] = {
                value: row[key],
                textProperty: 'name'
              };
            } else {
              cells[key] = {
                value: row[key]
              };
            }
          }

          cells.actions = {
            value: this.actions,
            showText: false
          };

          return { cells };
        });

        return this.rows;
      })
      .catch(error => {
        this.translate.get('common.alert.getDataFailed')
          .subscribe(getDataFailed => this.alertService.error(getDataFailed));
      });
  }

}
