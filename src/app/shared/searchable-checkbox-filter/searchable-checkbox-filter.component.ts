import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CheckboxFilterEvent } from 'src/app/interfaces/filter';
import { CheckboxFilterComponent } from '../checkbox-filter/checkbox-filter.component';

@Component({
  selector: 'app-searchable-checkbox-filter',
  templateUrl: './searchable-checkbox-filter.component.html',
  styleUrls: ['./searchable-checkbox-filter.component.scss']
})
export class SearchableCheckboxFilterComponent implements OnDestroy {

  allList: string[] = [];
  filteredList: string[] = [];
  searchFormControl = new FormControl(null);
  searchSubscription = this.searchFormControl.valueChanges.subscribe((search) => this.filterData(search));

  @Input() value: string[] = [];
  @Input() set list(val: string[]) {
    this.allList = val.slice();
    this.filteredList = val.slice();
  }
  @Output() filtered = new EventEmitter<CheckboxFilterEvent>();
  @Output() valueChanges = new EventEmitter<string[]>();

  @ViewChild(CheckboxFilterComponent) checkboxFilterComponent!: CheckboxFilterComponent;

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  reset(): void {
    this.searchFormControl.setValue(null);
    this.filteredList = this.allList.slice();
    this.checkboxFilterComponent.reset();
    this.apply(true);
  }

  apply(isResetPressed: boolean = false): void {
    const list = this.checkboxFilterComponent.getFilteredList();
    this.valueChanges.emit(list);
    this.filtered.emit({ filteredList: list, isResetPressed });
  }

  private filterData(filterValue: string): void {
    if (filterValue) {
      const regex = new RegExp(filterValue, 'gi');
      this.filteredList = this.allList.filter(x => regex.test(x));
    } else {
      this.filteredList = this.allList.slice();
    }
  }
}
