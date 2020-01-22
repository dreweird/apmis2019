import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataItemService } from '../_services';
import {ICellRendererAngularComp} from "ag-grid-angular";
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-weekly-table',
  templateUrl: './weekly-table.component.html',
  styleUrls: ['./weekly-table.component.scss']
})
export class WeeklyTableComponent implements OnInit {
  gridApi: any;
  rowData: any;

  @Output() onUpdate = new EventEmitter<any>();

  columnDefs = [
    
    {headerName: 'Province',cellClass:['data'], field: 'prov', rowGroup: true, hide: true},
    {headerName: 'Area', field: 'area', rowGroup: true, hide: true, 
    cellClass:['data','stringType'],
    cellClassRules:{
      indent1: function(params){
        if(params.node.uiLevel==1) return true;
      },
      indent2: function(params){
        if(params.node.uiLevel==2) return true;
      },
      indent3: function(params){
        if(params.node.uiLevel==3) return true;
      },
      indent4: function(params){
        if(params.node.uiLevel==4) return true;
      },
      indent5: function(params){
        if(params.node.uiLevel==5) return true;
      },
      bold: function(params){
        if(params.node.group) return true;
      }
    },},
    {headerName: 'Date', cellClass:['data'], field: 'date_surveyed',  width: 90, hide: true},
    {headerName: 'First Day', cellClass:['data'], field: 'firstday',  rowGroup:true, hide: true, width: 150, valueGetter:function(params){
      if(params.data!=undefined){
        var data = params.data;
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return months[new Date(data.date_surveyed).getMonth()]+", "+new Date(data.date_surveyed).getFullYear();
      }
    }},
    {headerName: 'Week', cellClass:['data'], field: 'week',  width: 90,rowGroup: true, hide: true, valueGetter:function(params){
      if(params.data!=undefined) return "Week "+params.data.week;
    }},
    {headerName: 'Date', pinned: 'left', cellClass:['data'], field: 'date_view', hide: true, width: 150, valueGetter:function(params){
      if(params.data!=undefined){
        var data = params.data;
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return months[new Date(data.date_surveyed).getMonth()]+", "+new Date(data.date_surveyed).getFullYear();
      }
    }},
    {headerName: 'Price', cellClass:['data'], field: 'price', width: 90},
    {headerName: 'High', cellClass:['data'], field: 'comp_high',  width: 90, hide: false},
    {headerName: 'Low', cellClass:['data'], field: 'comp_low',  width: 90, hide: false},
    {headerName: 'Seller', cellClass:['data'], field: 'seller', width: 90},
    {headerName: 'Supplier', cellClass:['data'], field: 'supplier', width: 90},
    {headerName: 'Remarks', cellClass:['data'], field: 'remarks', width: 90},
    {headerName: 'Action', cellClass:['data'], cellRenderer: 'actionRenderer', field: 'action'}
  ];
  frameworkComponents = {actionRenderer: ActionRenderer2} ;

  context = { componentParent: this };
  autoGroupColumnDef = {
    headerName: 'Group',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 200,
    field: '',
    cellRendererParams: {
      suppressCount: true, // turn off the row count
  
    }
  };
  area = [
    {area: 'Butuan City', prov: 'Agusan del Norte'},
    {area: 'Cabadbaran City', prov: 'Agusan del Norte'},
    {area: 'San Francisco', prov: 'Agusan del Sur'},
    {area: 'San Jose', prov: 'Dinagat Island'},
    {area: 'Surigao City', prov: 'Surigao del Norte'},
    {area: 'Tandag City', prov: 'Surigao del Sur'}
  ];
  newFilter: { area: string; prov: string; }[];
  getRowNodeId: (data: any) => any;
  
  whoAmI(cell) {
    console.log(cell);
    this.gridApi.updateRowData({
      add: [{ 
        id: cell.id,     
        prov: cell.prov,
        area: cell.area,
        date_surveyed: cell.date_surveyed,
        supplier: cell.supplier,
        seller: cell.seller,
        price: cell.price,
        remarks: cell.remarks,
        category: cell.category,
        commodity: cell.comodity,
        commodity_id: cell.commodity_id

      }]
    });
  }

