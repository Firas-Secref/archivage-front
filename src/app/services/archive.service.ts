import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  constructor(private http: HttpClient) { }

  public uploadFile(formData: FormData){
    return this.http.post<any>("http://localhost:8085/upload",formData)
  }

  public getAllFiles(){
    return this.http.get<any[]>("http://localhost:8085/findAll");
  }

  downloadFile(path: string): Observable<any>{
    console.log("enter")
    const requestOptions : Object = {
      responseType: `blob`
    }
    // @ts-ignore
    // return this.http.get<any>(`${endpoints.downloadCvFileUrl}/${path.slice(8, path.length)}`,{responseType:"blob"});
    return this.http.get<any>("http://localhost:8085/downloadFile/"+path.slice(8, path.length),{responseType:"blob"});
  }

}
