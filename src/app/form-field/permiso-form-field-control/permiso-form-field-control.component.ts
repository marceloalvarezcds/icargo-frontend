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
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Permiso } from 'src/app/interfaces/permiso';

@Component({
  selector: 'app-permiso-form-field-control',
  templateUrl: './permiso-form-field-control.component.html',
  styleUrls: ['./permiso-form-field-control.component.scss'],
  exportAs: 'app-permiso-form-field-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermisoFormFieldControlComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: PermisoFormFieldControlComponent,
    },
  ],
})
export class PermisoFormFieldControlComponent
  implements
    ControlValueAccessor,
    MatFormFieldControl<Permiso[]>,
    OnDestroy,
    DoCheck,
    OnInit
{
  static nextId = 0;

  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  errorState = false;
  isFirstValue = true;
  controlType = 'app-permiso-form-field-control';
  ngControl: NgControl | null = null;
  permisoAgrupados: {
    [modulo: string]: { [modelo: string]: Array<Permiso & { index: number }> };
  } = {};

  @HostBinding()
  id = `app-permiso-form-field-control-${PermisoFormFieldControlComponent.nextId++}`;

  get empty() {
    return this.val.length === 0;
  }

  @HostBinding('class.mat-form-field-should-float')
  get shouldLabelFloat() {
    return true;
  }

  @Input() hasGestorCargaId = false;

  get isSuperUser(): boolean {
    return !this.hasGestorCargaId;
  }

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
    this.stateChanges.next();
  }
  private isDisabled = false;

  @Input()
  get list(): Permiso[] {
    return this.lista;
  }
  set list(list: Permiso[]) {
    this.permisoAgrupados = list.reduce((r, p, index) => {
      r[p.modulo] = r[p.modulo] || {};
      r[p.modulo][p.modelo_titulo] = r[p.modulo][p.modelo_titulo] || [];
      r[p.modulo][p.modelo_titulo].push({ ...p, checked: false, index });
      return r;
    }, Object.create(null));
    this.lista = list;
    this.verifyPermisoCheckedAndEmitValue(this.value ?? []);
  }
  private lista: Permiso[] = [];

  @Input()
  get value(): Permiso[] | null {
    return this.val;
  }
  set value(val: Permiso[] | null) {
    // Vine NULL solo la primera vez
    if (val) {
      this.val = val.slice();
      this.verifyPermisoCheckedAndEmitValue(val);
      this.onChange(val);
      this.stateChanges.next();
    }
  }
  private val: Permiso[] = [];

  @Output() valueChange = new EventEmitter<Permiso[]>();

  constructor(
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

  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.app-permiso-form-field-control-container'
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    this.focusMonitor.focusVia(this.elementRef, 'program');
  }

  writeValue(val: Permiso[]): void {
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

  changeValueByPosition(
    permiso: Permiso,
    positionInArray: number,
    { checked }: MatCheckboxChange
  ): void {
    this.isFirstValue = false;
    this.list[positionInArray] = { ...permiso, checked };
    this.value = this.list.filter((permiso) => permiso.checked);
  }

  private verifyPermisoCheckedAndEmitValue(val: Permiso[]): void {
    if (this.list.length > 0 && val.length > 0) {
      if (this.isFirstValue) {
        val.forEach((p) => {
          const idx = this.permisoAgrupados![p.modulo][
            p.modelo_titulo
          ].findIndex((x) => x.id === p.id && !x.checked);
          if (idx >= 0) {
            const cur = this.permisoAgrupados![p.modulo][p.modelo_titulo][idx];
            this.permisoAgrupados![p.modulo][p.modelo_titulo][idx] = {
              ...cur,
              checked: true,
            };
            this.list[cur.index] = { ...p, checked: true };
          }
        });
      } else {
        this.valueChange.emit(val);
      }
    }
  }
}
