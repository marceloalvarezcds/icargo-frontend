import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-camion-form-info',
  templateUrl: './camion-form-info.component.html',
  styleUrls: ['./camion-form-info.component.scss']
})
export class CamionFormInfoComponent {

  groupName = 'info';
  fotoFile: File | null = null;

  @Input() propietarioId?: number;
  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() foto: string | null = null;

  @Output() fotoChange = new EventEmitter<File | null>();
}
