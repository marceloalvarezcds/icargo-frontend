import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';

@Component({
  selector: 'app-propietario-form-info',
  templateUrl: './propietario-form-info.component.html',
  styleUrls: ['./propietario-form-info.component.scss']
})
export class PropietarioFormInfoComponent {

  a = PermisoAccionEnum;
  fotoDocumentoFile: File | null = null;
  fotoPerfilFile: File | null = null;
  isFisicaSelected = false;

  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      tipo_persona_id: new FormControl(null),
      ruc: new FormControl(null),
      digito_verificador: new FormControl(null),
      pais_origen_id: new FormControl(null),
      fecha_nacimiento: new FormControl(null),
      oficial_cuenta_id: new FormControl(null),
      alias: new FormControl(null),
      foto_documento_frente: new FormControl(null),
      foto_documento_reverso: new FormControl(null),
      foto_perfil: new FormControl(null),
      es_chofer: new FormControl(false),
      telefono: new FormControl(null),
      email: new FormControl(null),
    }),
  });
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;
  @Input() fotoPerfil: string | null = null;
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCuentaId?: number;

  @Output() fotoDocumentoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoDocumentoReversoChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChange = new EventEmitter<File | null>();

  get info(): FormGroup {
    return this.form.get('info') as FormGroup;
  }

  get esChoferControl(): FormControl {
    return this.info.controls['es_chofer'] as FormControl;
  }

  get esChofer(): boolean {
    return !!this.esChoferControl.value;
  }

  isFisicaChange(isFisica: boolean): void {
    this.isFisicaSelected = isFisica;
    if (!isFisica) {
      this.esChoferControl.setValue(isFisica);
    }
  }
}
