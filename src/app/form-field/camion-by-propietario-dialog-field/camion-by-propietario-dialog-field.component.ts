import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Camion, CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { CamionService } from 'src/app/services/camion.service';

@Component({
  selector: 'app-camion-by-propietario-dialog-field',
  templateUrl: './camion-by-propietario-dialog-field.component.html',
  styleUrls: ['./camion-by-propietario-dialog-field.component.scss']
})
export class CamionByPropietarioDialogFieldComponent implements AfterViewInit {
  readonly inputValuePropName = 'placa';
  list$?: Observable<CamionList[]>;
  cId?: number;
  sId?: number;
  id?: number;
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: CamionList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CamionList) => element.estado,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: CamionList) => element.placa,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: CamionList) => element.marca_descripcion,
    },
    {
      def: 'color_descripcion',
      title: 'Color',
      value: (element: CamionList) => element.color_descripcion,
    },
  ];

  @Input() controlName = 'camion_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'TRACTO';
  @Input() isEdit: boolean = false;
  @Input() isShow: boolean = true;
  @Output() valueChange = new EventEmitter<CamionList | undefined>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<CamionList>;

  constructor(private service: CamionService) {}

  ngAfterViewInit(): void {
    this.getList(); 
  }

  private getList(): void {
    this.list$ = this.service.getList();
  }


  camionChange(camion?: CamionList): void {
    if (this.isEdit) {
        return;
    }
    if (this.isShow) {
      return; // No hacemos nada si está en modo de visualización (show).
    }


    if (camion) {
        const isInCombinacion = camion.is_in_combinacion === true;  
        
        if (isInCombinacion) {
            alert(`El camión con placa ${camion.placa} ya está en una combinación.`);
            this.form.reset();  
            this.form.get('camion_id')?.setValue(null);  
        } else {
            this.valueChange.emit(camion);  
        }
    }
  }
}

