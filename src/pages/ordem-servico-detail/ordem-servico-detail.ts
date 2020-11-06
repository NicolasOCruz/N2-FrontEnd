import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ComentarioDTO } from '../../models/comentario.dto';
import { OrdemServicoDTO } from '../../models/ordem-servico.dto';
import { AuthService } from '../../services/auth.service';
import { OrdemServicoService } from '../../services/domain/ordem-servico.service';

@IonicPage()
@Component({
  selector: 'page-ordem-servico-detail',
  templateUrl: 'ordem-servico-detail.html',
})
export class OrdemServicoDetailPage {

  ordem: OrdemServicoDTO;
  comentarios : ComentarioDTO[];
  thereIsComents : boolean;
  cancelada : boolean;
  finalizada : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ordemServicoService : OrdemServicoService,
    public alertCtrl : AlertController,
    public auth : AuthService,
    public loadingController : LoadingController) {
  }


  ionViewWillEnter(){ //ao entrar na página
    let ordem_id = this.navParams.get('ordem_id');
    let loader = this.presentLoading();
    this.ordemServicoService.findById(ordem_id)
      .subscribe(response => {
        loader.dismiss();
        this.ordem = response;
        this.getImageUrlIfExists();
        this.listarComentarios();
        this.checkStatus(this.ordem);
      },
      error => {});
  }

  getImageUrlIfExists(){
    this.ordemServicoService.getImageFromBucket(this.ordem.id)
      .subscribe(response => {
        this.ordem.imageUrl = `${API_CONFIG.bucketBaseUrl}/os${this.ordem.id}.jpg`;
      },
      error => {});
  }

  listarComentarios(){
    this.ordemServicoService.listarComentarios(this.ordem.id)
      .subscribe(response => {
        this.comentarios = response;
        this.checkComentarios(this.comentarios);
      },
      error => {});
  }

  checkComentarios(comentarios : ComentarioDTO[]) {
    if (comentarios.length > 0)
      this.thereIsComents = true;
    else
      this.thereIsComents =  false;
  }

  insert(id : string){
    this.navCtrl.push('AddComentarioPage', {id : id});
  }

  cancelar(id : string){
    this.ordemServicoService.cancelar(id)
      .subscribe(response => {
        this.showStatus(1);
      },
      error => {});
  }

  finalizar(id : string){
    this.ordemServicoService.finalizar(id)
      .subscribe(response => {
        this.showStatus(2);
      },
      error => {});
  }

  checkStatus(ordem : OrdemServicoDTO){
    switch(this.ordem.status){
      case "FINALIZADA":
        this.finalizada = true;
        break;
      case "CANCELADA":
        this.cancelada = true;
        break;
      default:
        this.cancelada = this.cancelada;
        this.finalizada = this.finalizada;
    }
  }

  showStatus(tipo : number){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: tipo == 1 ? 'Ordem de serviço cancelada com sucesso' : 'Ordem de serviço finalizada com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { //funcao anonima que nao recebe nada "()", porem executa o que vier em seguinte
          this.ionViewWillEnter();
          }
        }
      ]
    });
    alert.present();
  }

  presentLoading(){
    let loader = this.loadingController.create({
      content: "Só um pouquinho..."
    });
    loader.present();
    return loader;
  }

}
