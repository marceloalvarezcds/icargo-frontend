import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as saveAs from 'file-saver';
import { subtract } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { DialogFormFieldControlComponent } from 'src/app/form-field/dialog-form-field-control/dialog-form-field-control.component';
import { FleteByGestorDialogFieldComponent } from 'src/app/form-field/flete-by-gestor-dialog-field/flete-by-gestor-dialog-field.component';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Combinacion, CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { CamionService } from 'src/app/services/camion.service';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { FleteService } from 'src/app/services/flete.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss'],
})
export class OrdenCargaCreateFormCombinacionComponent {
  flete?: FleteList;
  combinacion?: CombinacionList;
  groupName = 'combinacion';
  groupNameInfo = 'info'
  camionId?: number;
  combinacionId?: number;
  semiAsociado?: number;
  semi?: SemiList;
  showPedidoSection: boolean = false;
  isEditMode: boolean = true;
  pdfSrc: string | undefined;
  
  @Input() submodule: string | undefined;
  @Input() activeSection: boolean = true ;

  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() showSearchPedido: boolean | undefined;
  @Input() showSearchOC: boolean = false;
  @Input() disabled: boolean = false;


  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() camionChange = new EventEmitter<Camion>();
  @Output() semiChange = new EventEmitter<Semi>();
  @Output() combinacionChange = new EventEmitter<CombinacionList>();
  @Output() ordenCargaChange = new EventEmitter<OrdenCargaList | undefined>();

  get diferenciaOrigenDestino(): number {
    return subtract(
      this.oc?.cantidad_origen ?? 0,
      this.oc?.cantidad_destino ?? 0
    );
  }

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

  get estadoChofer(): FormControl {
    return  this.form?.get(this.groupName)?.get('puede_recibir_anticipos') as FormControl 
  }

  isFormValid(): boolean {
    return  this.form?.get(this.groupName)?.get('semi_placa')?.value 
  }

