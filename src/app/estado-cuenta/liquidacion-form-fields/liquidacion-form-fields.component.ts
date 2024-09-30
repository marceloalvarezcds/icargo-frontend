import { Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { createLiquidacionData, createLiquidacionDataFields } from 'src/app/form-data/liquidacion-movimiento';
import { ContraparteInfoMovimiento, ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { DialogService } from 'src/app/services/dialog.service';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { SaldoComponent } from '../saldo/saldo.component';

@Component({
  selector: 'app-liquidacion-form-fields',
  templateUrl: './liquidacion-form-fields.component.html',
  styleUrls: ['./liquidacion-form-fields.component.scss']
})
export class LiquidacionFormFieldsComponent {

  private readonly monedaIdGs = 1;

  @Input()
  etapa?: LiquidacionEtapaEnum;

  @Input()
  estadoCuenta?: EstadoCuenta;

  @Input()
  list: Movimiento[] = [];

  @ViewChild('saldoView')
  childSaldoView!:SaldoComponent;

  @Output()
  createdLiquidacionEvt: EventEmitter<Liquidacion> = new EventEmitter<Liquidacion>();

  movimientosSelected: Movimiento[] = [];

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get monto(): number {
    return subtract(this.credito, this.debito);
  }

  get tipoContrapartePDV():boolean{
    return (this.estadoCuenta ? this.estadoCuenta.tipo_contraparte_descripcion.includes("PDV") : false);
  }

  constructor(
    private movimientoService: MovimientoService,
    private liquidacionService: LiquidacionService,
    private snackbar: SnackbarService,
  ) { }

  controlTipoMovimiento():boolean{

    if (this.tipoContrapartePDV){

      let movInsu = this.movimientosSelected.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
        && mov.anticipo?.tipo_anticipo_descripcion === 'INSUMOS') );

      let movAnti = this.movimientosSelected.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
          && mov.anticipo?.tipo_anticipo_descripcion === 'EFECTIVO') );

      if (movInsu && movAnti) {
        this.snackbar.open('No se puede agregar movimientos de tipos diferentes');
        return true;
      }

    }

    return false;
  }

  sendLiquidacion(confirmed: boolean): void {

    let es_pago_cobro = (this.childSaldoView.saldo) > 0 ? 'PAGO' : 'COBRO';
    let pago_cobro = es_pago_cobro === 'PAGO' ? Math.abs(this.childSaldoView.monto) : Math.abs(this.childSaldoView.monto)*-1 ;

    if (this.controlTipoMovimiento()){
      this.snackbar.open('No se puede agregar movimientos de tipos diferentes');
      return;
    }

    // TODO: seleccionar la moneda en el form, por ahora sino tiene movimientos sera en gs
    if (this.movimientosSelected.length === 0) {
      this.estadoCuenta!.moneda_id = this.monedaIdGs;
    } else {
      this.estadoCuenta!.moneda_id = this.movimientosSelected[0].moneda_id;
    }

    //if (this.movimientosSelected.length) {
      this.liquidacionService
        .create(createLiquidacionDataFields(this.movimientosSelected, this.estadoCuenta!, pago_cobro, es_pago_cobro))
        .subscribe((resp) => {
          this.snackbar.open('Datos guardados satisfactoriamente');

          this.createdLiquidacionEvt.emit(resp);

          /*if (confirmed) {
            this.router.navigate([backUrl]);
          } else {
            if (isDialog){
              this.createdLiquidacion.emit(resp);
            } else {
              this.getData();
            }
          }*/

          this.movimientosSelected.splice(0, this.movimientosSelected.length);
        });
    //} else {
    //  this.snackbar.open('Debe elegir al menos 1 movimiento');
    //}

  }

  getList(): void {
    const etapa = this.etapa! as LiquidacionEtapaEnum;
    this.movimientoService
      .getListByEstadoCuenta(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        etapa
      )
      .subscribe((data) => {
        this.list = data;
        this.movimientosSelected = [];
      });
  }

  cargarMovimientos(movimientos: Movimiento[]):void {
    // TODO: ver para evitar el check de tipos distintos
    this.controlTipoMovimiento();
    this.movimientosSelected = movimientos;
  }


}
