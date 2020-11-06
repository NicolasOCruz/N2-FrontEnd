import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewOrdemServicoPage } from './new-ordem-servico';

@NgModule({
  declarations: [
    NewOrdemServicoPage,
  ],
  imports: [
    IonicPageModule.forChild(NewOrdemServicoPage),
  ],
})
export class NewOrdemServicoPageModule {}
