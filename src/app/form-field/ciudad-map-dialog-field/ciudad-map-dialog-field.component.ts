import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { Column } from 'src/app/interfaces/column';
import { CiudadService } from 'src/app/services/ciudad.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-ciudad-map-dialog-field',
  templateUrl: './ciudad-map-dialog-field.component.html',
  styleUrls: ['./ciudad-map-dialog-field.component.scss']
})
export class CiudadMapDialogFieldComponent {
  pId?: number;
  formGroup?: FormGroup;
  list$: Observable<Ciudad[]> = of([]) ;
  readonly inputValuePropName = 'nombre';
  fetchFunction = this.service.getPaginatedList.bind(this.service);

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Ciudad) => element.id,
      sticky: true,
    },
    {
      def: 'nombre',
      title: 'Ciudad',
      value: (element: Ciudad) => element.nombre,
    },
    {
      def: 'localidad_nombre',
      title: 'Localidad',
      value: (element: Ciudad) => element.localidad_nombre,
    },
    {
      def: 'pais_nombre',
      title: 'País',
      value: (element: Ciudad) =>
        `${element.pais_nombre} | ${element.pais_nombre_corto}`,
    },
  ];

  @Input() set localidadId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }
  @Input() ciudadSelected?: Ciudad | null;
  @Input() form!: FormGroup;
  @Input() controlName = 'ciudad_id';
  @Input() groupName = '';
  @Input() title = 'Ciudad';
  

  @Output() valueChange = new EventEmitter<Ciudad>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<Ciudad>;

  constructor(private service: CiudadService) {}

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getList(this.pId);
    }
  }
}
