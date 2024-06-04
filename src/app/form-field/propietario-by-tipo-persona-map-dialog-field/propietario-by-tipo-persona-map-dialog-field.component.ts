import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectorInMapDialogComponent } from 'src/app/dialogs/selector-in-map-dialog/selector-in-map-dialog.component';
import {
  Marker,
  SelectorInMapDialogData,
} from 'src/app/interfaces/dialog-data';
import { RemitenteList } from 'src/app/interfaces/remitente';
import { DialogService } from 'src/app/services/dialog.service';
import { RemitenteService } from 'src/app/services/remitente.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { Propietario, PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';
import { Column } from 'src/app/interfaces/column';

@Component({
  selector: 'app-propietario-by-tipo-persona-map-dialog-field',
  templateUrl: './propietario-by-tipo-persona-map-dialog-field.component.html',
  styleUrls: ['./propietario-by-tipo-persona-map-dialog-field.component.scss']
})
export class PropietarioByTipoPersonaMapDialogFieldComponent{
  readonly inputValuePropName = 'info';
  list: PropietarioList[] = [];

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: PropietarioList) => element.id,
      sticky: true,
    },
    {
      def: 'nombre',
      title: 'Beneficiario',
      value: (element: PropietarioList) => element.nombre,
    },
    {
      def: 'ruc',
      title: 'Ruc',
      value: (element: PropietarioList) => element.ruc,
    },
    {
      def: 'numero_documento',
      title: 'Cedula',
      value: (element: PropietarioList) => element.numero_documento,
    },
 
  
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'propietario_id';
  @Input() groupName = '';
  @Input() title = 'Nº Doc';

  @Output() valueChange = new EventEmitter<PropietarioList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<PropietarioList>;

  constructor(private propietarioService: PropietarioService) {}
  
}
