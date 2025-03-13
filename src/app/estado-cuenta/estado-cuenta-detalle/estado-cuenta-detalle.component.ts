import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';

@Component({
  selector: 'app-estado-cuenta-detalle',
  templateUrl: './estado-cuenta-detalle.component.html',
  styleUrls: ['./estado-cuenta-detalle.component.scss'],
})
export class EstadoCuentaDetalleComponent {

  @Input() es_pdv?: boolean = false;
  @Input() etapa?: LiquidacionEtapaEnum;
  @Input() estadoLiqui?: LiquidacionEstadoEnum;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() showVistaConsolidada = true;
  @Input() showEstado = true;
  @Input() showEstadoLiqui = false;
  @Input() showSaldo = false;
  @Input() showLiquidacion = false;
  @Input() liquidacionId = 0;
  @Input() esEditableLinea=false;
  @Input() form!:FormGroup;

  @Input() esInsumoControl:FormControl|undefined=undefined;
  @Input() tipo_insumo:FormControl|undefined=undefined;

  @Output()
  filterEvent: EventEmitter<string> = new EventEmitter<string>();

  get esInsumoControlControl(): FormControl {
    return this.form?.controls['es_insumo_efectivo'] as FormControl;
  }

  get esInsumoControlvalue(): FormControl {
    return this.form?.controls['es_insumo_efectivo'].value;
  }

  filtrarMovimientosPDV():void{

    const listar_efectivo_insumo = this.esInsumoControl?.value ? "EFECTIVO" : "INSUMO";
    this.filterEvent.emit(listar_efectivo_insumo);

  }

}

