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
  autoGroupColumnDef: any;
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
  this.gridApi.exportDataAsExcel({
    customHeader  : [
      [{styleId:'headappend',data:{type:'String', value:'DEPARTMENT OF AGRICULTURE'}}],
      [{styleId:'headappend',data:{type:'String', value:'Regional Field Office XIII'}}],
      [{styleId:'headappend',data:{type:'String', value:'Agri-business and Marketing Assistance Division'}}],
      [{styleId:'headappend',data:{type:'String', value:'Raw Data Collection (Weekly Basis)'}}],
      [{styleId:'headappend',data:{type:'String', value: 'APMIS v1.0 Generated as of '+this.months[new Date().getMonth()]+' '+new Date().getDate()+', '+new Date().getFullYear()
      }}],
      [],
    ],
    sheetName: this.commodity.name + '- Raw Data Collection (Weekly Basis)',
    fileName: this.commodity.name + '- Raw Data Collection (Weekly Basis)',
    columnKeys:['area','date_surveyed','price','comp_high','comp_low','respondent','supplier','remarks'],
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

onExport2(){
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



onGridReady(params) {
  console.log(params.api);
  this.gridApi = params.api;
  
}

groupRowAggNodes(nodes: any) {
  const result = {
    price: 0,
    comp_high: 0,
    comp_low: 0,
  };
  
  nodes.forEach(function(node: any) {
    //console.log(node);
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
      result.price= item;
      result.comp_high= Math.max.apply(null,arr1);
      result.comp_low= Math.min.apply(null,arr1);
    }
  });
  if(nodes.length>0&&nodes[0].parent.field=="month"){
    return result;
  }
  
}

onGridReady2(params) {
  this.gridApi2 = params.api;
  console.log(this.gridApi2);
}
reset(formDirective: FormGroupDirective){
  formDirective.resetForm();
  this.inputForm.reset();

}

onRemoveSelected(cell,rowIndex) {
  console.log(this.gridApi2);
  var selectedData = this.gridApi2.getSelectedRows();
  console.log(this.gridApi2.getSelectedRows());
  if(selectedData[0]==undefined){
    alert("Please highlight the line you want to remove.");
  }else{
    var id = selectedData[0].id;
    console.log(selectedData);
    if(confirm("Are you sure you want to delete " + cell + "!")){
    this.dataItemService.deleteData(id).subscribe(()=>{
      var res = this.gridApi2.updateRowData({ remove: selectedData});
      console.log(res);
    });
    }else{
      console.log("false");
    }
  }
}

onSave(formDirective: FormGroupDirective){

  this.inputForm.value.date_surveyed = "2019-"+this.inputForm.value.date_surveyed+"-01";
  this.inputForm.value.comm_id = this.id;
  this.dataItemService.saveData(this.inputForm.value).subscribe(()=>{
    if(!this.inputForm.value.id){
      console.log("add");
      this.gridApi2.updateRowData({
        add: [{      
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
      var rowNode = this.gridApi2.getRowNode(this.inputForm.value.id);
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
    {headerName: 'Area', cellClass:['data','stringType'],
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
    }, field: 'area', rowGroup: true, hide: true},
    {headerName: 'Date Surveyed', cellClass:['data'], field: 'date_surveyed',  width: 180, valueGetter:function(params){
      if(params.data!=undefined){
        var data = params.data;
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return months[new Date(data.date_surveyed).getMonth()]+" "+new Date(data.date_surveyed).getDate()+", "+new Date(data.date_surveyed).getFullYear();
      }
    } },
    {headerName: 'Year', cellClass:['data'], field: 'year', width: 90, valueGetter: 'new Date(data.date_surveyed).getFullYear()', rowGroup: true, hide: true},
    //{headerName: 'Month', field: 'month', width: 90, valueGetter: 'new Date(data.date_surveyed).getMonth() + 1', hide: true},
    {headerName: 'Month', cellClass:['data'],field: 'month', width: 90, valueGetter: function(params){
      var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      if(params.data!=undefined) return months[new Date(params.data.date_surveyed).getMonth()];
    }, rowGroup: true, hide: true},

    {headerName: 'Price', field: 'price', width: 90},
    {headerName: 'High', field: 'comp_high', width: 90},
    {headerName: 'Low', field: 'comp_low', width: 90},
    {headerName: 'High', field: 'high', width: 90, hide: true},
    {headerName: 'Low', field: 'low', width: 90, hide: true},
    {headerName: 'Respondent', field: 'respondent' },
    {headerName: 'Supplier', field: 'supplier' },
    {headerName: 'Remarks', field: 'remarks' },
    {delete: 'Remarks', field: 'remarks' },
    {headerName: 'Action', cellRenderer: 'deleteRenderer', field: 'action'}

];

columnDefs2 = [
  {headerName: 'Province',cellClass:['data'], field: 'prov', rowGroup: true, hide: true,},
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
  {headerName: 'Date', cellClass:['data'], field: 'date_view',  width: 180, valueGetter:function(params){
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
frameworkComponents = {actionRenderer: ActionRenderer} ;
frameworkComponents2 =  {deleteRenderer: DeleteRenderer} //kinvey delete
context = { componentParent: this };


  constructor(private route: ActivatedRoute, private dataItemService: DataItemService,
    private kinveyStore: BackendService, private snackBar: MatSnackBar) { 
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
          this.kinveyStore.getData(this.commodity.name).subscribe(res=>{

             this.rowData = res;
             console.log(this.rowData);
           })
        });
        this.dataItemService.getItem(this.id).subscribe(res=>{
            this.rowData2 = res;
            console.log(res);      
          });
     });
 

    this.getRowNodeId = function(data) {
     // console.log(data);
      return data.id;
    };


    this.getRowNodeIdKinvey = function(data) {
      return data._id;
    };

    }

  ngOnInit() {

  }

 

  onRemoveSelectedKinvey(id){
    var selectedData = this.gridApi.getRowNode(id);
    console.log(selectedData);


    if(confirm("Are you sure you want to delete the data?") ){
      selectedData.data.id = id;
      this.gridApi.updateRowData({ remove: [selectedData.data]});
      this.kinveyStore.deleteData(id).then((result: {}) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });;
    }
   


  }

  editData(cell){
    console.log(cell);
    let month = cell.date_surveyed.slice(5, -17);
    console.log(month);
    this.newFilter = this.area;
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
      this.params.context.componentParent.onRemoveSelected(`Row: ${this.params.rowIndex+1}\nData: Date = ${new Date(this.params.data.date_surveyed)} Price = ${this.params.data.price} High = ${this.params.data.high} Low = ${this.params.data.low}`,this.params.rowIndex)
  }

  refresh(): boolean {
      return false;
  }
}

@Component({
  template: `
  <button color="warn" *ngIf="!params.node.group" mat-button style="height: 30px"
  (click)="invokeDeleteParent()" ><fa-icon icon="trash"></fa-icon></button>`,
  styles: [
      `.btn {
          line-height: 0.5
      }`
  ]
})
export class DeleteRenderer implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
      this.params = params;
  }



  public invokeDeleteParent() {
     console.log(this.params.data._id);
      this.params.context.componentParent.onRemoveSelectedKinvey(this.params.data._id);
  }

  refresh(): boolean {
      return false;
  }
}




