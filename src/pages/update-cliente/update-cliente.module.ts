import { CidadeService } from './../../services/domain/cidade.service';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateClientePage } from './update-cliente';
import { EstadoService } from '../../services/domain/estado.service';

@NgModule({
  declarations: [
    UpdateClientePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateClientePage),
  ],
  providers: [
    CidadeService,
    EstadoService
  ]
})
export class UpdateClientePageModule {}
