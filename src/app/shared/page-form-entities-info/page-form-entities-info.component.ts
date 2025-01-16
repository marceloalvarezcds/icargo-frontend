import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento';
import { User } from 'src/app/interfaces/user';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { isRuc } from 'src/app/utils/tipo-documento';

@Component({
  selector: 'app-page-form-entities-info',
  templateUrl: './page-form-entities-info.component.html',
  styleUrls: ['./page-form-entities-info.component.scss'],
})
export class PageFormEntitiesInfoComponent implements OnDestroy, AfterViewInit  {
  a = PermisoAccionEnum;
  file: File | null = null;

  composicionJuridicaList$ = this.composicionJuridicaService.getList();
  tipoDocumentoList: TipoDocumento[] = [];
  tipoDocumentoSubscription = this.tipoDocumentoService
    .getList()
    .subscribe((list) => {
      this.tipoDocumentoList = list.slice();
    });

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get isRucSelected(): boolean {
    return isRuc(
      this.tipoDocumentoList,
      this.info.controls['tipo_documento_id'].value
    );
  }

  get estadoControl(): FormControl {
    return this.info?.controls['estado'] as FormControl;
  }

  get estadoControlValue(): Boolean {
    return this.info?.controls['estado'].value;
  }

  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      nombre_corto: new FormControl(null),
      estado: new FormControl(true),
      tipo_documento_id: new FormControl(null),
      numero_documento: new FormControl(null),
      // digito_verificador: new FormControl(null),
      composicion_juridica_id: new FormControl(null),
      alias: new FormControl(null),
      logo: new FormControl(null),
      telefono: new FormControl(null),
      email: new FormControl(null),
      pagina_web: new FormControl(null),
      info_complementaria: new FormControl(null),
    }),
  });
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() logo: string | null = null;
  @Input() user?: User;
  @Input() modelo?: PermisoModeloEnum;

  constructor(
    private composicionJuridicaService: ComposicionJuridicaService,
    private tipoDocumentoService: TipoDocumentoService
  ) {}

  ngOnDestroy(): void {
    this.tipoDocumentoSubscription.unsubscribe();
  }

  fileChange(file: File | null): void {
    this.logo = null;
    this.file = file;
  }

  ngAfterViewInit() {
    // Selecciona todos los elementos con la clase 'view-mode'
    const viewModeElements = document.querySelectorAll('.view-mode');

    viewModeElements.forEach(element => {
      // Agrega un evento de enfoque que elimine el enfoque del elemento
      element.addEventListener('focus', function (event) {
        if (element.classList.contains('view-mode')) {
          (event.target as HTMLElement).blur(); // Elimina el enfoque del elemento
        }
      });
    });
  }


}
