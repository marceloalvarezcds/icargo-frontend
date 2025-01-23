import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Camion } from 'src/app/interfaces/camion';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-combinacion-form',
  templateUrl: './combinacion-form.component.html',
  styleUrls: ['./combinacion-form.component.scss']
})
export class CombinacionFormComponent implements OnInit, OnDestroy {
  a = PermisoAccionEnum;
  tPersona?: TipoPersona;
  anticiposBloqueados = false;
  id?: number;
  item?: Combinacion;
  item2?: Camion;
  semi?: PropietarioList;
  tractoId?: number;
  persona?: TipoPersona
  propietarioId?: number;
  semiId?: number;
  camionId?: number;
  gestorCargaId?: number;
  estado = EstadoEnum.PENDIENTE;
  nombre?: string;
  isActive = false;
  isEdit = false;
  isShow = false;
  isShowCamion = false
  isPanelOpen = false;
  isInfoTouched = true;
  modelo = m.COMBINACION;
  cantidadOCConAnticiposLiberados = 0;
  fotoPerfil: string | null = null;
  fotoPerfilSemi: string | null = null;
  fotoPerfilChofer: string | null | undefined;
  fotoBeneficiario:  string | null | undefined;
  fotoDocumentoFrente: string | null = null;
  backUrl = `/flota/${m.COMBINACION}/${a.LISTAR}`;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  form = this.fb.group({
    info: this.fb.group({
      //Datos del camion
      camion_id: [null, Validators.required],
      marca: null,
      color: null,
      propietario: null,
      oc_activa: [null, Validators.required],
      estado_camion: null,
      foto_camion: new FormControl({value: null, disabled: true}),
      //Datos del Semi
      semi_id: [null, Validators.required],
      marca_semi: null,
      color_semi: null,
      estado_semi: null,
      foto_semi: new FormControl({value: null, disabled: true}),
      //Datos del chofer
      chofer_id: [null, Validators.required],
      chofer_nombre: null,
      chofer_celular: null,
      limite_anticipos: [null, Validators.required],
      chofer_documento: null,
      puede_recibir_anticipos: null,
      estado: null,
      foto_chofer: new FormControl({value: null, disabled: true}),
      //Facturacion
      propietario_id: null,
      // tipo_persona_id: null,
      // tipo_persona: new FormControl({value: null, disabled: true}),
      nombre: null,
      anticipo_propietario: null,
      ruc: null,
      numero_documento: null,
      // telefono: new FormControl({value: null, disabled: true}),
      estado_propietario: new FormControl({value: null, disabled: true}),
      foto_documento_frente: new FormControl({value: null, disabled: true}),
      //Combinacion
      comentario: null,
      neto: [null, Validators.required],
    }),

  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  @Output() personaChange = new EventEmitter<PropietarioList>();



  get puedeModificar(): boolean {
    if (this.isShow || !this.isEdit) {
      return false;
    }
    return this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
    );
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get semi_id(): FormGroup {
    return this.form.get('info.semi_id') as FormGroup;
  }

  get chofer_id(): FormGroup {
    return this.form.get('info.chofer_id') as FormGroup;
  }

  get chofer(): FormGroup {
    return this.form.get('chofer') as FormGroup;
  }

  get ruc(): FormGroup {
    return this.form.get('info.ruc') as FormGroup;
  }

  get tipo_persona_id(): FormGroup {
    return this.form.get('info.tipo_persona_id') as FormGroup;
  }

  get propietario_id(): FormGroup {
    return this.form.get('info.propietario_id') as FormGroup;
  }

  get registro(): FormGroup {
    return this.form.get('registro') as FormGroup;
  }

  get contactos(): FormArray {
    return this.form.get('contactos') as FormArray;
  }

  get address(): FormGroup {
    return this.form.get('address') as FormGroup;
  }

  get esChoferControl(): FormControl {
    return this.info.get('es_chofer') as FormControl;
  }

  get esChofer(): boolean {
    return !!this.esChoferControl.value;
  }

  get propietarioBackUrl(): string {
    return this.router.url;
  }

  get rucControl(): FormGroup {
    return this.info.get('ruc') as FormGroup;
  }

  get paisEmisorDocumentoIdControl(): FormGroup {
    return this.chofer.get('pais_emisor_documento_id') as FormGroup;
  }

  get numeroDocumentoControl(): FormGroup {
    return this.chofer.get('numero_documento') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private combinacionService: CombinacionService,
    private service: TipoPersonaService,
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    // Se quita marca automatica de campos obligatorios, pedido de jorge
    //this.form.markAllAsTouched();
  }

  onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent; 
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault(); 
    }
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  redirectToEdit(): void {
    this.router.navigate([`/flota/${m.COMBINACION}/${a.EDITAR}`, this.id]);
  }

  active(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea activar la Combinación?',
      this.combinacionService.active(this.id!),
      () => {
        this.getData();
      }
    );
  }

