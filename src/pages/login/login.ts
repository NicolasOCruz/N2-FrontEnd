import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  creds : CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth : AuthService,
              public clienteService : ClienteService,
              public storage: StorageService,
              public loadingController : LoadingController) {
  }

  login(){
    let loader = this.presentLoading();
    this.auth.authenticate(this.creds)
        .subscribe(response => {
          loader.dismiss();
          this.auth.successfulLogin(response.headers.get('Authorization'));
          if(this.auth.checkAdmin()){
            this.navCtrl.setRoot('AdminPage');
          } else {
            this.navCtrl.setRoot('OrdemServicoPage');
          }
        }
        , error => { loader.dismiss(); });
  }

  forgot(){
    this.navCtrl.push('ForgotPage');
  }

  ionViewDidEnter(){ //para aproveitar o token existente e nao ter que fazer login toda vez que acessar o app
    this.auth.refreshToken()
        .subscribe(response => {
          this.auth.successfulLogin(response.headers.get('Authorization'));
          if(this.auth.checkAdmin()){
            this.navCtrl.setRoot('AdminPage');
          } else {
            this.navCtrl.setRoot('OrdemServicoPage');
          }
        },
        error => {});
    }

    presentLoading(){
      let loader = this.loadingController.create({
        content: "Só um pouquinho..."
      });
      loader.present();
      return loader;
    }
}
