import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { RolChecked } from 'src/app/interfaces/rol';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-rol-field',
  templateUrl: './rol-field.component.html',
  styleUrls: ['./rol-field.component.scss'],
})
export class RolFieldComponent {
  list$ = this.service.getActiveList();

  @Input() control!: AbstractControl;
  @Input() title = 'Roles';

  @Output() valueChange = new EventEmitter<RolChecked[]>();

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  constructor(private service: RolService) {}
}
