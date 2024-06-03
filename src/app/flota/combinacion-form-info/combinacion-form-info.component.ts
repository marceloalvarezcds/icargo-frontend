import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Chofer, ChoferList } from 'src/app/interfaces/chofer';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { Propietario, PropietarioList } from 'src/app/interfaces/propietario';
import { Remitente } from 'src/app/interfaces/remitente';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';

@Component({
  selector: 'app-combinacion-form-info',
  templateUrl: './combinacion-form-info.component.html',
  styleUrls: ['./combinacion-form-info.component.scss']
})
export class CombinacionFormInfoComponent implements AfterViewInit, OnInit {
  [x: string]: any;
  groupName = 'info';
 
  semi?: SemiList;
  fotoFile: File | null = null;
  isFisicaSelected = false;
  loading = true;
  personaId?: number;
  tipoPersona?: TipoPersona
  docBeneficiario?: PropietarioList
  isDisabled = true;
  ngOnInit(){
    this.loading = false;
    this.form = this.fb.group({
      camion_id: [''],
      marca: [''],
      color: [''],
      propietario: [''],
      oc_activa: [''],
      limite_anticipos: [''],
      estado_camion: [''],
      foto_camion: [''],
      tipo_persona_id: ['1', Validators.required],
      nombre: [''] 
    });
  
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
    this.info?.controls["foto_chofer"].setValue(chofer?.foto_registro_reverso)
    this.fotoPerfilChofer = chofer?.foto_registro_reverso ?? null
    }
  }

  tipoPersonaChange(propietario?: PropietarioList): void {
    this.info?.controls["propietario_id"].setValue(propietario?.id);
    this.info?.controls["nombre"].setValue(propietario?.nombre);
    this.info?.controls["tipo_persona_id"].setValue(propietario?.tipo_persona_id);
    this.info?.controls["telefono"].setValue(propietario?.telefono);
    this.info?.controls["anticipo_propietario"].setValue(propietario?.puede_recibir_anticipos);
    this.info?.controls["estado_propietario"].setValue(propietario?.estado);
    this.info?.controls["foto_documento_frente"].setValue(propietario?.foto_perfil);
    this.fotoDocumentoFrente = propietario?.foto_perfil ?? null;
  
  }
  
  onTipoPersonaChange(tipoPersona: TipoPersona | undefined): void {
    if(tipoPersona){
      this.tipoPersona = tipoPersona;
      this.personaChange.emit(tipoPersona);
    } 
  }

  handleFisicaSelected(isFisica: boolean) {
    this.isFisicaSelected = isFisica;
  }
  
}