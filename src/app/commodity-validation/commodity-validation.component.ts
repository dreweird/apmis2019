import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataItemService, Commodity, BackendService } from '../_services';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import "ag-grid-enterprise";
import { MatSnackBar } from '@angular/material';
import {ICellRendererAngularComp} from "ag-grid-angular";


@Component({
  selector: 'app-commodity-validation',
  templateUrl: './commodity-validation.component.html',
  styleUrls: ['./commodity-validation.component.scss'],
})
export class CommodityValidationComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  id: number;
  @Input() commodity: Commodity;
  myBackgroundImageUrl: string;
  rowData: [];
  rowData2: [];

  excelStyles:any;
  components: any;
  

  gridApi: any;
  gridApi2: any;
  getRowNodeId: any;
  getRowNodeIdKinvey: any;
  inputForm: FormGroup;
  rowSelection = "single";
  month = [
    {value: "01", viewValue: "January"},
    {value: "02", viewValue: "February"},
    {value: "03", viewValue: "March"},
    {value: "04", viewValue: "April"},
    {value: "05", viewValue: "May"},
    {value: "06", viewValue: "June"},
    {value: "07", viewValue: "July"},
    {value: "08", viewValue: "August"},
    {value: "09", viewValue: "September"},
    {value: "10", viewValue: "October"},
    {value: "11", viewValue: "November"},
    {value: "12", viewValue: "December"}
  ];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  

  area = [
    {area: 'Butuan City', prov: 'Agusan del Norte'},
    {area: 'Cabadbaran City', prov: 'Agusan del Norte'},
    {area: 'San Francisco', prov: 'Agusan del Sur'},
    {area: 'San Jose', prov: 'Dinagat Island'},
    {area: 'Surigao City', prov: 'Surigao del Norte'},
    {area: 'Tandag City', prov: 'Surigao del Sur'}
  ];
  newFilter: { area: string; prov: string; }[];
  selectedArea: any;


onExport(){
  this.gridApi2.exportDataAsExcel({
    customHeader  : [
      [{styleId:'headappend',data:{type:'String', value:'DEPARTMENT OF AGRICULTURE'}}],
      [{styleId:'headappend',data:{type:'String', value:'Regional Field Office XIII'}}],
      [{styleId:'headappend',data:{type:'String', value:'Agri-business and Marketing Assistance Division'}}],
      [{styleId:'headappend',data:{type:'String', value:'Verified Data Collection (Monthly Basis)'}}],
      [{styleId:'headappend',data:{type:'String', value: 'APMIS v1.0 Generated as of '+this.months[new Date().getMonth()]+' '+new Date().getDate()+', '+new Date().getFullYear()
      }}],
      [],
    ],
    sheetName: this.commodity.name + '- Verified Data Collection (Monthly Basis)',
    fileName: this.commodity.name + '- Verified Data Collection (Monthly Basis)',
    columnKeys:['area','date_surveyed','price','high','low'],
    processCellCallback:function (params){
      var node = params.node;
      console.log(params);
      if(node.group){
          if(params.column.colId=="area") return node.key;
          else return params.value;
      }else if(params.column.colId!="area") return params.value;
    },
  })
}


reset(formDirective: FormGroupDirective){
  formDirective.resetForm();
  this.inputForm.reset();

}

onGridReady(params) {
   this.gridApi = params.api; 
 }


onSave(formDirective: FormGroupDirective){

  this.inputForm.value.date_surveyed = "2019-"+this.inputForm.value.date_surveyed+"-01";
  this.inputForm.value.comm_id = this.id;
  this.dataItemService.saveData(this.inputForm.value).subscribe((data: any)=>{
    if(!this.inputForm.value.id){
      console.log("add");
      this.gridApi.updateRowData({
        add: [{    
          id:  data.insertId, 
          prov: this.inputForm.value.prov,
          area: this.inputForm.value.area,
          date_surveyed: this.inputForm.value.date_surveyed,
          price: this.inputForm.value.price,
          high: this.inputForm.value.high,
          low: this.inputForm.value.low
        }]
      });
      this.snackBar.open('Data Successfully Added! New data will display at the bottom!', 'ok', {
        duration: 3000,
    });
    }else{
      console.log("update");
      console.log(this.inputForm.value);
      var rowNode = this.gridApi.getRowNode(this.inputForm.value.id);
      var newData = {
        prov: this.inputForm.value.prov,
        area: this.inputForm.value.area,
        date_surveyed: this.inputForm.value.date_surveyed,
        price: this.inputForm.value.price,
        high: this.inputForm.value.high,
        low: this.inputForm.value.low
      }
      rowNode.setData(newData);
      this.snackBar.open('Data Successfully Updated!', 'ok', {
        duration: 3000,
    }); 
    }
    
  formDirective.resetForm();
  this.inputForm.reset();
  }, (err) => console.log(err))
  
}

