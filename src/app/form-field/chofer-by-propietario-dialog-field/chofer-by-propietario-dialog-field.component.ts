import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChoferList } from 'src/app/interfaces/chofer';
import { Column } from 'src/app/interfaces/column';
import { ChoferService } from 'src/app/services/chofer.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { ChoferFormComponent } from 'src/app/flota/chofer-form/chofer-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chofer-by-propietario-dialog-field',
  templateUrl: './chofer-by-propietario-dialog-field.component.html',
  styleUrls: ['./chofer-by-propietario-dialog-field.component.scss']
})
export class ChoferByPropietarioDialogFieldComponent implements AfterViewInit {
  readonly inputValuePropName = 'numero_documento';
  //list$?: Observable<ChoferList[]>;
  cId?: number;
  sId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: ChoferList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: ChoferList) => element.estado,
    },
    {
      def: 'numero_documento',
      title: 'Nº Documento',
      value: (element: ChoferList) => element.numero_documento,
    },

    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: ChoferList) => element.nombre,
    },
    {
      def: 'celular',
      title: 'Celular',
      value: (element: ChoferList) => element.telefono,
    },
  ];

  @Input() choferEvents?: Observable<ChoferList>;
  @Input() chofer?: ChoferList;
  @Input() controlName = 'chofer_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Nº Doc.';
  @Output() valueChange = new EventEmitter<ChoferList | undefined>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<ChoferList>;

  fetchFunction = () => this.service.getList();

  constructor(
    private service: ChoferService,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit(): void {
    //this.getList();
    null;
  }

  dialogRefFunctionCrear(): MatDialogRef<ChoferFormComponent> {

    const data = {
      message: "message",
      comentarioRequirido: true,
      isDialog: true
    }

    let dialog = this.dialog
        .open(ChoferFormComponent, { data, panelClass: 'full-dialog' })

    return dialog;
  }

  dialogRefFunctionVer(id:number): MatDialogRef<ChoferFormComponent> {

    const data = {
      message: "message",
      comentarioRequirido: true,
      isDialog: true,
      readOnly:true,
      id:id
    }

    return this.dialog.open(ChoferFormComponent, { data, panelClass: 'full-dialog' });
  }

  //private getList(): void {
  //  this.list$ = this.service.getList();
  //}

}
