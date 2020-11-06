import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { ComentarioDTO } from "../../models/comentario.dto";
import { OrdemServicoNewDTO } from "../../models/ordem-servico-new.dto";
import { OrdemServicoDTO } from "../../models/ordem-servico.dto";
import { AuthService } from "../auth.service";


@Injectable()
export class OrdemServicoService{


    constructor(public http: HttpClient){  

    }

    finalizar(id : string){
        return this.http.put(
            `${API_CONFIG.baseUrl}/ordens-servico/${id}/finalizacao`,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }


    cancelar(id : string){
        return this.http.put(
            `${API_CONFIG.baseUrl}/ordens-servico/${id}/cancelamento`,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    insertComentario(obj : ComentarioDTO, ordem : OrdemServicoDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/ordens-servico/${ordem.id}/comentarios`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    insert(obj : OrdemServicoNewDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/ordens-servico`, obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    listarComentarios(id : string) : Observable<ComentarioDTO[]>{
        return this.http.get<ComentarioDTO[]>(
            `${API_CONFIG.baseUrl}/ordens-servico/${id}/comentarios`
        )
    }

    findById(id : string){
        return this.http.get<OrdemServicoDTO>(
            `${API_CONFIG.baseUrl}/ordens-servico/${id}`
        );
    }

    findAll() : Observable<OrdemServicoDTO[]>{

        return this.http.get<OrdemServicoDTO[]>(
            `${API_CONFIG.baseUrl}/ordens-servico`
        );  
    }

    findPage() {
        return this.http.get(
            `${API_CONFIG.baseUrl}/ordens-servico/page`
        );
    }

    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/os${id}.jpg`
        return this.http.get(url, {responseType: 'blob'});
    }

    getSmallImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/os${id}-small.jpg`
        return this.http.get(url, {responseType: 'blob'});
    }

}