  previewPDF(): void {
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        const url = URL.createObjectURL(file);
        window.open(url); 
        this.pdfSrc = url;
      });
    });
  }

  onFleteChange(flete: FleteList): void {
    this.flete = flete;
    this.fleteChange.emit(flete);
    this.fleteService.getList().subscribe(
      (fletes: FleteList[]) => {
          this.form?.get(this.groupName)?.get('numero_lote')?.setValue(flete.numero_lote); 
          this.form?.get(this.groupName)?.get('pedido_id')?.setValue(flete.id); 
          this.form?.get(this.groupName)?.get('saldo')?.setValue(flete.condicion_cantidad); 
          this.form?.get(this.groupName)?.get('cliente')?.setValue(flete.remitente_nombre);
          this.form?.get(this.groupName)?.get('producto_descripcion')?.setValue(flete.producto_descripcion); 
          this.form?.get(this.groupName)?.get('origen_nombre')?.setValue(flete.origen_nombre); 
          this.form?.get(this.groupName)?.get('destino_nombre')?.setValue(flete.destino_nombre); 
          this.form?.get(this.groupName)?.get('tipo_flete')?.setValue(flete.tipo_flete); 
          this.form?.get(this.groupName)?.get('a_pagar')?.setValue(flete.condicion_gestor_carga_tarifa); 
          this.form?.get(this.groupName)?.get('valor')?.setValue(flete.merma_gestor_carga_valor); 
          this.form?.get(this.groupName)?.get('cant_origen')?.setValue(0);
          this.form?.get(this.groupName)?.get('cant_destino')?.setValue(0);
          this.form?.get(this.groupName)?.get('diferencia')?.setValue(0);
      },
    );
  }

  constructor(private service: SemiService, private camionService: CamionService, private fleteService: FleteService, private cdr: ChangeDetectorRef, private ordenCargaService: OrdenCargaService, private reportsService: ReportsService,) {}
  
  onSemiChange(semi: Semi | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
    
  }

  onCamionChange(combinacion?: CombinacionList) {
      this.form?.get(this.groupName)?.get('camion_id')?.setValue(combinacion?.camion_id); 
      this.form?.get(this.groupName)?.get('marca_camion')?.setValue(combinacion?.marca_descripcion); 
      this.form?.get(this.groupName)?.get('color_camion')?.setValue(combinacion?.color_camion ?? null); 
      this.form?.get(this.groupName)?.get('semi_id')?.setValue(combinacion?.semi_id);
      this.form?.get(this.groupName)?.get('semi_placa')?.setValue(combinacion?.semi_placa);
      this.form?.get(this.groupName)?.get('marca_semi')?.setValue(combinacion?.marca_descripcion_semi ?? null); 
      this.form?.get(this.groupName)?.get('color_semi')?.setValue(combinacion?.color_semi ?? null); 
      this.form?.get(this.groupName)?.get('propietario_camion')?.setValue(combinacion?.camion_propietario_nombre);
      this.form?.get(this.groupName)?.get('propietario_camion_doc')?.setValue(combinacion?.propietario_ruc);
      this.form?.get(this.groupName)?.get('beneficiario_camion')?.setValue(combinacion?.propietario_nombre);
      this.form?.get(this.groupName)?.get('beneficiario_camion_doc')?.setValue(combinacion?.camion_propietario_documento);
      this.form?.get(this.groupName)?.get('chofer_camion')?.setValue(combinacion?.chofer_nombre);
      this.form?.get(this.groupName)?.get('chofer_camion_doc')?.setValue(combinacion?.chofer_numero_documento);
      this.form?.get(this.groupName)?.get('neto')?.setValue(combinacion?.neto);
      this.form?.get(this.groupName)?.get('anticipo_propietario')?.setValue(combinacion?.anticipo_propietario);
      this.form?.get(this.groupName)?.get('puede_recibir_anticipos')?.setValue(combinacion?.puede_recibir_anticipos);
      if (combinacion){
        this.combinacionId = combinacion.id;
        this.combinacionChange.emit(combinacion);
        this.camionService.getById(combinacion.camion_id).subscribe(camion => {
          this.camionChange.emit(camion)
         
        })
        this.service.getById(combinacion.semi_id).subscribe(semi => {
          this.onSemiChange(semi)
        })
      }
    }

  onOrdenCargaChange(oc?: OrdenCargaList){
    if (oc){
      this.ordenCargaChange.emit(oc);
      this.form?.get(this.groupName)?.get('flete_id')?.setValue(oc.flete_id); 
      this.form?.get(this.groupName)?.get('numero_lote')?.setValue(oc.flete_numero_lote); 
      this.form?.get(this.groupName)?.get('saldo')?.setValue(oc.flete_saldo); //
      this.form?.get(this.groupName)?.get('cliente')?.setValue(oc.flete_remitente_nombre);
      this.form?.get(this.groupName)?.get('producto_descripcion')?.setValue(oc.flete_producto_descripcion);
      this.form?.get(this.groupName)?.get('origen_nombre')?.setValue(oc?.flete_origen_nombre);
      this.form?.get(this.groupName)?.get('destino_nombre')?.setValue(oc?.flete_destino_nombre); 
      this.form?.get(this.groupName)?.get('tipo_flete')?.setValue(oc.flete_tipo); 
      this.form?.get(this.groupName)?.get('a_pagar')?.setValue(oc.condicion_gestor_cuenta_tarifa); 
      this.form?.get(this.groupName)?.get('valor')?.setValue(oc.resultado_flete_gestor_carga_merma_valor); 
      this.form?.get(this.groupNameInfo)?.get('cantidad_nominada')?.setValue(oc.cantidad_nominada);
      this.form?.get(this.groupNameInfo)?.get('comentarios')?.setValue(oc.comentarios);
      this.form?.get(this.groupName)?.get('cant_origen')?.setValue(0);
      this.form?.get(this.groupName)?.get('cant_destino')?.setValue(0);
      this.form?.get(this.groupName)?.get('diferencia')?.setValue(0);
    }
  }

  downloadPDF(): void {
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
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