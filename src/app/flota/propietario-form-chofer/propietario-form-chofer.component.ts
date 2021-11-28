import { Component,  EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-propietario-form-chofer',
  templateUrl: './propietario-form-chofer.component.html',
  styleUrls: ['./propietario-form-chofer.component.scss']
})
export class PropietarioFormChoferComponent {

  @Input() form = new FormGroup({
    chofer: new FormGroup({
      tipo_documento_id: new FormControl(null),
      pais_emisor_documento_id: new FormControl(null),
      numero_documento: new FormControl(null),
      foto_documento_frente_chofer: new FormControl(null),
      foto_documento_reverso_chofer: new FormControl(null),
    }),
  });
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() fotoDocumentoFrente: string | null = null;
  @Input() fotoDocumentoReverso: string | null = null;

  @Output() fotoDocumentoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoDocumentoReversoChange = new EventEmitter<File | null>();
}
