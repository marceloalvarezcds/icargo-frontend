import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Chofer, ChoferList } from 'src/app/interfaces/chofer';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { Propietario, PropietarioList } from 'src/app/interfaces/propietario';
import { SemiList } from 'src/app/interfaces/semi';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { CamionService } from 'src/app/services/camion.service';
import { CombinacionService } from 'src/app/services/combinacion.service';

@Component({
  selector: 'app-combinacion-form-info',
  templateUrl: './combinacion-form-info.component.html',
  styleUrls: ['./combinacion-form-info.component.scss']
})
export class CombinacionFormInfoComponent implements AfterViewInit, OnInit {

  [x: string]: any;
  groupName = 'info';
  //semi?: SemiList;
  fotoFile: File | null = null;
  isFisicaSelected = false;
  loading = true;
  isShearch = false;
  personaId?: number;
  tipoPersona?: TipoPersona
  docBeneficiario?: PropietarioList
  isDisabled = true;

  ngOnInit(){
    this.loading = false;
    this.tipoPersonaOriginal = this.item?.propietario?.id;
   
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 0);
  }

  // controlName = 'ruc';
  fotoPerfil: string | null = null;
  fotoPerfilSemi: string | null = null;
  fotoPerfilChofer: string | null = null;
  fotoBeneficiario: string | null = null;

  @Input() gestorCargaId?: number;
  @Input() propietarioId?: number;
  @Input() form?: FormGroup;
  @Input() propietario?: Propietario;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;
  @Input() combinacion?: Combinacion;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() modelo?: PermisoModeloEnum;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;
  @Input() fotoCamion: string | null = null;
  @Input() fotoSemi: string | null = null;
  @Input() fotoPerfilPropietario: string | null | undefined;
  @Input() camion?: Camion;
  @Input() propietarioTipoPersona?: Propietario;
  @Input() cantidadOCConAnticiposLiberados = 0;
  @Input() readonly = true;
  @Input() disabled: boolean = false;
  @Input() controlName!: string;

  @Output() personaChange = new EventEmitter<TipoPersona | undefined>();
  @Output() propietarioChange = new EventEmitter<Propietario | undefined>();
  @Output() estadoSemiChange = new EventEmitter<boolean>();
  @Output() estadoCamionChange = new EventEmitter<boolean>();
  @Output() estadoChoferChange = new EventEmitter<boolean>();
  @Output() esChoferChange = new EventEmitter<boolean>();
  @Output() fotoChange = new EventEmitter<File | null>();
  @Output() fotoCamionChange = new EventEmitter<File | null>();
  @Output() fotoSemiChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChoferChange = new EventEmitter<File | null>();
  @Output() anticiposBloqueadosChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<SemiList | undefined>();

  // TODO: hacer un refresh con el backend
  get tracto(): CamionList | undefined {
    if (this.combinacion) {
      let item = this.combinacion?.camion as CamionList;
      item.marca_descripcion = item.marca.descripcion;
      item.color_descripcion = item.color?.descripcion ?? '';
      item.propietario_nombre = item.propietario.nombre;
      return item;
    }
    else return undefined;
  }

  get semiList(): SemiList | undefined {
    if (this.combinacion) {
      let item = {...this.combinacion.semi } as unknown as SemiList;
      item.marca_descripcion = this.combinacion?.semi.marca.descripcion ?? '';
      item.color_descripcion = this.combinacion?.semi.color?.descripcion ?? '';
      return item;
    } else return undefined;
  }

  get choferList(): ChoferList {
    let item = this.combinacion?.chofer as ChoferList;
    return item;
  }

  get propietarioList(): PropietarioList {
    let item = this.combinacion?.propietario as PropietarioList;
    return item;
  }

  get personaList(): PropietarioList {
    let item = this.combinacion?.propietario as PropietarioList;
    return item;
  }

  get info(): FormGroup | undefined{
    return this.form?.get('info') as FormGroup;
  }

  get tipoPersonaId(): number | undefined {
    return this.persona ? this.persona.id : undefined;
  }

  get esChoferControl(): FormControl {
    return this.info?.controls['es_chofer'] as FormControl;
  }

  get puedeRecibirAnticiposControl(): FormControl {
    return this.info?.controls['puede_recibir_anticipos'] as FormControl;
  }

  get puedeRecibirAnticiposControlPropietario(): FormControl {
    return this.info?.controls['anticipo_propietario'] as FormControl;
  }

  get estadoControl(): FormControl {
    return this.info?.controls['estado'] as FormControl;
  }

  get estadoControlCamion(): FormControl {
    return this.info?.controls['estado_camion'] as FormControl;
  }

  get estadoControlSemi(): FormControl {
    return this.info?.controls['estado_semi'] as FormControl;
  }

  get estadoControlPropietario(): FormControl {
    return this.info?.controls['estado_propietario'] as FormControl;
  }

  handleEstadoChange(): void {
    const estadoActual = this.estadoControl.value;
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    this.estadoControl.setValue(nuevoEstado);
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  camionChange(camion?: CamionList) {
    if (camion && camion.id !== this.currentCamionId) {
      this.currentCamionId = camion.id;
      this.info?.controls["camion_id"].setValue(camion.id);
      this.info?.controls["marca"].setValue(camion.marca_descripcion ?? null);
      this.info?.controls["color"].setValue(camion.color_descripcion ?? null);
      this.info?.controls["propietario"].setValue(camion.propietario_nombre);
      this.info?.controls["oc_activa"].setValue(camion.oc_activa);
      this.info?.controls["limite_anticipos"].setValue(camion.limite_monto_anticipo);
      this.info?.controls["estado_camion"].setValue(camion.estado);
      this.info?.controls["foto_camion"].setValue(camion.foto);
      this.fotoPerfil = camion.foto ?? null;
      this.info?.controls["ruc"].setValue(camion.propietario_ruc);
      this.info?.controls["nombre"].setValue(camion.propietario_nombre);
      this.info?.controls["estado_propietario"].setValue(camion.propietario_estado);
      this.info?.controls["anticipo_propietario"].setValue(camion.propietario_puede_recibir_anticipos);
      this.info?.controls["foto_documento_frente"].setValue(camion.propietario_foto);
      this.info?.controls["nombre"].setValue(camion.propietario_nombre);
      this.info?.controls["propietario_id"].setValue(camion.propietario_camion_id);
      const propietarioList = camion.propietario as PropietarioList;
  
      this.tipoPersonaChange(propietarioList);
  
    }
  }
  
  

  semiChange(semi?: SemiList){
     this.info?.controls["semi_id"].setValue(semi?.id)
     this.info?.controls["marca_semi"].setValue(semi?.marca_descripcion)
     this.info?.controls["color_semi"].setValue(semi?.color_descripcion)
     this.info?.controls["estado_semi"].setValue(semi?.estado)
     this.info?.controls["foto_semi"].setValue(semi?.foto)
     this.fotoPerfilSemi = semi?.foto ?? null
   }

  choferChange(chofer?: ChoferList){
    if (chofer && chofer.id !== this.currentChoferId) {
    this.currentChoferId = chofer.id;
    this.info?.controls["chofer_id"].setValue(chofer?.id)
    this.info?.controls["chofer_documento"].setValue(chofer?.numero_documento)
    this.info?.controls["chofer_nombre"].setValue(chofer?.nombre)
    this.info?.controls["chofer_celular"].setValue(chofer?.telefono_chofer)
    this.info?.controls["estado"].setValue(chofer?.estado)
    this.info?.controls["puede_recibir_anticipos"].setValue(chofer?.puede_recibir_anticipos)
    this.info?.controls["foto_chofer"].setValue(chofer?.foto_perfil)
    this.fotoPerfilChofer = chofer?.foto_perfil ?? null
    }
  }

  tipoPersonaChange(propietario?: PropietarioList): void {
    if (propietario && propietario.id !== this.info?.controls["propietario_id"].value ) {
      this.info?.controls["propietario_id"].setValue(propietario.id);
      this.info?.controls["nombre"].setValue(propietario.nombre);
      this.info?.controls["ruc"].setValue(propietario.ruc);
      this.info?.controls["tipo_persona_id"].setValue(propietario.tipo_persona_id);
      this.info?.controls["telefono"].setValue(propietario.telefono);
      this.info?.controls["anticipo_propietario"].setValue(propietario.puede_recibir_anticipos);
      this.info?.controls["estado_propietario"].setValue(propietario.estado);
      this.info?.controls["foto_documento_frente"].setValue(propietario.foto_perfil);
      this.fotoDocumentoFrente = propietario.foto_perfil ?? null;

      this.activateFields();
      if(this.isShow){
        this.info?.controls["tipo_persona_id"].disable();
        this.info?.controls["propietario_id"].disable();
      }
    }
  }

  private activateFields(): void {
    if (this.info?.controls['tipo_persona_id'].value) {
      this.info?.controls["ruc"].enable();
      this.info?.controls["nombre"].enable();
    } else {
      this.info?.controls["ruc"].disable();
      this.info?.controls["nombre"].disable();
    }
  }

  onTipoPersonaChange(tipoPersona: TipoPersona | undefined): void {
    this.isShearch = true;
    if (!tipoPersona || tipoPersona.id !== this.tipoPersonaAnterior?.id) {
      this.info?.controls["propietario_id"].setValue('');
    }
    if (tipoPersona) {
      this.tipoPersona = tipoPersona;
      this.personaChange.emit(tipoPersona);
    }
    this.tipoPersonaAnterior = tipoPersona;

    this.cdRef.detectChanges();
  }

  onChange(tipoPersona: Propietario | undefined): void {
    this.info?.controls["propietario_id"].setValue(tipoPersona?.id);
    this.cdRef.detectChanges();
  }

  handleFisicaSelected(isFisica: boolean) {
    this.isFisicaSelected = isFisica;
  }

}