  inactive(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea desactivar la Combinación?',
      this.combinacionService.inactive(this.id!),
      () => {
        this.getData();
      }
    );
  }

  private desactiveFields(): void {
    this.form.get('info')?.get('camion_id')?.disable();
    this.form.get('info')?.get('oc_activa')?.disable();
    this.form.get('info')?.get('limite_anticipos')?.disable();
    this.form.get('info')?.get('anticipo_propietario')?.disable();
    this.form.get('info')?.get('propietario_id')?.disable();
    this.form.get('info')?.get('neto')?.disable();
    this.form.get('info')?.get('comentario')?.disable();
  }


  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    const propietarioId = this.form.get('info.propietario_id')?.value;
    if (!propietarioId) {
      console.error("propietario_id no puede ser null o undefined");
      return; // Detener el envío si propietario_id no es válido
    }
    if (this.form.valid) {
      const formData = new FormData();

      const data = JSON.parse(
        JSON.stringify({
          ...this.info.value
        })
      );

      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });
      formData.append('data', JSON.stringify(data));
      this.hasChange = false;
      this.initialFormValue = this.form.value
      if (this.isEdit && this.id) {
        this.combinacionService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.combinacionService.create(formData).subscribe((combinacion) => {

          this.snackbar.openSaveAndRedirect(
            confirmed,
            this.backUrl,
            r.FLOTA,
            m.COMBINACION,
            combinacion.id
          );
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
      });
    }
  }


  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);

      this.combinacionService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.estado = data?.estado;
        this.gestorCargaId = data.gestor_carga_id;
        this.isActive = data.estado === EstadoEnum.ACTIVO;
        this.fotoPerfil = data?.foto_camion;
        this.fotoPerfilSemi = data?.semi?.foto;
        this.fotoPerfilChofer = data?.chofer?.foto_perfil;
        this.fotoDocumentoFrente = data?.propietario?.foto_perfil ?? null;
        this.created_at = data?.created_at;
        this.created_by = data?.created_by;
        this.modified_by = data?.modified_by;
        this.modified_at = data?.modified_at;
        this.form.patchValue({
          info: {
            //Datos camion
            camion_id: data?.camion_id,
            marca: data?.camion.marca?.descripcion,
            color: data?.camion?.color?.descripcion,
            oc_activa: data?.camion?.limite_cantidad_oc_activas,
            limite_anticipos: data?.camion?.limite_monto_anticipos,
            estado_camion: data?.estado,
            foto_camion: data?.camion?.foto,
            //Datos Semi
            semi_id: data?.semi_id,
            propietario: data?.camion?.propietario.nombre,
            marca_semi: data?.semi?.marca?.descripcion,
            color_semi: data?.semi?.color?.descripcion,
            estado_semi: data?.semi?.estado,
            foto_semi: data?.semi?.foto,
            //Datos Chofer
            chofer_id: data?.chofer_id,
            chofer_documento: data?.chofer?.numero_documento,
            chofer_nombre: data?.chofer?.nombre,
            chofer_celular: data?.chofer?.telefono,
            puede_recibir_anticipos: data?.chofer?.puede_recibir_anticipos,
            estado: data?.chofer?.estado,
            gestor_carga_id: data?.gestor_carga_id,
            foto_chofer: data?.chofer?.foto_perfil,
            //Datos Facturacion
            tipo_persona_id: data?.propietario.tipo_persona_id,
            propietario_id: data?.propietario_id,
            nombre: data?.propietario?.nombre,
            ruc: data?.propietario?.ruc,
            numero_documento: data?.propietario?.numero_documento,
            telefono: data?.propietario?.telefono,
            anticipo_propietario: data?.propietario?.puede_recibir_anticipos,
            estado_propietario: data?.propietario?.estado,
            foto_documento_frente: data?.propietario?.foto_perfil,
            //Datos combinacion
            neto: data?.neto,
            comentario: data?.comentario,
          },
        })
        setTimeout(() => {
          this.hasChange = false;
          if (this.isEdit) {
            this.form.get('info')?.get('camion_id')?.disable();
            this.form.get('info')?.get('oc_activa')?.disable();
            this.form.get('info')?.get('limite_anticipos')?.disable();
            this.form.get('info')?.get('anticipo_propietario')?.disable();
            this.form.get('info')?.get('neto')?.disable();
            this.form.get('info')?.get('comentario')?.disable();
          }
          if (this.isShow) {
            this.form.get('info')?.get('camion_id')?.disable();
            this.form.get('info')?.get('semi_id')?.disable();
            this.form.get('info')?.get('chofer_id')?.disable();
            this.form.get('info')?.get('oc_activa')?.disable();
            this.form.get('info')?.get('limite_anticipos')?.disable();
            this.form.get('info')?.get('anticipo_propietario')?.disable();
            this.form.get('info')?.get('propietario_id')?.disable();
            this.form.get('info')?.get('ruc')?.disable();
            this.form.get('info')?.get('neto')?.disable();
            this.form.get('info')?.get('comentario')?.disable();
          }
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }

}
