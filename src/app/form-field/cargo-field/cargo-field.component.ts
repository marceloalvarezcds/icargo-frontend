import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Cargo } from 'src/app/interfaces/cargo';
import { SeleccionableService } from 'src/app/services/seleccionable.service';

@Component({
  selector: 'app-cargo-field',
  templateUrl: './cargo-field.component.html',
  styleUrls: ['./cargo-field.component.scss'],
  providers: [SeleccionableService],
})
export class CargoFieldComponent implements OnChanges{
  list$?: Observable<Cargo[]>;

  @Input() control?: FormControl;
  @Input() title = 'Cargo';
  @Input() isViewMode: boolean = false;
  @Input() requerido: boolean = false;
  @Output() valueChange = new EventEmitter<Cargo | undefined>();

  constructor(private service: SeleccionableService<Cargo>) {
    this.service.setEndpoint(m.CARGO);
    this.list$ = this.service.getActiveList();
  }

  ngOnChanges(): void {
    if (this.control && this.list$) {
      this.list$.subscribe(list => {
        if (list && list.length > 0 && !this.control?.value) {
          this.control?.setValue(list[2]); // Establecer el primer cargo como seleccionado
        }
      });
    }
  }
  
  

  compareWith(o1?: Cargo, o2?: Cargo): boolean {
    return o1?.id === o2?.id;
  }

  textValueFormat(value: Cargo): string {
    return value.descripcion;
  }

  value(value: Cargo): number {
    return value.id;
  }
}

