import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';
@Component({
  selector: 'app-input-field-oc',
  templateUrl: './input-field-oc.component.html',
  styleUrls: ['./input-field-oc.component.scss']
})
export class InputFieldOcComponent {
  cId?: number;
  pId?: number;
  list$?: Observable<SemiList[]>;
  @Input() shouldFormat: boolean = true;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: SemiList) => element.placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: SemiList) => element.propietario_nombre,
    },
    {
      def: 'numero_chasis',
      title: 'Nº de Chasis',
      value: (element: SemiList) => element.numero_chasis,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'clasificacion_descripcion',
      title: 'Clasificación',
      value: (element: SemiList) => element.clasificacion_descripcion,
    },
  ];
  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get rowValue(): string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

  getFormattedValue(): string {
    const value = this.control?.value;

    // Solo formatea si shouldFormat es true
    if (this.shouldFormat && (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value))))) {
      return this.formatNumberWithDots(Number(value));
    }

    // Retorna el valor tal cual si no debe ser formateado
    return value || '';
  }

  private formatNumberWithDots(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  @Input() readonly = false;
  @Input() autocomplete: 'on' | 'off' | 'nope' = 'nope';
  @Input() formatToPasteNumber = false;
  @Input() formatToPastePhone = false;
  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() hint = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() requerido = false;
  @Input() title = '';
  @Input() disabled: boolean = false;
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }

  constructor(private service: SemiService) {}

  private getList(): void {
    if (this.cId && this.pId) {
      this.list$ = this.service.getListByCamionId(
        this.cId
      );
    }
  }
}