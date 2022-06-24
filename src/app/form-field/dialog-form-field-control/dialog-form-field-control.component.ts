import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';

@Component({
  selector: 'app-dialog-form-field-control',
  templateUrl: './dialog-form-field-control.component.html',
  styleUrls: ['./dialog-form-field-control.component.scss'],
  exportAs: 'app-dialog-form-field-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogFormFieldControlComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: DialogFormFieldControlComponent,
    },
  ],
})
export class DialogFormFieldControlComponent<T extends { id: number }>
  implements
    ControlValueAccessor,
    MatFormFieldControl<number>,
    OnDestroy,
    DoCheck,
    OnInit
{
  static nextId = 0;
  @ViewChild('id') idInput!: HTMLInputElement;
  @ViewChild('descripcion') descripcionInput!: HTMLInputElement;

  formGroup = this.formBuilder.group({
    id: null,
    descripcion: null,
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  errorState = false;
  controlType = 'app-dialog-form-field-control';
  ngControl: NgControl | null = null;
  idSubscription = this.idControl.valueChanges
    .pipe(filter(() => this.list.length > 0))
    .subscribe(() => {
      this.loadDescripcionAndEmitValue();
    });

  @HostBinding()
  id = `app-dialog-form-field-control-${DialogFormFieldControlComponent.nextId++}`;

  get empty() {
    const {
      value: { id, descripcion },
    } = this.formGroup;
    return !id && !descripcion;
  }

  @HostBinding('class.mat-form-field-should-float')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty || !!this.selectedValue;
  }

  @Input() columns: Column[] = [];
  @Input() descripcionPropName!: string;
  @Input() title = '';
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy = '';

  @Input()
  get placeholder(): string {
    return this.placehold;
  }
  set placeholder(value: string) {
    this.placehold = value;
    this.stateChanges.next();
  }
  private placehold = '';

  @Input()
  get required(): boolean {
    return this.req;
  }
  set required(value: BooleanInput) {
    this.req = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private req = false;

  @Input()
  get disabled(): boolean {
    return this.isDisabled;
  }
  set disabled(value: BooleanInput) {
    this.isDisabled = coerceBooleanProperty(value);
    this.isDisabled ? this.formGroup.disable() : this.formGroup.enable();
    this.stateChanges.next();
  }
  private isDisabled = false;

  @Input()
  get list(): T[] {
    return this.lista;
  }
  set list(list: T[]) {
    this.lista = list;
    if (this.value) {
      this.loadDescripcionAndEmitValue();
    }
  }
  private lista: T[] = [];

  @Input()
  get value(): number | null {
    return this.idControl.value;
  }
  set value(val: number | null) {
    this.idControl.setValue(val);
    this.onChange(val);
    this.stateChanges.next();
  }

  get idControl(): FormControl {
    return this.formGroup.controls['id'] as FormControl;
  }

  get selectedValue(): T | undefined {
    return this.list.find((x) => x.id === this.value);
  }

  @Output() valueChange = new EventEmitter<T | null>();

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    public injector: Injector
  ) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.idSubscription.unsubscribe();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = !!(this.ngControl.invalid && this.ngControl.touched);
      this.stateChanges.next();
    }
  }

  onChange = (_: any) => {};

  onTouched = () => {
    this.touched = true;
  };

  onFocusIn(_: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(
    control: AbstractControl,
    nextElement?: HTMLInputElement
  ): void {
    if (!control.errors && nextElement) {
      this.focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.app-dialog-form-field-control-container'
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.formGroup.controls.id.valid) {
      this.focusMonitor.focusVia(this.descripcionInput, 'program');
    } else {
      this.focusMonitor.focusVia(this.idInput, 'program');
    }
  }

  writeValue(val: number | null): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  clearSelectedValue(): void {
    this.writeValue(null);
  }

  openDialog(): void {
    const data: SelectorDialogData<T> = {
      list: this.list.slice(),
      columns: this.columns.slice(),
      title: this.title,
      selectedValue: this.selectedValue,
    };
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    };
    this.dialog
      .open(SelectorDialogComponent, config)
      .afterClosed()
      .pipe(filter((contacto) => !!contacto))
      .subscribe((selectedValue: T) => {
        this.writeValue(selectedValue.id);
      });
  }

  private loadDescripcionAndEmitValue(): void {
    const selectedValue = this.selectedValue;
    let descripcion = null;
    if (selectedValue) {
      descripcion = (selectedValue as any)[this.descripcionPropName];
    }
    this.formGroup.patchValue({ descripcion });
    this.valueChange.emit(this.selectedValue);
  }
}
