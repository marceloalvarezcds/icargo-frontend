import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { Contribuyente } from 'src/app/interfaces/contribuyente';
import { ContribuyenteService } from 'src/app/services/contribuyente.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogFormFieldControlComponent } from '../dialog-form-field-control/dialog-form-field-control.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectorDialogComponent } from 'src/app/dialogs/selector-dialog/selector-dialog.component';
import { SelectorDialogData } from 'src/app/interfaces/dialog-data';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';
import { PaginatedList, PaginatedListRequest } from 'src/app/interfaces/paginate-list';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dialog-field-ruc',
  templateUrl: './dialog-field-ruc.component.html',
  styleUrls: ['./dialog-field-ruc.component.scss']
})
export class DialogFieldRucComponent<DialogComponent = SelectorDialogComponent<Contribuyente>>
  implements OnInit {

  readonly inputValuePropName = 'contribuyente';

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Contribuyente) => element.id,
    },
    {
      def: 'contribuyente',
      title: 'Nombre',
      value: (element: Contribuyente) => element.contribuyente,
    },
    {
      def: 'ruc',
      title: 'RUC',
      value: (element: Contribuyente) => element.ruc,
    }
  ];

  selectedValue ?: Contribuyente;
  filteredOptions: Observable<Contribuyente[]> | undefined ;

  private lista: Contribuyente[] = [];
  list: Contribuyente[] = [];
  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });

  dialogRefFunction?: (selectedValue: Contribuyente | undefined) => MatDialogRef<DialogComponent>;
  fetchFunction?: (request: PaginatedListRequest) => Observable<PaginatedList<Contribuyente>>;

  get group(): FormGroup {
    if (this.groupName) {
      return this.form?.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() form!: FormGroup;
  @Input() controlName = '';
  @Input() groupName = '';
  @Input() title = 'RUC';
  @Input() requerido = false;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<Contribuyente>();

  @ViewChild(DialogFormFieldControlComponent)
  dialogFieldControl?: DialogFormFieldControlComponent<Contribuyente>;

  constructor(
    private service: ContribuyenteService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    console.log();
    this.filteredOptions = this.control.valueChanges
      .pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        //map(value => typeof value === 'string' ? value : value.name),
        switchMap(val => this.filterRuc(val))
      );
  }

  filterRuc(filter:string) : Observable<any[]> {

    // TODO: inicialmente la busqueda sera local
    const matches = this.list.filter(
      option => { return (option.ruc.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          || option.contribuyente.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))}
    );

    return of(matches);
    /*return this.ordenCargaRemisionOrigenService.getListByNroRemito(filter)
      .pipe(
        map(response => {
          this.optionsList =  response.filter(
            option => { return option.numero_documento.indexOf(filter) === 0}
          )
          return this.optionsList.slice();
        }))
      ;*/
  }

  cargarCampoContribuyente(contribuyente:any):void {
    this.selectedValue = this.list.find( x => x.contribuyente===contribuyente);
    if (this.selectedValue) {
      this.writeValue(this.selectedValue)
    }
  }

  openDialog(): void {
    const dialogRef = this.dialogRefFunction
      ? this.dialogRefFunction(this.selectedValue)
      : this.getDefaultDialogRef();

    dialogRef
      .afterClosed()
      .pipe(filter((selectedValue: Contribuyente) => !!selectedValue))
      .subscribe((selectedValue: Contribuyente) => {
        this.selectedValue = selectedValue;

        if (!this.lista.length) {
          this.lista = [selectedValue];
        }

        this.writeValue(selectedValue);
      });
  }

  private writeValue(contribuyente : Contribuyente ):void {
    this.form.get('contribuyente')?.setValue(contribuyente.contribuyente);
    this.form.get('ruc')?.setValue(contribuyente.ruc);
  }

  private getDefaultDialogRef(): MatDialogRef<SelectorDialogComponent<Contribuyente>> {
    const data: SelectorDialogData<Contribuyente> = {
      list: this.list.slice(),
      columns: this.columns.slice(),
      title: this.title,
      subtitle: "",
      selectedValue: this.selectedValue,
      fetchFunction: this.fetchFunction,
    };
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    };
    return this.dialog.open<SelectorDialogComponent<Contribuyente>>(
      SelectorDialogComponent,
      config
    );
  }

}
