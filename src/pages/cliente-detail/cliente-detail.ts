import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-cliente-detail',
  templateUrl: 'cliente-detail.html',
})
export class ClienteDetailPage {

  cliente : ClienteDTO;
  enderecos : EnderecoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public alertCtrl : AlertController,
    public loadingController : LoadingController,
    public storage : StorageService) {
  }


  ionViewWillEnter(){ //ao entrar na página
    let cliente_id = this.navParams.get('clienteId');
    let loader = this.presentLoading();
    this.clienteService.findById(cliente_id)
      .subscribe(response => {
        loader.dismiss();
        this.cliente = response;
        this.getImageUrlIfExists();
        this.loadEnderecos();
      },
      error => {});
  }

  getImageUrlIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      },
      error => {});
  }

  loadEnderecos(){
    this.clienteService.listarEnderecos(this.cliente.id)
      .subscribe(response =>{
        this.enderecos = response;
      },
      error => {});
  }

  delete(id : string){
    this.clienteService.delete(this.cliente.id)
      .subscribe(response => {
        if(this.cliente.email == this.storage.getLocalUser().email){
          this.storage.setLocalUser(null);
          this.storage.setProfile(null);
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.showStatus();
        }
        
      },
      error => {});
  }

  update(id : string){
    this.navCtrl.push('UpdateClientePage', {clienteId : id});
  }

  showStatus(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cliente apagado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { //funcao anonima que nao recebe nada "()", porem executa o que vier em seguinte
          this.navCtrl.pop();
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
