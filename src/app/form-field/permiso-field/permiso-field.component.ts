import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Permiso } from 'src/app/interfaces/permiso';
import { PermisoService } from 'src/app/services/permiso.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-permiso-field',
  templateUrl: './permiso-field.component.html',
  styleUrls: ['./permiso-field.component.scss'],
})
export class PermisoFieldComponent {
  list$ = this.service.getList();
  loggedUser$ = this.userService.getLoggedUser();

  @Input() control!: AbstractControl;
  @Input() title = 'Permisos';

  @Output() valueChange = new EventEmitter<Permiso[]>();

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  constructor(
    private service: PermisoService,
    private userService: UserService
  ) {}
}
