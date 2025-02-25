import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Camion } from 'src/app/interfaces/camion';

@Component({
  selector: 'app-camion-form-limite',
  templateUrl: './camion-form-limite.component.html',
  styleUrls: ['./camion-form-limite.component.scss'],
})
export class CamionFormLimiteComponent {
  groupName = 'limite';
  isVisible = true;

  @Input() camion?: Camion;
  @Input() form?: FormGroup;
  @Input() isShow = false;

  patternMessageError(_: any): string {
    return 'Debe ser un número entero y positivo';
  }

  toggleControl = new FormControl(true);
  toggleFieldVisibility(isChecked: boolean) {
    this.isVisible = isChecked;
  }
}
