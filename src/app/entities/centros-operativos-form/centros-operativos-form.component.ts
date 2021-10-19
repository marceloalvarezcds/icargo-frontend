import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { Localidad } from 'src/app/interfaces/localidad';
import { CentroOperativoClasificacionService } from 'src/app/services/centro-operativo-clasificacion.service';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { PaisService } from 'src/app/services/pais.service';
import { openSnackbar } from 'src/app/utils/snackbar';

@Component({
  selector: 'app-centros-operativos-form',
  templateUrl: './centros-operativos-form.component.html',
  styleUrls: ['./centros-operativos-form.component.scss']
})
export class CentrosOperativosFormComponent implements OnInit {

  id?: number;
  isEdit = false;
  isShow = false;
  backUrl = '/entities/centros-operativos/list';
  centroOperativoClasificacionList$ = this.centroOperativoClasificacionService.getList();

  paisList$ = this.paisService.getList();
  localidadList: Localidad[] = [];
  ciudadList: Ciudad[] = [];
  contactoList: CentroOperativoContactoGestorCargaList[] = [];

  file: File | null = null;
  logo: string | null = null;

  form = this.fb.group({
    nombre: [null, Validators.required],
    nombre_corto: [null, Validators.required],
    clasificacion_id: [null, Validators.required],
    alias: null,
    logo: [null, Validators.required],
    contactos: this.fb.array([]),
    pais_id: [null, Validators.required],
    localidad_id: [null, Validators.required],
    ciudad_id: [null, Validators.required],
    latitud: [-25.658948139894708, Validators.required],
    longitud: [-54.717514329980474, Validators.required],
    direccion: [null, Validators.required],
  });

  paisSubscription = this.paisControl.valueChanges.pipe(filter(v => !!v)).subscribe(paisId => {
    this.localidadService.getList(paisId).subscribe(list => {
      this.localidadList = list;
    });
  });

  localidadSubscription = this.localidadControl.valueChanges.pipe(filter(v => !!v)).subscribe(localidadId => {
    this.ciudadService.getList(localidadId).subscribe(list => {
      this.ciudadList = list;
    });
  });

  get fileControl(): FormControl {
    return this.form.get('logo') as FormControl;
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
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  fileChange(fileEvent: FileChangeEvent): void {
    this.logo = null;
    this.file = fileEvent.target!.files!.item(0);
    this.fileControl.setValue(this.file?.name);
  }

  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify(this.form.value));
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.file) { formData.append('file', this.file); }
      if (this.isEdit && this.id) {
        this.centroOperativoService.edit(this.id, formData).subscribe(() => {
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.centroOperativoService.create(formData).subscribe(() => {
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      }
    }
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /show/.test(this.router.url);
      if (this.isEdit) {
        this.fileControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.centroOperativoService.getById(this.id).subscribe(data => {
        this.form.setValue({
          alias: 'Alias', // Cambiar cuando haya roles
          nombre: data.nombre,
          nombre_corto: data.nombre_corto,
          clasificacion_id: data.clasificacion_id,
          pais_id: data.ciudad.localidad.pais_id,
          localidad_id: data.ciudad.localidad_id,
          ciudad_id: data.ciudad_id,
          latitud: data.latitud,
          longitud: data.longitud,
          direccion: data.direccion,
          logo: null,
          contactos: [],
        });
        this.contactoList = data.contactos.slice();
        this.logo = data.logo!;
      });
    }
  }
}
