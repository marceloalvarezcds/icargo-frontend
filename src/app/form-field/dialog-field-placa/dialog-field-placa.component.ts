import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-field-placa',
  templateUrl: './dialog-field-placa.component.html',
  styleUrls: ['./dialog-field-placa.component.scss']
})
export class DialogFieldPlacaComponent  {
  @Input() controlName = '';
  @Input() form!: FormGroup;
  @Input() title = '';
}
