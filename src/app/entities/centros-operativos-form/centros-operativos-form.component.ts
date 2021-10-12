import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { Localidad } from 'src/app/interfaces/localidad';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-centros-operativos-form',
  templateUrl: './centros-operativos-form.component.html',
  styleUrls: ['./centros-operativos-form.component.scss']
})
export class CentrosOperativosFormComponent {

  backUrl = '/entities/centros-operativos/list';
  centroOperativoClasificacionList$ = this.centroOperativoClasificacionService.getList();

  paisList$ = this.paisService.getList();
  localidadList: Localidad[] = [];
  ciudadList: Ciudad[] = [];

  file: File | null = null;

  form = this.fb.group({
    nombre: [null, Validators.required],
    nombre_corto: [null, Validators.required],
    clasificacion_id: [null, Validators.required],
    alias: [null, Validators.required],
    logo: [null, Validators.required],
    contactos: this.fb.array([]),
    pais_id: [null, Validators.required],
    localidad_id: [null, Validators.required],
    ciudad_id: [null, Validators.required],
    latitud: [null, Validators.required],
    longitud: [null, Validators.required],
    direccion: [null, Validators.required],
  });

  paisSubscription = this.paisControl.valueChanges.subscribe(paisId => {
    this.localidadService.getList(paisId).subscribe(list => {
      this.localidadList = list;
    });
  });

  localidadSubscription = this.localidadControl.valueChanges.subscribe(localidadId => {
    this.ciudadService.getList(localidadId).subscribe(list => {
      this.ciudadList = list;
    });
  });

  get fileControl(): FormControl {
    return this.form.get('logo') as FormControl;
  }

  get contactoArray(): FormArray {
    return this.form.get('contactoArray') as FormArray;
  }

  get localidadControl(): FormControl {
    return this.form.get('localidad_id') as FormControl;
  }

  get paisControl(): FormControl {
    return this.form.get('pais_id') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private centroOperativoClasificacionService:  CentroOperativoClasificacionService,
    private centroOperativoService:  CentroOperativoService,
    private ciudadService: CiudadService,
    private localidadService: LocalidadService,
    private paisService: PaisService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) { }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  fileChange(fileEvent: FileChangeEvent): void {
    this.file = fileEvent.target!.files!.item(0);
  }

  submit(confirmed: boolean): void {
    const formData = new FormData();
    const data = {
      nombre: this.form.controls['nombre'].value,
      nombre_corto: this.form.controls['nombre_corto'].value,
      clasificacion_id: this.form.controls['clasificacion_id'].value,
      alias: this.form.controls['alias'].value,
      direccion: this.form.controls['direccion'].value,
      ciudad_id: this.form.controls['ciudad_id'].value,
    }
    formData.append('data', JSON.stringify(data));
    if (this.file) { formData.append('file', this.file); }
    this.centroOperativoService.create(formData).subscribe(() => {
      this.snackbar
        .open('Centro Operativo creado satisfactoriamente', 'Ok')
        .afterDismissed()
        .pipe(filter(() => confirmed))
        .subscribe(() => {
          this.router.navigate([this.backUrl]);
        });
    });
  }
}
