import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { RolFormService } from './rol-form.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss'],
  providers: [RolFormService],
})
export class RolFormComponent implements OnInit, OnDestroy {
  loggedUser$ = this.userService.getLoggedUser();

  get form(): FormGroup {
    return this.service.form;
  }

  get hasChange(): boolean {
    return this.service.hasChange;
  }

  get estado(): EstadoEnum {
    return this.service.estado;
  }

  get isEdit(): boolean {
    return this.service.isEdit;
  }

  get isShow(): boolean {
    return this.service.isShow;
  }

  get modelo(): m {
    return m.ROL;
  }

  get submodule(): string {
    return 'Rol';
  }

  constructor(
    route: ActivatedRouteService,
    private service: RolFormService,
    private userService: UserService
  ) {
    this.service.setBackUrl(route.snapshot.queryParams.backUrl);
    this.service.setId(route.snapshot.params.id);
  }

  ngOnInit(): void {
    this.service.getData();
  }

  ngOnDestroy(): void {
    this.service.unsubscribe();
  }

  redirectToEdit(): void {
    this.service.redirectToEdit();
  }

  back(confirmed: boolean): void {
    this.service.back(confirmed);
  }

  submit(confirmed: boolean): void {
    this.service.submit(confirmed);
  }
}
