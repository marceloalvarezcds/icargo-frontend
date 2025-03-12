import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-habilitacion-form-transporte',
  templateUrl: './habilitacion-form-transporte.component.html',
  styleUrls: ['./habilitacion-form-transporte.component.scss']
})
export class HabilitacionFormTransporteComponent {

  groupName = 'transporte';
  fotoFrenteFile: File | null = null;
  fotoReversoFile: File | null = null;

  @Input() form?: FormGroup;
  @Input() fotoFrente: string | null = null;
  @Input() fotoReverso: string | null = null;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() esDialog: boolean = false; 

  @Output() fotoFrenteChange = new EventEmitter<File | null>();
  @Output() fotoReversoChange = new EventEmitter<File | null>();
}
