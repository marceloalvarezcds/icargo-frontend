import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { CheckboxEvent } from 'src/app/interfaces/table';

@Component({
  selector: 'app-selectable-item-table',
  templateUrl: './selectable-item-table.component.html',
  styleUrls: ['./selectable-item-table.component.scss'],
  exportAs: 'app-selectable-movimiento-table',
})
export class SelectableItemTableComponent<T extends { id: number }> {
  private selectedItems: T[] = [];

  @Input() list: T[] = [];
  @Input() columns: Column[] = [];

  @Output() selectedItemsChange = new EventEmitter<T[]>();

  onAllCheckedChange(checked: boolean): void {
    if (checked) {
      this.selectedItems = this.list.slice();
    } else {
      this.selectedItems = [];
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onCheckboxChange(event: CheckboxEvent<T>): void {
    const item = event.value.row;
    if (event.event.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter((m) => m.id !== item.id);
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  clearCheckedValues(){
    this.selectedItems = [];
    this.selectedItemsChange.emit(this.selectedItems);
  }

}
