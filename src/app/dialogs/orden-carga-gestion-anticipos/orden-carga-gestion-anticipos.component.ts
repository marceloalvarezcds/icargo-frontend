import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Column } from 'src/app/interfaces/column';
import { OCConfirmationDialogData, OCConfirmationInfo, OrdenCargaAnticipoDialogData } from 'src/app/interfaces/oc-confirmation-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoSaldo } from 'src/app/interfaces/orden-carga-anticipo-saldo';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orden-carga-gestion-anticipos',
  templateUrl: './orden-carga-gestion-anticipos.component.html',
  styleUrls: ['./orden-carga-gestion-anticipos.component.scss']
})
export class OrdenCargaGestionAnticiposComponent {
  get oc(): OrdenCarga | null {
    return this.data.oc;
  }

  constructor(
    public dialogRef: MatDialogRef<OrdenCargaGestionAnticiposComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdenCargaAnticipoDialogData
  ) {}
  columns: Column[] = [
    {
      def: 'id_anticipo',
      title: 'ID',
      value: (element: OrdenCargaAnticipoSaldo) => element.id,
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: OrdenCargaAnticipoSaldo) => element.concepto,
    },
    {
      def: 'porcentaje',
      title: '%',
      value: (element: OrdenCargaAnticipoSaldo) => element.porcentaje,
      type: 'number',
    },
    {
      def: 'total_anticipo',
      title: 'Anticipos OC (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_anticipo,
      type: 'number',
    },
    {
      def: 'total_complemento',
      title: 'Total complemento (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_complemento,
      type: 'number',
    },
    {
      def: 'total_disponible',
      title: 'Total Disponible (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_disponible,
      type: 'number',
    },
    {
      def: 'total_retirado',
      title: 'Total retirado (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_retirado,
      type: 'number',
    },
    {
      def: 'saldo',
      title: 'Saldo en Línea (ML)',
      value: (element: OrdenCargaAnticipoSaldo) => element.saldo,
      type: 'number',
    },
    {
      def: 'created_by_anticipo',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoSaldo) => element.created_by,
    },
    {
      def: 'created_at_anticipo',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoSaldo) => this.formatDate(element.created_at),
    },
    {
      def: 'modified_by_anticipo',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoSaldo) => element.modified_by,
    },
    {
      def: 'modified_at_anticipo',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoSaldo) => this.formatDate(element.modified_at),

    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


  @Input() list: OrdenCargaAnticipoSaldo[] = [];
}
