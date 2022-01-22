import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-generic-list-field',
  templateUrl: './generic-list-field.component.html',
  styleUrls: ['./generic-list-field.component.scss'],
  exportAs: 'app-generic-list-field',
})
export class GenericListFieldComponent<T extends { id: number }> implements OnDestroy {

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

  @Input() controlName = '';
  @Input() groupName?: string;
  @Input() errorMessage = '';
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.subscription = this.control.valueChanges
      .pipe(filter(v => !!v))
      .pipe(map(v => (typeof v === 'string' || typeof v === 'number') ? Number(v) : Number(v.id)))
      .subscribe(id => {
        const value = this.list.find(x => x.id === id);
        this.valueChange.emit(value);
      });
  }
  @Input() set list$(list$: Observable<T[]>) {
    list$.subscribe(list => {
      this.list = list;
    });
  }
  @Input() textValueFormat: (v: T) => string = () => '';
  @Input() title = '';
  @Input() value!: (v: T) => number | string | T;

  @Output() valueChange = new EventEmitter<T>();

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
