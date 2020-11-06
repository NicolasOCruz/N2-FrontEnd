import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';


@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  clientes : ClienteDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService : ClienteService,
    public loadingController : LoadingController) {
  }

  /*ionViewDidLoad() {
    let loader = this.presentLoading();
    this.clienteService.findAll()
      .subscribe(response => {
        loader.dismiss();
          this.clientes = response;
          this.loadImageUrls();
      },
      error => {});   
  }*/

  ionViewWillEnter(){ //ao entrar na página
    let loader = this.presentLoading();
    this.clienteService.findAll()
      .subscribe(response => {
        loader.dismiss();
          this.clientes = response;
          this.loadImageUrls();
      },
      error => {});  
  }

  loadImageUrls(){
    for(var i=0; i<this.clientes.length; i++){
      let ordem = this.clientes[i];
      this.clienteService.getImageFromBucket(ordem.id)
        .subscribe(response => {
          ordem.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${ordem.id}.jpg`;
        },
        error => {});
    }
  }

  showDetail(id : string){
    this.navCtrl.push('ClienteDetailPage', {clienteId : id});
  }

  presentLoading(){
    let loader = this.loadingController.create({
      content: "Só um pouquinho..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher){
    this.ionViewWillEnter();
    setTimeout(() =>{
      refresher.complete();
    }, 1000);
  }

}
