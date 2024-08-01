import { Component, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OcConfirmationDialogComponent } from 'src/app/dialogs/oc-confirmation-dialog/oc-confirmation-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { getOCData } from 'src/app/form-data/oc-confirmation-data';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-orden-carga-create-form',
  templateUrl: './orden-carga-create-form.component.html',
  styleUrls: ['./orden-carga-create-form.component.scss'],
})
export class OrdenCargaCreateFormComponent {
  flete?: FleteList;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;
  camion?: Camion;
  semi?: Semi;
  isFormSaved: boolean = false;
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
      semi_id: [null, Validators.required],
      semi_placa: null,
      marca_semi: null,
      color_semi: null,
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
      anticipo_propietario: null,
      puede_recibir_anticipos: null
    }),
    info: this.fb.group({
      cantidad_nominada: [null, Validators.required],
      comentarios: null,
    }),
  });
  
  get combinacion(): FormGroup {
    return this.form.get('combinacion') as FormGroup;
  }

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  @Input() isShow = false;
  @Input() modoVer = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private ordenCargaService: OrdenCargaService
  ) {}

  back(confirmed: boolean): void {
    if (confirmed) {
      this.save(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  save(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
  
    if (this.form.valid) {
      const data: OCConfirmationDialogData = {
        oc: getOCData(this.form, this.flete, this.camion, this.semi, this.form.get('combinacion')?.get('neto')?.value),
        
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
      // Lógica para guardar el formulario
      this.isFormSaved = true;
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
    console.log('data', data)
    this.ordenCargaService.create(formData).subscribe((item) => {
      this.snackbar.openSave();
      // this.snackbar.openSaveAndRedirect(
      //   confirmed,
      //   this.backUrl,
      //   r.ORDEN_CARGA,
      //   m.ORDEN_CARGA,
      //   item.id
      // );
    });
    this.form.disable();
  }
}
