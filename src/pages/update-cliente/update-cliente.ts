import { EnderecoDTO } from './../../models/endereco.dto';
import { EstadoDTO } from './../../models/estado.dto';
import { CidadeService } from './../../services/domain/cidade.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoService } from '../../services/domain/estado.service';

@IonicPage()
@Component({
  selector: 'page-update-cliente',
  templateUrl: 'update-cliente.html',
})
export class UpdateClientePage {

  cliente : ClienteDTO;
  formGroup : FormGroup;
  estados: EstadoDTO[];
  cidades : CidadeDTO[];


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public clienteService : ClienteService,
    public alertCtrl : AlertController,
    public cidadeService : CidadeService,
    public estadoService : EstadoService) {

      //metodo group é responsavel por instanciar um form Group
      this.formGroup = this.formBuilder.group({
        nome: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: [null, [Validators.required, Validators.email]],
        logradouro : [null, []],
        numero : [null, []],
        complemento : [null, []],
        bairro : [null, []],
        cep: [null, []],
        estadoId: [null, []],
        cidadeId: [null, []]
      });
  }

  ionViewDidLoad() {
    let cliente_id = this.navParams.get('clienteId');
    this.clienteService.findById(cliente_id)
      .subscribe(response => {
        this.cliente = response;
        this.getImageUrlIfExists();
        this.loadEstados();
        this.formGroup.controls.nome.setValue(this.cliente.nome);
        this.formGroup.controls.email.setValue(this.cliente.email);
      },
      error => {});
  }

  loadEstados(){
    this.estadoService.findAll()
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id); //adiciona o id do primeiro estado na lista estadoId do formulário
        this.updateCidades();
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


  updateUser(){
    this.clienteService.update(this.formGroup.value, this.cliente.id)
    .subscribe(response => {
      if(this.formGroup.value.logradouro != null){
        let endereco : EnderecoDTO;
        endereco = this.formGroup.value;
        this.clienteService.insertEndereco(this.cliente.id, endereco)
          .subscribe(response =>{
           this.showUpdateOk();
        },
        error => {}) 
      } else {
        this.showUpdateOk();
      }
    },
    error => {});
  }

  showUpdateOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro atualizado com sucesso',
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

  updateCidades(){

    let estado_id = this.formGroup.value.estadoId; //pega o valor do estado selecionado no formulário

    this.cidadeService.findAll(estado_id)
      .subscribe(response => {
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null); //tira a selecao da caixinha de cidades
      },
      error => {});
  }

}
