import { Component, OnInit } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations/index';
import { commodity, Commodity } from './commodity.data';
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
  commodities = [];
  group_commodity = [];

  //emit each person
  source = from(this.commodities = this.dataItemService.getAllCommodity());
  example = this.source.pipe(
    groupBy(data => data.category),
    // return each item in group as array
    mergeMap(group => group.pipe(toArray()))
  );
  constructor(private router: Router, private dataItemService: DataItemService,
    private logService: BackendService) { }

  ngOnInit() {
    this.commodities = this.dataItemService.getAllCommodity();
    this.example.subscribe(val => {
      // console.log(val);
      this.group_commodity.push(val);
    });
   // console.log(this.group_commodity)
  }

  onClick(commodity: Commodity){
    this.router.navigate(['/home/commodity-details', commodity.id]);
  }

  onValidate(commodity: Commodity){
    this.router.navigate(['/home/commodity-validation', commodity.id]);
  }
}
