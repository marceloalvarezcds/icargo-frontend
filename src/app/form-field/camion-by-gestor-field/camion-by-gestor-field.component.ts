import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CamionService } from 'src/app/services/camion.service';

@Component({
  selector: 'app-camion-by-gestor-field',
  templateUrl: './camion-by-gestor-field.component.html',
  styleUrls: ['./camion-by-gestor-field.component.scss']
})
export class CamionByGestorFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  list$ = this.camionService.getListByGestorCarga();
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
  @Input() controlName = 'camion_id';
  @Input() groupName = '';
  @Input() title = 'Camión';

  @Output() valueChange = new EventEmitter<number>();

  constructor(private camionService:  CamionService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
