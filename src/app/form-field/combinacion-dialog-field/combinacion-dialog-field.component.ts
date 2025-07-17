import { AfterViewInit, Component, EventEmitter, Input,  Output, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { FormGroup } from '@angular/forms';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Component({
  selector: 'app-combinacion-dialog-field',
  templateUrl: './combinacion-dialog-field.component.html',
  styleUrls: ['./combinacion-dialog-field.component.scss']
})
export class CombinacionDialogFieldComponent   implements AfterViewInit {
  readonly inputValuePropName = 'camion_placa';
  //list$?: Observable<CombinacionList[]>;
  cId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id_combinacion',
      title: 'ID',
      value: (element: CombinacionList) => element.id,
    },
    {
      def: 'camion_placa',
      title: 'Tracto',
      value: (element: CombinacionList) => element.camion_placa,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CombinacionList) => element.estado,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: CombinacionList) => element.chofer_nombre,
    },
    {
      def: 'chofer_numero_documento',
      title: 'Documento',
      value: (element: CombinacionList) => element.chofer_numero_documento,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: CombinacionList) => element.marca_descripcion,
    },
    {
      def: 'color_camion',
      title: 'Color',
      value: (element: CombinacionList) => element.color_camion,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: CombinacionList) => element.propietario_nombre,
    },
    {
      def: 'neto',
      title: 'Neto',
      value: (element: CombinacionList) => numberWithCommas(element.neto),
    },
  ];

  @Input() isRemote = false;
  @Input() combinacionEvents?: Observable<CombinacionList>;
  @Input() combinacion?: CombinacionList;
  @Input() controlName = 'combinacion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'TRACTOS';
  @Input() isEdit: boolean = false;
  @Input() isShow: boolean = true;

  @Output() valueChange = new EventEmitter<CombinacionList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<CombinacionList>;

  fetchFunction = () => this.service.getListByOc();

  constructor(private service: CombinacionService) { }

  ngAfterViewInit(): void {
    //this.getList();
    null;
  }

  onCamionChange(combinacion?: CombinacionList): void {
    if (combinacion) {
      const fechaVencimientoTransporteChofer = combinacion.camion?.vencimiento_habilitacion_transporte;
      const fechaVencimientoTransporteSemi = combinacion.semi?.vencimiento_habilitacion_transporte;

      const hoy = new Date();
      const vencimientoTransporteChofer = fechaVencimientoTransporteChofer ? new Date(fechaVencimientoTransporteChofer) : null;
      const vencimientoTransporteSemi = fechaVencimientoTransporteSemi ? new Date(fechaVencimientoTransporteSemi) : null;

      // Verificar si la habilitación de transporte del camión está vencida
      if (vencimientoTransporteChofer && vencimientoTransporteChofer < hoy) {
        alert(`La habilitación de transporte del camión con placa ${combinacion.camion_placa} está vencida (Venció el ${vencimientoTransporteChofer.toLocaleDateString()}).`);
        this.form.reset();
        this.form.get('camion_id')?.setValue(null);
        return;
      }

      // Verificar si la habilitación de transporte del semi está vencida
      if (vencimientoTransporteSemi && vencimientoTransporteSemi < hoy) {
        alert(`La habilitación de transporte del semi con placa ${combinacion.semi_placa} está vencida (Venció el ${vencimientoTransporteSemi.toLocaleDateString()}).`);
        this.form.reset();
        this.form.get('camion_id')?.setValue(null);
        return;
      }
      this.valueChange.emit(combinacion);
    }
  }

  filterSearchCallbackFn = (chapa:string) => {
      if (chapa && chapa.length>=2) return this.service.getListByOcChapa(chapa)
      else return of([]);
    }

  filterOptionLabelfn = (item:CombinacionList) => (
    `Chapa:${item.camion_placa} | Chofer:${item.chofer_nombre}`);

  //private getList(): void {
  //  this.list$ = this.service.getList();
  //}

}
