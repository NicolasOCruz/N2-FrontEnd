import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { OrdemServicoDTO } from '../../models/ordem-servico.dto';
import { AuthService } from '../../services/auth.service';
import { OrdemServicoService } from '../../services/domain/ordem-servico.service';

/**
 * Generated class for the OrdemServicoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ordem-servico',
  templateUrl: 'ordem-servico.html',
})
export class OrdemServicoPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  ordensServico : OrdemServicoDTO[] ;

  constructor(
          public navCtrl: NavController, 
          public navParams: NavParams,
          public ordemServicoService : OrdemServicoService,
          public auth : AuthService,
          public loadingController : LoadingController) {
  }

  ionViewDidLoad() {
    if(this.auth.checkAdmin()){
      let loader = this.presentLoading();
      this.ordemServicoService.findAll()
            .subscribe(response => {
                loader.dismiss();
                this.ordensServico = response;
                this.loadImageUrls();
            },
            error => {loader.dismiss()});
    } else {
      let loader = this.presentLoading();
      this.ordemServicoService.findPage()
            .subscribe(response => {
                loader.dismiss();
                this.ordensServico = response['content'];
                this.loadImageUrls();
            },
            error => {loader.dismiss()});
    }
                
  }

  loadImageUrls(){
    for(var i=0; i<this.ordensServico.length; i++){
      let ordem = this.ordensServico[i];
      this.ordemServicoService.getImageFromBucket(ordem.id)
        .subscribe(response => {
          ordem.imageUrl = `${API_CONFIG.bucketBaseUrl}/os${ordem.id}.jpg`;
        },
        error => {});
    }
  }

  showDetail(id : string){
    this.navCtrl.push('OrdemServicoDetailPage', {ordem_id: id});
  }

  presentLoading(){
    let loader = this.loadingController.create({
      content: "Só um pouquinho..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher){
    this.ionViewDidLoad();
    setTimeout(() =>{
      refresher.complete();
    }, 1000);
  }
}
