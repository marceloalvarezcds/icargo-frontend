import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChoferList } from 'src/app/interfaces/chofer';
import { ChoferService } from 'src/app/services/chofer.service';

@Component({
  selector: 'app-chofer-field',
  templateUrl: './chofer-field.component.html',
  styleUrls: ['./chofer-field.component.scss'],
})
export class ChoferFieldComponent {
  list$?: Observable<ChoferList[]>;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set camionId(id: number | undefined) {
    this.list$ = id
      ? this.service.getListByWithoutCamionByCamionId(id)
      : this.service.getListByWithoutCamion();
  }
  @Input() controlName = 'chofer_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Chofer';

  constructor(private service: ChoferService) {}
}
