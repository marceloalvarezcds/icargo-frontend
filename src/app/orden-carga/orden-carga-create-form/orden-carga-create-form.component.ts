import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';

@Component({
  selector: 'app-orden-carga-create-form',
  templateUrl: './orden-carga-create-form.component.html',
  styleUrls: ['./orden-carga-create-form.component.scss']
})
export class OrdenCargaCreateFormComponent {

  flete?: FleteList;
  backUrl = `/orden-carga/${m.ORDEN_CARGA}/${a.LISTAR}`;
  modelo = m.ORDEN_CARGA;

  form = this.fb.group({
    combinacion: this.fb.group({
      flete_id: [null, Validators.required],
      camion_id: [null, Validators.required],
      semi_id: [null, Validators.required],
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
    private snackbar: MatSnackBar,
    private ordenCargaService: OrdenCargaService,
  ) { }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify({
        ...this.combinacion.value,
        ...this.info.value,
      }));
      formData.append('data', JSON.stringify(data));
      this.ordenCargaService.create(formData).subscribe((item) => {
        this.snackbar
          .open('Datos guardados satisfactoriamente', 'Ok')
          .afterDismissed()
          .subscribe(() => {
            if (confirmed) {
              this.router.navigate([this.backUrl]);
            } else {
              this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.EDITAR}`, item.id]);
            }
          });
      });
    }
  }
}
