import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { filter } from 'rxjs/operators';
import { CommentDialogComponent } from 'src/app/dialogs/comment-dialog/comment-dialog.component';
import { OcConfirmationDialogComponent } from 'src/app/dialogs/oc-confirmation-dialog/oc-confirmation-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getOCData } from 'src/app/form-data/oc-confirmation-data';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Combinacion, CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orden-carga-create-form',
  templateUrl: './orden-carga-create-form.component.html',
  styleUrls: ['./orden-carga-create-form.component.scss'],
})
export class OrdenCargaCreateFormComponent implements OnInit {
  flete?: FleteList;
  ordenCarga?: OrdenCargaList;
  isFormSubmitting = true;
  isCreate=true;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  id?: number;
  camion?: Camion;
  semi?: Semi;
  combinacionList?: Combinacion
  isFormSaved: boolean = false;
  ordenCargaId: number | null = null;
  item?: OrdenCarga;
  isActive = false;
  fleteId?: number;
  dataFromParent: string = 'Nuevo';
  isEdit = false;
  
  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      combinacion_id: [null, Validators.required],
      marca_camion: null,
      color_camion: null,
      propietario_camion: null,
      propietario_camion_doc: null,
      chofer_camion: null,
      chofer_camion_doc: null,
      beneficiario_camion: null,
      beneficiario_camion_doc: null,
      semi_id: [null, Validators.required],
      semi_placa: null,
      marca_semi: null,
      color_semi: null,
      estado: null,
      pedido_id: null,
      numero_lote: null,
      saldo: null,
      cliente: null,
      producto_descripcion: null,
      origen_nombre: null,
      destino_nombre:null,
      tipo_flete: null,
      a_pagar: null,
      valor: null,
      neto: null,
      cant_origen: null,
      cant_destino: null,
      diferencia: null,
      puede_recibir_anticipos: [false],
      anticipo_propietario: null,
      anticipos: null,
      id_orden_carga: null,
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      comentarios: null,
    }),
    
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  get estadoOc() {
    const estadoValue = this.form.get('combinacion.estado')?.value;
    return estadoValue;
  }

  get estado(): EstadoEnum {
    return this.item!.estado;
  }

  get combinacion(): FormGroup {
    return this.form.get('combinacion') as FormGroup;
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get anticipoList(): OrdenCargaAnticipoRetirado[]{
    return this.item!?.anticipos.slice();
  }

  get comentariosList(): OrdenCargaComentariosHistorial[]{
    return this.item!?.comentario.slice();
  }

  get complementoList(): OrdenCargaComplemento[] {
    return this.item!?.complementos.slice();
  }

  get descuentoList(): OrdenCargaDescuento[] {
    return this.item!?.descuentos.slice();
  }

  get porcentajeAnticipos(): FormArray {
    return this.form.get('porcentaje_anticipos') as FormArray;
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isFinalizado(): boolean {
    return this.estado === EstadoEnum.FINALIZADO;
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  isViewMode: boolean = true;
  
  get isAnticiposLiberados(): boolean {
    return this.item!?.anticipos_liberados;
  }

  get puedeConciliar(): boolean {
    return (
      this.userService.checkPermisoAndGestorCargaId(
        a.CONCILIAR,
        this.modelo,
        this.gestorCargaId
      ) && this.isFinalizado
    );
  }

  get puedeCambiarEstado(): boolean {
    const permiso = this.userService.checkPermisoAndGestorCargaId(
      a.CAMBIAR_ESTADO,
      this.modelo,
      this.gestorCargaId
    );
    return permiso;
  }
  

  ngOnInit(): void {
    this.setInitialToggleState();
    const gestorCargaId = this.gestorCargaId;
    if (gestorCargaId !== undefined) {
      this.dataFromParent = this.userService.checkPermisoAndGestorCargaId(
        a.CAMBIAR_ESTADO,
        this.modelo,
        gestorCargaId
      ) ? 'Aceptado' : 'Nuevo';
    } else {
      this.dataFromParent = 'Nuevo';
    }
  
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private ordenCargaService: OrdenCargaService,
    private userService: UserService,
    private matDialog: MatDialog ,
    private stateService: StateService,
  ) {}

  setInitialToggleState(): void {
    if (this.item && this.item.anticipos_liberados) {
      this.isActive = this.item.anticipos_liberados; 
    }
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.save(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  active(): void {
    if (this.ordenCargaId !== null) {
      this.dialog.changeStatusConfirm(
        '¿Está seguro que desea liberar anticipos?',
        this.ordenCargaService.modificarAnticipos(this.ordenCargaId),
        () => {
          this.getData();
        }
      );
    } else {
      console.error('No se puede activar anticipos sin un ID válido');
    }
  }
  
  inactive(): void {
    if (this.ordenCargaId !== null) {
      this.dialog.changeStatusConfirm(
        '¿Está seguro que desea bloquear anticipos?',
        this.ordenCargaService.modificarAnticipos(this.ordenCargaId),
        () => {
          this.getData();
        }
      );
    } else {
      console.error('No se puede bloquear anticipos sin un ID válido');
    }
  }

  get isToggleAnticiposLiberados(): boolean {
    return this.item ? this.item.anticipos_liberados : false;
  }
  
  save(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const comentarios = this.item?.comentario || [];
      const data: OCConfirmationDialogData = {
        oc: getOCData(this.form, this.flete, this.camion, this.semi, this.form.get('combinacion')?.get('neto')?.value),
        comentarios: comentarios
      };
      this.dialog
        .open(OcConfirmationDialogComponent, {
          data,
          panelClass: 'selector-dialog',
          position: {
            top: '1rem',
          },
        })
        .afterClosed()
        .pipe(filter((confirmed: any) => !!confirmed))
        .subscribe(() => {
          this.submit(confirmed);
        });
    }
  }


  submit(confirmed: boolean): void {
    if (this.form.valid) {
      this.isFormSaved = true; 
      this.isFormSubmitting = false
      this.dataFromParent = this.form.get('combinacion.estado')?.value; 
    }
    const formData = new FormData();
    const data = JSON.parse(
      JSON.stringify({
        ...this.combinacion.value,
        ...this.info.value,
      })
     
    );
    // Convertir propiedades a mayúsculas, excepto los correos electrónicos
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' && key !== 'email') {
        data[key] = data[key].toUpperCase();
      }
    });  
    formData.append('data', JSON.stringify(data));
    this.ordenCargaService.create(formData).subscribe((item) => {
    this.snackbar.openSave();
      this.ordenCargaId = item.id; 
      this.fleteId = item.flete_id;
      this.item = item;
      this.info.get('comentarios')?.setValue('');
      this.dataFromParent = item.estado;
      r.ORDEN_CARGA;
      m.ORDEN_CARGA;
      // this.snackbar.openSaveAndRedirect(
      //   confirmed,
      //  this.backUrl,
      //   r.ORDEN_CARGA,
       //  m.ORDEN_CARGA,
       //  item.id
       //);
    });
    this.form.disable();
  }
  getData(): void {
    if (!this.item) return
    this.ordenCargaService.getById(
      this.item.id).subscribe((data) => {
      this.item = data;
    });
  }
}
