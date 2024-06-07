import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { UserAccount } from 'src/app/interfaces/user';
import { UserFormService } from './user-form.service';
import { ActivatedRouteService } from 'src/app/services/activated-route.service';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [UserFormService],
})
export class UserFormComponent implements OnInit, OnDestroy {
  set editPasswords(edit: boolean) {
    this.service.editPasswords = edit;
  }
  get editPasswords() {
    return this.service.editPasswords;
  }

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

  get isCreate(): boolean {
    return !this.isEdit && !this.isShow;
  }

  get loggedUser$(): Observable<UserAccount> {
    return this.service.loggedUser$;
  }

  get modelo(): m {
    return m.USER;
  }

  get submodule(): string {
    return 'Usuario';
  }

  constructor(route: ActivatedRoute, private service: UserFormService) {
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
