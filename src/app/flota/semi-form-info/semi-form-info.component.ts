import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-semi-form-info',
  templateUrl: './semi-form-info.component.html',
  styleUrls: ['./semi-form-info.component.scss']
})
export class SemiFormInfoComponent {

  groupName = 'info';
  fotoFile: File | null = null;

  @Input() form?: FormGroup;
  @Input() isEdit = false;
  @Input() isShow = false;
  @Input() foto: string | null = null;

  @Output() fotoChange = new EventEmitter<File | null>();
}
