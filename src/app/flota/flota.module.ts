import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { FormFieldModule } from 'src/app/form-field/form-field.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisoPipe } from 'src/app/pipes/permiso.pipe';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CamionFormCapacidadComponent } from './camion-form-capacidad/camion-form-capacidad.component';
import { CamionFormCombinacionComponent } from './camion-form-combinacion/camion-form-combinacion.component';
import { CamionFormDetalleComponent } from './camion-form-detalle/camion-form-detalle.component';
import { CamionFormInfoComponent } from './camion-form-info/camion-form-info.component';
import { CamionFormComponent } from './camion-form/camion-form.component';
import { CamionListComponent } from './camion-list/camion-list.component';
import { ChoferFormInfoComponent } from './chofer-form-info/chofer-form-info.component';
import { ChoferFormPropietarioComponent } from './chofer-form-propietario/chofer-form-propietario.component';
import { ChoferFormComponent } from './chofer-form/chofer-form.component';
import { ChoferListComponent } from './chofer-list/chofer-list.component';
import { FlotaRoutingModule } from './flota-routing.module';
import { HabilitacionFormAutomotorComponent } from './habilitacion-form-automotor/habilitacion-form-automotor.component';
import { HabilitacionFormMunicipalComponent } from './habilitacion-form-municipal/habilitacion-form-municipal.component';
import { HabilitacionFormTransporteComponent } from './habilitacion-form-transporte/habilitacion-form-transporte.component';
import { PropietarioCamionListComponent } from './propietario-camion-list/propietario-camion-list.component';
import { PropietarioFormChoferComponent } from './propietario-form-chofer/propietario-form-chofer.component';
import { PropietarioFormInfoComponent } from './propietario-form-info/propietario-form-info.component';
import { PropietarioFormComponent } from './propietario-form/propietario-form.component';
import { PropietarioListComponent } from './propietario-list/propietario-list.component';
import { PropietarioSemiListComponent } from './propietario-semi-list/propietario-semi-list.component';
import { RegistroConduccionFormComponent } from './registro-conduccion-form/registro-conduccion-form.component';
import { SemiFormCapacidadComponent } from './semi-form-capacidad/semi-form-capacidad.component';
import { SemiFormDetalleComponent } from './semi-form-detalle/semi-form-detalle.component';
import { SemiFormInfoComponent } from './semi-form-info/semi-form-info.component';
import { SemiFormComponent } from './semi-form/semi-form.component';
import { SemiListComponent } from './semi-list/semi-list.component';
import { CamionFormLimiteComponent } from './camion-form-limite/camion-form-limite.component';
import { CombinacionListComponent } from './combinacion-list/combinacion-list.component';
import { CombinacionFormComponent } from './combinacion-form/combinacion-form.component';

@NgModule({
  declarations: [
    CamionFormCapacidadComponent,
    CamionFormCombinacionComponent,
    CamionFormComponent,
    CamionFormDetalleComponent,
    CamionFormInfoComponent,
    CamionListComponent,
    ChoferFormComponent,
    ChoferFormInfoComponent,
    ChoferFormPropietarioComponent,
    ChoferListComponent,
    HabilitacionFormAutomotorComponent,
    HabilitacionFormMunicipalComponent,
    HabilitacionFormTransporteComponent,
    PropietarioCamionListComponent,
    PropietarioFormChoferComponent,
    PropietarioFormComponent,
    PropietarioFormInfoComponent,
    PropietarioListComponent,
    PropietarioSemiListComponent,
    RegistroConduccionFormComponent,
    SemiFormCapacidadComponent,
    SemiFormComponent,
    SemiFormDetalleComponent,
    SemiFormInfoComponent,
    SemiListComponent,
    CamionFormLimiteComponent,
    CombinacionListComponent,
    CombinacionFormComponent,
  ],
  imports: [
    CommonModule,
    FlotaRoutingModule,
    FormFieldModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    SharedModule,
  ],
  providers: [PermisoPipe],
})
export class FlotaModule {}
