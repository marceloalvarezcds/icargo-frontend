import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual } from 'lodash';
import { Observable } from 'rxjs';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  PermisoModuloRouterEnum as r,
} from 'src/app/enums/permiso-enum';
import { InsumoPuntoVenta } from 'src/app/interfaces/insumo-punto-venta';
import { InsumoPuntoVentaPrecioForm, InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
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
  horaPattern: RegExp =  /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

  form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      insumo_id: [null, Validators.required],
      moneda_id: null,
      unidad_id: null,
      precio: [null, Validators.required],
      fecha_inicio: null,
      created_at_insumo: null,
      hora_inicio: null,
      hora: null,
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

  constructor( private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackbarService,
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
  ) {
    this.form = this.fb.group({
      punto_venta_id: [null, Validators.required],
      insumo_id: [{ value: '', disabled: true }, Validators.required],
      fecha_inicio: [{ value: '', disabled: true }],
      hora_inicio: [
        '',
        [
          Validators.required,
          Validators.pattern(this.horaPattern)
        ]
      ],
      precio: [{ value: '', disabled: true }],
      created_at_insumo: [{ value: '', disabled: true }],
      hora: [{ value: '', disabled: true }],
      unidad_id: [{ value: '', disabled: true }],
      moneda_id: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: true }],
    });
  
    // Deshabilitar los campos hora_inicio y fecha_inicio al inicio
    this.form.get('hora_inicio')?.disable();
    this.form.get('fecha_inicio')?.disable();
  }

  ngOnInit(): void {
    this.getData();
    this.form.get('punto_venta_id')?.setValue(this.pdv?.punto_venta_id);
  
    // Configuración para created_at_insumo si es necesario
    this.form.get('created_at_insumo')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const date = new Date(value);
        this.hora = this.convertTo12HourFormat(date);
        this.form.get('hora')?.setValue(this.hora);
      }
    });
  }
  
  // Método para formatear la hora en formato HH:MM sin segundos
  formatearHora24(date: Date): string {
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  // Función para convertir hora a formato de 12 horas
  convertTo12HourFormat(date: Date): string {
    let hours = date.getHours();
    let minutes: number = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' se convierte a '12'
    
    // Asegúrate de que los minutos y horas estén en formato de dos dígitos
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
        this.puntoVentaId = pdv.punto_venta_id; // Este valor depende de la selección del punto de venta.
        this.monedaId = pdv.insumo_moneda_id; // Este se actualiza correctamente desde pdv.
        this.form.get('insumo_id')?.enable();
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
          this.form.get('created_at_insumo')?.setValue(insumo.created_at_insumo || null);

          if (insumo.created_at_insumo) {
              const dateFin = new Date(insumo.created_at_insumo);
              this.hora = dateFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              this.form.get('hora')?.setValue(this.hora);
          }
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
      const formData = new FormData();
      const data = JSON.parse(JSON.stringify(this.form.value));
      data.punto_venta_id = this.puntoVentaId;
      data.insumo_id = this.insumoId;
      data.moneda_id = this.monedaId;

      // Convertir propiedades a mayúsculas, excepto los correos electrónicos
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string' && key !== 'email') {
          data[key] = data[key].toUpperCase();
        }
      });

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
          punto_venta_id: data.punto_venta_nombre,
          insumo_id: data.insumo_descripcion,
          precio: data.precio,
          fecha_inicio: data.fecha_inicio,
          hora_inicio: data.hora_inicio,
          created_at_insumo: data.created_at_insumo,
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
