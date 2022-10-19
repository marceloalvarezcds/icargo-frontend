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
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { DialogService } from 'src/app/services/dialog.service';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-punto-venta-map-dialog-field',
  templateUrl: './punto-venta-map-dialog-field.component.html',
  styleUrls: ['./punto-venta-map-dialog-field.component.scss'],
})
export class PuntoVentaMapDialogFieldComponent {
  readonly inputValuePropName = 'nombre';
  list: PuntoVentaList[] = [];
  subs = this.service.getListByGestor().subscribe((list) => {
    this.list = list;
  });

  @Input() form!: FormGroup;
  @Input() controlName = 'punto_venta_id';
  @Input() groupName = '';
  @Input() title = 'Punto de Venta';

  @Output() valueChange = new EventEmitter<PuntoVentaList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<
    PuntoVentaList,
    SelectorInMapDialogComponent<PuntoVentaList>
  >;

  constructor(
    private service: PuntoVentaService,
    private dialog: DialogService
  ) {}

  createMarker(item: PuntoVentaList): Marker<PuntoVentaList> {
    const latLng: google.maps.ReadonlyLatLngLiteral | undefined =
      item.latitud && item.longitud
        ? { lat: item.latitud, lng: item.longitud }
        : undefined;
    const marker = new Marker<PuntoVentaList>({
      position: latLng,
      title: item.nombre,
    });
    marker.info = item;
    marker.template = `
      <div class="info-template">
        <div class="info-data">
          <strong>${item.nombre}</strong>
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
            item.direccion
              ? `<div><strong>Dir: </strong>${item.direccion}</div>`
              : ''
          }
        </div>
        ${
          item.logo
            ? `
            <div class="info-logo">
              <img
                src="${item.logo}"
                alt="logo"
              />
            </div>`
            : ''
        }
      </div>`;
    return marker;
  }

  dialogRefFunction(
    selectedValue: PuntoVentaList | undefined
  ): MatDialogRef<SelectorInMapDialogComponent<PuntoVentaList>> {
    const data: SelectorInMapDialogData<PuntoVentaList> = {
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
      SelectorInMapDialogComponent<PuntoVentaList>,
      PuntoVentaList
    >(SelectorInMapDialogComponent, config);
  }

  private filterMarker(
    regexList: RegExp[],
    item: PuntoVentaList | null
  ): boolean {
    if (!item) return false;
    if (!regexList.length) return true;
    return regexList.every((regex) => {
      return (
        regex.test(item.nombre) ||
        regex.test(item.proveedor_nombre ?? '') ||
        regex.test(item.ciudad_nombre ?? '') ||
        regex.test(item.localidad_nombre ?? '') ||
        regex.test(item.pais_nombre_corto ?? '') ||
        regex.test(item.direccion ?? '')
      );
    });
  }
}
