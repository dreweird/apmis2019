import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import { DataItemService } from '../_services';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  inputForm: FormGroup;
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

  year = [
    {value: "2016", viewValue: "2016"},
    {value: "2017", viewValue: "2017"},
    {value: "2018", viewValue: "2018"},
    {value: "2019", viewValue: "2019"}
  ];

  area = [
    {area: 'Butuan City', prov: 'Agusan del Norte'},
    {area: 'Cabadbaran City', prov: 'Agusan del Norte'},
    {area: 'San Francisco', prov: 'Agusan del Sur'},
    {area: 'San Jose', prov: 'Dinagat Island'},
    {area: 'Surigao City', prov: 'Surigao del Norte'},
    {area: 'Tandag City', prov: 'Surigao del Sur'}
  ];
  rowData: any;
  m: any;
  y: any;

  columnDefs = [
    {headerName: 'Category',  field: 'category', rowGroup: true, hide: true },
    {headerName: 'Commodity',  field: 'name', pinned: 'left', hide: true },
    {headerName: 'Specification',  field: '', width: 100 },
    {headerName: 'Butuan City - ADN',  children: [
      {headerName: 'Prevailing',  field: 'bxu.price', width: 80 },
      {headerName: 'Low',  field: 'bxu.low', width: 80 },
      {headerName: 'High',  field: 'bxu.high', width: 80 },
    ] },
    {headerName: 'Cabadbaran City - ADN',  children: [
      {headerName: 'Prevailing',  field: 'cbr.price', width: 80 },
      {headerName: 'Low',  field: 'cbr.low', width: 80 },
      {headerName: 'High',  field: 'cbr.high', width: 80 },
    ] },
    {headerName: 'San Francisco - ADS',  children: [
      {headerName: 'Prevailing',  field: 'sfr.price', width: 80 },
      {headerName: 'Low',  field: 'sfr.low', width: 80 },
      {headerName: 'High',  field: 'sfr.high', width: 80 },
    ] },
    {headerName: 'San Jose - PDI',  children: [
      {headerName: 'Prevailing',  field: 'sjs.price', width: 80 },
      {headerName: 'Low',  field: 'sjs.low', width: 80 },
      {headerName: 'High',  field: 'sjs.high', width: 80 },
    ] },
    {headerName: 'Surigao City - SDN',  children: [
      {headerName: 'Prevailing',  field: 'sur.price', width: 80 },
      {headerName: 'Low',  field: 'sur.low', width: 80 },
      {headerName: 'High',  field: 'sur.high', width: 80 },
    ] },
    {headerName: 'Tandag City - SDS',  children: [
      {headerName: 'Prevailing',  field: 'tan.price', width: 80 },
      {headerName: 'Low',  field: 'tan.low', width: 80 },
      {headerName: 'High',  field: 'tan.high', width: 80 },
    ] },
    {headerName: 'Caraga',  children: [
      {headerName: 'Prevailing',  field: '', width: 80  },
      {headerName: 'Low',  field: '', width: 80  },
      {headerName: 'High',  field: '', width: 80  },
      {headerName: 'Average',  field: '', width: 80  }
    ] }

  ];

  autoGroupColumnDef = {
    headerName: 'Commodity',
    cellRenderer: 'agGroupCellRenderer',
    pinned: 'left',
    width: 300,
    field: 'name',
    cellRendererParams: {
      suppressCount: true, // turn off the row count
      innerRenderer: 'simpleCellRenderer'
    }
  };

  components = { simpleCellRenderer: getSimpleCellRenderer() };

  constructor(private dataItemService: DataItemService) { 
    this.inputForm = new FormGroup({
      month: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required])

    }); 
  }

  onGenerate(formDirective: FormGroupDirective){
    console.log(this.inputForm.value);
    this.m = this.inputForm.value.month.viewValue;
    this.y = this.inputForm.value.year;
    this.dataItemService.monthlyReports(this.inputForm.value.month.value, this.y).subscribe(data=>{
      this.rowData = data;
      console.log(data);
    });
    formDirective.resetForm();
    this.inputForm.reset();
  }

  ngOnInit() {
 
  }

}

function getSimpleCellRenderer() {
  function SimpleCellRenderer() {}
  SimpleCellRenderer.prototype.init = function(params) {
    const tempDiv = document.createElement('div');
    // console.log(params.node);
    if (params.node.group && params.node.field === 'name') {
      // alert(params.node.field);
      tempDiv.innerHTML =
        '<span>' + params.node.allLeafChildren[0].data.name + '</span>';
    } else if (params.node.group) {
      tempDiv.innerHTML =
        '<span style="font-weight: bold">' + params.value + '</span>';
    } else {
      // console.log(params);
      tempDiv.innerHTML = '<span>' + params.value + '</span>';
    }
    this.eGui = tempDiv.firstChild;
  };
  SimpleCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return SimpleCellRenderer;
}
