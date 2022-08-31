import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, zip } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';

@Component({
  selector: 'app-page-form-geo',
  templateUrl: './page-form-geo.component.html',
  styleUrls: ['./page-form-geo.component.scss']
})
export class PageFormGeoComponent implements OnDestroy {

  latLngSubscription?: Subscription;
  formGroup?: FormGroup;
  markerPosition?: google.maps.LatLngLiteral;

  get info(): FormGroup {
    return this.formGroup!.get('info') as FormGroup;
  }

  get geo(): FormGroup {
    return this.formGroup!.get('geo') as FormGroup;
  }

  get latitudControl(): FormControl {
    return this.geo!.get('latitud') as FormControl;
  }

  get longitudControl(): FormControl {
    return this.geo!.get('longitud') as FormControl;
  }

  @Input() ciudadSelected?: Ciudad | null;
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.latLngSubscription = zip(this.latitudControl.valueChanges, this.longitudControl.valueChanges)
      .pipe(filter(x => (x[0] && x[1])))
      .pipe(map((x) => new google.maps.LatLng(x[0], x[1])))
      .subscribe(latLng => {
        this.markerPosition = latLng.toJSON();
      });
  }
  @Input() isShow = false;
  @Input() isPanelOpen = false;

  ngOnDestroy(): void {
    this.latLngSubscription?.unsubscribe();
  }

  updateMarkerPosition(event: google.maps.MapMouseEvent): void {
    this.geo!.controls['latitud'].setValue(event.latLng.lat());
    this.geo!.controls['longitud'].setValue(event.latLng.lng());
  }
}
