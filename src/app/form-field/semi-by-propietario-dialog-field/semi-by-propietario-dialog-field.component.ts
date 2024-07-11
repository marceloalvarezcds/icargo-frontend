import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { Semi, SemiList } from 'src/app/interfaces/semi';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-semi-by-propietario-dialog-field',
  templateUrl: './semi-by-propietario-dialog-field.component.html',
  styleUrls: ['./semi-by-propietario-dialog-field.component.scss']
})
export class SemiByPropietarioDialogFieldComponent implements AfterViewInit {
  readonly inputValuePropName = 'placa';
  list$?: Observable<SemiList[]>;
  cId?: number;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: SemiList) => element.estado,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: SemiList) => element.placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'color_descripcion',
      title: 'Color',
      value: (element: SemiList) => element.color_descripcion,
    },
  ];

  @Input() controlName = 'semi_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Semi';

  @Output() valueChange = new EventEmitter<SemiList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<SemiList>;

  constructor(private service: SemiService) { }

  ngAfterViewInit(): void {
    this.getList();
  }

  private getList(): void {
    this.list$ = this.service.getList();
  }
  
}
