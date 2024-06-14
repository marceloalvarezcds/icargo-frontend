import { Component } from '@angular/core';
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
import { CamionList } from 'src/app/interfaces/camion';
import { FleteList } from 'src/app/interfaces/flete';
import { OCConfirmationDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { SemiList } from 'src/app/interfaces/semi';
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
  camion?: CamionList;
  semi?: SemiList;
  neto?: string;

  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      semi_id: [null, Validators.required],
      semi_details: null,
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
        oc: getOCData(this.form, this.flete, this.camion, this.semi, this.neto),
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
      this.snackbar.openSaveAndRedirect(
        confirmed,
        this.backUrl,
        r.ORDEN_CARGA,
        m.ORDEN_CARGA,
        item.id
      );
    });
  }
}
