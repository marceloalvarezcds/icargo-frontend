import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registro-conduccion-form',
  templateUrl: './registro-conduccion-form.component.html',
  styleUrls: ['./registro-conduccion-form.component.scss']
})
export class RegistroConduccionFormComponent {

  fotoRegistroFile: File | null = null;
  localidadId?: number;
  paisId?: number;

  @Input() form?: FormGroup;
  @Input() fotoRegistroFrente: string | null = null;
  @Input() fotoRegistroReverso: string | null = null;
  @Input() isEdit = false;
  @Input() isShow = false;

  @Output() fotoRegistroFrenteChange = new EventEmitter<File | null>();
  @Output() fotoRegistroReversoChange = new EventEmitter<File | null>();
}
