import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../_animations/index';
import { ActivatedRoute  } from '@angular/router';
import { DataItemService, Commodity } from '../_services';
import * as CanvasJS from '../../assets/canvasjs.min';
import "ag-grid-enterprise";

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-commodity-details',
  templateUrl: './commodity-details.component.html',
  styleUrls: ['./commodity-details.component.scss']
})
export class CommodityDetailsComponent implements OnInit, OnDestroy {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  id: number;
  private sub: any;
  rowData: [];
  @Input() commodity: Commodity;
  myBackgroundImageUrl: any;
  chart: any;
  chart2: any;
  chart3: any;
  res: any;
  dataPoints = new Array();
  monthAgo = new Array();
  month3Ago = new Array();
  yearAgo = new Array();

  foods: Food[] = [
    {value: 'Butuan City', viewValue: 'Agusan del Norte - Butuan City'},
    {value: 'Cabadbaran City', viewValue: 'Agusan del Norte - Cabadbaran City'},
    {value: 'San Francisco', viewValue: 'Agusan del Sur - San Francisco'},
    {value: 'San Jose', viewValue: 'Dinagat Island - San Jose'},
    {value: 'Surigao City', viewValue: 'Surigao del Norte - Surigao City'},
    {value: 'Tandag City', viewValue: 'Surigao del Sur - Tandag City'}
  ];

  selected = 'Butuan City';
  loading: boolean = false;

  columnDefs = [
    {headerName: 'Province', field: 'prov', rowGroup: true, hide: true },
    {headerName: 'Area', field: 'area', rowGroup: true },
    {headerName: 'Year', field: 'year', rowGroup: true, hide: true },
    {headerName: 'Date', field: 'date_surveyed' },
    {headerName: 'Price', field: 'price'},
    {headerName: 'High', field: 'high'},
    {headerName: 'Low', field: 'low'}
];

autoGroupColumnDef = {
  headerName: "Area"
}
gridApi: any;

onExport(){
  this.gridApi.exportDataAsExcel({
    sheetName: this.commodity.name + '- Data Collection (Monthly Basis)',
    fileName: this.commodity.name + '- Data Collection (Monthly Basis)'
  })
}

onGridReady(params) {
  this.gridApi = params.api;
}

  constructor(private route: ActivatedRoute, private dataItemService: DataItemService) { }

    ngDoCheck(){
			/* Check https://angular.io/guide/lifecycle-hooks#docheck for informaton about ngDoCheck */
      if(this.chart == undefined && document.getElementById("chartContainer")) {
        if(this.dataPoints.length > 0 && this.monthAgo.length > 0){
          this.renderChart();
        }
			
			} 
		}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      this.dataItemService.getSelected(this.id).subscribe(data=>{
        this.commodity = data[0];
        this.myBackgroundImageUrl = this.commodity.imageSrc;
      });
  
  
      this.dataItemService.getItem(this.id).subscribe(res=>{
        console.log(res);
        this.rowData = res;
        if(this.rowData.length > 0){
          this.processData(this.selected);
        }
      });
      
  

   });
  }

  updateChart(event){
    this.dataPoints = [];
    this.monthAgo = [];
    this.month3Ago= [];
    this.yearAgo = [];
    this.loading = true;
    console.log(event);
    this.chart.subtitles[0].set("text", event.value);
    this.chart2.subtitles[0].set("text", event.value);
    this.chart3.subtitles[0].set("text", event.value);
    this.processData(event.value);
    setTimeout(()=> {
  
      this.monthAgo.shift();
      this.month3Ago.splice(0, 3);
      this.yearAgo.splice(0, 12);
      console.log(this.monthAgo);
      this.chart.options.data[0].dataPoints = this.dataPoints;
      this.chart2.options.data[0].dataPoints = this.dataPoints;
      this.chart3.options.data[0].dataPoints = this.dataPoints;
      this.chart.options.data[1].dataPoints = this.monthAgo;
      this.chart2.options.data[1].dataPoints = this.month3Ago;
      this.chart3.options.data[1].dataPoints = this.yearAgo;
      this.chart.render();
      this.chart2.render();
      this.chart3.render();
      this.loading = false;
    }, 3500);

  }


  processData(area){
    console.log(area);
    this.dataItemService.get3MosAgo(this.id, area).subscribe(res=>{
     console.log(res);
      for(let entry of res){
        this.dataPoints.push({
          x: new Date(entry.date_surveyed),
          y: entry.price
        });
        this.monthAgo.push({
          x: new Date(entry.date_surveyed),
          y: entry['get1mos']
        });
        this.month3Ago.push({
          x: new Date(entry.date_surveyed),
          y: entry['get3mos']
        });
        this.yearAgo.push({
          x: new Date(entry.date_surveyed),
          y: entry['get12mos']
        });
      }
    });


    
  }

  renderChart() {
    this.monthAgo.shift();
    this.month3Ago.splice(0, 3);
    this.yearAgo.splice(0, 12);
    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Prevailing Price vs Prevailing Price A Month Ago",
        fontColor: "#388e3c"
      },
      subtitles: [{
        text: this.selected,
        fontSize: 20
      }],
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      axisY2: {
        title: "Average Price",
        prefix: "₱",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true
      },
      data: [{
        type:"line",
        axisYType: "secondary",
        name: "Prevailing Price",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.dataPoints
      },
      {
        type: "line",
        axisYType: "secondary",
        name: "Prevailing Price A Month Ago",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.monthAgo
      }]
    });
    this.chart.render();

    this.chart2 = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Prevailing Price vs Prevailing Price 3 Months Ago",
        fontColor: "#388e3c"
      },
      subtitles: [{
        text: this.selected,
        fontSize: 20
      }],
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      axisY2: {
        title: "Average Price",
        prefix: "₱",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true
      },
      data: [{
        type:"line",
        axisYType: "secondary",
        name: "Prevailing Price",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.dataPoints
      },
      {
        type: "line",
        axisYType: "secondary",
        name: "Prevailing Price 3 Months Ago",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.month3Ago
      }]
    });
    this.chart2.render();

    this.chart3 = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Prevailing Price vs Prevailing Price A Year Ago",
        fontColor: "#388e3c"
      },
      subtitles: [{
        text: this.selected,
        fontSize: 20
      }],
      axisX: {
        valueFormatString: "MMM YYYY"
      },
      axisY2: {
        title: "Average Price",
        prefix: "₱",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        verticalAlign: "top",
        horizontalAlign: "center",
        dockInsidePlotArea: true
      },
      data: [{
        type:"line",
        axisYType: "secondary",
        name: "Prevailing Price",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.dataPoints
      },
      {
        type: "line",
        axisYType: "secondary",
        name: "Prevailing Price A Year Ago",
        showInLegend: true,
        markerSize: 0,
        yValueFormatString: "₱#,###",
        dataPoints: this.yearAgo
      }]
    });
    this.chart3.render();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if(this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }





}
