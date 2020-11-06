import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddComentarioPage } from './add-comentario';

@NgModule({
  declarations: [
    AddComentarioPage,
  ],
  imports: [
    IonicPageModule.forChild(AddComentarioPage),
  ],
})
export class AddComentarioPageModule {}
