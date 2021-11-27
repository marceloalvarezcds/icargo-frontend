import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-pais-field',
  templateUrl: './pais-field.component.html',
  styleUrls: ['./pais-field.component.scss']
})
export class PaisFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  paisList$ = this.paisService.getList();
  paisSubscription?: Subscription;

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.paisSubscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(paisId => {
      this.valueChange.emit(paisId);
    });
  }
  @Input() controlName = 'pais';
  @Input() groupName = '';
  @Input() title = 'País';

  @Output() valueChange = new EventEmitter<number>();

  constructor(private paisService: PaisService) { }

  ngOnDestroy(): void {
    this.paisSubscription?.unsubscribe();
  }
}
