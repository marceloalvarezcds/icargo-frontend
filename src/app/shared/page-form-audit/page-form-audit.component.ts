import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-page-form-audit',
  templateUrl: './page-form-audit.component.html',
  styleUrls: ['./page-form-audit.component.scss']
})
export class PageFormAuditComponent {
  created_at_format = '';
  modified_at_format = '';

  @Input() created_by = '';
  @Input() set created_at(str: string) {
    this.created_at_format = moment(str, moment.ISO_8601).format('DD/MM/YYYY HH:mm:ss');
  }
  @Input() modified_by = '';
  @Input() set modified_at(str: string) {
    this.modified_at_format = moment(str, moment.ISO_8601).format('DD/MM/YYYY HH:mm:ss');
  }
}
