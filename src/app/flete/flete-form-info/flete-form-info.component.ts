import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Producto } from 'src/app/interfaces/producto';
import { Remitente } from 'src/app/interfaces/remitente';

@Component({
  selector: 'app-flete-form-info',
  templateUrl: './flete-form-info.component.html',
  styleUrls: ['./flete-form-info.component.scss'],
})
export class FleteFormInfoComponent {
  groupName = 'info';

  @Input() form?: FormGroup;
  @Input() estado = EstadoEnum.PENDIENTE;
  @Input() isShow = false;

  @Output() remitenteChange = new EventEmitter<Remitente | undefined>();
  @Output() productoChange = new EventEmitter<Producto | undefined>();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get estaPublicadoControl(): FormControl {
    return this.group.controls['publicado'] as FormControl;
  }

  get esSubastaControl(): FormControl {
    return this.group.controls['es_subasta'] as FormControl;
  }

  get estaPublicado(): boolean {
    return !!this.estaPublicadoControl.value;
  }

  get esSubasta(): boolean {
    return !!this.esSubastaControl.value;
  }
}
