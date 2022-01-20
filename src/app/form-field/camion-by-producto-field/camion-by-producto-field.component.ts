import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CamionList } from 'src/app/interfaces/camion';
import { CamionService } from 'src/app/services/camion.service';

@Component({
  selector: 'app-camion-by-producto-field',
  templateUrl: './camion-by-producto-field.component.html',
  styleUrls: ['./camion-by-producto-field.component.scss']
})
export class CamionByProductoFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  pId?: number;
  list: CamionList[] = [];
  subscription?: Subscription;

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.subscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(id => {
      this.valueChange.emit(id);
    });
  }
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }
  @Input() controlName = 'camion_id';
  @Input() groupName = '';
  @Input() title = 'Camión';

  @Output() valueChange = new EventEmitter<number>();

  constructor(private camionService:  CamionService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private getList(): void {
    if (this.pId) {
      this.camionService.getListByProductoId(this.pId).subscribe(list => {
        this.list = list;
      });
    }
  }
}
