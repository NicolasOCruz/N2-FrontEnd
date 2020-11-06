import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../config/api.config";
import { StorageService } from "../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 //para nao ter que ficar passando headers no service toda hora

    constructor(public storage: StorageService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
       
        let localUser = this.storage.getLocalUser();

        let N = API_CONFIG.baseUrl.length;

        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl; //significa que a req esta indo para a API, nao para a Amazon

        if(localUser && requestToAPI){ //so acrescenta esse cabecalho quando for uma req para a nossa API
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)}); //clona a req original e acrescenta o header
            return next.handle(authReq); //prosegue com a nova requisição
        }
        else {
            return next.handle(req) //continua a requisiçao sem interrupção
        }
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};