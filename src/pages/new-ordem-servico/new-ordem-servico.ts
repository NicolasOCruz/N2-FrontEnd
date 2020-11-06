import { ClienteDTO } from './../../models/cliente.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteService } from '../../services/domain/cliente.service';


@IonicPage()
@Component({
  selector: 'page-new-ordem-servico',
  templateUrl: 'new-ordem-servico.html',
})
export class NewOrdemServicoPage {

  clienteCpfOrCnpj : string;
  formGroup : FormGroup;
  formSearch : FormGroup;
  cliente : ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder : FormBuilder,
    public clienteService : ClienteService,
    public alertCtrl : AlertController) {

      this.formGroup = this.formBuilder.group({
        descricao: [null, [Validators.required]],
        preco: [null, [Validators.required]]
      })
      this.formSearch = this.formBuilder.group({
        cliente: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        nome: [null , Validators.required],
      })

  }

  ionViewDidLoad() {
    
  }

  findCliente(){
    if(this.clienteCpfOrCnpj.length < 11 || this.clienteCpfOrCnpj.length > 14){
      this.showIncomplete();
    }
    else{
      this.clienteService.findByCpfOrCnpj(this.clienteCpfOrCnpj)
        .subscribe(resp => {
          this.cliente = resp as ClienteDTO; //para setar o campo "Nome" no formulario e passar as informaçoes dele pra proxima tela
          if(this.cliente.id != null){
            this.formSearch.controls.nome.setValue(this.cliente.nome);
          }
          else{
            this.formSearch.controls.nome.setValue(null);
          }
          
        },
        error => {});
    }
  }

  showIncomplete(){
    let alert = this.alertCtrl.create({
      title: 'Ops!',
      message: 'Não foi possível localizar um cliente nesse CPF/CNPJ',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => { //funcao anonima que nao recebe nada "()", porem executa o que vier em seguinte
          }
        }
      ]
    });
    alert.present();
  }

  next(){
    this.navCtrl.push('PickAddressPage', 
          {
            cliente : this.cliente, 
            dados : this.formGroup.value
          });
  }

}
