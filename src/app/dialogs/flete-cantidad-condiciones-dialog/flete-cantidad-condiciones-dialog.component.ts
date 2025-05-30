import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FleteService } from 'src/app/services/flete.service';

@Component({
  selector: 'app-flete-cantidad-condiciones-dialog',
  templateUrl: './flete-cantidad-condiciones-dialog.component.html',
  styleUrls: ['./flete-cantidad-condiciones-dialog.component.scss']
})
export class FleteCantidadCondicionesDialogComponent implements OnInit {
  condicionCantidadHint: string = '';
  originalCantidad: number = 0;
  isCantidadValida: boolean = true;
  cantidad: number;
  form!: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<FleteCantidadCondicionesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { flete: any },
    private fleteService: FleteService,
    private fb: FormBuilder
  ) {this.cantidad = data.flete.condicion_cantidad;}

  ngOnInit() {
    this.form = this.fb.group({
      condicion: this.fb.group({
        condicion_cantidad: [this.data.flete.condicion_cantidad || null, Validators.required],
        saldo: [{ value: this.data.flete.saldo || null, disabled: true }],
        cargado: [{ value: this.data.flete.cargado || null, disabled: true }]
      })
    });

    const condicionGroup = this.form.get('condicion');
    if (condicionGroup) {
      condicionGroup.get('condicion_cantidad')?.valueChanges.subscribe(value => {
        const nuevaCantidad = value || 0;
        this.condicionCantidadHint = this.getCondicionCantidadHint(nuevaCantidad);

        this.isCantidadValida = nuevaCantidad >= (this.data.flete.cargado || 0);

        // Si la cantidad aumentó respecto a la original, se suma la diferencia al saldo original
        const diferencia = nuevaCantidad - this.originalCantidad;

        if (diferencia > 0) {
          const nuevoSaldo = (this.data.flete.saldo || 0) + diferencia;
          condicionGroup.get('saldo')?.setValue(nuevoSaldo, { emitEvent: false });
        } else {
          // Si la cantidad no aumentó, se restaura el saldo original
          condicionGroup.get('saldo')?.setValue(this.data.flete.saldo, { emitEvent: false });
        }
      });
    }
    const cantidad = this.form.get('condicion.condicion_cantidad')?.value;
    this.originalCantidad = cantidad || 0;
  }


  getCondicionCantidadHint(value: number): string {
    const formatNumber = (val: number) =>
      new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(val);

    const cantidad = value || 0;
    const cargado = this.data.flete.cargado || 0;

    if (cantidad < cargado) {
      return `<span class="hint-alert">La cantidad no puede ser menor a
      (<strong>${formatNumber(cargado)}</strong> kg ya cargados).</span>`;
    }

    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedCantidad = this.form.get('condicion.condicion_cantidad')?.value;
    this.dialogRef.close(updatedCantidad);
  }

}
