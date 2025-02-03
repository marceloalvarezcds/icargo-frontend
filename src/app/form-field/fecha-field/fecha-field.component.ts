import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-fecha-field',
  templateUrl: './fecha-field.component.html',
  styleUrls: ['./fecha-field.component.scss']
})
export class FechaFieldComponent implements OnInit {

  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() requerido = false;
  @Input() title = '';
  @Input() showFutureDateWarning: boolean = true; 
  private selectedDate: Date | null = null;

  constructor(private dialog: DialogService) {}

  ngOnInit(): void {
    if (this.showFutureDateWarning) {
      this.control?.valueChanges.subscribe((value: Date) => {
        if (value) {
          const selectedDate = new Date(value);
          const currentDate = new Date();

          if (selectedDate > currentDate) {
            this.showConfirmationDialog(selectedDate);
          }
        }
      });
    }
  }

  
  private showConfirmationDialog(selectedDate: Date): void {
    this.dialog.confirmation(
      'La fecha seleccionada es futura. ¿Desea continuar?',
     
    );
  }
  

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  onDateChange(selectedDate: Date): void {
    const currentDate = new Date();
    const updatedDateTime = new Date(selectedDate);
    updatedDateTime.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    this.control.setValue(updatedDateTime);
  }
}