import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { SeleccionableFormService } from './seleccionable-form.service';

@Component({
  selector: 'app-seleccionable-form',
  templateUrl: './seleccionable-form.component.html',
  styleUrls: ['./seleccionable-form.component.scss'],
})
export class SeleccionableFormComponent implements OnInit, OnDestroy {
  get form(): FormGroup {
    return this.service.form;
  }

  get hasChange(): boolean {
    return this.service.hasChange;
  }

  get estado(): EstadoEnum {
    return this.service.estado;
  }

  get isActive(): boolean {
    return this.service.isActive;
  }

  get isEdit(): boolean {
    return this.service.isEdit;
  }

  get isShow(): boolean {
    return this.service.isShow;
  }

  get modelo(): m {
    return this.service.modelo;
  }

  get submodule(): string {
    return this.service.submodule;
  }

  constructor(
    route: ActivatedRoute,
    private service: SeleccionableFormService
  ) {
    const { modelo, submodule, changeStatusMsg } = route.snapshot.data;
    this.service.setBackUrl(route.snapshot.queryParams.backUrl);
    this.service.setChangeStatusMsg(changeStatusMsg);
    this.service.setEndpoint(modelo);
    this.service.setId(route.snapshot.params.id);
    this.service.setModelo(modelo);
    this.service.setSubmodule(submodule);
  }

  ngOnInit(): void {
    this.service.getData();
  }

  ngOnDestroy(): void {
    this.service.unsubscribe();
  }

  active(): void {
    this.service.active();
  }

  inactive(): void {
    this.service.inactive();
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
