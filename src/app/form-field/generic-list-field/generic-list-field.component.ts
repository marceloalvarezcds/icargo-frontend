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
  private lista: T[] = [];
  formGroup?: FormGroup;
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

  get list(): T[] {
    return this.lista;
  }

  @Input() set list(l: T[]) {
    this.lista = l.slice();
  }
  @Input() key = 'id';
  @Input() controlName = '';
  @Input() groupName?: string;
  @Input() hint = '';
  @Input() requerido = false;
  @Input() errorMessage = '';
  @Input() set form(f: FormGroup) {
    const key = this.key;
    this.formGroup = f;
    const currentId = getIdFromAny(this.rowValue, key);
    this.setValueChange(currentId);
    this.subscription = this.control.valueChanges
      .pipe(filter((v) => !!v))
      .pipe(map((v) => getIdFromAny(v, key)))
      .subscribe((id) => {
        this.setValueChange(id);
      });
  }
  @Input() set list$(list$: Observable<T[]> | undefined) {
    list$?.subscribe((list) => {
      this.list = list;
      if (!list.length) {
        this.emptyListChange.emit();
      }
      if (this.formGroup) {
        const currentId = getIdFromAny(this.rowValue, this.key);
        this.setValueChange(currentId);
      }
    });
  }
  @Input() readonly = false;
  @Input() textValueFormat: (v: T) => string = () => '';
  @Input() title = '';
  @Input() value!: (v: T) => number | string | T;

  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<T | undefined>();

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  compareWith(
    o1?: string | number | { id: number },
    o2?: string | number | { id: number }
  ): boolean {
    const id1 = typeof o1 === 'number' || typeof o1 === 'string' ? o1 : o1?.id;
    const id2 = typeof o2 === 'number' || typeof o2 === 'string' ? o2 : o2?.id;
    return id1 === id2;
  }

  getItemById(id: string | number | undefined): T | undefined {
    return this.list.find((x: any) => x[this.key] === id);
  }

  getTextValue(): number | string | T | undefined {
    const currentId = getIdFromAny(this.rowValue, this.key);
    const item = this.getItemById(currentId);
    return item ? this.textValueFormat(item) : item;
  }

  private setValueChange(id: string | number | undefined): void {
    setTimeout(() => {
      const value = this.getItemById(id);
      this.valueChange.emit(value);
    }, 0);
  }

  isFieldEmpty(): boolean {
    const controlValue = this.control.value;
    return !controlValue || controlValue.length === 0;
  }

  shouldApplySmallSelect(controlName: string): boolean {
    // Define aquí la lógica para aplicar la clase small-select
    const smallSelectControls = ['tipo_anticipo_id', 'camion_id']; // Agrega los nombres de control necesarios
    return smallSelectControls.includes(controlName);
  }

}
