import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CamionService } from 'src/app/services/camion.service';

@Component({
  selector: 'app-camion-by-propietario-dialog-field',
  templateUrl: './camion-by-propietario-dialog-field.component.html',
  styleUrls: ['./camion-by-propietario-dialog-field.component.scss']
})
export class CamionByPropietarioDialogFieldComponent implements AfterViewInit{
  readonly inputValuePropName = 'placa';
  list$?: Observable<CamionList[]>;
  cId?: number;
  sId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: CamionList) => element.id,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: CamionList) => element.placa,
    },
  
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: CamionList) => element.marca_descripcion,
    },
    {
      def: 'color_descripcion',
      title: 'Color',
      value: (element: CamionList) => element.color_descripcion,
    },
  ];

  @Input() controlName = 'camion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tracto';

  @Output() valueChange = new EventEmitter<CamionList | undefined>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<CamionList>;

  constructor(private service: CamionService) {  }
  
  ngAfterViewInit(): void {
    this.getList();
  }
  private getList(): void {
    this.list$ = this.service.getList();
  }
}
