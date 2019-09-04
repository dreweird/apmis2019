import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class Commodity {
    constructor(public id?: number, public name?: string, public category?: string, public imageSrc?: string) {
    }
}

@Injectable()
export class DataItemService {

    constructor(private http: HttpClient) {}

    private _selectedId = -1;
    apiRoot: string = "http://210.5.100.46:4000";
    allCommodity: any;

    getItem(id: number){
        const url = `${this.apiRoot}/getCommodity`;
        return this.http.post<any>(url, {id});
    }

    getSelected(id: number) {
        const url = `${this.apiRoot}/getSelected`;
        return this.http.post<any>(url, {id});
    }

    get3MosAgo(id: number, area: string){
        const url = `${this.apiRoot}/get3MosAgo`;
        return this.http.post<any>(url, {id, area});
    }

    saveData(item: any){
        console.log(item);
        const url = `${this.apiRoot}/saveData`;
        //const url = `http://localhost/apmis/api/data/read.php?get=saveData`;
        return this.http.post<any>(url, {item});
    }

    deleteData(id: number){
        const url = `${this.apiRoot}/deleteData`;
       //const url = `http://localhost/apmis/api/data/read.php?get=deleteData`;
        return this.http.post<any>(url, {id});
    }



    getAllCommodity() {
        const url = `${this.apiRoot}/getCommodity`;
        return this.http.get<Commodity>(url);
    }
    



    getCommodity(id: number): Commodity {
        return this.allCommodity.filter(commodity => commodity.id === id)[0];
    }

  
}