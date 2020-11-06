import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { ClienteDTO } from "../../models/cliente.dto";
import { EmailDTO } from "../../models/email.dto";
import { EnderecoDTO } from "../../models/endereco.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService{

    constructor(public http: HttpClient, public storage: StorageService){

    }

    delete(id : string){
        return this.http.delete(
            `${API_CONFIG.baseUrl}/clientes/${id}`
        );
    }

    listarEnderecos(id : string) : Observable<EnderecoDTO[]>{
        return this.http.get<EnderecoDTO[]>(
            `${API_CONFIG.baseUrl}/clientes/${id}/enderecos`
        );
    }

    findById(id : string) : Observable<ClienteDTO>{
        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/${id}`
        );
    }

    findByCpfOrCnpj(id : string){
        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/cpfOrCnpj/${id}`
        );
    }

    findAll() : Observable<ClienteDTO[]> {
        return this.http.get<ClienteDTO[]>(
            `${API_CONFIG.baseUrl}/clientes`
        );
    }

    findByEmail(email: string){

        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
        //tinha um header de autorização aqui, mas agora ele está sendo interceptado pelo interceptor para setar o header
    }

    getImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType: 'blob'}); //blob é imagem
    }

    insert(obj : ClienteDTO){
        console.log(obj);
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    insertEndereco(id : string, obj : EnderecoDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/${id}/enderecos`, obj
        );
    }
    update(obj : ClienteDTO, id : string){
        return this.http.put(
            `${API_CONFIG.baseUrl}/clientes/${id}`,
            obj
        );
    }

    findProfile(){
        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/profile`,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    forgot(email : EmailDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/forgot`, email,
            {
                observe: 'response',
                responseType: 'text'
            }
        )

    }
}