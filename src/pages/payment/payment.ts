import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrdemServicoNewDTO } from './../../models/ordem-servico-new.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  ordemServico : OrdemServicoNewDTO;  
  parcelas: number[] = [1, 2, 3, 4, 5 ];
  formGroup : FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder : FormBuilder) {

      this.ordemServico = this.navParams.get('ordemServico'); //pega a ordem de serviço que veio da outra página
      this.formGroup = this.formBuilder.group({
        numeroDeParcelas: [1, [Validators.required]],
        "@type": ["pagamentoComCartao", [Validators.required]]
      })
  }

  ionViewDidLoad() {
   
  }

  nextPage(){
    this.ordemServico.pagamento = this.formGroup.value;
    this.navCtrl.setRoot('OrderConfirmationPage', {ordemServico: this.ordemServico});
  }
}
