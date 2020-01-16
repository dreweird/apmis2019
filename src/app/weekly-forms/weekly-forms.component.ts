import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import { Commodity, DataItemService } from '../_services';
import { WeeklyTableComponent } from '../weekly-table/weekly-table.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-weekly-forms',
  templateUrl: './weekly-forms.component.html',
  styleUrls: ['./weekly-forms.component.scss']
})
export class WeeklyFormsComponent implements OnInit {


  inputWeeklyForm: FormGroup;
  @Input() commodity: Commodity;
  @ViewChild(WeeklyTableComponent, {static: false}) child: WeeklyTableComponent;

  area = [
    {area: 'Butuan City', prov: 'Agusan del Norte'},
    {area: 'Cabadbaran City', prov: 'Agusan del Norte'},
    {area: 'San Francisco', prov: 'Agusan del Sur'},
    {area: 'San Jose', prov: 'Dinagat Island'},
    {area: 'Surigao City', prov: 'Surigao del Norte'},
    {area: 'Tandag City', prov: 'Surigao del Sur'}
  ];

  newFilter: { area: string; prov: string; }[];

  filterArea(event){
    this.newFilter = this.area.filter((el)=>{
      return el.prov == event.value
    });
  }

  onSave(formDirective: FormGroupDirective){
    console.log(this.inputWeeklyForm.value);
    this.ds.addWeekly(this.inputWeeklyForm.value).subscribe((data: any)=> {
      if(data){
        if(this.inputWeeklyForm.value.id){
          this.child.updategrid(this.inputWeeklyForm.value);
          this.snackBar.open('Data Successfully Updated!', 'Ok', {
            duration: 2000,
          });
        }else{
          this.inputWeeklyForm.value.id = data.insertId;
          this.child.whoAmI(this.inputWeeklyForm.value);
          this.snackBar.open('Data Successfully Added!', 'Ok', {
            duration: 2000,
          });
        }
        formDirective.resetForm();
        this.inputWeeklyForm.reset();
      }
    });
  }
  onUpdate(cell: any){
    console.log(cell);
    this.newFilter = this.area;
    this.inputWeeklyForm.patchValue({
      id: cell.id,
      prov: cell.prov,
      area: cell.area,
      date_surveyed: new Date(cell.date_surveyed).toISOString().substr(0, 10),
      price: cell.price,
      seller: cell.seller,
      supplier: cell.supplier,
      remarks: cell.remarks,
      category: cell.category,
      commodity_id: cell.commodity_id,
      commodity: cell.commodity

    });
  }
  
  constructor(private ds: DataItemService, public snackBar: MatSnackBar) {
  
  }

  ngOnInit() {

    //console.log(this.commodity);

    this.inputWeeklyForm = new FormGroup({
      prov: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      date_surveyed: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      seller: new FormControl(''),
      supplier: new FormControl(''),
      remarks: new FormControl(''),
      category: new FormControl(this.commodity.category),
      commodity: new FormControl(this.commodity.name),
      commodity_id: new FormControl(this.commodity.id),
      id: new FormControl('')
    }); 
  }

}
