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
  ]

  area = [
    {area: 'Butuan City', prov: 'Agusan del Norte'},
    {area: 'Cabadbaran City', prov: 'Agusan del Norte'},
    {area: 'San Francisco', prov: 'Agusan del Sur'},
    {area: 'San Jose', prov: 'Dinagat Island'},
    {area: 'Surigao City', prov: 'Surigao del Norte'},
    {area: 'Tandag City', prov: 'Surigao del Sur'}
  ]
  newFilter: { area: string; prov: string; }[];
  selectedArea: any;

onExport(){
  this.gridApi.exportDataAsExcel({
    sheetName: this.commodity.name + '- Raw Data Collection (Weekly Basis)',
    fileName: this.commodity.name + '- Raw Data Collection (Weekly Basis)'
  })
}



onGridReady(params) {
  this.gridApi = params.api;
}
onGridReady2(params) {
  this.gridApi2 = params.api;
}
reset(formDirective: FormGroupDirective){
  formDirective.resetForm();
  this.inputForm.reset();

}
onSave(formDirective: FormGroupDirective){

  this.inputForm.value.date_surveyed = "2019-"+this.inputForm.value.date_surveyed+"-01";
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
    {headerName: 'Area', field: 'area' },
    {headerName: 'Date Surveyed', field: 'date_surveyed', width: 90 },
    {headerName: 'Price', field: 'price', width: 90},
    {headerName: 'High', field: 'high', width: 90},
    {headerName: 'Low', field: 'low', width: 90},
    {headerName: 'Respondent', field: 'respondent' },
    {headerName: 'Supplier', field: 'supplier' },
    {headerName: 'Remarks', field: 'remarks' },
    {delete: 'Remarks', field: 'remarks' },
    {headerName: 'Action', cellRenderer: 'deleteRenderer', field: 'action'}
];

columnDefs2 = [
  {headerName: 'Province', field: 'prov', rowGroup: true, hide: true },
  {headerName: 'Area', field: 'area', rowGroup: true, hide: true},
  {headerName: 'Date', field: 'date_surveyed',  width: 90  },
  {headerName: 'Price', field: 'price', width: 90},
  {headerName: 'High', field: 'high', width: 90},
  {headerName: 'Low', field: 'low', width: 90},
  {headerName: 'Action', cellRenderer: 'actionRenderer', field: 'action'}
];
frameworkComponents = {actionRenderer: ActionRenderer} ;
frameworkComponents2 =  {deleteRenderer: DeleteRenderer} //kinvey delete
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

  onRemoveSelected(cell) {
    var selectedData = this.gridApi2.getSelectedRows();
    var id = selectedData[0].id;
    console.log(selectedData);
    this.gridApi2.updateRowData({ remove: selectedData});
    if(confirm("Are you sure you want to delete " + cell + "!")){
     this.dataItemService.deleteData(id).subscribe(()=>{
      var res = this.gridApi2.updateRowData({ remove: selectedData});
      console.log(res);
     })
   
  
    }else{
      console.log("false");
    }
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
  <button color="accent" *ngIf="!params.node.group" mat-button style="height: 20px"
  (click)="invokeParentMethod()" ><fa-icon icon="edit"></fa-icon></button>

  <button color="warn" *ngIf="!params.node.group" mat-button style="height: 20px"
  (click)="invokeParentMethod2()" ><fa-icon icon="trash"></fa-icon></button>`,
  styles: [
      `.btn {
          line-height: 0.5
      }`
  ]
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
   // console.log(this.params);
      this.params.context.componentParent.onRemoveSelected(`Name: ${this.params.data.commodity}, Row: ${this.params.node.rowIndex}`)
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




