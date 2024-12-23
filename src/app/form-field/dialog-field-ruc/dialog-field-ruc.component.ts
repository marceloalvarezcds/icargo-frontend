import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { Contribuyente } from 'src/app/interfaces/contribuyente';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { ContribuyenteService } from 'src/app/services/contribuyente.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-field-ruc',
  templateUrl: './dialog-field-ruc.component.html',
  styleUrls: ['./dialog-field-ruc.component.scss']
})
export class DialogFieldRucComponent {

  readonly inputValuePropName = 'contribuyente';

  list: Contribuyente[] = [];

  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });

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

  @Input() form!: FormGroup;
  @Input() controlName = 'contribuyente';
  @Input() groupName = '';
  @Input() title = 'RUC';

  @Output() valueChange = new EventEmitter<Contribuyente>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<Contribuyente>;

  constructor(private service: ContribuyenteService) {}

}
