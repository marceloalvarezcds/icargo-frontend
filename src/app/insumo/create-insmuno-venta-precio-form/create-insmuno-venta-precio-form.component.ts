import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';
import { Subject } from 'rxjs';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { Insumo } from 'src/app/interfaces/insumo';
import { InsumoService } from 'src/app/services/insumo.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DateValidator } from 'src/app/validators/date-validator';

@Component({
  selector: 'app-create-insmuno-venta-precio-form',
  templateUrl: './create-insmuno-venta-precio-form.component.html',
  styleUrls: ['./create-insmuno-venta-precio-form.component.scss']
})
export class CreateInsmunoVentaPrecioFormComponent implements OnInit {
  isEdit = false;
  isShow = false;
  modelo = m.INSUMO_PUNTO_VENTA_PRECIO;
  proveedor?: string;
  tipoInsumo?: string;
  backUrl = `/insumo/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.LISTAR}`;
  saldoAnticipo = 0;
  item?: InsumoPuntoVentaPrecioList;
  insumoPdvId: number | null = null;
  tipoInsumoList: Insumo[] = [];
  tipoInsumoList$ =
  this.insumoService.getList();
  pdvEventsSubject: Subject<PuntoVentaList> = new Subject<PuntoVentaList>();
  pdvInsumoEventsSubject: Subject<InsumoPuntoVentaPrecioList> = new Subject<InsumoPuntoVentaPrecioList>();
  hora: string | null = null;
  autoSelectFiltro = "L";
  insumoId: number | null = null;
  horaPattern: RegExp =  /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      insumo_id: [null, Validators.required],
      moneda_id: null,
      unidad_id: null,
      precio: [null, Validators.required],
      fecha_inicio: [new Date(), Validators.required],
      hora_inicio: [
        this.convertTo12HourFormat(new Date()),
        Validators.compose([Validators.required, Validators.pattern(this.horaPattern)])
      ],
      insumo: null,
      punto_venta: null,
      observacion: null,
  });
  initialFormValue = this.form.value;
  hasChange = false;
  hasChangeSubscription = this.form.valueChanges.subscribe((value) => {
    setTimeout(() => {
      this.hasChange = !isEqual(this.initialFormValue, value);
    });
  });

  @Output() insumoChange = new EventEmitter<Insumo | undefined>();
  @Output() insumoPdvChange = new EventEmitter<InsumoPuntoVentaPrecioList | undefined>();
  @Output() insumoPrecioChange = new EventEmitter<InsumoPuntoVentaPrecioList | undefined>();
  //@Output() valueChange = new EventEmitter<number>();

  get proveedorControl(): FormControl {
    return this.form.get('proveedor_id') as FormControl;
    }

  ngOnInit() {
    this.insumoService.getList().subscribe(insumos => {
      this.tipoInsumoList = insumos;
    });
    // this.form.get('created_at_insumo')?.valueChanges.subscribe((value: string) => {
    //   if (value) {
    //     const date = new Date(value);
    //     this.hora = this.convertTo12HourFormat(date);
    //     this.form.get('hora')?.setValue(this.hora);
    //   }
    // });
    // this.form.get('created_at_insumo')?.disable();

  }

  onMonedaSeleccionada(moneda: any) {
    //this.form.get('moneda_id')?.setValue(moneda?.id);
    //this.valueChange.emit(moneda?.id);
  }


  constructor(
    private insumoService: InsumoService,
    private fb: FormBuilder,
    private router: Router,
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
    private snackbar: SnackbarService,
  ) {
    this.form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      insumo_id: ['', Validators.required],
      fecha_inicio: [new Date(), Validators.required],
      hora_inicio: [
        this.convertTo12HourFormat(new Date()),
        Validators.compose([Validators.required, Validators.pattern(this.horaPattern)])
      ],
      precio: ['', Validators.required],
      unidad_id: ['', []],
      moneda_id: ['', []],
      observacion: ['', []],
    });

  }

  puntoVentaChange(event?: PuntoVentaList): void {
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
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

  getDescripcionById(insumoId: any): string {
    const id = typeof insumoId === 'string' ? parseInt(insumoId, 10) : insumoId;
    const insumo = this.tipoInsumoList.find(item => item.id === id);
    return insumo ? insumo.descripcion : '';
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  submit(confirmed: boolean): void {
        this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = JSON.parse(JSON.stringify(this.form.value));
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      this.insumoPuntoVentaPrecioService.createMercaderia(formData).subscribe((item) => {
        this.snackbar.openSave();
        this.insumoId = item.id;
        this.form.get('observacion')?.setValue('');
        this.isShow = true;
        this.form.disable();
      });
    }
  }

  getData(): void {
    if (!this.item) return
    this.insumoPuntoVentaPrecioService.getById(
      this.item.id).subscribe((data) => {
      this.item = data;
    });
  }

}
