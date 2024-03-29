import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { BloodBank } from '../core/models/blood-bank.interface';
import { FilterMode } from '../core/models/filter-mode.interface';
import { Pagination } from '../core/models/pagination.interface';
import { SortMode } from '../core/models/sort-mode.interface';
import { BloodBankService } from '../core/services/blood-bank.service';
import { MapInputComponent } from '../shared/components/map-input/map-input.component';

@Component({
  selector: 'app-blood-banks',
  templateUrl: './blood-banks.component.html',
  styleUrls: ['./blood-banks.component.scss']
})
export class BloodBanksComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('search') search: ElementRef;
  @ViewChild(MapInputComponent) mapInput: MapInputComponent;

  bloodBanks: BloodBank[] = [];

  pagination: Pagination = {
    page: 1,
    size: 10
  };

  sortMode: SortMode = {
    sortBy: 'createdAt',
    isSortAscending: false
  };

  filterMode: FilterMode = {};

  searchSubscription: Subscription;
  modalRef: MDBModalRef;

  constructor(
    private renderer: Renderer2,
    private bloodBankService: BloodBankService
  ) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'grey-background');
    this.getBloodBanks();
  }

  ngAfterViewInit() {
    this.searchSubscription = fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(250),
        tap((value: string) => this.searchBloodBank(value))
      )
      .subscribe();
  }

  private getBloodBanks() {
    this.bloodBankService.getBloodBanks(this.pagination, this.sortMode, this.filterMode)
      .subscribe((response: any) => {
        this.bloodBanks = response.items;
        this.pagination = response.pagination;
      });
  }

  searchBloodBank(value: string) {
    if (value.length === 0 || value.length > 2) {
      this.pagination.page = 1;
      this.filterMode.name = value;
      this.getBloodBanks();
    }
  }

  resetFilters() {
    this.search.nativeElement.value = null;
    this.mapInput.reset();
    this.filterMode = {};
    this.getBloodBanks();
  }

  onLocationChanged(location: any) {
    this.filterMode.location = `${location.lng},${location.lat}`;
    this.getBloodBanks();
  }

  onPageChanged(page: number) {
    this.pagination.page = page;
    this.getBloodBanks();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'grey-background');
    this.searchSubscription.unsubscribe();
  }

}
