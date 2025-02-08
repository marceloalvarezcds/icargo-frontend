import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FleteDestinatarioEnum } from 'src/app/enums/flete-destinatario-enum';
import { FleteDestinatario } from 'src/app/interfaces/flete-destinatario';
import { FleteService } from 'src/app/services/flete.service';

@Component({
  selector: 'app-flete-form-emision-orden',
  templateUrl: './flete-form-emision-orden.component.html',
  styleUrls: ['./flete-form-emision-orden.component.scss'],
})
export class FleteFormEmisionOrdenComponent implements OnDestroy {
  D = FleteDestinatarioEnum;
  list: FleteDestinatario[] = [];

  formGroup?: FormGroup;
  groupName = 'emision_orden';
  destinoId?: number;
  destinoSubscription?: Subscription;
  origenId?: number;
  origenSubscription?: Subscription;
  remitenteId?: number;
  remitenteSubscription?: Subscription;


  @Input() isShow = false;
  @Input() isEdit = false;
  
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.destinoSubscription = this.destinoControl.valueChanges.subscribe(
      (val) => {
        this.destinoId = val;
        this.getList();
      }
    );
    this.origenSubscription = this.origenControl.valueChanges.subscribe(
      (val) => {
        this.origenId = val;
        this.getList();
      }
    );
    this.remitenteSubscription = this.remitenteControl.valueChanges.subscribe(
      (val) => {
        this.remitenteId = val;
        this.getList();
      }
    );
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get info(): FormGroup {
    return this.formGroup!.get('info') as FormGroup;
  }

  get destinoControl(): FormControl {
    return this.tramo.get('destino_id') as FormControl;
  }

  get origenControl(): FormControl {
    return this.tramo.get('origen_id') as FormControl;
  }

  get remitenteControl(): FormControl {
    return this.info.get('remitente_id') as FormControl;
  }

  get tramo(): FormGroup {
    return this.formGroup!.get('tramo') as FormGroup;
  }

  constructor(private fleteService: FleteService) {}

  ngOnDestroy(): void {
    this.destinoSubscription?.unsubscribe();
    this.origenSubscription?.unsubscribe();
    this.remitenteSubscription?.unsubscribe();
  }

  compareWith(o1?: FleteDestinatario, o2?: FleteDestinatario): boolean {
    return o1?.id === o2?.id;
  }

  private getList(): void {
    if (this.remitenteId && this.origenId && this.destinoId) {
      this.fleteService
        .getDestinatarioList(this.remitenteId, this.origenId, this.destinoId)
        .subscribe((list) => (this.list = list));
    }
  }
}
