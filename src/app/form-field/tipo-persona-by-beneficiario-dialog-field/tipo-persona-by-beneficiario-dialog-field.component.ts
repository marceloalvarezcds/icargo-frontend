import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RemitenteList } from 'src/app/interfaces/remitente';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { RemitenteService } from 'src/app/services/remitente.service';

@Component({
  selector: 'app-tipo-persona-by-beneficiario-dialog-field',
  templateUrl: './tipo-persona-by-beneficiario-dialog-field.component.html',
  styleUrls: ['./tipo-persona-by-beneficiario-dialog-field.component.scss']
})
export class TipoPersonaByBeneficiarioDialogFieldComponent{

}
