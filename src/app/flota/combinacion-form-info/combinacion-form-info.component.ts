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
  fotoFile: File | null = null;
  isFisicaSelected = false;
  loading = true;
  personaId?: number;
  tipoPersona?: TipoPersona

  docBeneficiario?: PropietarioList
  ngOnInit(){
    this.loading = false;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 0);
    
  }
  controlName = 'numero_documento'; 
  @Input() propietarioId?: number;
  // @Input() form = new FormGroup({
  //   info: new FormGroup({
  //     nombre: new FormControl(null),
  //     tipo_persona_id: new FormControl(null),
  //     ruc: new FormControl(null),
  //     digito_verificador: new FormControl(null),
  //     pais_origen_id: new FormControl(null),
  //     fecha_nacimiento: new FormControl(null),
  //     oficial_cuenta_id: new FormControl(null),
  //     alias: new FormControl(null),
  //     foto_documento_frente: new FormControl(null),
  //     foto_documento_reverso: new FormControl(null),
  //     foto_perfil: new FormControl(null),
  //     es_chofer: new FormControl(false),
  //     telefono: new FormControl(null),
  //     email: new FormControl(null),
  //     neto: new FormControl(null),
  //     puede_recibir_anticipos: new FormControl(null),
  //     anticipo_propietario: new FormControl(null),
  //     estado: new FormControl(null),
  //     estado_camion: new FormControl(null),
  //     estado_semi: new FormControl(null),
  //     limite_anticipos: new FormControl(null),
  //     chofer_celular: new FormControl(null),
  //     oc_activa: new FormControl(null),
  //     tipo_persona: new FormControl(null),
  //   }),
  // });
  @Input() form?: FormGroup;

  @Input() fotoPerfil: string | null = null;
  @Input() fotoPerfilChofer: string | null = null;
  @Input() combinacion?: Combinacion;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() modelo?: PermisoModeloEnum;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() foto: string | null = null;
  @Input() fotoCamion: string | null = null;
  @Input() fotoSemi: string | null = null;
  @Input() semi?: Semi;
  @Input() camion?: Camion;
  @Input() propietarioTipoPersona?: Propietario;
  @Input() cantidadOCConAnticiposLiberados = 0;
  @Input() readonly = true;
  @Input() disabled: boolean = false;

  @Output() personaChange = new EventEmitter<TipoPersona | undefined>();
  @Output() propietarioChange = new EventEmitter<Propietario | undefined>();
  @Output() estadoSemiChange = new EventEmitter<boolean>();
  @Output() estadoCamionChange = new EventEmitter<boolean>();
  @Output() estadoChoferChange = new EventEmitter<boolean>();
  @Output() esChoferChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<SemiList | undefined>();
  @Output() fotoChange = new EventEmitter<File | null>();
  @Output() fotoCamionChange = new EventEmitter<File | null>();
  @Output() fotoSemiChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChoferChange = new EventEmitter<File | null>();
  @Output() anticiposBloqueadosChange = new EventEmitter();
 

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

  // get contactos(): FormArray | null {
  //   return this.form.get('contactos') as FormArray;
  // }

  handleEstadoChange(): void {
    const estadoActual = this.estadoControl.value;
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    this.estadoControl.setValue(nuevoEstado);
  }
  
  camionChange(camion?: CamionList){
    this.info?.controls["marca"].setValue(camion?.marca_descripcion)
    this.info?.controls["color"].setValue(camion?.color_descripcion)
    this.info?.controls["propietario"].setValue(camion?.propietario_nombre)
    this.info?.controls["oc_activa"].setValue(camion?.oc_activa)
    this.info?.controls["limite_anticipos"].setValue(camion?.limite_monto_anticipo)
    this.info?.controls["estado_camion"].setValue(camion?.estado)
    this.info?.controls["foto_perfil_camion"].setValue(camion?.foto_camion)
  }

  semiChange(semi?: SemiList){
     this.info?.controls["semi_id"].setValue(semi?.id)
     this.info?.controls["marca_semi"].setValue(semi?.marca_descripcion)
     this.info?.controls["color_semi"].setValue(semi?.color_descripcion)
     this.info?.controls["estado_semi"].setValue(semi?.estado)
     this.info?.controls["perfil_foto_semi"].setValue(semi?.foto_semi)
   }

  choferChange(chofer?: ChoferList){
    this.info?.controls["chofer_id"].setValue(chofer?.id)
    this.info?.controls["chofer_documento"].setValue(chofer?.numero_documento)
    this.info?.controls["chofer_nombre"].setValue(chofer?.nombre)
    this.info?.controls["chofer_celular"].setValue(chofer?.telefono_chofer)
    this.info?.controls["estado"].setValue(chofer?.estado)
    this.info?.controls["puede_recibir_anticipos"].setValue(chofer?.puede_recibir_anticipos)
    this.info?.controls["foto_chofer"].setValue(chofer?.foto_registro_reverso)
  }

  tipoPersonaChange(propietario?: PropietarioList): void {
    this.info?.controls["propietario_id"].setValue(propietario?.id)
    this.info?.controls["nombre"].setValue(propietario?.nombre);
    this.info?.controls["tipo_persona_id"].setValue(propietario?.tipo_persona_id);
    this.info?.controls["telefono"].setValue(propietario?.telefono);
    this.info?.controls["anticipo_propietario"].setValue(propietario?.puede_recibir_anticipos);
    // this.info?.controls["numero_documento"].setValue(propietario?.numero_documento);
    // this.info?.controls["ruc"].setValue(propietario?.ruc);
    this.info?.controls["estado_propietario"].setValue(propietario?.estado);
    this.info?.controls["foto_propietario"].setValue(propietario?.foto_perfil);
    console.log("trae el propietario", propietario?.foto_perfil)
    console.log("trae el propietario", propietario)
  }
  
  onTipoPersonaChange(tipoPersona: TipoPersona | undefined): void {
    this.tipoPersona = tipoPersona;
    this.personaChange.emit(tipoPersona); 
   
  }
  onBeneficiarioChange(docBeneficiario: PropietarioList | undefined): void {
    this.docBeneficiario = docBeneficiario;
    this.propietarioChange.emit(docBeneficiario); 
  }


  isFisicaChange(propietario?: PropietarioList | boolean): void {
    if (typeof propietario === 'boolean') {
      setTimeout(() => {
        this.isFisicaSelected = propietario;
      });
    } else {
      setTimeout(() => {
        this.isFisicaSelected = propietario?.tipo_persona.descripcion === 'Física';
        if (!this.isFisicaSelected) {
          if (propietario?.tipo_persona.descripcion === 'Jurídica' && propietario?.ruc) {
            this.tipoPersonaChange(propietario);
          }
        }
      });
    }
    if (this.info) {
      if (this.isFisicaSelected) {
        this.info.controls['cedula'].enable(); 
        this.info.controls['ruc'].disable();
      } else {
        this.info.controls['ruc'].enable(); 
        this.info.controls['cedula'].disable(); 
      }
    }
  }
}




