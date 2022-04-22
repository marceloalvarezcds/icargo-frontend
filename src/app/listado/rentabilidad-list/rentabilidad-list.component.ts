import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Rentabilidad } from 'src/app/interfaces/rentabilidad';
import { RentabilidadService } from 'src/app/services/rentabilidad.service';
import { ReportsService } from 'src/app/services/reports.service';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

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
      def: 'estado',
      title: 'Estado',
      value: (element: Rentabilidad) => element.estado,
    },
    {
      def: 'oc_id',
      title: 'Nº de OC',
      value: (element: Rentabilidad) => element.oc_id,
    },
    {
      def: 'flete_id',
      title: 'Nº de Flete',
      value: (element: Rentabilidad) => element.flete_id,
    },
    {
      def: 'nro_remisiones',
      title: 'Nº de Remisiones',
      value: (element: Rentabilidad) => element.nro_remisiones,
    },
    {
      def: 'estado_anticipo',
      title: 'Estado Anticipo',
      value: (element: Rentabilidad) => element.estado_anticipo,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: Rentabilidad) => element.chofer_nombre,
    },
    {
      def: 'chofer_tipo_documento',
      title: 'Chofer tipo de documento',
      value: (element: Rentabilidad) => element.chofer_tipo_documento,
    },
    {
      def: 'chofer_numero_documento',
      title: 'Nº de Flete',
      value: (element: Rentabilidad) => element.chofer_numero_documento,
    },
    {
      def: 'camion_placa',
      title: 'Camión',
      value: (element: Rentabilidad) => element.camion_placa,
    },
    {
      def: 'semi_placa',
      title: 'Semi',
      value: (element: Rentabilidad) => element.semi_placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: Rentabilidad) => element.propietario_nombre,
    },
    {
      def: 'flete_tipo',
      title: 'TTipo de Flete',
      value: (element: Rentabilidad) => element.flete_tipo,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: Rentabilidad) => element.producto_descripcion,
    },
    {
      def: 'remitente_nombre',
      title: 'Remitente',
      value: (element: Rentabilidad) => element.remitente_nombre,
    },
    {
      def: 'cantidad_nominada',
      title: 'Cantidad nominada',
      value: (element: Rentabilidad) => element.cantidad_nominada,
      type: 'number',
    },
    {
      def: 'cantidad_origen',
      title: 'Cantidad origen',
      value: (element: Rentabilidad) => element.cantidad_origen,
      type: 'number',
    },
    {
      def: 'cantidad_destino',
      title: 'Cantidad destino',
      value: (element: Rentabilidad) => element.cantidad_destino,
      type: 'number',
    },
    {
      def: 'diferencia_origen_destino',
      title: 'Diferencia origen/destino',
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
      title: 'Tarifa del Propietario',
      value: (element: Rentabilidad) =>
        `${numberWithCommas(element.condicion_propietario_tarifa)} ${
          element.condicion_propietario_unidad_abreviatura
        }/${element.condicion_propietario_moneda_simbolo}`,
    },
    {
      def: 'propietario_flete_total',
      title: 'Total Flete Propietario',
      value: (element: Rentabilidad) => element.propietario_flete_total,
      type: 'number',
    },
    {
      def: 'propietario_flete_total_ml',
      title: 'Total Flete Propietario (Moneda Local)',
      value: (element: Rentabilidad) => element.propietario_flete_total_ml,
      type: 'number',
    },
    {
      def: 'merma_propietario_valor',
      title: 'Costo por unidad de Merma a Propietario',
      value: (element: Rentabilidad) =>
        `${numberWithCommas(element.merma_propietario_valor)} ${
          element.merma_propietario_unidad_abreviatura
        }/${element.merma_propietario_moneda_simbolo}`,
    },
    {
      def: 'merma_propietario_tolerancia',
      title: 'Tolerancia Propietario',
      value: (element: Rentabilidad) => element.merma_propietario_tolerancia,
      type: 'number',
    },
    {
      def: 'merma_propietario_merma',
      title: 'Merma Propietario',
      value: (element: Rentabilidad) => element.merma_propietario_merma,
      type: 'number',
    },
    {
      def: 'merma_propietario_valor_merma',
      title: 'Valor Total Merma Propietario',
      value: (element: Rentabilidad) => element.merma_propietario_valor_merma,
      type: 'number',
    },
    {
      def: 'condicion_gestor_carga_tarifa',
      title: 'Tarifa del Gestor',
      value: (element: Rentabilidad) =>
        `${numberWithCommas(element.condicion_gestor_carga_tarifa)} ${
          element.condicion_gestor_carga_unidad_abreviatura
        }/${element.condicion_gestor_carga_moneda_simbolo}`,
    },
    {
      def: 'gestor_carga_flete_total',
      title: 'Total Flete Gestor',
      value: (element: Rentabilidad) => element.gestor_carga_flete_total,
      type: 'number',
    },
    {
      def: 'gestor_carga_flete_total_ml',
      title: 'Total Flete Gestor (Moneda Local)',
      value: (element: Rentabilidad) => element.gestor_carga_flete_total_ml,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_valor',
      title: 'Costo por unidad de Merma a Remitente',
      value: (element: Rentabilidad) =>
        `${numberWithCommas(element.merma_gestor_carga_valor)} ${
          element.merma_gestor_carga_unidad_abreviatura
        }/${element.merma_gestor_carga_moneda_simbolo}`,
    },
    {
      def: 'merma_gestor_carga_tolerancia',
      title: 'Tolerancia Remitente',
      value: (element: Rentabilidad) => element.merma_gestor_carga_tolerancia,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_merma',
      title: 'Merma Remitente',
      value: (element: Rentabilidad) => element.merma_gestor_carga_merma,
      type: 'number',
    },
    {
      def: 'merma_gestor_carga_valor_merma',
      title: 'Valor Total Merma Remitente',
      value: (element: Rentabilidad) => element.merma_gestor_carga_valor_merma,
      type: 'number',
    },
    {
      def: 'total_complemento_a_pagar',
      title: 'Total complemento a pagar',
      value: (element: Rentabilidad) => element.total_complemento_a_pagar,
    },
    {
      def: 'total_complemento_a_cobrar',
      title: 'Total complemento a cobrar',
      value: (element: Rentabilidad) => element.total_complemento_a_cobrar,
      type: 'number',
    },
    {
      def: 'diferencia_complemento',
      title: 'Diferencia complementos',
      value: (element: Rentabilidad) => element.diferencia_complemento,
    },
    {
      def: 'total_descuento_a_pagar',
      title: 'Total descuento a pagar',
      value: (element: Rentabilidad) => element.total_descuento_a_pagar,
      type: 'number',
    },
    {
      def: 'total_descuento_a_cobrar',
      title: 'Total descuento a cobrar',
      value: (element: Rentabilidad) => element.total_descuento_a_cobrar,
      type: 'number',
    },
    {
      def: 'diferencia_descuento',
      title: 'Diferencia descuentos',
      value: (element: Rentabilidad) => element.diferencia_descuento,
      type: 'number',
    },
    {
      def: 'total_anticipo_retirado',
      title: 'Total anticipos retirados',
      value: (element: Rentabilidad) => element.total_anticipo_retirado,
      type: 'number',
    },
    {
      def: 'saldo_gestor_carga',
      title: 'Saldo Gestora',
      value: (element: Rentabilidad) => element.saldo_gestor_carga,
      type: 'number',
    },
    {
      def: 'saldo_propietario',
      title: 'Saldo Propietario',
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
    private reportsService: ReportsService
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
