import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { subtract } from 'src/app/utils/math';
import { SaldoComponent } from '../saldo/saldo.component';

@Component({
  selector: 'app-liquidacion-edit-fields',
  templateUrl: './liquidacion-edit-fields.component.html',
  styleUrls: ['./liquidacion-edit-fields.component.scss']
})
export class LiquidacionEditFieldsComponent {

  E = LiquidacionEstadoEnum;

  @Input() etapa?: LiquidacionEtapaEnum;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() item?: Liquidacion;
  @Input() movimientos: Movimiento[] = [];
  @Input() isEdit = false;

  @Output() actualizarLiquidacion: EventEmitter<any> = new EventEmitter<any>();
  @Output() actualizarMovimientos: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('saldoView')
  childSaldoView!:SaldoComponent;

  saldo = 0;

  get monto(): number {
    return subtract((this.item?.credito ?? 0), (this.item?.debito ?? 0));
  }

  get montoSaldo(): number {
    return (this.childSaldoView?.monto ?? 0);
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get esFinalizado(): boolean {
    return this.item?.etapa === LiquidacionEtapaEnum.FINALIZADO;
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
  }

  constructor(
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
  ) { }


}
