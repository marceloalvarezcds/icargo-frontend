import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageFileBase64Pipe } from './image-file-base64.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { PermisoPipe } from './permiso.pipe';
import { UserGestorCuentaPipe } from './user-gestor-cuenta.pipe';

const modules = [
  ImageFileBase64Pipe,
  NumberFormatPipe,
  PermisoPipe,
  UserGestorCuentaPipe,
];

@NgModule({
  declarations: modules.slice(),
  exports: modules.slice(),
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
