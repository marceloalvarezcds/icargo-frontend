import { Component, Input } from '@angular/core';
import { CheckboxModel } from 'src/app/interfaces/filter';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss']
})
export class CheckboxFilterComponent {

  allChecked = true;
  allCheckboxModel: CheckboxModel = {};
  allList: string[] = [];
  filteredList: string[] = [];
  filteredCheckboxModel: CheckboxModel = {};

  @Input() set value(val: string[]) {
    this.allChecked = true;
    this.filteredList = val.slice();
    this.filteredCheckboxModel = this.mergeCheckboxModelWithInitial();
  }

  @Input() set list(val: string[]) {
    this.allList = val.slice();
    Object.values(val).forEach((key) => (this.allCheckboxModel[key] = true));
    this.filteredCheckboxModel = this.mergeCheckboxModelWithInitial();
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

  reset(): void {
    this.filteredCheckboxModel = this.clonedCheckboxModel();
    this.updateAllChecked();
  }

  getFilteredList(): string[] {
    return this.transformCheckboxModelToStringList(this.filteredCheckboxModel);
  }

  private clonedCheckboxModel(): CheckboxModel {
    return JSON.parse(JSON.stringify(this.allCheckboxModel));
  }

  private mergeCheckboxModelWithInitial(): CheckboxModel {
    const checkboxModel = this.clonedCheckboxModel();
    if (!this.filteredList.length) {
      return checkboxModel;
    }
    this.allList.filter(x => !this.filteredList.includes(x)).forEach(key => {
      this.allChecked = false;
      checkboxModel[key] = false;
    });
    return checkboxModel;
  }

  private transformCheckboxModelToStringList(checkboxModel: CheckboxModel): string[] {
    return Object.keys(checkboxModel).filter((key) => checkboxModel[key]);
  };
}
