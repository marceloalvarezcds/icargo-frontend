import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';

@Component({
  selector: 'app-beneficiario-field',
  templateUrl: './beneficiario-field.component.html',
  styleUrls: ['./beneficiario-field.component.scss']
})
export class BeneficiarioFieldComponent implements AfterViewInit, OnChanges {
  readonly inputValuePropName = 'ruc';
  list$: Observable<PropietarioList[]> = new Observable();
  
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: PropietarioList) => element.estado,
    },
    {
      def: 'nombre',
      title: 'Beneficiario',
      value: (element: PropietarioList) => element.nombre,
    },
    {
      def: 'ruc',
      title: 'Nº Documento',
      value: (element: PropietarioList) => element.ruc,
    },
  ];
  
  get group(): FormGroup {
    return this.form.get(this.groupName) as FormGroup;
  }

  get control() {
    return this.form?.get(this.groupName)?.get(this.controlName);
  }

  @Input() propietario?: PropietarioList;  // Valor recibido del componente padre
  @Input() title = '';
  @Input() form!: FormGroup;
  @Input() controlName = 'propietario_id';
  @Input() controlNameRuc = 'ruc';
  @Input() groupName = '';
  @Input() isShow = false;

  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();

  fetchFunction = () => this.service.getList();
  
  constructor(private service: PropietarioService) { }

  ngAfterViewInit(): void {
    // Solo si tienes lógica adicional al iniciar la vista
    this.loadList();
  }

  private loadList(): void {
    // Llama a tu servicio para cargar la lista de propietarios
    this.list$ = this.service.getList();
  }

  ngOnChanges() {
    // Si el valor de propietario cambia, actualiza la lista de búsqueda o el valor en el campo
    if (this.propietario) {
      this.control?.setValue(this.propietario[this.inputValuePropName]);
      // Puedes emitir un valor para que el componente padre reaccione a este cambio si es necesario
      this.valueChange.emit(this.propietario);
    }
  }
}
