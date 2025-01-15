import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { set } from 'lodash';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ASSETS_ICONS_URL } from 'src/app/contanst';
import {
  Marker,
  SelectorInMapDialogData,
} from 'src/app/interfaces/dialog-data';
import { GoogleMapComponent } from 'src/app/shared/google-map/google-map.component';

@Component({
  selector: 'app-selector-in-map-dialog',
  templateUrl: './selector-in-map-dialog.component.html',
  styleUrls: ['./selector-in-map-dialog.component.scss'],
})
export class SelectorInMapDialogComponent<T extends { id: number }>
implements OnInit, AfterViewInit, OnDestroy
{

  Obj = Object;
  allMarkers: Marker<T>[] = [];
  lastMarker?: Marker<T>;
  markerFilteredList: Marker<T>[] = [];
  selectValue?: T | null;
  searchControl = new FormControl('');

  searchControlSubscription = this.searchControl.valueChanges
    .pipe(filter(() => !!this.googleMapComponent))
    .subscribe((searchText) => {
      this.markerFilteredList = this.filterMarkers(this.map!, searchText);
    });

  get searchValue(): string {
    return this.searchControl.value;
  }

  get title(): string {
    return this.data.title;
  }

  get list(): T[] {
    return this.data.list;
  }

  get map(): google.maps.Map | undefined {
    return this.googleMapComponent?.map;
  }

  @ViewChild(GoogleMapComponent) googleMapComponent!: GoogleMapComponent;
  @ViewChild('mapContainer') mapContainer?: HTMLDivElement;

  constructor(
    public dialogRef: MatDialogRef<SelectorInMapDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) private data: SelectorInMapDialogData<T>,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectValue = data.selectedValue;

    if (this.data.isFetchRemote) {
      this.data.fetchFunctionLocal!().subscribe( (data:any) => {
        this.data.list = data;

        console.log("fetchFunctionLocal, ", data);

        //this.drawAllMarkers();

        /*setTimeout(() => {
          this.cdRef.detectChanges();
          if (this.map) {
            const map = this.map!;
            map.addListener('bounds_changed', () => {
              this.markerFilteredList = this.filterMarkers(map, this.searchValue);
              this.cdRef.detectChanges();
            });
          }
        }, 500);*/

      });

    }
  }

  ngOnInit(): void {
    console.log("ngOnInit, ");
    console.log("this.selectValue ", this.selectValue);

  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit, ");
    /*
    if (this.data.isFetchRemote) {
      this.data.fetchFunctionLocal!().subscribe( (data:any) => {
        this.data.list = data;

        this.drawAllMarkers();

      });

      if (this.map) {
        this.cdRef.detectChanges();
        const map = this.map!;
        map.addListener('bounds_changed', () => {
          console.log("bounds_changed: ");
          this.markerFilteredList = this.filterMarkers(map, this.searchValue);
          this.cdRef.detectChanges();
        });
      }

    } else {
*/
      setTimeout(() => {
        this.drawAllMarkers();
        if (this.map) {
          const map = this.map!;
          this.markerFilteredList = this.filterMarkers(map, this.searchValue);
          console.log("this.markerFilteredList", this.markerFilteredList);
          this.cdRef.detectChanges();
        }
      }, 1000);

      this.cdRef.detectChanges();
      if (this.map) {
        const map = this.map!;
        map.addListener('bounds_changed', () => {
          console.log("bounds_changed");
          this.markerFilteredList = this.filterMarkers(map, this.searchValue);
          this.cdRef.detectChanges();
        });
      }

  }

  ngOnDestroy(): void {
    this.searchControlSubscription.unsubscribe();
  }

  select() {
    this.dialogRef.close(this.selectValue);
  }

  setSelectValue(value: T | null, marker: Marker<T>): void {
    this.selectValue = value;
    if (this.lastMarker) {
      this.lastMarker.isSelected = false;
      this.deactiveMarker(this.lastMarker);
    }
    this.selectedMarkerIcon(marker);
    marker.isSelected = true;
    this.lastMarker = marker;
  }

  drawAllMarkers(): void {
    console.log("drawAllMarkers");
    console.log("lista: ", this.list);
    const lista = this.list.slice();
    if (this.map && this.data.drawMarkerFunction) {
      const map = this.map!;
      const bounds = new google.maps.LatLngBounds();
      lista.map((item) => {
        const marker = this.data.drawMarkerFunction!(item);
        console.log("marker: ", marker);
        if (marker) {

          marker.isSelected = marker.info?.id === this.selectValue?.id;
          console.log("marker.isSelected, ", marker.isSelected);
          if (marker.isSelected) {
            this.selectedMarkerIcon(marker);
            this.lastMarker = marker;
          } else {
            this.deactiveMarker(marker);
          }
          marker.addListener('mouseover', () => {
            this.activeMarker(marker);
          });
          marker.addListener('mouseout', () => {
            this.deactiveMarker(marker);
          });
          this.allMarkers.push(marker);
          const position = marker.getPosition();
          console.log("position: ", position);
          if (position) {
            console.log("this.markerFilteredList.length: ", this.markerFilteredList.length);
            this.markerFilteredList.push(marker);
            bounds.extend(position);
          }
        }
      });

      if (!bounds.isEmpty()) {
        setTimeout(() => {
          map.fitBounds(bounds);
        }, 500);
      }
    }
  }

  selectedMarkerIcon(marker: Marker<T>): void {
    const icon: google.maps.ReadonlyIcon = {
      url: `${ASSETS_ICONS_URL}/marker-green.svg`,
      scaledSize: new google.maps.Size(27, 37),
    };
    marker.setZIndex(2);
    marker.setIcon(icon);
  }

  activeMarker(marker: Marker<T>): void {
    const icon: google.maps.ReadonlyIcon = {
      url: `${ASSETS_ICONS_URL}/marker-blue.svg`,
      scaledSize: new google.maps.Size(27, 37),
    };
    marker.setZIndex(3);
    this.setIconInMarker(marker, icon, true);
  }

  deactiveMarker(marker: Marker<T>): void {
    const red = `${ASSETS_ICONS_URL}/marker-red.svg`;
    const green = `${ASSETS_ICONS_URL}/marker-green.svg`;
    let url;
    if (marker.isSelected) {
      url = green;
      marker.setZIndex(2);
    } else {
      url = red;
      marker.setZIndex(1);
    }
    const icon: google.maps.ReadonlyIcon = {
      url,
      scaledSize: new google.maps.Size(27, 37),
    };
    this.setIconInMarker(marker, icon, false);
  }

  private setIconInMarker(
    marker: Marker<T>,
    icon: string | google.maps.ReadonlyIcon | google.maps.ReadonlySymbol | null,
    isActive: boolean = false
  ): void {
    marker.setIcon(icon);
    marker.isActive = isActive;
  }

  private filterMarkers(map: google.maps.Map, searchText: string): Marker<T>[] {
    console.log("filterMarkers: ");
    const bounds = map.getBounds();
    const regexList = searchText
      .trim()
      .split(' ')
      .filter((v) => !!v)
      .map((search) => new RegExp(search, 'gi'));
    const filterFunction = (m: Marker<T>) => {
      const toFilter = this.data.filterFunction
        ? this.data.filterFunction(regexList, m.info)
        : true;
      if (toFilter && m.getPosition()) {
        m.setMap(map);
      } else {
        m.setMap(null);
      }
      return toFilter;
    };
    if (!bounds || bounds.isEmpty()) {
      return this.allMarkers.filter(filterFunction);
    }
    console.log("filterMarkers: ", searchText);
    return this.allMarkers.filter((m) => {
      const position = m.getPosition();
      if (!position) return filterFunction(m);
      if (bounds.contains(position)) {
        return filterFunction(m);
      }
      return false;
    });
  }
}
