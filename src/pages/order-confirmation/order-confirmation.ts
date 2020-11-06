import { ClienteService } from './../../services/domain/cliente.service';
import { EnderecoDTO } from './../../models/endereco.dto';
import { ClienteDTO } from './../../models/cliente.dto';
import { OrdemServicoNewDTO } from './../../models/ordem-servico-new.dto';
import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { OrdemServicoService } from '../../services/domain/ordem-servico.service';


@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  ordemServico : OrdemServicoNewDTO;
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  id : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService : ClienteService,
    public ordemServicoService : OrdemServicoService,
    public alertCtrl : AlertController,
    public loadingController : LoadingController) {

    this.ordemServico = this.navParams.get('ordemServico');
  }

  ionViewDidLoad() {
    this.clienteService.findById(this.ordemServico.cliente.id)
      .subscribe(response => {
        this.cliente = response;
        this.endereco = this.findEndereco(this.ordemServico.endereco.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('LoginPage');
      })
  }

  private findEndereco(id : string, enderecos : EnderecoDTO[]) : EnderecoDTO{
    let position = enderecos.findIndex(x => x.id == id); //procure um x tal que o id desse x seja igual ao id
    return enderecos[position];
  }

  checkout(){
    let loader = this.presentLoading();
    this.ordemServicoService.insert(this.ordemServico)
      .subscribe(response => {
        loader.dismiss();
        let resp = JSON.parse(response.body);
        this.id = resp.id;
        this.showInsertOk();
      },
      error => {
        loader.dismiss();
        if(error.status == 403){
          this.navCtrl.setRoot('LoginPage');
        }
      });
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Ordem de Serviço Cadastrada! Código: ' + this.id ,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { //funcao anonima que nao recebe nada "()", porem executa o que vier em seguinte
            this.navCtrl.setRoot('OrdemServicoPage');
          }
        }
      ]
    });
    alert.present();
  }

  back(){
    this.navCtrl.setRoot('NewOrdemServicoPage');
  }

  presentLoading(){
    let loader = this.loadingController.create({
      content: "Só um pouquinho..."
    });
    loader.present();
    return loader;
  }

}
