import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';

@Component({
  selector: 'app-propietario-field',
  templateUrl: './propietario-field.component.html',
  styleUrls: ['./propietario-field.component.scss']
})
export class PropietarioFieldComponent implements OnInit {

  id?: number;
  list: PropietarioList[] = [];
  propietario?: PropietarioList;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set propietarioId(id: number | undefined) {
    if (id) {
      this.id = id;
      this.control.setValue(id);
      this.getList();
    }
  }
  @Input() controlName = 'propietario_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Propietario';

  constructor(private propietarioService: PropietarioService) { }

  ngOnInit(): void {
    this.getList();
  }

  private getList(): void {
    this.propietarioService.getListByGestorCuenta().subscribe(list => {
      this.list = list;
      this.propietario = this.list.find(p => p.id === this.id);
    });
  }
}
