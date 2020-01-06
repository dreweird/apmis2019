import { Component, OnInit, Input } from '@angular/core';
import {FormControl, FormGroup, Validators, FormGroupDirective} from '@angular/forms';
import { Commodity } from '../_services';


@Component({
  selector: 'app-weekly-forms',
  templateUrl: './weekly-forms.component.html',
  styleUrls: ['./weekly-forms.component.scss']
})
export class WeeklyFormsComponent implements OnInit {


  inputWeeklyForm: FormGroup;
  @Input() commodity: Commodity;

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
    formDirective.resetForm();
    this.inputWeeklyForm.reset();
  }
  

  constructor() {}

  ngOnInit() {
    console.log(this.commodity);

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
     //  unit: new FormControl('kilo'),
      id: new FormControl(null)
    }); 
  }

}
