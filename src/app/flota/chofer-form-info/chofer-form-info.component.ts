import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';

@Component({
  selector: 'app-chofer-form-info',
  templateUrl: './chofer-form-info.component.html',
  styleUrls: ['./chofer-form-info.component.scss'],
})
export class ChoferFormInfoComponent {
  groupName = 'info';
  a = PermisoAccionEnum;
  fotoDocumentoFile: File | null = null;
  fotoPerfilFile: File | null = null;

  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;
  @Input() fotoPerfil: string | null = null;
  @Input() modelo?: PermisoModeloEnum;
  @Input() gestorCuentaId?: number;
  @Input() cantidadOCConAnticiposLiberados = 0;

  @Output() esPropietarioChange = new EventEmitter<boolean>();
  @Output() fotoDocumentoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoDocumentoReversoChange = new EventEmitter<File | null>();
  @Output() fotoPerfilChange = new EventEmitter<File | null>();
  @Output() anticiposBloqueadosChange = new EventEmitter();

  get info(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get esPropietarioControl(): FormControl {
    return this.info.controls['es_propietario'] as FormControl;
  }

  get puedeRecibirAnticiposControl(): FormControl {
    return this.info.controls['puede_recibir_anticipos'] as FormControl;
  }
}
