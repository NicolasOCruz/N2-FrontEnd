import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ClienteService } from '../../services/domain/cliente.service';

/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {

  formGroup : FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder : FormBuilder,
    public clienteService : ClienteService,
    public alertCtrl : AlertController,
    public loadingController : LoadingController, ) {

      this.formGroup = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]]
      })
  }
  forgot(){
    let loader = this.presentLoading();
    this.clienteService.forgot(this.formGroup.value)
      .subscribe(response=> {
        loader.dismiss();
        this.showInsertOk();
      },
      error =>{});
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Nova senha enviada para seu email',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { //funcao anonima que nao recebe nada "()", porem executa o que vier em seguinte
            this.navCtrl.pop(); //desempilha essa página
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
