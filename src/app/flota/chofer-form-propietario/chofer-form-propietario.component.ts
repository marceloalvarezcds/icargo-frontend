import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chofer-form-propietario',
  templateUrl: './chofer-form-propietario.component.html',
  styleUrls: ['./chofer-form-propietario.component.scss']
})
export class ChoferFormPropietarioComponent {

  groupName = 'propietario';

  @Input() form = new FormGroup({
    propietario: new FormGroup({
      pais_origen_id: new FormControl(null),
      foto_documento_frente_propietario: new FormControl(null),
      foto_documento_reverso_propietario: new FormControl(null),
    }),
  });
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;

  @Output() fotoDocumentoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoDocumentoReversoChange = new EventEmitter<File | null>();
}
