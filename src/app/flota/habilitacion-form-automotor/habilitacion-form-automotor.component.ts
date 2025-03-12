import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-habilitacion-form-automotor',
  templateUrl: './habilitacion-form-automotor.component.html',
  styleUrls: ['./habilitacion-form-automotor.component.scss']
})
export class HabilitacionFormAutomotorComponent {

  groupName = 'automotor';
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
