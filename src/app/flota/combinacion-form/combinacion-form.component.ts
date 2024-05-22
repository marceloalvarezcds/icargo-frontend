import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
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
import { Semi } from 'src/app/interfaces/semi';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
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
  propietarioId?: number;
  semiId?: number;
  camionId?: number;
  estado = EstadoEnum.PENDIENTE;
  nombre?: string;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  gestorCargaId?: number;
  camionModelo = m.CAMION;
  choferModelo = m.CHOFER;
  semirremolqueModelo = m.SEMIRREMOLQUE;
  modelo = m.COMBINACION;
  fotoDocumentoFrente: string | null = null;
  fotoDocumentoFrenteFile: File | null = null;
  fotoDocumentoReverso: string | null = null;
  fotoDocumentoReversoFile: File | null = null;
  fotoPerfil: string | null = null;
  fotoPerfilSemi: string | null = null;
  fotoPerfilChofer: string | null = null;
  fotoPerfilPropietario:string | null | undefined;
  fotoPerfilFile: File | null = null;
  fotoDocumentoFrenteChofer: string | null = null;
  fotoDocumentoFrenteChoferFile: File | null = null;
  fotoDocumentoReversoChofer: string | null = null;
  fotoDocumentoReversoChoferFile: File | null = null;
  fotoRegistroFrente: string | null = null;
  fotoRegistroFrenteFile: File | null = null;
  fotoRegistroReverso: string | null = null;
  fotoRegistroReversoFile: File | null = null;
  backUrl = `/flota/${m.COMBINACION}/${a.LISTAR}`;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  form = this.fb.group({
    info: this.fb.group({
      //Datos del camion
      camion_id: [null, Validators.required],
      color: null,
      propietario: null,
      oc_activa: null,
      estado_camion: null,
      foto_camion: null,
      //Datos del Semi
      semi_id: [null, Validators.required],
      marca: null,
      marca_semi: null,
      color_semi: null,
      estado_semi: null,
      foto_perfil: [null],
      //Datos del chofer
      chofer_id: [null, Validators.required],
      chofer_nombre: null,
      chofer_celular: null,
      limite_anticipos: null,
      chofer_documento: null,
      puede_recibir_anticipos: null,
      estado: null,
      foto_chofer: null,
      //Facturacion
      propietario_id: [null, Validators.required],
      tipo_persona_id: null,
      tipo_persona: null,
      nombre: null,
      anticipo_propietario: null,
      ruc: null,
      numero_documento: null,
      telefono: null,
      estado_propietario: null,
      foto_propietario: null,
      //Combinacion
      comentario: [null, Validators.required],
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

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }
  get chofer(): FormGroup {
    return this.form.get('chofer') as FormGroup;
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

  get tipoDocumentoIdControl(): FormGroup {
    return this.chofer.get('tipo_documento_id') as FormGroup;
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
    private userService: UserService,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();

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


  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(
        JSON.stringify({
          ...this.info.value,
        })
      );
      formData.append('data', JSON.stringify(data));
      if (this.fotoPerfilFile) {
        formData.append('foto_perfil_file', this.fotoPerfilFile);
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
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

  bloquearAnticipos(): void {
    this.dialog.confirmation(
      'Existen Órdenes de Carga Aceptadas y con Anticipos liberados ¿Desea bloquearlos después de guardar los cambios?',
      () => {
        this.anticiposBloqueados = true;
      }
    );
  }



  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      this.combinacionService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.estado = data?.estado;
        this.created_by = data?.created_by;
        this.fotoPerfil = data?.foto_camion;
        this.fotoPerfilSemi = data?.semi?.foto;
        this.fotoPerfilPropietario = data?.propietario?.foto_perfil;
        this.created_at = data?.created_at;
        this.gestorCargaId = data.gestor_carga_id;
        this.modified_by = data?.modified_by;
        this.modified_at = data?.modified_at;
        this.form.patchValue({
          info: {
            //Datos camion
            camion_id: data?.camion_id,
            color: data?.camion?.color?.descripcion,
            chofer_id: data?.chofer_id,
            oc_activa: data?.camion?.limite_cantidad_oc_activas,
            limite_anticipos: data?.camion?.limite_monto_anticipos,
            estado_camion: data?.estado,
            foto_camion: data?.camion?.foto,
            //Datos Semi
            semi_id: data?.semi_id,
            marca: data?.marca_descripcion,
            propietario: data?.camion?.propietario.nombre,
            marca_semi: data?.semi?.marca?.descripcion,
            color_semi: data?.semi?.color?.descripcion,
            estado_semi: data?.semi?.estado,
            foto_perfil: data?.semi?.foto,
            //Datos Chofer
            chofer_documento: data?.chofer?.numero_documento,
            chofer_nombre: data?.chofer?.nombre,
            chofer_celular: data?.chofer?.telefono,
            puede_recibir_anticipos: data?.chofer?.puede_recibir_anticipos,
            estado: data?.chofer?.estado,
            gestor_carga_id: data?.gestor_carga_id,
            foto_chofer: data?.chofer?.foto_registro_reverso,
            //Datos Facturacion
            tipo_persona_id: data?.propietario.tipo_persona_id,
            propietario_id: data?.propietario_id,
            nombre: data?.propietario?.nombre,
            ruc: data?.propietario?.ruc,
            numero_documento: data?.propietario?.numero_documento,
            telefono: data?.propietario?.telefono,
            anticipo_propietario: data?.propietario?.puede_recibir_anticipos,
            estado_propietario: data?.propietario?.estado,
            foto_propietario: data?.propietario?.foto_perfil,
            //Datos combinacion
            neto: data?.neto,
            comentario: data?.comentario,
          
          },
        });
        console.log("Combinacion Form Camion", data?.camion)
        console.log("Foto_Camion", data?.foto_camion)
        console.log("foto registro", data?.chofer?.foto_registro_reverso)
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }  

}
  