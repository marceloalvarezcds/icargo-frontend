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
import { Instrumento, InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { subtract } from 'src/app/utils/math';
import { SaldoComponent } from '../saldo/saldo.component';
import { editLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LiquidacionConfirmadaFormFacturasComponent } from '../liquidacion-confirmada-form-facturas/liquidacion-confirmada-form-facturas.component';

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
  @Output() actualizarEstado: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('saldoView')
  childSaldoView!:SaldoComponent;

  @ViewChild('facturaList')
  liquidacionFacturasComponent?: LiquidacionConfirmadaFormFacturasComponent;

  instrumentoInMemoryList: InstrumentoLiquidacionItem[] = [];
  saldo = 0;
  liquidacionTipoEfectivo = false;
  liquidacionTipoInsumo = false;

  get monto(): number {
    return this.item?.pago_cobro ?? subtract((this.item?.credito ?? 0), (this.item?.debito ?? 0));
  }

  get montoSaldo(): number {
    return (this.childSaldoView?.monto ?? 0);
  }

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get esFinalizado(): boolean {
    return (this.item?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO ||
      this.item?.estado === LiquidacionEstadoEnum.SALDO_CERRADO  ||
      this.item?.estado === LiquidacionEstadoEnum.FINALIZADO);
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
  }

  get residuo(): number {
    return this.item?.saldo_residual ?? 0;
  }

  get valorInstrumentos(): number {
    return this.item?.instrumentos_saldo ?? 0;
  }

  get tipoLiquidacion(): string {
    if (this.liquidacionTipoInsumo) return "INSUMOS"
    if (this.liquidacionTipoEfectivo) return "EFECTIVO"

    return "";
  }

  get tipoContrapartePDV():boolean{
    return (this.estadoCuenta ? this.estadoCuenta.tipo_contraparte_descripcion.includes("PDV") : false);
  }

  constructor(
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private snackbar: SnackbarService,
  ) {
    this.obtenetTipoLiquidacion();
  }

  actualizarFactura():void{
    this.liquidacionFacturasComponent?.loadList();
  }

  obtenetTipoLiquidacion():void{
    this.liquidacionTipoInsumo=false;
    this.liquidacionTipoEfectivo=false;

    let anticipoTipoInsumo = this.movimientos.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
      && mov.anticipo?.tipo_anticipo_descripcion === 'INSUMOS') );

    let anticipoTipoEfectivo = this.movimientos.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
        && mov.anticipo?.tipo_anticipo_descripcion === 'EFECTIVO') );

    if (anticipoTipoInsumo) {
    this.liquidacionTipoInsumo=true;
    this.liquidacionTipoEfectivo=false;
    }

    if (anticipoTipoEfectivo) {
    this.liquidacionTipoInsumo=false;
    this.liquidacionTipoEfectivo=true;
    }

  }

  actualizarMovimientosEvento(movimientos:any){
    //this.movimientos = movimientos;
    this.obtenetTipoLiquidacion();
    this.actualizarMovimientos.emit(movimientos);
  }

  modificarLiquidacion():void {

    this.item!.monto = this.childSaldoView.monto;

    this.liquidacionService
        .edit(this.item!.id, editLiquidacionData(this.item!))
        .subscribe((resp) => {
          this.snackbar.open('Datos guardados satisfactoriamente');

          this.actualizarLiquidacion.emit(resp);

          /*if (confirmed) {
            this.router.navigate([backUrl]);
          } else {
            if (isDialog){
              this.createdLiquidacion.emit(resp);
            } else {
              this.getData();
            }
          }*/

          this.movimientos.splice(0, this.movimientos.length);
        });

  }


}
