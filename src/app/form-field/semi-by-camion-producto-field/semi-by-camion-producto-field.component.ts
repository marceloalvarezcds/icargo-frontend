import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-semi-by-camion-producto-field',
  templateUrl: './semi-by-camion-producto-field.component.html',
  styleUrls: ['./semi-by-camion-producto-field.component.scss']
})
export class SemiByCamionProductoFieldComponent {

  cId?: number;
  pId?: number;
  list: SemiList[] = [];

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }
  @Input() form?: FormGroup;
  @Input() controlName = 'semi_id';
  @Input() groupName = '';
  @Input() title = 'Semi-remolque';

  constructor(private semiService: SemiService) { }

  private getList(): void {
    if (this.cId && this.pId) {
      this.semiService.getListByCamionIdAndProductoId(this.cId, this.pId).subscribe(list => {
        this.list = list;
      });
    }
  }
}
