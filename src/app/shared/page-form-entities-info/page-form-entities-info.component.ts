import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileChangeEvent } from 'src/app/interfaces/file-change-event';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento';
import { User } from 'src/app/interfaces/user';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { isRuc } from 'src/app/utils/tipo-documento';

@Component({
  selector: 'app-page-form-entities-info',
  templateUrl: './page-form-entities-info.component.html',
  styleUrls: ['./page-form-entities-info.component.scss']
})
export class PageFormEntitiesInfoComponent implements OnDestroy {

  file: File | null = null;

  composicionJuridicaList$ = this.composicionJuridicaService.getList();
  tipoDocumentoList: TipoDocumento[] = [];
  tipoDocumentoSubscription = this.tipoDocumentoService.getList().subscribe(list => {
    this.tipoDocumentoList = list.slice();
  });

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get fileControl(): FormControl {
    return this.info.get('logo') as FormControl;
  }

  get isRucSelected(): boolean {
    return isRuc(this.tipoDocumentoList, this.info.controls['tipo_documento_id'].value);
  }

  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      nombre_corto: new FormControl(null),
      tipo_documento_id: new FormControl(null),
      numero_documento: new FormControl(null),
      digito_verificador: new FormControl(null),
      composicion_juridica_id: new FormControl(null),
      alias: new FormControl(null),
      logo: new FormControl(null),
      telefono: new FormControl(null),
      email: new FormControl(null),
      pagina_web: new FormControl(null),
      info_complementaria: new FormControl(null),
    }),
  });
  @Input() isShow = false;
  @Input() logo: string | null = null;
  @Input() user?: User;

  constructor(
    private composicionJuridicaService: ComposicionJuridicaService,
    private tipoDocumentoService: TipoDocumentoService,
  ) { }

  ngOnDestroy(): void {
    this.tipoDocumentoSubscription.unsubscribe();
  }

  fileChange(fileEvent: FileChangeEvent): void {
    this.logo = null;
    this.file = fileEvent.target!.files!.item(0);
    this.fileControl.setValue(this.file?.name);
  }
}
