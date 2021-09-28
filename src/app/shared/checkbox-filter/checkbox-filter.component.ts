import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CheckboxFilterEvent, CheckboxModel } from 'src/app/interfaces/filter';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss']
})
export class CheckboxFilterComponent implements OnDestroy {

  allChecked = true;
  allCheckboxModel: CheckboxModel = {};
  allList: string[] = [];
  filteredList: string[] = [];
  filteredCheckboxModel: CheckboxModel = {};
  searchFormControl = new FormControl(null);
  searchSubscription = this.searchFormControl.valueChanges.subscribe((search) => this.filterData(search));

  @Input() value: string[] = [];
  @Input() set list(val: string[]) {
    this.allList = val.slice();
    this.filteredList = val.slice();
    Object.values(val).forEach((key) => (this.allCheckboxModel[key] = true));
    this.filteredCheckboxModel = this.mergeCheckboxModelWithInitial();
  }
  @Output() filtered = new EventEmitter<CheckboxFilterEvent>();
  @Output() valueChanges = new EventEmitter<string[]>();

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  reset(): void {
    this.filteredList = this.allList.slice();
    this.filteredCheckboxModel = this.clonedCheckboxModel();
    this.searchFormControl.setValue(null);
    this.updateAllChecked();
    this.apply(true);
  }

  apply(isResetPressed: boolean = false): void {
    const list = this.transformCheckboxModelToStringList(this.filteredCheckboxModel);
    this.valueChanges.emit(list);
    this.filtered.emit({ filteredList: list, isResetPressed });
  }

  updateAllChecked(): void {
    this.allChecked = Object.keys(this.filteredCheckboxModel).every(
      (key) => this.filteredCheckboxModel[key]
    );
  }

  someChecked(): boolean {
    const someResult = Object.keys(this.filteredCheckboxModel).some((key) => {
      return this.filteredCheckboxModel[key];
    });
    return someResult && !this.allChecked;
  }

  setAll(completed: boolean): void {
    this.allChecked = completed;
    if (completed) {
      this.filteredCheckboxModel = this.clonedCheckboxModel();
    } else {
      Object.keys(this.filteredCheckboxModel).forEach((key) => {
        this.filteredCheckboxModel[key] = false;
      });
    }
  }

  private filterData(filterValue: string): void {
    const list = this.allList.slice();
    if (filterValue) {
      const regex = new RegExp(filterValue, 'gi');
      this.filteredList = list.filter((city) => regex.test(city));
    } else {
      this.filteredList = list.slice();
    }
  }

  private clonedCheckboxModel(): CheckboxModel {
    return JSON.parse(JSON.stringify(this.allCheckboxModel));
  }

  private mergeCheckboxModelWithInitial(): CheckboxModel {
    const checkboxModel = this.clonedCheckboxModel();
    if (!this.value.length) {
      return checkboxModel;
    }
    this.allList.filter(x => !this.value.includes(x)).forEach(key => {
      this.allChecked = false;
      checkboxModel[key] = false;
    });
    return checkboxModel;
  }

  private transformCheckboxModelToStringList(checkboxModel: CheckboxModel): string[] {
    return Object.keys(checkboxModel).filter((key) => checkboxModel[key]);
  };
}
