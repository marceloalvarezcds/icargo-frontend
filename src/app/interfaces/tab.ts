import { NavigationExtras } from '@angular/router';

export interface Tab {
  name: string;
  path: string;
  url: string;
  extras: NavigationExtras;
}

export interface RouteTabData {
  name: string;
  useEtapa?: boolean;
  useEstado?: boolean;
}
