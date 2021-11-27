import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Localidad } from 'src/app/interfaces/localidad';
import { LocalidadService } from 'src/app/services/localidad.service';

@Component({
  selector: 'app-localidad-field',
  templateUrl: './localidad-field.component.html',
  styleUrls: ['./localidad-field.component.scss']
})
export class LocalidadFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  localidadList: Localidad[] = [];
  localidadSubscription?: Subscription;
  pId?: number;

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set paisId(id: number | undefined) {
    this.pId = id;
    if (id) {
      this.localidadService.getList(id).subscribe(list => {
        this.localidadList = list;
      });
    }
  }
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.localidadSubscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(localidadId => {
      this.valueChange.emit(localidadId);
    });
  }
  @Input() controlName = 'localidad';
  @Input() groupName = '';
  @Input() title = 'Localidad';

  @Output() valueChange = new EventEmitter<number>();

  constructor(private localidadService: LocalidadService) { }

  ngOnDestroy(): void {
    this.localidadSubscription?.unsubscribe();
  }
}
