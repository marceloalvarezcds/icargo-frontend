import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstrumentoViaEnum } from 'src/app/enums/instrumento-via';
import { Banco } from 'src/app/interfaces/banco';
import { Caja } from 'src/app/interfaces/caja';
import { InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { InstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { InstrumentoVia } from 'src/app/interfaces/instrumento-via';
import { TipoInstrumento } from 'src/app/interfaces/tipo-instrumento';
import { subtract } from 'src/app/utils/math';
import { Subject } from 'rxjs';

import { numberWithCommas } from 'src/app/utils/thousands-separator';
import { Moneda } from 'src/app/interfaces/moneda';
import { MonedaService } from 'src/app/services/moneda.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { CajaService } from 'src/app/services/caja.service';
import { BancoService } from 'src/app/services/banco.service';

@Component({
  selector: 'app-instrumento-form-dialog',
  templateUrl: './instrumento-form-dialog.component.html',
  styleUrls: ['./instrumento-form-dialog.component.scss'],
})
export class InstrumentoFormDialogComponent implements OnDestroy, OnInit, AfterViewInit {

  banco?: Banco;
  caja?: Caja;
  via?: InstrumentoVia;
  tipoInstrumento?: TipoInstrumento;
  moneda?:Moneda;
  monedaLocal?:Moneda;
  totalMonedas:any;
  cotizacion_ml=0;

  bancoEventsSubject: Subject<Banco> = new Subject<Banco>();
  cajaEventsSubject: Subject<Caja> = new Subject<Caja>();

  form = this.fb.group({
    via_id: [this.data?.via_id, Validators.required],
    caja_id: this.data?.caja_id,
    banco_id: this.data?.banco_id,
    monto: [
      this.data?.monto ? this.data.monto : 0,
      [Validators.required, Validators.max(this.dialogData.residuo ?? 0)],
    ],
    monto_ml: [null],
    tipo_cambio_moneda: [{value:1, disabled:true}],
    fecha_instrumento: [
      this.data?.fecha_instrumento ?? new Date().toJSON(),
      Validators.required,
    ],
    numero_referencia: this.data?.numero_referencia,
    comentario: this.data?.comentario,
    numero_documento: this.data?.numero_documento,
    moneda_id: [{value:this.data?.moneda_id, disabled:true}, [Validators.required] ],
    // Datos mostrados solo para Banco
    tipo_instrumento_id: [{value: this.data?.tipo_instrumento_id, disabled: true}],
    // Solo para cheque
    cheque_es_diferido: this.data?.cheque_es_diferido ?? false,
    cheque_fecha_vencimiento: this.data?.cheque_fecha_vencimiento,
  });

  chequeEsDiferidoSubscription =
    this.chequeEsDiferidoControl.valueChanges.subscribe((val) => {
      if (val) {
        this.form.controls['cheque_fecha_vencimiento'].setValidators(
          Validators.required
        );
      } else {
        this.form.controls['cheque_fecha_vencimiento'].removeValidators(
          Validators.required
        );
      }
      this.form.controls['cheque_fecha_vencimiento'].updateValueAndValidity();
    });

  viaSubscription = this.viaControl.valueChanges.subscribe(() => {
    console.log("viaControl.valueChanges");
    setTimeout(() => {
      if (this.esBanco) {
        this.form.controls['numero_referencia'].setValidators(
          Validators.required
        );
        this.form.controls['banco_id'].setValidators(Validators.required);
        this.form.controls['caja_id'].removeValidators(Validators.required);
        this.form.controls['caja_id'].setValue(null);
        this.form.controls['tipo_instrumento_id'].enable();
        this.form.controls['tipo_instrumento_id'].setValidators(Validators.required);
        this.form.controls['banco_id'].setValue(this.data?.banco_id);
      } else {
        this.form.controls['tipo_instrumento_id'].disable();
        this.form.controls['tipo_instrumento_id'].removeValidators(Validators.required);
        this.form.controls['tipo_instrumento_id'].setValue(null);
        this.form.controls['numero_referencia'].removeValidators(
          Validators.required
        );
        this.form.controls['banco_id'].removeValidators(Validators.required);
        this.form.controls['banco_id'].setValue(null);
        this.form.controls['caja_id'].setValidators(Validators.required);
        this.form.controls['caja_id'].setValue(this.data?.caja_id);
      }
      this.form.controls['numero_referencia'].updateValueAndValidity();
      this.form.controls['banco_id'].updateValueAndValidity();
      this.form.controls['caja_id'].updateValueAndValidity();
      this.form.controls['tipo_instrumento_id'].updateValueAndValidity();
    }, 500);
  });

  get data(): InstrumentoLiquidacionItem | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    return this.data ? this.dialogData.isShow ? 'Ver' : 'Editar' : 'Crear';
  }

  get anticipadoControl(): FormControl {
    return this.form.get('anticipado') as FormControl;
  }

  get anticipado(): boolean {
    return this.anticipadoControl.value;
  }

  get chequeEsDiferidoControl(): FormControl {
    return this.form.get('cheque_es_diferido') as FormControl;
  }

  get chequeEsDiferido(): boolean {
    return this.chequeEsDiferidoControl.value;
  }

  get esBanco(): boolean {
    return this.via?.descripcion === InstrumentoViaEnum.BANCO;
  }

  get esCobro(): boolean {
    return this.dialogData.es_cobro;
  }

  get monto(): number {
    return parseInt(this.montoControl.value, 10);
  }

  get montoControl(): FormControl {
    return this.form.get('monto') as FormControl;
  }

  get montoHint(): string {
    if (this.dialogData.isShow) return "";
    if (this.monto) {
      return `Residuo: <strong>${ numberWithCommas(subtract(
        this.residuo,
        this.monto
      ))}</strong>`;
    }
    return `Residuo: <strong>${ numberWithCommas(this.residuo)}</strong>`;
  }

  get residuo(): number {
    //console.log("residuo");
    //let saldo = this.totalMonedas.reduce((acc:number, cur:any) => acc + cur.total_ml, 0);
    return this.dialogData.residuo ?? 0;;
  }

  get totalLiquidacion(): number {
    return this.dialogData.totalLiquidacion;
  }

  get sentido():string {
    return this.residuo > 0 ?  "A Pagar" : "A Cobrar";
  }

  get esTipoCheque(): boolean {
    return this.tipoInstrumento?.descripcion === 'Cheque';
  }

  get viaControl(): FormControl {
    return this.form.get('via_id') as FormControl;
  }

  get isShow(): boolean {
    return this.dialogData.isShow!;
  }

  constructor(
    private monedaService: MonedaService,
    private cotizacionService: MonedaCotizacionService,
    private cajaService: CajaService,
    private bancoService: BancoService,
    public dialogRef: MatDialogRef<InstrumentoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: InstrumentoFormDialogData
  ) {

    if (this.dialogData.isShow){
      this.form.disable();
    }

    this.totalMonedas = this.dialogData.totalMonedas;

    console.log(this.dialogData);
    console.log(this.data);

  }

  ngOnInit(){
    if (this.data){
      if (this.data.caja_id)
        this.cajaService.getById(this.data.caja_id).subscribe( c=> {
          this.cajaEventsSubject.next(c);
        });
      if (this.data.banco_id)
        this.bancoService.getById(this.data.banco_id).subscribe( c=> {
          this.bancoEventsSubject.next(c);
        });
    }
  }

  ngAfterViewInit(): void {
    this.monedaService.getMonedaByGestorId(1).subscribe( (resp:Moneda) => {
      this.monedaLocal = resp;
    });
  }

  onbancoSelect(banco:Banco):void {
    console.log("onbancoSelect: ", banco)
    this.banco = banco;
    const totalMonena = this.totalMonedas.find( (total:any) => total.moneda.id === banco.moneda_id);
    this.form.controls['moneda_id'].setValue(banco.moneda_id);

    /*if (totalMonena) {
      this.montoControl.setValidators([]);
      this.montoControl.updateValueAndValidity();
      this.montoControl.setValidators([Validators.required, Validators.min(1), Validators.max(totalMonena.residuo ?? totalMonena.total)]);
      this.montoControl.setValue(totalMonena.residuo ?? totalMonena.total);
      this.montoControl.updateValueAndValidity();
    } else{
      this.montoControl.setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
      this.montoControl.setValue(0);
      this.montoControl.updateValueAndValidity();
    }*/
  }

  onCajaSelect(caja:Caja):void {
    console.log("onCajaSelect: ", caja)
    this.caja = caja;
    const totalMonena = this.totalMonedas.find( (total:any) => total.moneda.id === caja.moneda_id);
    this.form.controls['moneda_id'].setValue(caja.moneda_id);

    /*if (totalMonena) {
      this.montoControl.setValidators([]);
      this.montoControl.updateValueAndValidity();
      this.montoControl.setValidators([Validators.required, Validators.min(1), Validators.max(totalMonena.residuo ?? totalMonena.total)]);
      this.montoControl.setValue(totalMonena.residuo ?? totalMonena.total);
      this.montoControl.updateValueAndValidity();
    } else {
      this.montoControl.setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
      this.montoControl.setValue(0);
      this.montoControl.updateValueAndValidity();
    }*/

  }

  refreshTotal(total: number):void{
    this.montoControl.setValidators([]);
    this.montoControl.updateValueAndValidity();
    this.montoControl.setValidators([Validators.required, Validators.min(1), Validators.max(total)]);
    //this.montoControl.setValue(total);
    this.montoControl.updateValueAndValidity();
  }

  onMonedaSelect(mon:Moneda){

    if (!mon.id) return;

    if (!this.monedaLocal) return;

    this.moneda = mon;

    console.log("mon: ", mon);
    console.log("monedaLocal: ", this.monedaLocal);

    // aca trae inveso, para obtener el valor se debe dividir
    this.cotizacionService.get_cotizacion_by_moneda(mon.id, this.monedaLocal!.id)
      .subscribe(res=>{
        if (res){
          this.form.controls['tipo_cambio_moneda'].enable();
          this.form.controls['tipo_cambio_moneda'].setValidators([Validators.required]);
          this.form.controls['tipo_cambio_moneda'].setValue(res.cotizacion_moneda);
          this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();

          this.dialogData.residuo = Number((this.residuo / res.cotizacion_moneda).toFixed(2));;
          const totalDeudaPendiente = this.residuo;

          this.refreshTotal(Math.abs(totalDeudaPendiente));

        }
    });

    /*this.totalMonedas.forEach( (ele:any, idx:number, array:[]) => {
      this.cotizacionService.get_cotizacion_by_moneda(ele.moneda.id, mon.id)
        .subscribe(res=>{
          if (res){
            ele.cotizacion = res.cotizacion_moneda;
            ele.total_ml = ele.total * ele.cotizacion;
            deudaTotal = deudaTotal + ele.total_ml;
          }
          if (idx === array.length - 1 || idx === 1){
            this.refreshTotal(Math.abs(deudaTotal));
          }
      });
    });

      /*this.cotizacionService.get_cotizacion_by_moneda(this.monedaLocal!.id, mon.id)
        .subscribe(res=>{
          if (res){
            this.form.controls['tipo_cambio_moneda'].enable();
            this.form.controls['tipo_cambio_moneda'].setValidators([Validators.required]);
            this.form.controls['tipo_cambio_moneda'].setValue(res.cotizacion_moneda);
            this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
          }
      });
    /*} else {
      this.form.controls['tipo_cambio_moneda'].disable();
      this.form.controls['tipo_cambio_moneda'].setValidators([]);
      this.form.controls['tipo_cambio_moneda'].setValue(1);
      this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
    }*/
  }

  ngOnDestroy(): void {
    this.chequeEsDiferidoSubscription.unsubscribe();
    this.viaSubscription.unsubscribe();
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const cuentaDescripcion = `${
        this.esBanco
          ? this.banco?.nombre +
            ' (' +
            this.banco?.titular +
            ' - ' +
            this.banco?.numero_cuenta +
            ')'
          : this.caja?.nombre
      }`;
      const data: InstrumentoLiquidacionItem = {
        ...this.form.getRawValue(),
        via_descripcion: this.via?.descripcion ?? '',
        cuenta_descripcion: cuentaDescripcion,
        tipo_instrumento_descripcion: this.tipoInstrumento?.descripcion ?? 'Efectivo',
      };
      // falta cambio inverso, de monto moneda instrumento a ML
      data.monto_ml = data.monto * data.tipo_cambio_moneda;
      this.dialogRef.close(data);
    }
  }

  setTipoInstrumento(tipo: TipoInstrumento): void {
    this.tipoInstrumento = tipo;
    if (tipo && tipo.descripcion !== 'Cheque') {
      this.chequeEsDiferidoControl.setValue(false);
    }
  }
}
