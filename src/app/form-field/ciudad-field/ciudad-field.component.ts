import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { CiudadService } from 'src/app/services/ciudad.service';

@Component({
  selector: 'app-ciudad-field',
  templateUrl: './ciudad-field.component.html',
  styleUrls: ['./ciudad-field.component.scss']
})
export class CiudadFieldComponent {

  ciudadList: Ciudad[] = [];
  lId?: number;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set localidadId(id: number | undefined) {
    this.lId = id;
    if (id) {
      this.ciudadService.getList(id).subscribe(list => {
        this.ciudadList = list;
      });
    }
  }
  @Input() form?: FormGroup;
  @Input() controlName = 'ciudad';
  @Input() groupName = '';
  @Input() title = 'Ciudad';

  constructor(private ciudadService: CiudadService) { }
}
