import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Semi } from 'src/app/interfaces/semi';
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
  isFisicaSelected: boolean = false;
 
  a = a;
  anticiposBloqueados = false;
  id?: number;
  item?: Semi;
  item2?: Camion;
  tractoId?: number;
  propietarioId?: number;
  estado = EstadoEnum.PENDIENTE;
  nombre?: string;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  gestorCargaId?: number;
  fotoCamion: string | null = null;
  fotoSemi: string | null = null;
  fotoPerfil: string | null = null;
  fotoPerfilChofer: string | null = null;
  fotoDocumentoFrente: string | null = null;
  fotoDocumentoFrenteFile: File | null = null;
  fotoDocumentoReverso: string | null = null;
  fotoDocumentoReversoFile: File | null = null;
  fotoPerfilFile: File | null = null;
  fotoPerfilChoferFile: File | null = null;
  fotoCamionFile: File | null = null;
  fotoSemiFile: File | null = null;
  modelo = m.COMBINACION;
  backUrl = `/flota/${m.COMBINACION}/${a.LISTAR}`;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';

  form = this.fb.group({
    info: this.fb.group({
      propietario_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      placa: [null, Validators.required],
      color: [null, Validators.required],
      propietario: [null, Validators.required],
      oc_activa: null,
      estado_camion: null,
      foto_camion: null,
      marca: [null, Validators.required],
      marca_semi: [null, Validators.required],
      color_semi: null,
      estado_semi: null,
      foto_semi: null,
      cedula: null,
      limite_anticipos: null,
      chofer_documento: null,
      puede_recibir_anticipos: null,
      estado: [null, Validators.required],
      tipo_persona_id: [null, Validators.required],
      tipo_persona: null,
      anticipo_propietario: null,
      ruc: [null, Validators.required],
      nombre: [null, Validators.required],
      chofer_nombre: null,
      chofer_celular: null,
      telefono: null,
      foto_perfil_chofer: null,
      semi_id: [null, Validators.required],
      chofer_id: [null, Validators.required],
      producto_id: [null, Validators.required],
      comentario: null,
      foto_perfil: null,
      neto: null,
      capacidad_total_combinacion: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

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
    this.isFisicaSelected = false;
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

  get puedeModificarSoloAliasYcontactos(): boolean {
    if (this.isShow || !this.isEdit) {
      return false;
    }
    return !this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCargaId
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
          anticipos_bloqueados: this.anticiposBloqueados,
        })
      );
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFrenteFile) {
        formData.append(
          'foto_documento_frente_file',
          this.fotoDocumentoFrenteFile
        );
      }
      if (this.fotoDocumentoReversoFile) {
        formData.append(
          'foto_documento_reverso_file',
          this.fotoDocumentoReversoFile
        );
      }
      if (this.fotoPerfilFile) {
        formData.append('foto_perfil_file', this.fotoPerfilFile);
      }
      if (this.fotoPerfilChoferFile) {
        formData.append('foto_perfil_chofer_file', this.fotoPerfilChoferFile);
      }
      if (this.fotoCamionFile) {
        formData.append('foto_camion_file', this.fotoCamionFile);
      }
      if (this.fotoSemiFile) {
        formData.append('foto_semi_file', this.fotoSemiFile);
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

  esChoferChange(esChofer: boolean): void {
    if (esChofer) {
      this.tipoDocumentoIdControl.setValidators(Validators.required);
      this.paisEmisorDocumentoIdControl.setValidators(Validators.required);
      this.numeroDocumentoControl.setValidators(Validators.required);
    } else {
      this.tipoDocumentoIdControl.removeValidators(Validators.required);
      this.paisEmisorDocumentoIdControl.removeValidators(Validators.required);
      this.numeroDocumentoControl.removeValidators(Validators.required);
    }
    this.tipoDocumentoIdControl.updateValueAndValidity();
    this.paisEmisorDocumentoIdControl.updateValueAndValidity();
    this.numeroDocumentoControl.updateValueAndValidity();
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
        this.estado = data?.estado;
        this.gestorCargaId = data.gestor_carga_id;
        this.nombre = data?.propietario?.nombre
        this.isActive = data?.estado === EstadoEnum.ACTIVO;
        this.fotoPerfil = data.propietario?.foto_perfil!;
        this.fotoPerfilChofer = data.chofer?.foto_perfil!;
        this.fotoCamion = data.camion?.foto!;
        this.created_by = data?.created_by;
        this.created_at = data?.created_at;
        this.modified_by = data?.modified_by;
        this.modified_at = data?.modified_at;
        this.form.patchValue({
          info: {
            propietario_id: data?.propietario_id,
            //Datos camion
            camion_id: data?.camion_id,
            semi_id: data?.semi_id,
            placa: data?.camion.marca.descripcion,
            foto_camion: null,
            color: data?.camion?.color?.descripcion,
            chofer_id: data?.chofer_id,
            producto_id: data?.producto_id,
            
            oc_activa: data?.camion?.limite_cantidad_oc_activas,
            limite_anticipos: data?.camion?.limite_monto_anticipos,
            estado_camion: data?.estado,
            //Datos Semi
            marca: data?.camion.marca.descripcion,
            propietario: data?.camion?.propietario.nombre,
            marca_semi: data?.semi?.marca?.descripcion,
            color_semi: data?.semi?.color?.descripcion,
            estado_semi: data?.semi?.estado,
            foto_semi: data?.semi?.foto,
            //Datos Chofer
            chofer_documento: data?.chofer?.numero_documento,
            chofer_nombre: data?.chofer?.nombre,
            chofer_celular: data?.chofer?.telefono,
            puede_recibir_anticipos: data?.chofer?.puede_recibir_anticipos,
            estado: data?.chofer?.estado,
            //Datos Propietario
            tipo_persona_id: data?.propietario_id,
            tipo_persona: data?.propietario?.tipo_persona.descripcion,
            nombre: data?.propietario?.nombre,
            ruc: data?.propietario?.ruc,
            cedula: data?.propietario?.numero_documento,
            telefono: data?.propietario?.telefono,
            anticipo_propietario: data?.propietario?.puede_recibir_anticipos,
            foto_perfil: null,
            foto_perfil_chofer: null,
            //Datos combinacion
            neto: data?.neto,
            comentario: data?.comentario,
            capacidad_total_combinacion: data?.capacidad_total_combinacion,
          },
          nombre: [],
        });
        console.log('data:', data); 
        console.log('Tipo persona:', data?.propietario?.tipo_persona ?? null);
        console.log('OC:', data?.camion?.limite_cantidad_oc_activas)
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }  

}
  