import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-oficial-cuenta-field',
  templateUrl: './oficial-cuenta-field.component.html',
  styleUrls: ['./oficial-cuenta-field.component.scss']
})
export class OficialCuentaFieldComponent implements OnInit {

  userList$ = this.userService.getListByGestorCargaId();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'oficial_cuenta_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Oficial de cuenta';
  @Input() requerido = false;

  ngOnInit(): void {
    this.userService.getLoggedUser().subscribe((user) => {
      if (user?.id && this.control && !this.control.value) {
        this.control.setValue(user.id);
      }
    });
  }

  constructor(private userService: UserService) { }
}
