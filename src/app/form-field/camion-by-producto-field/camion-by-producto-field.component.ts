import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CamionList } from 'src/app/interfaces/camion';
import { CamionService } from 'src/app/services/camion.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-camion-by-producto-field',
  templateUrl: './camion-by-producto-field.component.html',
  styleUrls: ['./camion-by-producto-field.component.scss'],
})
export class CamionByProductoFieldComponent {
  pId?: number;
  list$?: Observable<CamionList[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'camion_id';
  @Input() groupName?: string;
  @Input() title = 'Camión';
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }
  @Input() value: (v: CamionList) => number | string | CamionList = (
    v: CamionList
  ) => v.id;

  @Output() valueChange = new EventEmitter<CamionList>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<CamionList>;

  constructor(private service: CamionService) {}

  textValueFormat(value: CamionList): string {
    return `${value.placa} - ${value.propietario_nombre}`;
  }

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getListByProductoId(this.pId);
    }
  }
}
