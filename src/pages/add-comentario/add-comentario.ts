import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdemServicoDTO } from '../../models/ordem-servico.dto';
import { OrdemServicoService } from '../../services/domain/ordem-servico.service';


@IonicPage()
@Component({
  selector: 'page-add-comentario',
  templateUrl: 'add-comentario.html',
})
export class AddComentarioPage {

  formGroup : FormGroup;
  ordem : OrdemServicoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder : FormBuilder,
    public ordemServicoService : OrdemServicoService,
    public alertCtrl : AlertController) {

      this.formGroup = formBuilder.group({
        descricao : [null, [Validators.required]]
      });
  }

  ionViewDidLoad() {
    let ordem_id = this.navParams.get('id');
    this.ordemServicoService.findById(ordem_id)
      .subscribe(response => {
        this.ordem = response;
      },
      error => {});
  }

  add(){
    this.ordemServicoService.insertComentario(this.formGroup.value, this.ordem)
    .subscribe(response => {
      this.showInsertOk();
    },
    error => {});
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Comentário anexado com sucesso',
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

}
