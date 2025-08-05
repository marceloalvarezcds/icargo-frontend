import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { EnteEmisorTransporteService } from 'src/app/services/ente-emisor-transporte.service';

@Component({
  selector: 'app-ente-emisor-transporte-field',
  templateUrl: './ente-emisor-transporte-field.component.html',
  styleUrls: ['./ente-emisor-transporte-field.component.scss']
})
export class EnteEmisorTransporteFieldComponent implements OnInit {

  list$ = this.enteEmisorTransporteService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  ngOnInit(): void {
  this.list$.pipe(take(1)).subscribe(list => {
    if (list.length === 1 && !this.control.value) {
      this.control.setValue(list[0].id);
      }
    });
  }


  @Input() controlName = 'ente_emisor_transporte_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Ente Emisor para Transportar';

  constructor(private enteEmisorTransporteService: EnteEmisorTransporteService) { }
}
