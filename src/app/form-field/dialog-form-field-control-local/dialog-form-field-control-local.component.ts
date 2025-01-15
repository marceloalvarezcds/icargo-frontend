import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
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
import { filter, map, take } from 'rxjs/operators';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import {
  PaginatedList,
  PaginatedListRequest,
} from 'src/app/interfaces/paginate-list';
import { CombinacionService } from 'src/app/services/combinacion.service';

@Component({
  selector: 'app-dialog-form-field-control-local',
  templateUrl: './dialog-form-field-control-local.component.html',
  styleUrls: ['./dialog-form-field-control-local.component.scss'],
  exportAs: 'app-dialog-form-field-control-local',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DialogFormFieldControlLocalComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: DialogFormFieldControlLocalComponent,
    },
  ],
})
export class DialogFormFieldControlLocalComponent<T extends { id: number }, DialogComponent = SelectorDialogComponent<T>>
implements MatFormFieldControl<number>, OnDestroy, AfterViewInit {

  @ViewChild('id') idInput!: HTMLInputElement;
  @ViewChild('descripcion') descripcionInput!: HTMLInputElement;

  static nextId = 0;

  selectedValue?: T;
  focused = false;
  errorState = false;
  controlType = 'app-dialog-form-field-control-local';
  ngControl: NgControl | null = null;
  formGroup = this.formBuilder.group({
    id: null,
    descripcion: null,
  });
  idSubscription = this.idControl.valueChanges
    .subscribe((value) => {
      //this.loadDescripcionAndEmitValue();
    });

  @HostBinding('class.mat-form-field-should-float')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty || !!this.selectedValue;
  }

  @Input() itemEvents?: Observable<void>;
  @Input() smallInput: boolean | undefined;
  @Input() excludeInactive: boolean = false;
  @Input() dialogRefFunction?: (selectedValue: T | undefined) => MatDialogRef<DialogComponent>;
  @Input() fetchFunctionLocal?: () => Observable<T[]>;
  @Input() columns: Column[] = [];
  @Input() descripcionPropName!: string;
  @Input() title = '';
  @Input() subtitle = '';
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy = '';
  @Input() item: T | undefined;
  @Input() itemObs?: Observable<T>;
  @Input()
  get value(): number | null {
    return this.idControl.value ? parseInt(this.idControl.value, 10) : null;
  }
  set value(val: number | null) {
    if ((val && !isNaN(val)) || val === null || val === undefined) {
      this.idControl.setValue(val);
      this.onChange(val);
    }
  }

  get empty() {
    const {
      value: { id, descripcion },
    } = this.formGroup;
    return !id && !descripcion;
  }

  get idControl(): FormControl {
    return this.formGroup.controls['id'] as FormControl;
  }

  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<T | null>();

  private eventsSubscription: Subscription | null= null;

  // variables formfielcontrol
  stateChanges = new Subject<void>();
  @HostBinding()
  id = `app-dialog-form-field-control-${DialogFormFieldControlLocalComponent.nextId++}`;
  placeholder: string = '';
  required: boolean = false;
  disabled: boolean = false;
  touched = false;
  autofilled?: boolean | undefined;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef<HTMLElement>,
    public injector: Injector,
  ) { }

  ngAfterViewInit(): void {
    if (this.itemEvents) {
      this.eventsSubscription = this.itemEvents
        .pipe(
          take(1),
        )
        .subscribe((r:any) => {
          console.log("itemEvents: ", r);
          this.selectedValue = r;
          this.loadDescripcionAndEmitValue();
      });
    }
  }

  onChange = (_: any) => {};

  onTouched = () => {
    this.touched = true;
  };

  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.app-dialog-form-field-control-local-container'
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.idSubscription.unsubscribe();
    this.eventsSubscription?.unsubscribe();
  }

  onload = false;

  writeValue(val: number | null): void {
    //setTimeout(() => {
      console.log("writeValue: ", val);
      this.value = val;

      if (this.onload) {
        console.log("item onload: ", this.item);
        this.selectedValue = this.item;
        this.onload = false;
      }

      this.loadDescripcionAndEmitValue();
    //}, 1000);
  }

  clearSelectedValue(): void {
    this.writeValue(null);
  }

  openDialog(): void {
    let dialogRef = this.dialogRefFunction
      ? this.dialogRefFunction(this.selectedValue)
      : this.getDefaultDialogRef();

    dialogRef
      .afterClosed()
      .pipe(filter((selectedValue: T) => !!selectedValue))
      .subscribe((selectedValue: T) => {

        console.log("afterClosed: ", selectedValue);
        this.selectedValue = selectedValue;
        this.writeValue(selectedValue.id);
        this.valueChange.emit(selectedValue);

      });
  }

  private getDefaultDialogRef(): MatDialogRef<SelectorDialogComponent<T>> {
    const data: SelectorDialogData<T> = {
      list: [],
      columns: this.columns.slice(),
      title: this.title,
      subtitle: this.subtitle,
      selectedValue: this.selectedValue,
      fetchFunctionLocal: this.fetchFunctionLocal,
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

  private loadDescripcionAndEmitValue(): void {
    console.log("loadDescripcionAndEmitValue");
    console.log(this.selectedValue);
    console.log(this.item);
    const selectedValue = this.selectedValue;
    let descripcion = null;
    if (selectedValue) {
      descripcion = (selectedValue as any)[this.descripcionPropName];
    }
    //this.formGroup.patchValue({ descripcion:descripcion });
    this.formGroup.controls['descripcion'].patchValue( descripcion );
  }

}

