import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ciudad } from 'src/app/interfaces/ciudad';

@Component({
  selector: 'app-page-form-address',
  templateUrl: './page-form-address.component.html',
  styleUrls: ['./page-form-address.component.scss'],
})
export class PageFormAddressComponent {
  ciudadList: Ciudad[] = [];
  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

  @Input() isShow = false;
  @Input() isPanelOpen = false;
  @Input() groupName = 'address';
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
  }

  get address(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get ciudadControl(): FormControl {
    return this.address!.get('ciudad_id') as FormControl;
  }
}
