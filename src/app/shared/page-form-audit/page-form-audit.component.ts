import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-form-audit',
  templateUrl: './page-form-audit.component.html',
  styleUrls: ['./page-form-audit.component.scss']
})
export class PageFormAuditComponent {
  @Input() created_by = '';
  @Input() created_at = '';
  @Input() modified_by = '';
  @Input() modified_at = '';
}
