import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '@shared/services/data.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  search = new FormControl('');
  private $destroy = new Subject<void>();

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.search.valueChanges.pipe(
      tap(console.log),
      map((searchText: string) => searchText?.toLowerCase().trim()),
      debounceTime(300),
      distinctUntilChanged(),
      filter(search => search !== '' && search?.length > 2),
      tap(search => this.dataService.filterData(search)),
      takeUntil(this.$destroy)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  onClear(): void {
    this.search.reset();
    this.dataService.getDataApi();
  }

}
