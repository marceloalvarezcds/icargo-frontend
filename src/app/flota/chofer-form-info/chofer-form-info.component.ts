import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';

@Component({
  selector: 'app-chofer-form-info',
  templateUrl: './chofer-form-info.component.html',
  styleUrls: ['./chofer-form-info.component.scss']
})
export class ChoferFormInfoComponent {

  groupName = 'info';
  a = PermisoAccionEnum;
  fotoDocumentoFile: File | null = null;
  fotoPerfilFile: File | null = null;

  @Input() form = new FormGroup({
    info: new FormGroup({
      nombre: new FormControl(null),
      tipo_documento_id: new FormControl(null),
      pais_emisor_documento_id: new FormControl(null),
      numero_documento: new FormControl(null),
      ruc: new FormControl(null),
      digito_verificador: new FormControl(null),
      pais_origen_id: new FormControl(null),
      fecha_nacimiento: new FormControl(null),
      oficial_cuenta_id: new FormControl(null),
      alias: new FormControl(null),
      foto_documento_frente: new FormControl(null),
      foto_documento_reverso: new FormControl(null),
      foto_perfil: new FormControl(null),
      es_propietario: new FormControl(false),
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

  get esPropietarioControl(): FormControl {
    return this.info.controls['es_propietario'] as FormControl;
  }

  get esPropietario(): boolean {
    return !!this.esPropietarioControl.value;
  }
}
