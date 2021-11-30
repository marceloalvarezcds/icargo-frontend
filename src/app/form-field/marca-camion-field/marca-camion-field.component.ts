import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MarcaCamionService } from 'src/app/services/marca-camion.service';

@Component({
  selector: 'app-marca-camion-field',
  templateUrl: './marca-camion-field.component.html',
  styleUrls: ['./marca-camion-field.component.scss']
})
export class MarcaCamionFieldComponent {

  list$ = this.marcaCamionService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'marca_camion_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Marca de Camión';

  constructor(private marcaCamionService: MarcaCamionService) { }
}
