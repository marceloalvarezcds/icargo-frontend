import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-combinacion-form',
  templateUrl: './combinacion-form.component.html',
  styleUrls: ['./combinacion-form.component.scss']
})
export class CombinacionFormComponent implements  OnDestroy {
  a = PermisoAccionEnum;
  id?: number;
  item?: Combinacion;
  propietario_id?: number;
  camion_id?: number;
  chofer_id?: number;
  producto_id?: number;
  gestor_carga_id?: number;
  neto?: number;
  semi_id?: number;
  comentario?: number;
  capacidad_total_combinacion?: number;
  gestorCuentaId?: number;
  isActive = false;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isChoferTouched = false;
  isRegistroTouched = false;
  isContactoTouched = false;
  isAddressTouched = false;
  modelo = m.COMBINACION;
  backUrl = `/flota/${m.COMBINACION}/${a.LISTAR}`;
  camionModelo = m.CAMION;
  choferModelo = m.CHOFER;
  semirremolqueModelo = m.SEMIRREMOLQUE;
  created_by = '';
  created_at = '';
  modified_by = '';
  modified_at = '';
  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      tipo_persona_id: [null, Validators.required],
      ruc: [null, Validators.required],
      digito_verificador: [null, Validators.min(0)],
      pais_origen_id: null,
      oficial_cuenta_id: null,
      alias: null,
      foto_documento_frente: null,
      foto_documento_reverso: null,
      foto_perfil: null,
      es_chofer: null,
      puede_recibir_anticipos: true,
    }),
    chofer: this.fb.group({
      tipo_documento_id: null,
      pais_emisor_documento_id: null,
      numero_documento: null,
      foto_documento_frente_chofer: null,
      foto_documento_reverso_chofer: null,
    }),
    registro: this.fb.group({
      pais_emisor_registro_id: null,
      localidad_emisor_registro_id: null,
      ciudad_emisor_registro_id: null,
      tipo_registro_id: null,
      numero_registro: null,
      vencimiento_registro: null,
      foto_registro_frente: null,
      foto_registro_reverso: null,
    }),
    contactos: this.fb.array([]),
    address: this.fb.group({
      ciudad_id: null,
      direccion: null,
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get puedeModificarSoloAliasYcontactos(): boolean {
    if (this.isShow || !this.isEdit) {
      return false;
    }
    return !this.userService.checkPermisoAndGestorCargaId(
      a.EDITAR,
      this.modelo,
      this.gestorCuentaId
    );
  }

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
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  

  // private getData(): void {
  //   this.id = +this.route.snapshot.params.id;
  //   if (this.id) {
  //     this.isEdit = /edit/.test(this.router.url);
  //     this.isShow = /ver/.test(this.router.url);
  //     if (this.isShow) {
  //       this.form.disable();
  //     }
  //     this.combinacionService.getById(this.id).subscribe((data) => {

  //       this.created_by = data.created_by;
  //       this.created_at = data.created_at;
      
  //       this.modified_at = data.modified_at;
  //       if (this.puedeModificarSoloAliasYcontactos) {
  //         this.info.disable();
  //         this.address.disable();
  //         this.chofer.disable();
  //         this.registro.disable();
  //         this.info.controls['alias'].enable();
  //       }
  //       this.form.patchValue({
  //         info: {
  //           alias: data.gestor_carga_propietario?.alias ?? null,
  //           nombre: data.nombre,
  //           tipo_persona_id: data.tipo_persona_id,
  //           ruc: data.ruc,
  //           digito_verificador: data.digito_verificador,
  //           pais_origen_id: data.pais_origen_id,
  //           fecha_nacimiento: data.fecha_nacimiento,
  //           oficial_cuenta_id: data.oficial_cuenta_id,
  //           telefono: data.telefono,
  //           email: data.email,
  //           es_chofer: data.es_chofer,
  //           puede_recibir_anticipos: data.puede_recibir_anticipos,
  //           foto_documento_frente: null,
  //           foto_documento_reverso: null,
  //           foto_perfil: null,
  //         },
  //         chofer: {
  //           camion_placa: data.camion.placa ?? null,
  //           pais_emisor_documento_id: data.pais_emisor_documento_id ?? null,
  //           numero_documento: data.numero_documento ?? null,
  //           foto_documento_frente_chofer: null,
  //           foto_documento_reverso_chofer: null,
  //         },
  //         registro: {
  //           pais_emisor_registro_id: data.pais_emisor_documento_id ?? null,
  //           localidad_emisor_registro_id:
  //             data.localidad_emisor_registro_id ?? null,
  //           ciudad_emisor_registro_id: data.ciudad_emisor_registro_id ?? null,
  //           tipo_registro_id: data.tipo_registro_id ?? null,
  //           numero_registro: data.numero_registro ?? null,
  //           vencimiento_registro: data.vencimiento_registro ?? null,
  //           foto_registro_frente: null,
  //           foto_registro_reverso: null,
  //         },
  //         address: {
  //           ciudad_id: data.ciudad_id,
  //           direccion: data.direccion,
  //         },
  //         contactos: [],
  //       });
  //       this.contactoList = data.contactos.slice();
  //       setTimeout(() => {
  //         this.hasChange = false;
  //         this.initialFormValue = this.form.value;
  //       }, 500);
  //     });
    }
  