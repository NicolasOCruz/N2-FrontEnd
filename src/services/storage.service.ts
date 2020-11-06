import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { LocalUser } from "../models/local_user";

@Injectable()
export class StorageService{

    getLocalUser() : LocalUser {
        let user = localStorage.getItem(STORAGE_KEYS.localUser)
        if (user == null){
            return null;
        } else {
            return JSON.parse(user); //localStorage só armazena String 
        }
    }
    setLocalUser(obj : LocalUser){
        if (obj == null){
            localStorage.removeItem(STORAGE_KEYS.localUser); //se for nulo é porque eu quero remover o localStorage
        } else {
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj)); //converte para texto
        }
    }

    getProfile() : string{
        let profile = localStorage.getItem(STORAGE_KEYS.profile);
        if (profile){
            return profile;
        }
        else {
            return null;
        }
    }

    setProfile(obj : string){
        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.profile);
        } else {
            localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(obj));
        }
    }

}