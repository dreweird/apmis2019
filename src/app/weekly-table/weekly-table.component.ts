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
    {headerName: 'Date', pinned: 'left', cellClass:['data'], field: 'date_view',  width: 150, valueGetter:function(params){
      if(params.data!=undefined){
        var data = params.data;
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return months[new Date(data.date_surveyed).getMonth()]+", "+new Date(data.date_surveyed).getFullYear();
      }
    }},
    {headerName: 'Price', cellClass:['data'], field: 'price', width: 90},
    {headerName: 'Seller', cellClass:['data'], field: 'seller', width: 90},
    {headerName: 'Supplier', cellClass:['data'], field: 'supplier', width: 90},
    {headerName: 'Remarks', cellClass:['data'], field: 'remarks', width: 90},
    {headerName: 'Action', cellClass:['data'], cellRenderer: 'actionRenderer', field: 'action'}
  ];
  frameworkComponents = {actionRenderer: ActionRenderer2} ;

  context = { componentParent: this };
  autoGroupColumnDef = {
    headerName: 'Area',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 180,
    field: 'area',
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



