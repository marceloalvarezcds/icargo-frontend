import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { Observable, Subject } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { InsumoPuntoVenta } from 'src/app/interfaces/insumo-punto-venta';
import { InsumoPuntoVentaPrecioForm, InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-insumo-venta-precio-form',
  templateUrl: './insumo-venta-precio-form.component.html',
  styleUrls: ['./insumo-venta-precio-form.component.scss']
})
export class InsumoVentaPrecioFormComponent implements OnInit, OnDestroy  {
  [x: string]: any;
  id!: number;
  isEdit = false;
  isShow = false;
  backUrl = `/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.LISTAR}`;
  modelo = m.INSUMO_PUNTO_VENTA_PRECIO;
  horaInicio: string | null = null;
  hora: string | null = null;
  isInfoTouched = true;
  gestorCargaId?: number;
  item?: InsumoPuntoVentaPrecioList;
  pdv?: InsumoPuntoVentaPrecioList;
  insumoPDVList$: Observable<InsumoPuntoVenta[]> | undefined;
  puntoVentaId: number | null = null;
  insumoId: number | null = null;
  monedaId: number | null = null;
  proveedorId: number | null = null;
  horaPattern: RegExp =  /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  pdvEventsSubject: Subject<PuntoVentaList> = new Subject<PuntoVentaList>();

  form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      proveedor_id: null,
      insumo_id: [null, Validators.required],
      moneda_id: null,
      unidad_id: null,
      precio: [null, Validators.required],
      fecha_inicio: [new Date(), Validators.required],
      hora_inicio: null,
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

  @Output() insumoPdvChange = new EventEmitter<InsumoPuntoVentaPrecioList | undefined>();
  @Output() insumoPrecioChange = new EventEmitter<InsumoPuntoVentaPrecioList | undefined>();


  get getPunto_venta_id(): FormArray {
    return this.form.get('punto_venta_id') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService,
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
  ) {
    this.form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      insumo_id: [{ value: '', disabled: true }, Validators.required],
      proveedor_id: [{ value: '', disabled: true }, Validators.required],
      fecha_inicio: [{ value: '', disabled: true }],
      hora_inicio: [
        '',
        [
          Validators.required,
          Validators.pattern(this.horaPattern)
        ]
      ],
      precio: [{ value: '', disabled: true }],
      hora: [{ value: '', disabled: true }],
      unidad_id: [{ value: '', disabled: true }],
      moneda_id: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: true }],
    });

    this.form.get('hora_inicio')?.disable();
    this.form.get('fecha_inicio')?.disable();
  }

  get proveedorControl(): FormControl {
    return this.form.get('proveedor_id') as FormControl;
    }

  ngOnInit(): void {
    this.getData();
    this.form.get('punto_venta_id')?.setValue(this.pdv?.punto_venta_id);
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


  enableOtherFields(): void {
     this.form.get('fecha_inicio')?.enable();
     this.form.get('hora_inicio')?.enable();
     this.form.get('precio')?.enable();
     this.form.get('observacion')?.enable();
  }

  ngOnDestroy(): void {
    this.hasChangeSubscription.unsubscribe();
  }

  redirectToEdit(): void {
    this.router.navigate([`/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.EDITAR}`, this.id]);
  }

  back(confirmed: boolean): void {
    if (confirmed) {
      this.submit(confirmed);
    } else {
      this.router.navigate([this.backUrl]);
    }
  }

  onPDVPrecioChange(pdv?: InsumoPuntoVentaPrecioList) {
    if (pdv) {
        this.insumoPdvChange.emit(pdv);
        this.puntoVentaId = pdv.punto_venta_id;
        this.monedaId = pdv.insumo_moneda_id;
        this.form.get('insumo_id')?.enable();
        this.form.get('proveedor_id')?.setValue(pdv.proveedor_nombre || null);
    }
  }

  onInsumoDescipcionChange(insumo?: InsumoPuntoVentaPrecioList) {
      if (insumo) {
          this.insumoPrecioChange.emit(insumo);
          this.insumoId = insumo.insumo_id;
          this.form.get('precio')?.setValue(insumo.precio || null);
          this.form.get('fecha_inicio')?.setValue(insumo.fecha_inicio || null);
          this.form.get('unidad_id')?.setValue(insumo.insumo_unidad_descripcion || null);
          this.form.get('moneda_id')?.setValue(insumo.insumo_moneda_nombre || null);
          this.form.get('observacion')?.setValue(insumo.observacion || null);
          this.form.get('hora_inicio')?.setValue(insumo.hora_inicio || null);
        this.enableOtherFields()
      }

      const now = new Date();
      const currentDate = now.toISOString();
      this.form.get('fecha_inicio')?.setValue(currentDate);
      const formattedTime = this.convertTo12HourFormat(now);
      this.form.get('hora_inicio')?.setValue(formattedTime);
  }


  submit(confirmed: boolean): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = JSON.parse(JSON.stringify(this.form.value));

      // Convertir fecha_inicio a formato ISO sin zona horaria
      if (data.fecha_inicio) {
        const fechaLocal = new Date(data.fecha_inicio);
        // Convertimos a ISO y eliminamos la zona horaria (sin 'Z')
        data.fecha_inicio = fechaLocal.toISOString().slice(0, -1); // Eliminar el 'Z' al final
      }

      data.punto_venta_id = this.puntoVentaId;
      data.insumo_id = this.insumoId;
      data.moneda_id = this.monedaId;

      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.hasChange = false;
      this.initialFormValue = this.form.value;

      if (this.isEdit) {
        this.insumoPuntoVentaPrecioService.edit(this.id, formData).subscribe(() => {
          this.snackbar.openUpdateAndRedirect(confirmed, this.backUrl);
          this.getData();
        });
      } else {
        this.insumoPuntoVentaPrecioService.create(formData).subscribe((insumoVentaPrecio) => {
          this.snackbar.openSaveAndRedirect(
            confirmed,
            this.backUrl,
            r.INSUMO_PUNTO_VENTA_PRECIO,
            m.INSUMO_PUNTO_VENTA_PRECIO,
            insumoVentaPrecio.id
          );
        });
      }
    }
  }


  private getData(): void {
    this.id = +this.route.snapshot.params.id;
    if (this.id) {
      this.isEdit = /edit/.test(this.router.url);
      this.isShow = /ver/.test(this.router.url);
      if (this.isShow) {
        this.form.disable();
      }
      if (this.isEdit) {
        this.enableOtherFields();
      }
      this.insumoPuntoVentaPrecioService.getById(this.id).subscribe((data) => {
        this.item = data;
        this.form.patchValue({
          punto_venta_id: data.punto_venta_alias,
          proveedor_id: data.proveedor_nombre ?? null,
          insumo_id: data.insumo_descripcion,
          precio: data.precio,
          fecha_inicio: data.fecha_inicio,
          hora_inicio: data.hora_inicio,
          unidad_id: data.insumo_unidad_descripcion,
          moneda_id: data.insumo_moneda_nombre,
          observacion: data.observacion,
        });

        setTimeout(() => {
          this.hasChange = false;
          this.initialFormValue = this.form.value;
        }, 500);
      });
    }
  }
}
