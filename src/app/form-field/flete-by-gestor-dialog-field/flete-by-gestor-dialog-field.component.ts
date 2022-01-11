import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FleteList } from 'src/app/interfaces/flete';
import { FleteService } from 'src/app/services/flete.service';

@Component({
  selector: 'app-flete-by-gestor-dialog-field',
  templateUrl: './flete-by-gestor-dialog-field.component.html',
  styleUrls: ['./flete-by-gestor-dialog-field.component.scss']
})
export class FleteByGestorDialogFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  list: FleteList[] = [];
  subs = this.fleteService.getListByGestorCarga().subscribe(list => {
    this.list = list;
  });
  subscription?: Subscription;

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.subscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(fleteId => {
      const flete = this.list.find(f => f.id === fleteId);
      if (flete) {
        this.valueChange.emit(flete);
      }
    });
  }
  @Input() controlName = 'flete_id';
  @Input() groupName = '';
  @Input() title = 'Flete';

  @Output() valueChange = new EventEmitter<FleteList>();

  constructor(private fleteService:  FleteService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
