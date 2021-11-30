import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EnteEmisorTransporteService } from 'src/app/services/ente-emisor-transporte.service';

@Component({
  selector: 'app-ente-emisor-transporte-field',
  templateUrl: './ente-emisor-transporte-field.component.html',
  styleUrls: ['./ente-emisor-transporte-field.component.scss']
})
export class EnteEmisorTransporteFieldComponent {

  list$ = this.enteEmisorTransporteService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'ente_emisor_transporte_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Ente Emisor para Transportar';

  constructor(private enteEmisorTransporteService: EnteEmisorTransporteService) { }
}
