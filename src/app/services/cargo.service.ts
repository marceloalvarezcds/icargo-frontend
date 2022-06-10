import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Cargo } from 'src/app/interfaces/cargo';
import { SeleccionableService } from './seleccionable.service';

@Injectable({
  providedIn: 'root',
})
export class CargoService {
  constructor(private service: SeleccionableService) {
    this.service.setEndpoint(m.CARGO);
  }

  getList(): Observable<Cargo[]> {
    return this.service.getActiveList<Cargo>();
  }
}
