import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Params, Route, Routes } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { bancoUrls } from 'src/app/banco/banco-routing.module';
import { cargoUrls } from 'src/app/biblioteca/biblioteca-routing.module';
import { cajaUrls } from 'src/app/caja/caja-routing.module';
import {
  centroOperativoUrls,
  gestorCargaUrls,
  proveedorUrls,
  puntoVentaUrls,
  remitenteUrls,
} from 'src/app/entities/entities-routing.module';
import { RouterSnapshot } from 'src/app/interfaces/router-snapshot';
import {
  estadoCuentaUrls,
  liquidacionConfirmadaUrls,
  liquidacionUrls,
  movimientosUrls,
} from 'src/app/estado-cuenta/estado-cuenta-routing.module';
import { fleteUrls } from 'src/app/flete/flete-routing.module';
import {
  camionUrls,
  choferUrls,
  propietarioUrls,
  semiUrls,
} from 'src/app/flota/flota-routing.module';
import {
  movimientoListadoUrls,
  rentabilidadUrls,
} from 'src/app/listado/listado-routing.module';
import { ordenCargaUrls } from 'src/app/orden-carga/orden-carga-routing.module';
import {
  tipoCuentaUrls,
  tipoMovimientoUrls,
} from 'src/app/parametros/parametros-routing.module';
import { rolUrls, userUrls } from 'src/app/users/users-routing.module';

@Injectable({
  providedIn: 'root',
})
export class ActivatedRouteService {
  urls: Routes = [
    ...bancoUrls,
    ...cajaUrls,
    ...camionUrls,
    ...cargoUrls,
    ...centroOperativoUrls,
    ...choferUrls,
    ...estadoCuentaUrls,
    ...fleteUrls,
    ...gestorCargaUrls,
    ...liquidacionUrls,
    ...liquidacionConfirmadaUrls,
    ...movimientoListadoUrls,
    ...movimientosUrls,
    ...ordenCargaUrls,
    ...propietarioUrls,
    ...proveedorUrls,
    ...puntoVentaUrls,
    ...remitenteUrls,
    ...rentabilidadUrls,
    ...semiUrls,
    ...tipoCuentaUrls,
    ...tipoMovimientoUrls,
    ...userUrls,
    ...rolUrls,
  ];

  snapshot$ = new BehaviorSubject<RouterSnapshot>({
    data: {},
    params: {},
    queryParams: {},
  });

  private url$ = new BehaviorSubject(this.location.path());

  constructor(private location: Location) {
    this.onChangeUrl(location.path());
    this.location.onUrlChange((url) => this.onChangeUrl(url));
  }

  get currentRoute(): Route | undefined {
    return this.findRoute(this.url);
  }

  get snapshot(): RouterSnapshot {
    return this.snapshot$.value;
  }

  get url(): string {
    return this.url$.value;
  }

  get urlChange(): Observable<string> {
    return this.url$.asObservable();
  }

  findRoute(url: string): Route | undefined {
    return this.urls.find((x) => x.data && url.startsWith(x.data.url));
  }

  getQueryParamsByObject(obj: any | null | undefined): string {
    if (!obj) return '';
    const keys = Object.keys(obj);
    return keys.length
      ? `${keys
          .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
          .join('&')}`
      : '';
  }

  getQueryParamsBySplit(urlSplit: string[]): Params {
    const query = urlSplit.length > 1 ? urlSplit[1] : '';
    return query !== ''
      ? JSON.parse(
          '{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
          function (key, value) {
            return key === '' ? value : decodeURIComponent(value);
          }
        )
      : {};
  }

  private onChangeUrl(url: string): void {
    const urlSplit = url.split('?');
    const path = urlSplit[0];
    const queryParams = this.getQueryParamsBySplit(urlSplit);
    const currentURL = this.findRoute(url);
    const params: Params = {};
    let data = {};
    if (currentURL && currentURL.data) {
      data = currentURL.data;
      const currentPath = currentURL.path ?? '';
      const colonIndex = (/:/.exec(currentPath)?.index ?? 0) - 1;
      if (colonIndex >= 0) {
        const pathParams = currentPath
          .substring(colonIndex)
          .split(':')
          .map((s) => s.replace('/', ''))
          .filter((s) => !!s);
        const urlPath = path.replace(currentURL.data.url, '');
        const pathSplit = urlPath.substring(1).split('/');
        for (let i = 0, len = pathParams.length; i < len; i++) {
          const key = pathParams[i];
          const value = pathSplit[i];
          params[key] = value;
        }
      }
    }
    this.snapshot$.next({ data, params, queryParams });
    this.url$.next(url);
  }
}
