import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Rentabilidad } from 'src/app/interfaces/rentabilidad';
import { RentabilidadService } from 'src/app/services/rentabilidad.service';
import { ReportsService } from 'src/app/services/reports.service';
import { redirectToShowOC } from 'src/app/utils/oc-utils';

@Component({
  selector: 'app-rentabilidad-list',
  templateUrl: './rentabilidad-list.component.html',
  styleUrls: ['./rentabilidad-list.component.scss'],
})
export class RentabilidadListComponent implements OnInit {
  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  columns: Column[] = [
    {
      def: 'ver',
      title: 'URL',
      type: 'button',
      value: () => 'Ver OC',
      buttonCallback: (element: Rentabilidad) =>
        redirectToShowOC(this.router, element.oc_id),
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado OC',
      value: (element: Rentabilidad) => element.estado,
    },
    {
      def: 'oc_id',
      title: 'Nº de OC',
      value: (element: Rentabilidad) => element.oc_id,
    },
    {
      def: 'flete_id',
      title: 'Nº de Pedido',
      value: (element: Rentabilidad) => element.flete_id,
    },
    {
      def: 'nro_remisiones',
      title: 'Nº de Remisiones',
      value: (element: Rentabilidad) => element.nro_remisiones,
    },
    {
      def: 'estado_anticipo',
      title: 'Estado Anticipos',
      value: (element: Rentabilidad) => element.estado_anticipo,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: Rentabilidad) => element.chofer_nombre,
    },
    {
      def: 'chofer_tipo_documento',
      title: 'Chofer: Tipo Documento',
      value: (element: Rentabilidad) => element.chofer_tipo_documento,
    },
    {
      def: 'chofer_numero_documento',
      title: 'Chofer: Nº del Documento',
      value: (element: Rentabilidad) => element.chofer_numero_documento,
    },
    {
      def: 'camion_placa',
      title: 'Placa Tracto',
      value: (element: Rentabilidad) => element.camion_placa,
    },
    {
      def: 'semi_placa',
      title: 'Placa Semi',
      value: (element: Rentabilidad) => element.semi_placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: Rentabilidad) => element.propietario_nombre,
    },
    {
      def: 'flete_tipo',
      title: 'Tipo de Pedido',
      value: (element: Rentabilidad) => element.flete_tipo,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: Rentabilidad) => element.producto_descripcion,
    },
    {
      def: 'remitente_nombre',
      title: 'Cliente',
      value: (element: Rentabilidad) => element.remitente_nombre,
    },
    {
      def: 'cantidad_nominada',
      title: 'Cant. Nominada (kg)',
      value: (element: Rentabilidad) => element.cantidad_nominada,
      type: 'number',
    },
    {
      def: 'cantidad_origen',
      title: 'Tot. Cant. Origen',
      value: (element: Rentabilidad) => element.cantidad_origen,
      type: 'number',
    },
    {
      def: 'cantidad_destino',
      title: 'Tot. Cant. Destino',
      value: (element: Rentabilidad) => element.cantidad_destino,
      type: 'number',
    },
    {
      def: 'diferencia_origen_destino',
      title: 'Diferencia Origen/Destino',
      value: (element: Rentabilidad) => element.diferencia_origen_destino,
      type: 'number',
    },
    {
      def: 'origen_nombre',
      title: 'Origen',
      value: (element: Rentabilidad) => element.origen_nombre,
    },
    {
      def: 'destino_nombre',
      title: 'Destino',
      value: (element: Rentabilidad) => element.destino_nombre,
    },
    {
      def: 'lugar_carga_nombre',
      title: 'Lugar de carga',
      value: (element: Rentabilidad) => element.lugar_carga_nombre,
    },
    {
      def: 'lugar_descarga_nombre',
      title: 'Lugar de descarga',
      value: (element: Rentabilidad) => element.lugar_descarga_nombre,
    },
    {
      def: 'condicion_propietario_tarifa',
      title: 'Tarifa Pedido a Pagar',
      value: (element: Rentabilidad) => element.condicion_propietario_tarifa,
      type: 'number',
    },
    {
      def: 'condicion_propietario_moneda_nombre',
      title: 'Moneda de Pago',
      value: (element: Rentabilidad) =>
        element.condicion_propietario_moneda_nombre,
    },
    {
      def: 'condicion_propietario_unidad_descripcion',
      title: 'Unidad de Pago',
      value: (element: Rentabilidad) =>
        element.condicion_propietario_unidad_descripcion,
    },
    {
      def: 'propietario_flete_total',
      title: 'Tot. Pedido a Pagar',
      value: (element: Rentabilidad) => element.propietario_flete_total,
      type: 'number',
    },
    {
      def: 'propietario_flete_total_ml',
      title: 'Tot. Pedido a Pagar (Moneda Local)',
      value: (element: Rentabilidad) => element.propietario_flete_total_ml,
      type: 'number',
    },
    {
      def: 'merma_propietario_valor',
      title: 'Precio Merma a Cobrar',
      value: (element: Rentabilidad) => element.merma_propietario_valor,
      type: 'number',
    },
    {
      def: 'merma_propietario_moneda_nombre',
      title: 'Moneda Merma a Cobrar',
      value: (element: Rentabilidad) => element.merma_propietario_moneda_nombre,
    },
    {
      def: 'merma_propietario_unidad_descripcion',
      title: 'Unidad Merma a Cobrar',
      value: (element: Rentabilidad) =>
        element.merma_propietario_unidad_descripcion,
    },
    {
      def: 'merma_propietario_tolerancia',
      title: 'Tolerancia Propietario',
      value: (element: Rentabilidad) => element.merma_propietario_tolerancia,
      type: 'number',
    },
    {
      def: 'merma_propietario_merma',
      title: 'Merma Propietario (Kg)',
      value: (element: Rentabilidad) => element.merma_propietario_merma,
      type: 'number',
    },
    {
      def: 'merma_propietario_valor_merma',
      title: 'Valor de Merma a Cobrar',
      value: (element: Rentabilidad) => element.merma_propietario_valor_merma,
      type: 'number',
    },
    {
      def: 'condicion_gestor_carga_tarifa',
      title: 'Tarifa Pedido a Cobrar',
      value: (element: Rentabilidad) => element.condicion_gestor_carga_tarifa,
      type: 'number',
    },
    {
      def: 'condicion_gestor_carga_moneda_nombre',
      title: 'Moneda de Cobro',
      value: (element: Rentabilidad) =>
        element.condicion_gestor_carga_moneda_nombre,
    },
    {
      def: 'condicion_gestor_carga_unidad_descripcion',
      title: 'Unidad de Cobro',
      value: (element: Rentabilidad) =>
        element.condicion_gestor_carga_unidad_descripcion,
    },
    {
      def: 'gestor_carga_flete_total',
      title: 'Tot. Pedido a Cobrar',
      value: (element: Rentabilidad) => element.gestor_carga_flete_total,
      type: 'number',
    },
    {
      def: 'gestor_carga_flete_total_ml',
      title: 'Tot. Pedido a Cobrar (Moneda Local)',
      value: (element: Rentabilidad) => element.gestor_carga_flete_total_ml,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_valor',
      title: 'Precio Merma a PAGAR',
      value: (element: Rentabilidad) => element.merma_gestor_carga_valor,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_moneda_nombre',
      title: 'Moneda Merma a Pagar',
      value: (element: Rentabilidad) =>
        element.merma_gestor_carga_moneda_nombre,
    },
    {
      def: 'merma_gestor_carga_unidad_descripcion',
      title: 'Unidad Merma a Pagar',
      value: (element: Rentabilidad) =>
        element.merma_gestor_carga_unidad_descripcion,
    },
    {
      def: 'merma_gestor_carga_tolerancia',
      title: 'Tolerancia Gestora de Carga',
      value: (element: Rentabilidad) => element.merma_gestor_carga_tolerancia,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_merma',
      title: 'Merma Gestora Carga (Kg)',
      value: (element: Rentabilidad) => element.merma_gestor_carga_merma,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_valor_merma',
      title: 'Valor de Merma a Pagar',
      value: (element: Rentabilidad) => element.merma_gestor_carga_valor_merma,
      type: 'number',
    },
    // Resutados del Flete
    {
      def: 'flete_condicion_propietario_tarifa',
      title: 'Tarifa Pedido a Pagar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_condicion_propietario_tarifa,
      type: 'number',
    },
    {
      def: 'flete_condicion_propietario_moneda_nombre',
      title: 'Moneda de Pago (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_condicion_propietario_moneda_nombre,
    },
    {
      def: 'flete_propietario_total',
      title: 'Tot. Flete a Pagar (Pedido)',
      value: (element: Rentabilidad) => element.flete_propietario_total,
      type: 'number',
    },
    {
      def: 'flete_propietario_total_ml',
      title: 'Tot. Pedido a Pagar (Pedido - Moneda Local)',
      value: (element: Rentabilidad) => element.flete_propietario_total_ml,
      type: 'number',
    },
    {
      def: 'flete_merma_propietario_valor',
      title: 'Precio Merma a Cobrar (Pedido)',
      value: (element: Rentabilidad) => element.flete_merma_propietario_valor,
      type: 'number',
    },
    {
      def: 'flete_merma_propietario_moneda_nombre',
      title: 'Moneda Merma a Cobrar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_propietario_moneda_nombre,
    },
    {
      def: 'flete_merma_propietario_tolerancia',
      title: 'Tolerancia Propietario (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_propietario_tolerancia,
      type: 'number',
    },
    {
      def: 'flete_merma_propietario_merma',
      title: 'Merma Propietario (Kg) (Pedido)',
      value: (element: Rentabilidad) => element.flete_merma_propietario_merma,
      type: 'number',
    },
    {
      def: 'flete_merma_propietario_valor_merma',
      title: 'Valor de Merma a Cobrar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_propietario_valor_merma,
      type: 'number',
    },
    {
      def: 'flete_condicion_gestor_carga_tarifa',
      title: 'Tarifa Pedido a Cobrar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_condicion_gestor_carga_tarifa,
      type: 'number',
    },
    {
      def: 'flete_condicion_gestor_carga_moneda_nombre',
      title: 'Moneda de Cobro (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_condicion_gestor_carga_moneda_nombre,
    },
    {
      def: 'flete_gestor_carga_total',
      title: 'Tot. Flete a Cobrar (Pedido)',
      value: (element: Rentabilidad) => element.flete_gestor_carga_total,
      type: 'number',
    },
    {
      def: 'flete_gestor_carga_total_ml',
      title: 'Tot. Flete a Cobrar (Moneda Local) (Pedido)',
      value: (element: Rentabilidad) => element.flete_gestor_carga_total_ml,
      type: 'number',
    },
    {
      def: 'flete_merma_gestor_carga_valor',
      title: 'Precio Merma a PAGAR (Pedido)',
      value: (element: Rentabilidad) => element.flete_merma_gestor_carga_valor,
      type: 'number',
    },
    {
      def: 'flete_merma_gestor_carga_moneda_nombre',
      title: 'Moneda Merma a Pagar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_gestor_carga_moneda_nombre,
    },
    {
      def: 'flete_merma_gestor_carga_tolerancia',
      title: 'Tolerancia Gestora de Carga (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_gestor_carga_tolerancia,
      type: 'number',
    },
    {
      def: 'flete_merma_gestor_carga_merma',
      title: 'Merma Gestora Carga (Kg) (Pedido)',
      value: (element: Rentabilidad) => element.flete_merma_gestor_carga_merma,
      type: 'number',
    },
    {
      def: 'flete_merma_gestor_carga_valor_merma',
      title: 'Valor de Merma a Pagar (Pedido)',
      value: (element: Rentabilidad) =>
        element.flete_merma_gestor_carga_valor_merma,
      type: 'number',
    },
    // Termina Resultados del Flete
    {
      def: 'total_complemento_a_pagar',
      title: 'Total Complemento a Pagar',
      value: (element: Rentabilidad) => element.total_complemento_a_pagar,
    },
    {
      def: 'total_complemento_a_cobrar',
      title: 'Total Complemento a Cobrar',
      value: (element: Rentabilidad) => element.total_complemento_a_cobrar,
      type: 'number',
    },
    {
      def: 'diferencia_complemento',
      title: 'Diferencia Complementos',
      value: (element: Rentabilidad) => element.diferencia_complemento,
    },
    {
      def: 'total_descuento_a_pagar',
      title: 'Total Descuento a Pagar',
      value: (element: Rentabilidad) => element.total_descuento_a_pagar,
      type: 'number',
    },
    {
      def: 'total_descuento_a_cobrar',
      title: 'Total Descuento a Cobrar',
      value: (element: Rentabilidad) => element.total_descuento_a_cobrar,
      type: 'number',
    },
    {
      def: 'diferencia_descuento',
      title: 'Diferencia Descuentos',
      value: (element: Rentabilidad) => element.diferencia_descuento,
      type: 'number',
    },
    {
      def: 'total_anticipo_retirado',
      title: 'Total Anticipos Retirados',
      value: (element: Rentabilidad) => element.total_anticipo_retirado,
      type: 'number',
    },
    {
      def: 'saldo_gestor_carga',
      title: 'Resultado Gestora de Carga (ML)',
      value: (element: Rentabilidad) => element.saldo_gestor_carga,
      type: 'number',
    },
    {
      def: 'saldo_propietario',
      title: 'Saldo Final Propietario',
      value: (element: Rentabilidad) => element.saldo_propietario,
      type: 'number',
    },
    {
      def: 'fecha_conciliacion',
      title: 'Fecha de Conciliacion',
      value: (element: Rentabilidad) => element.fecha_conciliacion,
      type: 'date',
    },
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Rentabilidad) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Rentabilidad) => element.created_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha y hora',
      value: (element: Rentabilidad) => element.modified_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario',
      value: (element: Rentabilidad) => element.modified_by,
    },
  ];

  list: Rentabilidad[] = [];

  constructor(
    private rentabilidadService: RentabilidadService,
    private reportsService: ReportsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  downloadFile(): void {
    this.rentabilidadService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  private getList(): void {
    this.rentabilidadService.getList().subscribe((list) => {
      this.list = list;
    });
  }
}
