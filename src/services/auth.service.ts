import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { API_CONFIG } from "../config/api.config";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { ClienteService } from "./domain/cliente.service";
import { STORAGE_KEYS } from "../config/storage_keys.config";


@Injectable()
export class AuthService{


    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http : HttpClient, 
        public storage : StorageService,
        public clienteService : ClienteService){

    }

    authenticate(creds : CredenciaisDTO){
      return this.http.post(`${API_CONFIG.baseUrl}/login`,
                    creds,
                    {
                        observe: 'response', //especifica que a requisicao tera uma resposta, para pegar o header
                        responseType: 'text'//a resposta tem um corpo vazio. Se nao colocar texto, tentara converter em JSON e dara um erro de PARSE
                    });
    }

    refreshToken(){ //lembrar que o token atual está sendo enviado via interceptor
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`,
                      {},
                      {
                          observe: 'response', //especifica que a requisicao tera uma resposta, para pegar o header
                          responseType: 'text'//a resposta tem um corpo vazio. Se nao colocar texto, tentara converter em JSON e dara um erro de PARSE
                      });
      }


    successfulLogin(authorizationValue : string){ //para adicionar o usuario logado ao localStorage
        let tok = authorizationValue.substring(7); //para tirar o "Bearer "
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);

    }

    checkAdmin() : boolean {
        if(this.storage.getLocalUser()){
            let tok = this.jwtHelper.decodeToken(this.storage.getLocalUser().token).role;
        if (tok){
            for(let i = 0; i < tok.length; i++){
                if (tok[i] == 'TECNICO'){
                    return true;
                };
            }
            return false;

        }
        return false;
        }
        return false;
        
    }

    logout(){
        this.storage.setLocalUser(null);
        this.storage.setProfile(null);
    }



}