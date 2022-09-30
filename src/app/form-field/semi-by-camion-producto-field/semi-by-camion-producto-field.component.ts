import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-semi-by-camion-producto-field',
  templateUrl: './semi-by-camion-producto-field.component.html',
  styleUrls: ['./semi-by-camion-producto-field.component.scss'],
})
export class SemiByCamionProductoFieldComponent implements OnDestroy {
  cId?: number;
  pId?: number;
  list: SemiList[] = [];
  formGroup?: FormGroup;
  subscription?: Subscription;

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
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
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.subscription = this.control.valueChanges
      .pipe(filter((v) => !!v))
      .subscribe((id) => {
        this.setValueChange(id);
      });
  }
  @Input() controlName = 'semi_id';
  @Input() groupName = '';
  @Input() title = 'Semi-remolque';

  @Output() valueChange = new EventEmitter<SemiList | undefined>();

  constructor(private semiService: SemiService) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getItemById(id: string | number | undefined): SemiList | undefined {
    return this.list.find((x) => x.id === id);
  }

  private getList(): void {
    if (this.cId && this.pId) {
      this.semiService
        .getListByCamionIdAndProductoId(this.cId, this.pId)
        .subscribe((list) => {
          this.list = list;
        });
    }
  }

  private setValueChange(id: number | undefined): void {
    const value = this.getItemById(id);
    this.valueChange.emit(value);
  }
}
