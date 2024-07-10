import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ciudad } from 'src/app/interfaces/ciudad';

@Component({
  selector: 'app-page-form-map',
  templateUrl: './page-form-map.component.html',
  styleUrls: ['./page-form-map.component.scss']
})
export class PageFormMapComponent {

  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

  @Input() ciudadSelected?: Ciudad | null;
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


