import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataItemService, Commodity, BackendService } from '../_services';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import "ag-grid-enterprise";
import { MatSnackBar } from '@angular/material';
import {ICellRendererAngularComp} from "ag-grid-angular";
import * as moment from 'moment';

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
  components: any;
  

  gridApi: any;
  gridApi2: any;
  getRowNodeId: any;
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
    sheetName: this.commodity.name + '- Raw Data Collection (Weekly Basis)',
    fileName: this.commodity.name + '- Raw Data Collection (Weekly Basis)'
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
    {headerName: 'Area', field: 'area', rowGroup: true, hide: true},
    {headerName: 'Date Surveyed', field: 'date_surveyed', width: 90 },
    {headerName: 'Year', field: 'year', width: 90, valueGetter: 'new Date(data.date_surveyed).getFullYear()', rowGroup: true, hide: true},
    //{headerName: 'Month', field: 'month', width: 90, valueGetter: 'new Date(data.date_surveyed).getMonth() + 1', hide: true},
    {headerName: 'Month',field: 'month', width: 90, valueGetter: function(params){
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
    {headerName: 'Remarks', field: 'remarks' }
];

columnDefs2 = [
  {headerName: 'Province', field: 'prov', rowGroup: true, hide: true },
  {headerName: 'Area', field: 'area', rowGroup: true, hide: true},
  {headerName: 'Date', field: 'date_surveyed',  width: 90  },
  {headerName: 'Price', field: 'price', width: 90},
  {headerName: 'High', field: 'high', width: 90,},
  {headerName: 'Low', field: 'low', width: 90,},
  {headerName: 'Action', cellRenderer: 'actionRenderer', field: 'action'}
];
frameworkComponents = {actionRenderer: ActionRenderer} ;
context = { componentParent: this };


  constructor(private route: ActivatedRoute, private dataItemService: DataItemService,
    private kinveyStore: BackendService, private snackBar: MatSnackBar) { 
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

          console.log(this.inputForm);
          this.kinveyStore.getData(this.commodity.name).subscribe(res=>{
    
            // for(let i=0; i<res.length; i++){
            //    let yearWeek = moment(res[i].date_surveyed).year()+'-'+moment(res[i].date_surveyed).week();
            //  //  console.log(yearWeek);
            //    res[i].yearWeek = yearWeek
            //  }
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
      return data.id;
    };

    this.autoGroupColumnDef = {
      headerName: ' ',
      cellRenderer: 'agGroupCellRenderer',
      pinned: 'left',
      width: 300,
      field: 'month_name',
      cellRendererParams: {
        suppressCount: true, // turn off the row count
        innerRenderer: 'simpleCellRenderer'
      }
    };
    console.log(getSimpleCellRenderer());
    
    this.components = { simpleCellRenderer: getSimpleCellRenderer() };
     
    }

  ngOnInit() {

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

function getSimpleCellRenderer() {
  function SimpleCellRenderer() {}
  SimpleCellRenderer.prototype.init = function(params) {
    const tempDiv = document.createElement('div');
     console.log(params.node);
      // console.log(params);
      tempDiv.innerHTML = '<span>' + params.value + '</span>';
     this.eGui = tempDiv.firstChild;
  };
  SimpleCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return SimpleCellRenderer;
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




