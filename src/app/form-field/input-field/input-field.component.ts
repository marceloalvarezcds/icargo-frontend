import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent {
  cId?: number;
  pId?: number;
  list$?: Observable<SemiList[]>;
  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get rowValue(): string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

  @Input() autocomplete: 'on' | 'off' | 'nope' = 'nope';
  @Input() formatToPasteNumber = false;
  @Input() formatToPastePhone = false;
  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() hint = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() readonly = false;
  @Input() title = '';
  @Input() disabled: boolean = false;
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
   
 this.getList();
  }
  constructor(private service: SemiService) {}

  private getList(): void {
    if (this.cId && this.pId) {
      this.list$ = this.service.getListByCamionId(
        this.cId
      );
    }
  }
}
