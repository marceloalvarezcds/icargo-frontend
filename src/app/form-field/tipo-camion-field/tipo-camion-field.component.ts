import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoCamionService } from 'src/app/services/tipo-camion.service';

@Component({
  selector: 'app-tipo-camion-field',
  templateUrl: './tipo-camion-field.component.html',
  styleUrls: ['./tipo-camion-field.component.scss']
})
export class TipoCamionFieldComponent {

  list$ = this.tipoCamionService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_camion_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Camion';

  constructor(private tipoCamionService: TipoCamionService) { }
}