  updategrid(cell){
    var rowNode = this.gridApi.getRowNode(cell.id);
    rowNode.setData({      
      prov: cell.prov,
      area: cell.area,
      date_surveyed: cell.date_surveyed,
      supplier: cell.supplier,
      seller: cell.seller,
      price: cell.price,
      remarks: cell.remarks
    });
  }

  constructor(private dataItemService: DataItemService, public snackBar: MatSnackBar) {
    this.dataItemService.getWeekly().subscribe(res=>{
      this.rowData = res;
      console.log(res);      
    });
    this.getRowNodeId = function(data) {
      return data.id;
    };
  }

  ngOnInit() {
  }

  onGridReady(params) {
   // console.log(params.api);
    this.gridApi = params.api;
    
  }
  editData(cell){
    this.onUpdate.emit(cell);

  }
    onRemoveSelected(cell){
      delete cell.imageSrc;
      console.log(cell);
      var result = confirm("Want to delete?");
      if (result) {
        this.dataItemService.delWeekly(cell.id).subscribe((data: any)=>{
          if(data.affectedRows){
            this.gridApi.updateRowData({ remove: [cell] });
            this.snackBar.open('Data Successfully Deleted!', 'Ok', {
              duration: 2000,
            });
          }
        })
   
      }
    }


    groupRowAggNodes(nodes: any) {
      const result = {
        price: 0,
        comp_high: 0,
        comp_low: 0,
      };
      const result_ = {
        price: 0,
        comp_high: 0,
        comp_low: 0,
      };
      // console.log(nodes);
      // console.log("-----------------");
      nodes.forEach(function(node: any) {
        // console.log(node);
        if(!node.group){
          var price=0;
          var arr1 = [];
          var children = node.parent.childrenAfterGroup;
          //console.log(node.key);
          children.forEach(function(child: any){
            //console.log(child);
            arr1.push(child.data.price);
          });
          var mf = 0;
          var m = 0;
          var item;
          for (var i=0; i<arr1.length; i++){
            for (var j=i; j<arr1.length; j++){
              if (arr1[i] == arr1[j]) m++;
              if (mf<m){
                mf=m; 
                item = arr1[i];
              }
            }
            m=0;
            }
          var sum = 0;
          for( var i = 0; i < arr1.length; i++ ){
              sum += parseInt( arr1[i], 10 );
          }
          result.price= sum/arr1.length;
          result.comp_high= Math.max.apply(null,arr1);
          result.comp_low= Math.min.apply(null,arr1);
        }

        
      });
      if(nodes.length>0&&(nodes[0].parent.field=="week")){
        return result;
      }
      if(nodes.length>0&&(nodes[0].parent.field=="firstday")){
        var node = nodes[0].parent;
        var _price=0;
        var _arr1 = [];
        var _children = node.allLeafChildren;
        _children.forEach(function(_child: any){
          _arr1.push(_child.data.price);
        });
        // var _mf = 0;
        // var _m = 0;
        // var _item;
        // for (var _i=0; _i<_arr1.length; _i++){
        //   for (var _j=_i; _j<_arr1.length; _j++){
        //     if (_arr1[_i] == _arr1[_j]) _m++;
        //     if (_mf<_m){
        //       _mf=_m; 
        //       _item = _arr1[_i];
        //     }
        //   }
        //   _m=0;
        //   }
        var _sum = 0;
        for( var i = 0; i < _arr1.length; i++ ){
            _sum += parseInt( _arr1[i], 10 );
        }
        result_.price= _sum / _arr1.length;
        result_.comp_high= Math.max.apply(null,_arr1);
        result_.comp_low= Math.min.apply(null,_arr1);
        return result_;
      }
      
    }
  

}

@Component({
  selector: 'child-cell',
  template: `
  <button color="accent" *ngIf="!params.node.group" mat-button 
  (click)="invokeParentMethod()" ><fa-icon icon="edit"></fa-icon></button>

  <button color="warn" *ngIf="!params.node.group" mat-button 
  (click)="invokeParentMethod2()" ><fa-icon icon="trash"></fa-icon></button>`,
  
})
export class ActionRenderer2 implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
      this.params = params;
  }

  public invokeParentMethod() {
      this.params.context.componentParent.editData(this.params.data);
  }

  public invokeParentMethod2() {
    console.log(this.params);
      this.params.context.componentParent.onRemoveSelected(this.params.data);
  }

  refresh(): boolean {
      return false;
  }
}



