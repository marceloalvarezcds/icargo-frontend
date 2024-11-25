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
  horaPattern: RegExp = /^(?:2[0-3]|[01][0-9]):([0-5][0-9])$/;

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
       
        { disabled: true }
      ],
      precio: [{ value: '', disabled: false }],
      created_at_insumo: [{ value: '', disabled: true }],
      hora: [{ value: '', disabled: true }],
      unidad_id: [{ value: '', disabled: true }],
      moneda_id: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: true }],
      
    });
    this.form.get('hora_inicio')?.disable();
  }

  ngOnInit(): void {
    this.getData();
    this.form.get('punto_venta_id')?.setValue(this.pdv?.punto_venta_id);
  
    // Actualizar el campo hora_inicio cada vez que cambia fecha_inicio
    this.form.get('fecha_inicio')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const date = new Date(value);
        this.horaInicio = this.formatearHora24(date);
        this.form.get('hora_inicio')?.setValue(this.horaInicio);
      }
    });
  
    // Configuración para created_at_insumo si es necesario
    this.form.get('created_at_insumo')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const date = new Date(value);
        this.hora = this.formatearHora24(date);
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
   // Método que se ejecuta al escribir en el campo
   onInputHoraInicio(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Solo permitir el formato de hora HH:MM
    value = value.replace(/[^0-9:]/g, ''); // Solo permite números y dos puntos
    if (value.length === 2 || value.length === 5) {
      value += ':'; // Asegura que se añada el separador ":"
    }
    input.value = value.slice(0, 5); // Limita la longitud a 5 caracteres
  }

  // Método que se ejecuta al perder el foco
  onBlurHoraInicio(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Si el valor tiene el formato incorrecto, lo limpia
    if (!this.isValidHora(value)) {
      input.value = ''; // Limpiar el campo si no es válido
    }
  }

  // Verifica si la hora es válida
  isValidHora(value: string): boolean {
    return this.horaPattern.test(value); // Ahora 'horaPattern' es un objeto RegExp
  }

  enableOtherFields(): void {
    this.form.get('fecha_inicio')?.enable();
    this.form.get('hora_inicio')?.enable();
    this.form.get('precio')?.enable();
    this.form.get('observacion')?.enable();
    this.form.get('precio')?.enable();
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

        // Actualiza la hora de inicio y hora de creación si existen.
        if (insumo.fecha_inicio) {
            const dateInicio = new Date(insumo.fecha_inicio);
            this.horaInicio = dateInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.form.get('hora_inicio')?.setValue(this.horaInicio);
        }

        if (insumo.created_at_insumo) {
            const dateFin = new Date(insumo.created_at_insumo);
            this.hora = dateFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.form.get('hora')?.setValue(this.hora);
        }

        this.enableOtherFields();
    }
}


convertToTime(hourString: string): Time {
  const [hours, minutes] = hourString.split(':').map((value) => parseInt(value, 10));
  return { hours, minutes };  // Return only hours and minutes, no seconds
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

    // Convertir la hora a tipo 'time' antes de enviarla al backend
    if (data.hora_inicio) {
      data.hora_inicio = this.convertToTime(data.hora_inicio); // Convertimos la hora aquí
    }

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
