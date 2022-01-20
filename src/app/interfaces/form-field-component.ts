import { FormGroup } from "@angular/forms";

export interface FormFieldComponent {
  groupName?: string;
  controlName: string;
  form?: FormGroup;
}
