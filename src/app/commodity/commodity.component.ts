import { Component, OnInit } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations/index';
import { Commodity } from './commodity.data';
import { DataItemService, BackendService } from '../_services'
import { Router } from '@angular/router';
﻿import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss']
})
export class CommodityComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  commodities: any;
  group_commodity = [];

  //emit each person
  // source = from(this.commodities = this.dataItemService.allCommodity);
  // example = this.source.pipe(
  //   groupBy((data: any) => data.category),
  //   // return each item in group as array
  //   mergeMap(group => group.pipe(toArray()))
  // );
  constructor(private router: Router, private dataItemService: DataItemService,
    public logService: BackendService) { }

  ngOnInit() {
    this.dataItemService.getAllCommodity().subscribe((data: any)=>{

     // console.log(this.commodities);
      // var groups = data.reduce(function(obj, item){
      //   obj[item.category] = obj[item.category] || [];
      //   obj[item.category].push({"name": item.name, "imageSrc": item.imageSrc, "category": item.category});
      //   return obj;
      // }, {});
      // var myArray = Object.keys(groups).map(function(key){
      //   return {category: key, items: groups[key]};
      // });

      this.commodities = data;
      console.log(this.commodities);
    })
   
    // this.example.subscribe(val => {
    //   // console.log(val);
    //   this.group_commodity.push(val);
    // });
   // console.log(this.group_commodity)
  }

  onClick(commodity: Commodity){
    this.router.navigate(['/home/commodity-details', commodity.commodity_id]);
  }

  onValidate(commodity: Commodity){
    this.router.navigate(['/home/commodity-validation', commodity.commodity_id]);
  }
}
