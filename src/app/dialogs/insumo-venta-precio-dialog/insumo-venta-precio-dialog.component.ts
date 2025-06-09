import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { InsumoService } from 'src/app/services/insumo.service';
import { Insumo } from 'src/app/interfaces/insumo';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { Subject } from 'rxjs';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-insumo-venta-precio-dialog',
  templateUrl: './insumo-venta-precio-dialog.component.html',
  styleUrls: ['./insumo-venta-precio-dialog.component.scss']
})
export class InsumoVentaPrecioDialogComponent implements OnInit {
  isEdit?: boolean = false;
  isShow?: boolean = false;
  isShowBtn?: boolean = false;
  id!: number;
  hora: string | null = null;
  puntoVentaId: number | null = null;
  insumoId: number | null = null;
  monedaId: number | null = null;
  proveedorId: number | null = null;
  tipoInsumoList: Insumo[] = [];
  tipoInsumoList$ =
  this.insumoService.getList();
  pdvEventsSubject: Subject<PuntoVentaList> = new Subject<PuntoVentaList>();
  horaPattern: RegExp = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  autoSelectFiltro = "L";

  form = this.fb.group({
    punto_venta_id: [this.data?.punto_venta_nombre || null],
    punto_venta_nombre:[this.data?.punto_venta_nombre || null],
    proveedor_nombre: [this.data?.proveedor_nombre || null],
    proveedor_id: [this.data?.proveedor_nombre || null],
    insumo_id: [this.data?.insumo_descripcion || null, Validators.required],
    moneda_id: this.data?.insumo_moneda_nombre || null,
    unidad_id: this.data?.insumo_unidad_descripcion,
    precio: [this.data?.precio || null, Validators.required],
    fecha_inicio: [this.data?.fecha_inicio || new Date(), Validators.required],
    hora_inicio: [
      this.data?.hora_inicio || this.convertTo12HourFormat(new Date()),
      Validators.compose([Validators.required, Validators.pattern(this.horaPattern)])
    ],
    observacion: [this.data?.observacion || null],
  });


    initialFormValue = this.form.value;
    hasChange = false;
    hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.hasChange = !isEqual(this.initialFormValue, value);
      });
    });

  @Input() item?: InsumoPuntoVentaPrecioList;

  @Output() dataSaved = new EventEmitter<void>();
  //@Output() valueChange = new EventEmitter<number>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InsumoVentaPrecioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
    private insumoService: InsumoService,
    private snackbar: SnackbarService,
  ) {}

  get data(): InsumoPuntoVentaPrecioList | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    if (this.isShow) {
      return 'VER';
    }
    return this.isEdit ? 'ACTUALIZAR' : 'NUEVA';
  }


  get modeText(): string {
    return this.isEdit ? 'PRECIO' : 'MERCADERIA';
  }


  ngOnInit(): void {

    this.form.get('proveedor_id')?.disable();
    this.form.get('proveedor_nombre')?.disable();
    // this.form.get('created_at_insumo')?.disable();
    this.form.get('hora')?.disable();
    if (this.dialogData?.punto_venta_id) {
      this.form.get('punto_venta_id')?.setValue(this.dialogData.punto_venta_id);
    }

    if (this.dialogData?.proveedor_id) {
      this.form.get('proveedor_id')?.setValue(this.dialogData.proveedor_id);
    }

    if (this.dialogData?.punto_venta_nombre) {
      this.form.get('punto_venta_nombre')?.setValue(this.dialogData.punto_venta_nombre);
    }

    if (this.dialogData?.proveedor_nombre) {
      this.form.get('proveedor_nombre')?.setValue(this.dialogData.proveedor_nombre);
    }

    if (this.dialogData?.hora) {
      this.form.get('hora')?.setValue(this.dialogData.hora);
    }

    this.isEdit = this.dialogData?.isEdit ?? false;
    this.insumoService.getList().subscribe(
      (insumos) => {
        this.tipoInsumoList = insumos;
      },
      (error) => {
        console.error('Error al obtener la lista de insumos', error);
      }

    );

    if (this.isEdit) {
      Object.keys(this.form.controls).forEach((key) => {
        if (!['precio', 'fecha_inicio', 'hora_inicio', 'observacion'].includes(key)) {
          this.form.get(key)?.disable();
        }
      });

    if (this.dialogData?.isShow) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.disable();
        this.isShowBtn = true
      });
      }
    }
    // this.form.get('created_at_insumo')?.valueChanges.subscribe((value: string) => {
    //   if (value) {
    //     const date = new Date(value);
    //     this.hora = this.convertTo12HourFormat(date);
    //     this.form.get('hora')?.setValue(this.hora);
    //   }
    // });
  }



  formatearHora24(date: Date): string {
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  convertTo12HourFormat(date: Date): string {
    let hours = date.getHours();
    let minutes: number = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' se convierte a '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  onInsumoDescipcionChange(insumoId: number) {
    const selectedInsumo = this.tipoInsumoList.find(i => i.id === insumoId);
    if (selectedInsumo) {
      this.form.get('created_at_insumo')?.setValue(selectedInsumo.fecha_creacion || null);

      if (selectedInsumo.fecha_creacion) {
        const dateFin = new Date(selectedInsumo.fecha_creacion);
        const hora = dateFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.form.get('hora')?.setValue(hora);
      }
    }
  }

  onMonedaSeleccionada(moneda: any) {
    //this.form.get('moneda_id')?.setValue(moneda?.id);
    //this.valueChange.emit(moneda?.id);
  }


  submit(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = JSON.parse(JSON.stringify(this.form.value));
      if (data.fecha_inicio) {
        const fechaLocal = new Date(data.fecha_inicio);
        data.fecha_inicio = fechaLocal.toISOString().slice(0, -1);
      }

      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (this.isEdit) {
        this.insumoPuntoVentaPrecioService
          .edit(this.data!.id, formData)
          .subscribe(() => {
            this.close();
            this.dataSaved.emit(data);
          });
      } else {
        this.insumoPuntoVentaPrecioService
          .createMercaderia(formData)
          .subscribe(() => {
            this.close();
            this.dataSaved.emit(data);
          });
      }
    }
  }


  close(): void {
    this.dialogRef.close();
  }
}
