import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
 transform(items: any[],  searchValue: string) {
    if(!searchValue) return items; 
    searchValue = searchValue.toLocaleLowerCase();
    return items.filter(it => 
        JSON.stringify(it.name).toLocaleLowerCase().includes(searchValue) || 
        JSON.stringify(it.category).toLocaleLowerCase().includes(searchValue)
        );

 }
}   