import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageFileBase64Pipe } from './image-file-base64.pipe';
import { PermisoPipe } from './permiso.pipe';
import { UserGestorCuentaPipe } from './user-gestor-cuenta.pipe';

const modules = [
  ImageFileBase64Pipe,
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
