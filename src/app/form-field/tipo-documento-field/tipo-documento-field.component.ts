import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TipoDocumento } from 'src/app/interfaces/tipo-documento';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { isRuc } from 'src/app/utils/tipo-documento';

@Component({
  selector: 'app-tipo-documento-field',
  templateUrl: './tipo-documento-field.component.html',
  styleUrls: ['./tipo-documento-field.component.scss']
})
export class TipoDocumentoFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  controlSubscription?: Subscription;
  tipoDocumentoList: TipoDocumento[] = [];
  tipoDocumentoSubscription = this.tipoDocumentoService.getList().subscribe(list => {
    this.tipoDocumentoList = list.slice();
  });

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.controlSubscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(id => {
      this.rucSelected.emit(isRuc(this.tipoDocumentoList, id));
    });
  }
  @Input() controlName = 'tipo_documento_id';
  @Input() groupName = '';
  @Input() title = 'Tipo de Documento';

  @Output() rucSelected = new EventEmitter<boolean>();

  constructor(private tipoDocumentoService: TipoDocumentoService) { }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
    this.tipoDocumentoSubscription.unsubscribe();
  }
}
