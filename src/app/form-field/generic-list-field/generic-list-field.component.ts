import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { getIdFromAny } from 'src/app/utils/form-control';

@Component({
  selector: 'app-generic-list-field',
  templateUrl: './generic-list-field.component.html',
  styleUrls: ['./generic-list-field.component.scss'],
  exportAs: 'app-generic-list-field',
})
export class GenericListFieldComponent<T extends { id: number }>
  implements OnDestroy
{
  formGroup?: FormGroup;
  list: T[] = [];
  subscription?: Subscription;

  get group(): FormGroup {
    if (this.groupName) {
      return this.formGroup!.get(this.groupName) as FormGroup;
    }
    return this.formGroup!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get rowValue(): T | string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

  @Input() controlName = '';
  @Input() groupName?: string;
  @Input() errorMessage = '';
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    const currentId = getIdFromAny(this.rowValue);
    this.setValueChange(currentId);
    this.subscription = this.control.valueChanges
      .pipe(filter((v) => !!v))
      .pipe(map((v) => getIdFromAny(v)))
      .subscribe(this.setValueChange.bind(this));
  }
  @Input() set list$(list$: Observable<T[]> | undefined) {
    list$?.subscribe((list) => {
      this.list = list;
      if (this.formGroup) {
        const currentId = getIdFromAny(this.rowValue);
        this.setValueChange(currentId);
      }
    });
  }
  @Input() textValueFormat: (v: T) => string = () => '';
  @Input() title = '';
  @Input() value!: (v: T) => number | string | T;

  @Output() valueChange = new EventEmitter<T>();

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  compareWith(
    o1?: number | { id: number },
    o2?: number | { id: number }
  ): boolean {
    const id1 = typeof o1 === 'number' ? o1 : o1?.id;
    const id2 = typeof o2 === 'number' ? o2 : o2?.id;
    return id1 === id2;
  }

  private setValueChange(id: number | undefined): void {
    const value = this.list.find((x) => x.id === id);
    this.valueChange.emit(value);
  }
}
