import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import {
  PaginatedList,
  PaginatedListRequest,
} from 'src/app/interfaces/paginate-list';
import { CombinacionService } from 'src/app/services/combinacion.service';

@Component({
  selector: 'app-dialog-form-field-control',
  templateUrl: './dialog-form-field-control.component.html',
  styleUrls: ['./dialog-form-field-control.component.scss'],
  exportAs: 'app-dialog-form-field-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class DialogFormFieldControlComponent<
  T extends { id: number },
  DialogComponent = SelectorDialogComponent<T>
> implements
    ControlValueAccessor,
    MatFormFieldControl<number>,
    OnDestroy,
    DoCheck,
    OnInit,
    AfterViewInit
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
    .subscribe((value) => {
      this.selectedValue = this.list.find(x => x.id === value)
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
  @Input() itemEvents?: Observable<void>;
  @Input() smallInput: boolean | undefined;
  @Input() excludeInactive: boolean = false;
  @Input() dialogRefFunction?: (selectedValue: T | undefined, dataList: T[] | undefined) => MatDialogRef<DialogComponent>;
  @Input() dialogRefFunctionCrear?: () => MatDialogRef<any>
  @Input() fetchDateFunction?: () => Observable<T[]>;
  @Input() fetchFunction?: (request: PaginatedListRequest) => Observable<PaginatedList<T>>;
  @Input() columns: Column[] = [];
  @Input() descripcionPropName!: string;
  @Input() title = '';
  @Input() subtitle = '';
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
    if (!list.length) {
      this.emptyListChange.emit();
    }
    if (this.value) {
      this.selectedValue = this.list.find(x => x.id === this.value)
      this.loadDescripcionAndEmitValue();
    }
  }
  private lista: T[] = [];

  @Input()
  get value(): number | null {
    return this.idControl.value ? parseInt(this.idControl.value, 10) : null;
  }
  set value(val: number | null) {
    if ((val && !isNaN(val)) || val === null || val === undefined) {
      this.idControl.setValue(val);
      this.onChange(val);
      this.stateChanges.next();
    }
  }

  get idControl(): FormControl {
    return this.formGroup.controls['id'] as FormControl;
  }

  selectedValue ?: T;

  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<T | null>();

  private eventsSubscription: Subscription | null= null;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
    private combinacionService: CombinacionService,
  ) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit(): void {
    if (this.itemEvents) {
      this.eventsSubscription = this.itemEvents
        .pipe(
          take(1),
        )
        .subscribe((r:any) => {
          this.selectedValue = r;
          this.loadDescripcionAndEmitValue();
      });
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.idSubscription.unsubscribe();
    this.eventsSubscription?.unsubscribe();
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


  private deshabilitarOpcion(estado: string): boolean {
    const estadosNoSeleccionables = ['Inactivo', 'Pendiente', 'Eliminado', 'Cancelado'];
    return estadosNoSeleccionables.includes(estado);
  }

  openDialog(): void {
    const dialogRef = this.dialogRefFunction
      ? this.dialogRefFunction(this.selectedValue, [])
      : this.getDefaultDialogRef();

    dialogRef
      .afterClosed()
      .pipe(filter((selectedValue: T) => !!selectedValue))
      .subscribe((selectedValue: T) => {
        if (this.deshabilitarOpcion((selectedValue as any).estado)) {
          alert('El elemento seleccionado está inactivo o en un estado no seleccionable.');
          return; // Salir sin asignar ni realizar acciones adicionales
        }

        this.selectedValue = selectedValue;
        if (!this.lista.length) {
          this.lista = [selectedValue];
        }
        this.writeValue(selectedValue.id);
      });

  }

  openDialogWithData(dataList: T[]): void {
    this.list = dataList;

    const dialogRef = this.dialogRefFunction
      ? this.dialogRefFunction(this.selectedValue, dataList)
      : this.getDefaultDialogRef();

    dialogRef
      .afterClosed()
      .pipe(filter((selectedValue: T) => !!selectedValue))
      .subscribe((selectedValue: T) => {
        if (this.deshabilitarOpcion((selectedValue as any).estado)) {
          alert('El elemento seleccionado está inactivo o en un estado no seleccionble.');
          return;
        }

        this.selectedValue = selectedValue;
        if (!this.lista.length) {
          this.lista = [selectedValue];
        }
        this.writeValue(selectedValue.id);
      });
  }

  private getDefaultDialogRef(): MatDialogRef<SelectorDialogComponent<T>> {

    const nuevoEleEventsSubject: Subject<[T, T[]]> = new Subject<[T, T[]]>();
    const backEleEventsSubject: Subject<T[]> = new Subject<T[]>();

    nuevoEleEventsSubject.subscribe( (a:any[]) => {

      this.list = a[1];

      setTimeout((e:T) => {
        this.selectedValue = e;
        this.writeValue(this.selectedValue.id);
      }, 500, a[0]);

    })

    backEleEventsSubject.subscribe( (lista:any) => {
      this.openDialogWithData(lista);
    });

    const data: SelectorDialogData<T> = {
      list: this.list.slice(),
      columns: this.columns.slice(),
      title: this.title,
      subtitle: this.subtitle,
      selectedValue: this.selectedValue,
      fetchFunction: this.fetchFunction,
      fetchFunctionLocal: this.fetchDateFunction,
      dialogRefFunctionCrear: this.dialogRefFunctionCrear,
      nuevoEleEvent: nuevoEleEventsSubject,
      backEleEventsSubject: backEleEventsSubject,
    };

    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    };

    return this.dialog.open<SelectorDialogComponent<T>>(
      SelectorDialogComponent,
      config
    );
  }


  readonly searchBy = 'id';
  keyPress(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      const inputValue = this.formGroup.controls['descripcion'].value?.toString().trim();
      if (this.searchBy === 'id') {
        const result = this.list.find((x: any) => x.id === Number(inputValue));
        if (result) {
          this.value = result.id;
        } else {
          alert('No se encontró ningún elemento en la lista con el valor proporcionado por ID');
        }
      }
      else if (this.searchBy === 'descripcion') {
        const result = this.list.find((x: any) => x[this.descripcionPropName] === inputValue);
        if (result) {
          this.value = result.id;
        } else {
          alert('No se encontró ningún elemento en la lista con el valor proporcionado por Descripción');
        }
      }
    }
  }

  findNextEditableField(): HTMLElement | null {
    const formControls = Array.from(document.querySelectorAll('input:not([readonly]), select:not([disabled]), textarea:not([disabled])')) as HTMLElement[];
    const currentIndex = formControls.findIndex(control => control === document.activeElement);
    const nextIndex = currentIndex + 1;
    const nextField = formControls[nextIndex];

    return nextField || null;
  }

  private loadDescripcionAndEmitValue(): void {
    const selectedValue = this.selectedValue;
    let descripcion = null;
    if (selectedValue) {
      descripcion = (selectedValue as any)[this.descripcionPropName];
    }
    this.formGroup.patchValue({ descripcion });
    setTimeout(() => this.valueChange.emit(this.selectedValue), 0);
  }

}
