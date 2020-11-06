import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EstadoService } from '../../services/domain/estado.service';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup : FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService : CidadeService,
    public estadoService : EstadoService,
    public clienteService : ClienteService,
    public alertCtrl : AlertController,
    public loadingController : LoadingController) {

      //metodo group é responsavel por instanciar um form Group
      this.formGroup = this.formBuilder.group({
        nome: ['Joaquim Sousa', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
        telefone: ['11111111111', [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
        tipo: ['1', [Validators.required]],
        cpf : ['04973796000', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['123', [Validators.required]],
        logradouro : ['Rua Via', [Validators.required]],
        numero : ['123', [Validators.required]],
        complemento : ['Bloco C', []],
        bairro : ['Oliveiras', []],
        cep: ['10828333', Validators.required],
        estadoId: [null, [Validators.required]],
        cidadeId: [null, [Validators.required]],
        perfil: [null, []]
      });
  }

  signupUser(){
    let loader = this.presentLoading();
    this.clienteService.insert(this.formGroup.value)
    .subscribe(response => {
      loader.dismiss();
      this.showInsertOk();
    },
    error => {});
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
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

  ionViewDidLoad(){
    this.estadoService.findAll()
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id); //adiciona o id do primeiro estado na lista estadoId do formulário
        this.updateCidades();
      },
      error => {});
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
  presentLoading(){
    let loader = this.loadingController.create({
      content: "Só um pouquinho..."
    });
    loader.present();
    return loader;
  }
}
