import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { isRuc } from 'src/app/utils/tipo-documento';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-gestor-carga-form',
  templateUrl: './gestor-carga-form.component.html',
  styleUrls: ['./gestor-carga-form.component.scss'],
})
export class GestorCargaFormComponent implements OnInit, OnDestroy {
  id?: number;
  isEdit = false;
  isShow = false;
  isPanelOpen = false;
  isInfoTouched = true;
  isGeoTouched = false;
  backUrl = `/entities/${m.GESTOR_CARGA}/${a.LISTAR}`;
  composicionJuridicaList$ = this.composicionJuridicaService.getList();
  tipoDocumentoList: TipoDocumento[] = [];
  tipoDocumentoSubscription = this.tipoDocumentoService
    .getList()
    .subscribe((list) => {
      this.tipoDocumentoList = list.slice();
    });
  monedaList$ = this.monedaService.getList();
  modelo = m.GESTOR_CARGA;
  ciudadSelected?: Ciudad | null;

  file: File | null = null;
  logo: string | null = null;

  form = this.fb.group({
    info: this.fb.group({
      nombre: [null, Validators.required],
      nombre_corto: null,
      tipo_documento_id: [null, Validators.required],
      numero_documento: [null, Validators.required],
      digito_verificador: [null, Validators.min(0)],
      composicion_juridica_id: null,
      moneda_id: [null, Validators.required],
      logo: null,
      telefono: [null, Validators.pattern('^([+]595|0)([0-9]{9})$')],
      email: [null, emailValidator],
      pagina_web: null,
      info_complementaria: null,
      limite_cantidad_oc_activas: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]{1,}$'),
        ],
      ],
    }),
    geo: this.fb.group({
      ciudad_id: null,
      latitud: null,
      longitud: null,
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

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get geo(): FormGroup {
    return this.form.get('geo') as FormGroup;
  }

  get fileControl(): FormControl {
    return this.info.get('logo') as FormControl;
  }

  get isRucSelected(): boolean {
    return isRuc(
      this.tipoDocumentoList,
      this.info.controls['tipo_documento_id'].value
    );
  }

  constructor(
    private fb: FormBuilder,
    private composicionJuridicaService: ComposicionJuridicaService,
    private tipoDocumentoService: TipoDocumentoService,
    private monedaService: MonedaService,
    private remitenteService: GestorCargaService,
    private snackbar: SnackbarService,
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
    this.router.navigate([`/entities/${m.GESTOR_CARGA}/${a.EDITAR}`, this.id]);
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
      const data = JSON.parse(
        JSON.stringify({
          ...this.info.value,
          ...this.geo.value,
        })
      );
      delete data.logo;
      delete data.pais_id;
      delete data.localidad_id;
      formData.append('data', JSON.stringify(data));
      if (this.file) {
        formData.append('file', this.file);
      }
      this.hasChange = false;
      this.initialFormValue = this.form.value;
      if (this.isEdit && this.id) {
        this.remitenteService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.remitenteService.create(formData).subscribe((remitente) => {
          this.snackbar.openSaveAndRedirect(confirmed, this.backUrl, [
            `/entities/${m.GESTOR_CARGA}/${a.EDITAR}`,
            remitente.id,
          ]);
        });
      }
    } else {
      setTimeout(() => {
        this.isInfoTouched = this.info.invalid;
        this.isGeoTouched = this.geo.invalid;
      });
    }
  }

  patternMessageError(_: any): string {
    return 'Debe ser un número entero y positivo';
  }

  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isEdit) {
        this.fileControl.removeValidators(Validators.required);
      }
      if (this.isShow) {
        this.form.disable();
      }
      this.remitenteService.getById(this.id).subscribe((data) => {
        this.ciudadSelected = data.ciudad;
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
            limite_cantidad_oc_activas: data.limite_cantidad_oc_activas,
            logo: null,
          },
          geo: {
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
