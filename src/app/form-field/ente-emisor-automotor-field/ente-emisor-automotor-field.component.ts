import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EnteEmisorAutomotorService } from 'src/app/services/ente-emisor-automotor.service';

@Component({
  selector: 'app-ente-emisor-automotor-field',
  templateUrl: './ente-emisor-automotor-field.component.html',
  styleUrls: ['./ente-emisor-automotor-field.component.scss']
})
export class EnteEmisorAutomotorFieldComponent {

  list$ = this.enteEmisorAutomotorService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'ente_emisor_automotor_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Ente Emisor del Registro de Automotores';

  constructor(private enteEmisorAutomotorService: EnteEmisorAutomotorService) { }
}
