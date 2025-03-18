import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { TextoLegal } from 'src/app/interfaces/texto-legal';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { TextoLegalService } from 'src/app/services/texto-legal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-texto-legal-dialog-field',
  templateUrl: './texto-legal-dialog-field.component.html',
  styleUrls: ['./texto-legal-dialog-field.component.scss']
})
export class TextoLegalDialogFieldComponent {

  readonly inputValuePropName = 'texto_legal';

  list: TextoLegal[] = [];
  //subs = this.service.getList().subscribe((list) => {
  //  this.list = list;
  //});

  fetchDataFunction = () => this.service.getList();

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: TextoLegal) => element.id,
      sticky: true,
    },
    {
      def: 'titulo',
      title: 'Titulo',
      value: (element: TextoLegal) => element.titulo,
    },
    {
      def: 'descripcion',
      title: 'Descripcion',
      value: (element: TextoLegal) => element.descripcion,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: TextoLegal) => element.created_at,
    },
  ];

  @Input() textoLegalEvents?: Observable<TextoLegal>;
  @Input() isRemote?:boolean = false;
  @Input() form!: FormGroup;
  @Input() controlName = 'emision_orden_texto_legal';
  @Input() groupName = '';
  @Input() title = 'Texto Legal';

  @Output() valueChange = new EventEmitter<TextoLegal | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<TextoLegal>;

  constructor(private service: TextoLegalService) {}

}
