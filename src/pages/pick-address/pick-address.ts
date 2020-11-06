import { OrdemServicoNewDTO } from './../../models/ordem-servico-new.dto';
import { EnderecoDTO } from './../../models/endereco.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  enderecos : EnderecoDTO[];
  ordemServico : OrdemServicoNewDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {

    let obj  = this.navParams.get('cliente');
    let dados = this.navParams.get('dados');
    this.enderecos = obj['enderecos'];
    this.ordemServico = {
      cliente: {id: obj['id']},
      descricao: dados['descricao'],
      preco: dados['preco'],
      endereco: null,
      pagamento: null
    }
    }

    nextPage(endereco : EnderecoDTO){
      this.ordemServico.endereco = {id: endereco.id}
      this.navCtrl.push('PaymentPage', {ordemServico : this.ordemServico});
    }
  }