filterArea(event){
  this.newFilter = this.area.filter((el)=>{
    return el.prov == event.value
  });
}


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
  {headerName: 'High', cellClass:['data'], field: 'high', width: 90,},
  {headerName: 'Low', cellClass:['data'], field: 'low', width: 90,},
  {headerName: 'Action', cellClass:['data'], cellRenderer: 'actionRenderer', field: 'action'}
];
frameworkComponents = {actionRenderer: ActionRenderer};
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


  constructor(private route: ActivatedRoute, private dataItemService: DataItemService, private snackBar: MatSnackBar) { 
      this.excelStyles= [
        { id:"stringType",dataType :'string' },
        { id:"indent1",alignment :{indent:1} },
        { id:"indent2",alignment :{indent:3} },
        { id:"indent3",alignment :{indent:5} },
        { id:"indent4",alignment :{indent:7} },
        { id:"indent5",alignment :{indent:9} },
        { id:"bold", font: {bold:true} },
        {
          id: "data",
          font: { size:11, fontName: "Calibri", },
          borders: {
            borderBottom: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderLeft: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderRight: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderTop: { color: "#000000", lineStyle: "Continuous", weight: 1 },
          }
        },
        {
          id: "header",
          font: { size:11, fontName: "Calibri", bold: true, },
          borders: {
            borderBottom: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderLeft: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderRight: { color: "#000000", lineStyle: "Continuous", weight: 1 },
            borderTop: { color: "#000000", lineStyle: "Continuous", weight: 1 },
          }
        },
        { id: "headappend", font: { size:11, fontName: "Calibri", bold: true, }, }
      ];

      this.route.params.subscribe(params => {
        this.id = +params['id']; // (+) converts string 'id' to a number
        this.dataItemService.getSelected(this.id).subscribe(data=>{
          this.commodity = data[0];
          this.myBackgroundImageUrl = this.commodity.imageSrc;
          console.log(this.commodity); 
          this.inputForm = new FormGroup({
            prov: new FormControl('', [Validators.required]),
            area: new FormControl('', [Validators.required]),
            date_surveyed: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required]),
            high: new FormControl('', [Validators.required]),
            low: new FormControl('', [Validators.required]),
            category: new FormControl(this.commodity.category),
            commodity: new FormControl(this.commodity.name),
            unit: new FormControl('kilo'),
            id: new FormControl(null)
          }); 
          // this.kinveyStore.getData(this.commodity.name).subscribe(res=>{

          //    this.rowData = res;
          //    console.log(this.rowData);
          //  })
        });
        this.dataItemService.getItem(this.id).subscribe(res=>{
            this.rowData = res;
            console.log(res);      
          });
     });
 

    this.getRowNodeId = function(data) {
      return data.id;
    };


    }

  ngOnInit() {

  }


  editData(cell){
    let month = cell.date_surveyed.slice(5, -17);
    this.newFilter = this.area;
    console.log(this.newFilter);
    this.inputForm.patchValue({
      id: cell.id,
      prov: cell.prov,
      area: cell.area,
      date_surveyed: month,
      price: cell.price,
      high: cell.high,
      low: cell.low

    });
  }

  onRemoveSelected(cell){
    console.log(cell);
    var result = confirm("Want to delete?");
    if (result) {
      this.dataItemService.deleteData(cell.id).subscribe((data: any)=>{
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
export class ActionRenderer implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
      this.params = params;
  }

  public invokeParentMethod() {
      this.params.context.componentParent.editData(this.params.data);
  }

  public invokeParentMethod2() {
    console.log(this.params);
      this.params.context.componentParent.onRemoveSelected(this.params.data)
  }

  refresh(): boolean {
      return false;
  }
}






