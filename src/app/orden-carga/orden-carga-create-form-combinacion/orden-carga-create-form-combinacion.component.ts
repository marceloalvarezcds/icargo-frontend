import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { subtract } from 'lodash';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { DialogFormFieldControlComponent } from 'src/app/form-field/dialog-form-field-control/dialog-form-field-control.component';
import { FleteByGestorDialogFieldComponent } from 'src/app/form-field/flete-by-gestor-dialog-field/flete-by-gestor-dialog-field.component';
import { CamionList } from 'src/app/interfaces/camion';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { SemiList } from 'src/app/interfaces/semi';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { FleteService } from 'src/app/services/flete.service';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss'],
})
export class OrdenCargaCreateFormCombinacionComponent {
  flete?: FleteList;
  groupName = 'combinacion';
  gouprNameInfo = 'info'
  camionId?: number;
  semiAsociado?: number;
  semi?: SemiList;
  camionesDisponibles: CamionList[] = [];
  showPedidoSection: boolean = false;


  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  get diferenciaOrigenDestino(): number {
    return subtract(
      this.oc?.cantidad_origen ?? 0,
      this.oc?.cantidad_destino ?? 0
    );
  }
  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() camionChange = new EventEmitter<CombinacionList>();
  @Output() semiChange = new EventEmitter<SemiList>();

  get info(): FormGroup | undefined{
    return this.form?.get('info') as FormGroup ?? null;
  }

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup ?? null;
  }

  get productoId(): number | undefined {
    return this.flete ? this.flete.producto_id : undefined;
  }

  get isActive() {
    return this.info?.controls['anticipo_propietario'].value;
  }

  isFormValid(): boolean {
    return  this.form?.get(this.groupName)?.get('semi_placa')?.value 
  }


  onFleteChange(flete: FleteList): void {
    this.flete = flete;
    this.fleteChange.emit(flete);
    this.fleteService.getList().subscribe(
      (fletes: FleteList[]) => {
        if (fletes && fletes.length > 0) {
          const flete = fletes[0]; 
          this.form?.get(this.groupName)?.get('numero_lote')?.setValue(flete.numero_lote); 
          this.form?.get(this.groupName)?.get('pedido_id')?.setValue(flete.id); 
          this.form?.get(this.groupName)?.get('saldo')?.setValue(flete.condicion_cantidad); 
          this.form?.get(this.groupName)?.get('cliente')?.setValue(flete.remitente_nombre);
          this.form?.get(this.groupName)?.get('producto_descripcion')?.setValue(flete.producto_descripcion); 
          this.form?.get(this.groupName)?.get('origen_nombre')?.setValue(flete.origen_nombre); 
          this.form?.get(this.groupName)?.get('destino_nombre')?.setValue(flete.destino_nombre); 
          this.form?.get(this.groupName)?.get('tipo_flete')?.setValue(flete.tipo_flete); 
          this.form?.get(this.groupName)?.get('a_pagar')?.setValue(flete.merma_gestor_carga_unidad_descripcion); 
          this.form?.get(this.groupName)?.get('valor')?.setValue(flete.condicion_cantidad); 
          this.form?.get(this.groupName)?.get('cant_origen')?.setValue(0);
          this.form?.get(this.groupName)?.get('cant_destino')?.setValue(0);
          this.form?.get(this.groupName)?.get('diferencia')?.setValue(0);
        }
      },
    );
  }

  constructor(private service: SemiService, private camionService: CombinacionService, private fleteService: FleteService, private cdr: ChangeDetectorRef) {}
  
  onSemiChange(semi: SemiList | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
    
  }

  onCamionChange(combinacion?: CombinacionList) {
      this.form?.get(this.groupName)?.get('marca_camion')?.setValue(combinacion?.marca_descripcion); 
      this.form?.get(this.groupName)?.get('color_camion')?.setValue(combinacion?.color_camion ?? null); 
      this.form?.get(this.groupName)?.get('semi_placa')?.setValue(combinacion?.semi_placa);
      this.form?.get(this.groupName)?.get('marca_semi')?.setValue(combinacion?.marca_descripcion_semi ?? null); 
      this.form?.get(this.groupName)?.get('color_semi')?.setValue(combinacion?.color_semi ?? null); 
      this.form?.get(this.groupName)?.get('propietario_camion')?.setValue(combinacion?.propietario_nombre);
      this.form?.get(this.groupName)?.get('propietario_camion_doc')?.setValue(combinacion?.propietario_ruc);
      this.form?.get(this.groupName)?.get('chofer_camion')?.setValue(combinacion?.chofer_nombre);
      this.form?.get(this.groupName)?.get('chofer_camion_doc')?.setValue(combinacion?.chofer_numero_documento);
      this.form?.get(this.groupName)?.get('neto')?.setValue(combinacion?.neto);
      this.form?.get(this.groupName)?.get('anticipo_propietario')?.setValue(combinacion?.anticipo_propietario);
      this.form?.get(this.groupName)?.get('anticipo_chofer')?.setValue(combinacion?.puede_recibir_anticipos);
    }

  @Input() title = 'Chapa Tracto';
  @Input() control!: FormControl;
  @Input() isShow = false;
  @Input() trueTitle = 'Si';
  @Input() falseTitle = 'No';
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<boolean>();

  get controlValue(): boolean {
    return !!this.control.value;
  }
}