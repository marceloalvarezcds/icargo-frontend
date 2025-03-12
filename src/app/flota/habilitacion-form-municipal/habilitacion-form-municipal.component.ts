import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-habilitacion-form-municipal',
  templateUrl: './habilitacion-form-municipal.component.html',
  styleUrls: ['./habilitacion-form-municipal.component.scss']
})
export class HabilitacionFormMunicipalComponent {

  groupName = 'municipal';
  fotoFrenteFile: File | null = null;
  fotoReversoFile: File | null = null;
  localidadId?: number;
  paisId?: number;

  @Input() form?: FormGroup;
  @Input() fotoFrente: string | null = null;
  @Input() fotoReverso: string | null = null;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() esDialog: boolean = false;


  @Output() fotoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoReversoChange = new EventEmitter<File | null>();
}
