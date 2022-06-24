import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Permiso } from 'src/app/interfaces/permiso';
import { PermisoService } from 'src/app/services/permiso.service';

@Component({
  selector: 'app-permiso-field',
  templateUrl: './permiso-field.component.html',
  styleUrls: ['./permiso-field.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermisoFieldComponent {
  list$ = this.permisoService.getList();

  @Input() control!: AbstractControl;
  @Input() title = 'Permisos';

  @Output() valueChange = new EventEmitter<Permiso[]>();

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  constructor(private permisoService: PermisoService) {}
}
