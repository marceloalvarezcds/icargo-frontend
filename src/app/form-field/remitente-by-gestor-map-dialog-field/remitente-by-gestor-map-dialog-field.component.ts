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
import { RemitenteList } from 'src/app/interfaces/remitente';
import { DialogService } from 'src/app/services/dialog.service';
import { RemitenteService } from 'src/app/services/remitente.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-remitente-by-gestor-map-dialog-field',
  templateUrl: './remitente-by-gestor-map-dialog-field.component.html',
  styleUrls: ['./remitente-by-gestor-map-dialog-field.component.scss'],
})
export class RemitenteByGestorMapDialogFieldComponent {
  readonly inputValuePropName = 'nombre';

  list: RemitenteList[] = [];
  //subs = this.service.getListByGestorCuentaId().subscribe((list) => {
  //  this.list = list;
  //});

  @Input() remitenteEvents?: Observable<RemitenteList>;
  @Input() isRemote?:boolean = false;
  @Input() form!: FormGroup;
  @Input() controlName = 'remitente_id';
  @Input() groupName = '';
  @Input() title = 'Cliente';

  @Output() valueChange = new EventEmitter<RemitenteList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<RemitenteList, SelectorInMapDialogComponent<RemitenteList>>;

  fetchDataFunction = () => this.service.getListByGestorCuentaId();

  constructor(
    private service: RemitenteService,
    private dialog: DialogService
  ) {}

  createMarker(item: RemitenteList): Marker<RemitenteList> {
    const latLng: google.maps.ReadonlyLatLngLiteral | undefined =
      item.latitud && item.longitud
        ? { lat: item.latitud, lng: item.longitud }
        : undefined;
    const marker = new Marker<RemitenteList>({
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
      console.log("createMarker: ", marker);
    return marker;
  }

  dialogRefFunction(
    selectedValue: RemitenteList | undefined,
    dataList: RemitenteList[] | undefined,
  ): MatDialogRef<SelectorInMapDialogComponent<RemitenteList>> {

    if (this.isRemote && dataList) this.list = dataList;

    const data: SelectorInMapDialogData<RemitenteList> = {
      list: this.isRemote ? dataList ?? []  : this.list,
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

    return this.dialog.open<SelectorInMapDialogComponent<RemitenteList>,RemitenteList>(SelectorInMapDialogComponent, config);
  }

  private filterMarker(
    regexList: RegExp[],
    item: RemitenteList | null
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
