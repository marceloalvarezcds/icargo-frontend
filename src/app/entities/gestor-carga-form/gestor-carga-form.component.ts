import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { User } from 'src/app/interfaces/user';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { UserService } from 'src/app/services/user.service';
import { openSnackbar } from 'src/app/utils/snackbar';

@Component({
  selector: 'app-gestor-carga-form',
  templateUrl: './gestor-carga-form.component.html',
  styleUrls: ['./gestor-carga-form.component.scss']
})
export class GestorCargaFormComponent implements OnInit, OnDestroy {

  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isGeoTouched = false;
  backUrl = '/entities/gestor-carga/list';
  composicionJuridicaList$ = this.composicionJuridicaService.getList();
  tipoDocumentoList$ = this.tipoDocumentoService.getList();
  monedaList$ = this.monedaService.getList();
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });

  file: File | null = null;
  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: [null, Validators.required],
      tipo_documento_id: [null, Validators.required],
      numero_documento: [null, Validators.required],
      digito_verificador: null,
      composicion_juridica_id: [null, Validators.required],
      moneda_id: [null, Validators.required],
      logo: [null, Validators.required],
      telefono: [null, [Validators.required, Validators.pattern(/^([+]595|0)([0-9]{9})$/g)]],
      email: null,
      pagina_web: null,
      info_complementaria: null,
    }),
    geo: this.fb.group({
      pais_id: [null, Validators.required],
      localidad_id: [null, Validators.required],
      ciudad_id: [null, Validators.required],
      latitud: [null, Validators.required],
      longitud: [null, Validators.required],
      direccion: [null, Validators.required],
    }),
  });

  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe(value => {
    this.hasChange = Object.keys(this.initialFormValue).some(key => value[key] != this.initialFormValue[key])
  });

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get geo(): FormGroup {
    return this.form.get('geo') as FormGroup;
  }

  get fileControl(): FormControl {
    return this.info.get('logo') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private composicionJuridicaService: ComposicionJuridicaService,
    private tipoDocumentoService: TipoDocumentoService,
    private monedaService: MonedaService,
    private remitenteService: GestorCargaService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  redirectToEdit(): void {
    this.router.navigate(['/entities/gestor-carga/edit', this.id]);
  }

  fileChange(fileEvent: FileChangeEvent): void {
    this.logo = null;
    this.file = fileEvent.target!.files!.item(0);
    this.fileControl.setValue(this.file?.name);
  }

  submit(confirmed: boolean): void {
    this.isInfoTouched = false;
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify({
        ...this.info.value,
        ...this.geo.value,
      }));
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.file) { formData.append('file', this.file); }
      if (this.isEdit && this.id) {
        this.remitenteService.edit(this.id, formData).subscribe(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          openSnackbar(this.snackbar, confirmed, this.router, this.backUrl);
        });
      } else {
        this.remitenteService.create(formData).subscribe((remitente) => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
          this.snackbar
            .open('Datos guardados satisfactoriamente', 'Ok')
            .afterDismissed()
            .subscribe(() => {
              if (confirmed) {
                this.router.navigate([this.backUrl]);
              } else {
                this.router.navigate(['/entities/gestor-carga/edit', remitente.id]);
              }
            });
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isGeoTouched = this.geo.invalid;
      });
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
      this.remitenteService.getById(this.id).subscribe(data => {
        this.form.setValue({
          info: {
            nombre: data.nombre,
            nombre_corto: data.nombre_corto,
            tipo_documento_id: data.tipo_documento_id,
            numero_documento: data.numero_documento,
            digito_verificador: data.digito_verificador,
            composicion_juridica_id: data.composicion_juridica_id,
            moneda_id: data.moneda_id,
            telefono: data.telefono,
            email: data.email,
            pagina_web: data.pagina_web,
            info_complementaria: data.info_complementaria,
            logo: null,
          },
          geo: {
            pais_id: data.ciudad.localidad.pais_id,
            localidad_id: data.ciudad.localidad_id,
            ciudad_id: data.ciudad_id,
            latitud: data.latitud,
            longitud: data.longitud,
            direccion: data.direccion,
          },
        });
        this.logo = data.logo!;
        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
