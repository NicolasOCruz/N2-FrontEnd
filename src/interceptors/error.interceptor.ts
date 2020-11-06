import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { Observable } from "rxjs/Rx";
import { FieldMessage } from "../models/fieldmessage";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage : StorageService, public alertCtrl: AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{

        return next.handle(req) //continua a requisiçao sem interrupção
        .catch((error, caught) => {

            let errorObj = error;

            if(errorObj.error){
                errorObj = errorObj.error;
            }

            if(!errorObj.status){ //se o erro não tiver um campo apartado de status, quer dizer que veio em formato texto
                errorObj = JSON.parse(errorObj); //converte o erro em JSON
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status){

                case 401:
                    this.handle401();
                    break;
                case 403:
                    this.handle403();
                    break;
                case 404:
                    this.handle404();
                case 422:
                    this.handle422(errorObj);
                    break;
                default:
                    this.handleDefaultError(errorObj);
            }

            return Observable.throw(errorObj); //se acontecer um erro, propague o erro
        }) as any;
    }

    handle403() {
        this.storage.setLocalUser(null); //seta nulo para garantir que o token sera limpo
    }
    handle404(){

        let alert = this.alertCtrl.create({
            title: 'Erro 404: Não encontrado',
            message: 'Não foi possível localizar', //chama a função para listar os erros que vieram no Array
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();

    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401 : Falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, //para sair do alert tem que clicar nele mesmo e não fora
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle422(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro 422: Validação',
            message: this.listError(errorObj.errors), //chama a função para listar os erros que vieram no Array
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }
    handleDefaultError(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false, //para sair do alert tem que clicar nele mesmo e não fora
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();

    }

    private listError(messages: FieldMessage[]) : string {
        let s : string = '';
        for(var i=0; i<messages.length; i++){
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }
}


export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};