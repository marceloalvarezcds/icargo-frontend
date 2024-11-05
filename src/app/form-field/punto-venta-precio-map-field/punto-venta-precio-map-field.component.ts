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
import { DialogService } from 'src/app/services/dialog.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';

@Component({
  selector: 'app-punto-venta-precio-map-field',
  templateUrl: './punto-venta-precio-map-field.component.html',
  styleUrls: ['./punto-venta-precio-map-field.component.scss']
})
export class PuntoVentaPrecioMapFieldComponent{

  readonly inputValuePropName = 'punto_venta_nombre';
  list: InsumoPuntoVentaPrecioList[] = [];
  subs = this.service.getByActivosList().subscribe((list) => {
    this.list = list;
  });

  @Input() form!: FormGroup;
  @Input() controlName = 'punto_venta_id';
  @Input() groupName = '';
  @Input() title = 'Punto de Venta';

  @Output() valueChange = new EventEmitter<InsumoPuntoVentaPrecioList | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<
    InsumoPuntoVentaPrecioList,
    SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>
  >;

  constructor(
    private service: InsumoPuntoVentaPrecioService,
    private dialog: DialogService
  ) {}

  createMarker(item: InsumoPuntoVentaPrecioList): Marker<InsumoPuntoVentaPrecioList> {
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
          <strong>${item.punto_venta_nombre}</strong>
          ${latLng ? '' : ' <span>(Sin Ubicación)</span>'}
          ${
            item.proveedor_nombre
              ? `<div><strong>Proveedor: </strong>${item.proveedor_nombre}</div>`
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
        ${
          item.punto_venta_logo
            ? `
            <div class="info-logo">
              <img
                src="${item.punto_venta_logo}"
                alt="logo"
              />
            </div>`
            : ''
        }
      </div>`;
    return marker;
  }

  dialogRefFunction(
    selectedValue: InsumoPuntoVentaPrecioList | undefined
  ): MatDialogRef<SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>> {
    const data: SelectorInMapDialogData<InsumoPuntoVentaPrecioList> = {
      list: this.list.slice(),
      title: this.title,
      selectedValue,
      drawMarkerFunction: this.createMarker.bind(this),
      filterFunction: this.filterMarker.bind(this),
    };
    const config: MatDialogConfig = {
      data,
      panelClass: 'selector-dialog',
      position: {
        top: '1rem',
      },
    };
    return this.dialog.open<
      SelectorInMapDialogComponent<InsumoPuntoVentaPrecioList>,
      InsumoPuntoVentaPrecioList
    >(SelectorInMapDialogComponent, config);
  }

  private filterMarker(
    regexList: RegExp[],
    item: InsumoPuntoVentaPrecioList | null
  ): boolean {
    if (!item) return false;
    if (!regexList.length) return true;
    return regexList.every((regex) => {
      return (
        regex.test(item.punto_venta_nombre) ||
        regex.test(item.proveedor_nombre ?? '') ||
        regex.test(item.ciudad_nombre ?? '') ||
        regex.test(item.localidad_nombre ?? '') ||
        regex.test(item.pais_nombre_corto ?? '') ||
        regex.test(item.punto_venta_direccion ?? '')
      );
    });
  }


}
