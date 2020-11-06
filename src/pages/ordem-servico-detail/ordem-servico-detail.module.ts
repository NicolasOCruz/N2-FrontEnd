import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdemServicoDetailPage } from './ordem-servico-detail';

@NgModule({
  declarations: [
    OrdemServicoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdemServicoDetailPage),
  ],
})
export class OrdemServicoDetailPageModule {}
