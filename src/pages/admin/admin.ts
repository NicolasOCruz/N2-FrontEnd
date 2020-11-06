import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth : AuthService) {
  }

  ionViewDidLoad() {
  }

  novo(){
    this.navCtrl.push('SignupPage');
  }

  listarClientes(){
    this.navCtrl.push('ClientesPage');
  }

  listarOrdens(){
    this.navCtrl.push('OrdemServicoPage');
  }
  novaOrdem(){
    this.navCtrl.push('NewOrdemServicoPage');
  }

}
