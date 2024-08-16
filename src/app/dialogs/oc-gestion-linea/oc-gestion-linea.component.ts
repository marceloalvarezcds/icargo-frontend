import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdenCargaAnticipoDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { OrdenCargaAnticipoSaldo } from 'src/app/interfaces/orden-carga-anticipo-saldo';
import { ProportionValidator } from 'src/app/validators/proportion-validator';
import { OrdenCargaAnticipoPorcentajeForm } from 'src/app/interfaces/orden-carga-anticipo-porcentaje';

@Component({
  selector: 'app-oc-gestion-linea',
  templateUrl: './oc-gestion-linea.component.html',
  styleUrls: ['./oc-gestion-linea.component.scss']
})
export class OcGestionLineaComponent  {
  @Input() form?: FormGroup;
  @Input() isCreate = false;
  @Input() anicipoMaximo = 100;
  @Input() puedeModificar = false;
  @Input() list: OrdenCargaAnticipoSaldo[] = [];
  @Input() listAnticipo: OrdenCargaAnticipoPorcentajeForm[] = [];

  groupName = 'porcentaje_anticipos';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OcGestionLineaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdenCargaAnticipoDialogData
  ) {}

  get oc(): OrdenCarga | null {
    console.log(this.data.oc);
    return this.data.oc;
  }

getTotalAnticipo(): number {
  if (!this.oc?.porcentaje_anticipos) {
    return 0;
  }
  return this.oc.porcentaje_anticipos.reduce((total, anticipo) => total + anticipo.porcentaje, 0);
}

  columns: Column[] = [

    {
      def: 'id_anticipo_saldo',
      title: 'ID',
      value: (element: OrdenCargaAnticipoSaldo) => element.id,
    },
    {
      def: 'concepto_gestion',
      title: 'Concepto',
      value: (element: OrdenCargaAnticipoSaldo) => element.concepto,
    },
    {
      def: '%',
      title: '%',
      value: (element: OrdenCargaAnticipoSaldo) => element.porcentaje,
      type: 'number',
    },
    {
      def: 'anticipo_gestion',
      title: 'Anticipos Liberado (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_anticipo,
      type: 'number',
    },
    {
      def: 'complemento_gestion',
      title: 'Total Complemento (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_complemento,
      type: 'number',
    },
    {
      def: 'disponible_gestion',
      title: 'Total Disponible (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_disponible,
      type: 'number',
    },
    {
      def: 'retirado_gestion',
      title: 'Total Retirado (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_retirado,
      type: 'number',
    },
    {
      def: 'saldo_gestion',
      title: 'Saldo en Linea (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.saldo,
      type: 'number',
    },
    {
      def: 'usuario_gestion',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoSaldo) => element.created_by,
    },
    {
      def: 'fecha_gestion',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoSaldo) => element.created_at,
    },
    {
      def: 'modi_gestion',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoSaldo) => element.modified_by,
    },
    {
      def: 'fecha_mod_gestion',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoSaldo) => element.modified_by,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
}
