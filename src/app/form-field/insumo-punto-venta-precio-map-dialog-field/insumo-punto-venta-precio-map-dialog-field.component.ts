import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectorInMapDialogComponent } from 'src/app/dialogs/selector-in-map-dialog/selector-in-map-dialog.component';
import {
  Marker,
  SelectorInMapDialogData,
} from 'src/app/interfaces/dialog-data';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { DialogService } from 'src/app/services/dialog.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Observable, of } from 'rxjs';
import { getClassColorForState } from 'src/app/utils/movimiento-utils';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Component({
  selector: 'app-insumo-punto-venta-precio-map-dialog-field',
  templateUrl: './insumo-punto-venta-precio-map-dialog-field.component.html',
  styleUrls: ['./insumo-punto-venta-precio-map-dialog-field.component.scss'],
})
export class InsumoPuntoVentaPrecioMapDialogFieldComponent {
  readonly inputValuePropName = 'punto_venta_alias';
  fId?: number | null;
  list: InsumoPuntoVentaPrecioList[] = [];

  @Input() pdvInsumoEvents?: Observable<InsumoPuntoVentaPrecioList>;
  @Input() isRemote?: boolean = false;
  @Input() form!: FormGroup;
  @Input() controlName = 'insumo_punto_venta_precio_id';
  @Input() groupName = '';
  @Input() title = 'Establecimiento';
  // nombre_corto

  @Input() set fleteId(id: number | null | undefined) {
    this.fId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<
    InsumoPuntoVentaPrecioList | undefined
  >();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<
    InsumoPuntoVentaPrecioList,
    SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>
  >;

  fetchDataFunction = (): Observable<InsumoPuntoVentaPrecioList[]> => {
    if (this.fId) {
      return this.service.getListByFleteId(this.fId);
    }
    return of([]);
  };

  constructor(
    private service: InsumoPuntoVentaPrecioService,
    private dialog: DialogService
  ) {}

  createMarker(
    item: InsumoPuntoVentaPrecioList
  ): Marker<InsumoPuntoVentaPrecioList> {
    const latLng: google.maps.ReadonlyLatLngLiteral | undefined =
      item.punto_venta_latitud && item.punto_venta_longitud
        ? { lat: item.punto_venta_latitud, lng: item.punto_venta_longitud }
        : undefined;
    const marker = new Marker<InsumoPuntoVentaPrecioList>({
      position: latLng,
      title: item.punto_venta_nombre,
    });
    marker.info = item;
    marker.template = `
      <div class="info-template">
        <div class="info-data">
          <strong>Establecimiento: </strong>${item.punto_venta_alias}
          ${latLng ? '' : ' <span>(Sin Ubicación)</span>'}
          ${
            item.proveedor_nombre
              ? `<div><strong>Proveedor: </strong>${item.proveedor_nombre}</div>`
              : ''
          }
          ${
            item.insumo_tipo_descripcion
              ? ` <div>
                    <strong>${item.insumo_tipo_descripcion}: </strong>${
                  item.insumo_descripcion
                }
                    ${
                      item.precio
                        ? `<strong>: ${numberWithCommas(item.precio)} ${item.insumo_moneda_simbolo} / ${item.insumo_unidad_abreviatura}</strong>`
                        : ''
                    }
                  </div>`
              : ''
          }
          ${
            item.ciudad_nombre
              ? `<div><strong>Ubi: </strong>${item.ciudad_nombre}/${item.localidad_nombre}/${item.pais_nombre_corto}</div>`
              : ''
          }
          ${
            item.punto_venta_direccion
              ? `<div><strong>Dir: </strong>${item.punto_venta_direccion}</div>`
              : ''
          }
        </div>
        <div class="info-estado estado" >
          <strong class="${getClassColorForState(item.estado)}">${item.estado.toUpperCase()}</strong>
        </div>
         ${'' /*
          item.logo
            ? `
            <div class="info-logo">
              <img
                src="${item.logo}"
                alt="logo"
              />
            </div>`
            : ''*/
        }
      </div>`;
    return marker;
  }

  dialogRefFunction(
    selectedValue: InsumoPuntoVentaPrecioList | undefined,
    dataList: InsumoPuntoVentaPrecioList[] | undefined
  ): MatDialogRef<SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>> {
    if (this.isRemote && dataList) {
      this.list = dataList;
    }

    const data: SelectorInMapDialogData<InsumoPuntoVentaPrecioList> = {
      list: this.isRemote ? dataList ?? [] : this.list.slice(),
      title: this.title,
      selectedValue,
      drawMarkerFunction: this.createMarker.bind(this),
      filterFunction: this.filterMarker.bind(this),
    };
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-map-dialog',
      position: {
        //top: '1rem',
      },
    };

    return this.dialog.open<
      SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>,
      InsumoPuntoVentaPrecioList
    >(SelectorInMapDialogComponent, config);
  }


  private filterMarker(
    regexList: RegExp[],
    item: InsumoPuntoVentaPrecioList | null,
    regexText?:string,
  ): boolean {
    if (!item) return false;

    if (!regexList.length) return true;

    if (regexText)
      return (
        (item.punto_venta_nombre ?? '').toLowerCase().includes(regexText.toLowerCase()) ||
        item.punto_venta_alias!.toLowerCase().includes(regexText.toLowerCase()) ||
        (item.proveedor_nombre ?? '').toLowerCase().includes(regexText.toLowerCase()) ||
        (item.insumo_tipo_descripcion ?? '').toLowerCase().includes(regexText.toLowerCase()) ||
        (item.insumo_descripcion ?? '').toLowerCase().includes(regexText.toLowerCase()) ||
        (item.ciudad_nombre ?? '').toLowerCase().includes(regexText.toLowerCase()) ||
        (item.localidad_nombre ?? '').toLowerCase().includes(regexText.toLowerCase())
      );

    return regexList.every((regex) => {
      return (
        regex.test(item.punto_venta_nombre) ||
        regex.test(item.proveedor_nombre ?? '') ||
        regex.test(item.insumo_tipo_descripcion ?? '') ||
        regex.test(item.insumo_descripcion ?? '') ||
        regex.test(item.precio.toString() ?? '') ||
        regex.test(item.insumo_moneda_simbolo ?? '') ||
        regex.test(item.ciudad_nombre ?? '') ||
        regex.test(item.localidad_nombre ?? '') ||
        regex.test(item.pais_nombre_corto ?? '') ||
        regex.test(item.punto_venta_direccion ?? '')
      );
    });
  }

  list$?: Observable<InsumoPuntoVentaPrecioList[]>;

  private getList(): void {
    // Verifica si ya existe una lista cargada
    if (this.list$) {
      return;
    }

    // Define la función de obtención de datos basada en el flete ID
    this.fetchDataFunction = () =>
      this.fId
        ? this.service.getListByFleteId(this.fId)
        : of([]); // Si no hay flete ID, devuelve un observable vacío

    // Llama a la función de obtención de datos
    const list$ = this.fId
      ? this.service.getListByFleteId(this.fId)
      : of([]);

    // Suscríbete al observable y maneja los datos
    list$.subscribe({
      next: (list) => {
        this.list$ = of(list); // Guarda la lista como un observable
      },
      error: (err) => {
        console.error('Error al cargar la lista:', err);
        this.list$ = of([]); // Maneja el error devolviendo una lista vacía
      },
    });
  }

}
