import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { NavigationExtras, Params, Route, Routes } from '@angular/router';
import { bancoUrls } from 'src/app/banco/banco-routing.module';
import {
  centroOperativoUrls,
  gestorCargaUrls,
  proveedorUrls,
  puntoVentaUrls,
  remitenteUrls,
} from 'src/app/entities/entities-routing.module';
import {
  combinacionUrls,
  propietarioUrls,
  choferUrls,
  camionUrls,
  semiUrls,
} from 'src/app/flota/flota-routing.module';
import { fleteUrls } from 'src/app/flete/flete-routing.module'
import { ordenCargaUrls } from 'src/app/orden-carga/orden-carga-routing.module'
import { estadoCuentaUrls } from 'src/app/estado-cuenta/estado-cuenta-routing.module'
import { cajaUrls } from 'src/app/caja/caja-routing.module'
import { listadoUrls } from 'src/app/listado/listado-routing.module'
import { usersUrls, rolUrls } from 'src/app/users/users-routing.module'
import { cargoUrls } from 'src/app/biblioteca/biblioteca-routing.module'
import { tipoCuentaUrls, tipoMovimientoUrls } from 'src/app/parametros/parametros-routing.module'
import { RouterSnapshot } from 'src/app/interfaces/router-snapshot';


@Injectable({
  providedIn: 'root',
})
export class ActivatedRouteService {
  urls: Routes = [
    ...bancoUrls,
    ...centroOperativoUrls,
    ...gestorCargaUrls,
    ...proveedorUrls,
    ...puntoVentaUrls,
    ...remitenteUrls,
    ...combinacionUrls,
    ...propietarioUrls,
    ...choferUrls,
    ...camionUrls,
    ...semiUrls,
    ...fleteUrls,
    ...ordenCargaUrls,
    ...estadoCuentaUrls,
    ...cajaUrls,
    ...listadoUrls,
    ...usersUrls,
    ...rolUrls,
    ...cajaUrls,
    ...cargoUrls,
    ...tipoCuentaUrls,
    ...tipoMovimientoUrls,
  ];

  snapshot$ = new BehaviorSubject<RouterSnapshot>({
    params: {},
    queryParams: {},
    data: {},
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

  getQueryParamsByObject(obj: any): string {
    let params = new HttpParams();
    params.appendAll(obj);
    return params.toString();
  }

  private onChangeUrl(url: string): void {
    const urlSplit = url.split('?');
    const path = urlSplit[0];
    const query = urlSplit.length > 1 ? urlSplit[1] : '';
    const queryParams: Params =
      query !== ''
        ? JSON.parse(
            '{"' + query.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
            function (key, value) {
              return key === '' ? value : decodeURIComponent(value);
            }
          )
        : {};
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
    this.snapshot$.next({ params, queryParams, data });
    this.url$.next(url);
  }
}
