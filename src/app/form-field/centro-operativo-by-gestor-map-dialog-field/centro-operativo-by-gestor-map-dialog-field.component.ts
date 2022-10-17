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
import { CentroOperativoList } from 'src/app/interfaces/centro-operativo';
import {
  Marker,
  SelectorInMapDialogData,
} from 'src/app/interfaces/dialog-data';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-centro-operativo-by-gestor-map-dialog-field',
  templateUrl: './centro-operativo-by-gestor-map-dialog-field.component.html',
  styleUrls: ['./centro-operativo-by-gestor-map-dialog-field.component.scss'],
})
export class CentroOperativoByGestorMapDialogFieldComponent {
  readonly inputValuePropName = 'nombre';
  list: CentroOperativoList[] = [];
  subs = this.service.getListByGestorCuentaId().subscribe((list) => {
    this.list = list;
  });

  @Input() form!: FormGroup;
  @Input() controlName = 'centro_operativo_id';
  @Input() groupName = '';
  @Input() title = 'Centro operativo';

  @Output() valueChange = new EventEmitter<CentroOperativoList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<
    CentroOperativoList,
    SelectorInMapDialogComponent<CentroOperativoList>
  >;

  constructor(
    private service: CentroOperativoService,
    private dialog: DialogService
  ) {}

  createMarker(
    item: CentroOperativoList
  ): Marker<CentroOperativoList> | undefined {
    if (item.latitud && item.longitud) {
      const myLatLng = { lat: item.latitud, lng: item.longitud };
      const marker = new Marker<CentroOperativoList>({
        position: myLatLng,
        title: item.nombre,
      });
      marker.info = item;
      marker.template = `
        <div class="info-template">
          <div class="info-data">
            <strong>${item.nombre}</strong>
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
    return undefined;
  }

  dialogRefFunction(
    selectedValue: CentroOperativoList | undefined
  ): MatDialogRef<SelectorInMapDialogComponent<CentroOperativoList>> {
    const data: SelectorInMapDialogData<CentroOperativoList> = {
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
      SelectorInMapDialogComponent<CentroOperativoList>,
      CentroOperativoList
    >(SelectorInMapDialogComponent, config);
  }

  private filterMarker(
    regexList: RegExp[],
    item: CentroOperativoList | null
  ): boolean {
    if (!item) return false;
    if (!regexList.length) return true;
    return regexList.every((regex) => {
      return (
        regex.test(item.nombre) ||
        regex.test(item.nombre_corto ?? '') ||
        regex.test(item.direccion ?? '')
      );
    });
  }
}
