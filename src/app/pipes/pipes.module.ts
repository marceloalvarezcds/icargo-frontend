import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageFileBase64Pipe } from './image-file-base64.pipe';
import { MomentFormatPipe } from './moment-format.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { PermisoPipe } from './permiso.pipe';
import { UserGestorCuentaPipe } from './user-gestor-cuenta.pipe';
import { HourFormatPipe } from './hour-format.pipe';
import { NumberDecimalFormatPipe } from './number-decimal-format.pipe';

const modules = [
  ImageFileBase64Pipe,
  MomentFormatPipe,
  NumberFormatPipe,
  PermisoPipe,
  UserGestorCuentaPipe,
  HourFormatPipe,
  NumberDecimalFormatPipe,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [CommonModule],
})
export class PipesModule {}
