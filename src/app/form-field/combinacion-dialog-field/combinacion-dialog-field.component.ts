import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-combinacion-dialog-field',
  templateUrl: './combinacion-dialog-field.component.html',
  styleUrls: ['./combinacion-dialog-field.component.scss']
})
export class CombinacionDialogFieldComponent   implements AfterViewInit {
  readonly inputValuePropName = 'camion_placa';
  list$?: Observable<CombinacionList[]>;
  cId?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'camion_nombre',
      title: 'Tracto',
      value: (element: CombinacionList) => element.camion_placa,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: CombinacionList) => element.chofer_nombre,
    },
    {
      def: 'doc',
      title: 'Documento',
      value: (element: CombinacionList) => element.chofer.numero_documento,
    }, 
    {
      def: 'marca',
      title: 'Marca',
      value: (element: CombinacionList) => element.marca_descripcion,
    },    
    {
      def: 'color',
      title: 'Color',
      value: (element: CombinacionList) => element.color_camion,
    },    
    {
      def: 'neto',
      title: 'Neto',
      value: (element: CombinacionList) => element.neto,
    },

  ];

  @Input() controlName = 'camion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'TRACTOS';



  @Output() valueChange = new EventEmitter<CombinacionList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<CombinacionList>;

  constructor(private service: CombinacionService) { }

  ngAfterViewInit(): void {
    this.getList();
  }

  private getList(): void {
    this.list$ = this.service.getList();
  }
}
