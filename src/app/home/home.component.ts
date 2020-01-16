import { Component, OnInit} from '@angular/core';
import { routeAnimations, AnimationsService } from '../_animations/index';
import { Router } from '@angular/router';
import { environment as env} from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BackendService } from '../_services';
import * as CanvasJS from '../../assets/canvasjs.min';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations]

})
export class HomeComponent implements OnInit {

  isProd = env.production;
  envName = '';
  version = 1.0;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  

  menu: any[] = [
    {
      title: 'Commodity',
      route: 'commodity'
    },
    {
      title: 'Reports',
      route: 'report'
    }         
  ];

  navigationSideMenu = [
    ...this.menu,
    { title: 'Log-out', route: 'logout'}

  ];
  chart: any;

  constructor(private router: Router, private animationService: AnimationsService,
    public logService: BackendService) {
    this.animationService.updateRouteAnimationType(true, true);

   }

   ngOnInit() {

		;
	
		// chart.render();
    }

    // ngDoCheck(){
		// 	/* Check https://angular.io/guide/lifecycle-hooks#docheck for informaton about ngDoCheck */
    //   if(this.chart == undefined && document.getElementById("chartContainer")) {

    //     this.chart = new CanvasJS.Chart("chartContainer",{
    //       animationEnabled: true,
    //       zoomEnabled: true,
    //       title:{
    //         text: "Basic Column Chart in Angular 6"
    //       },
    //       data: [
    //         {        
    //           type: "line",
    //           dataPoints: [
    //           { x: new Date(2016, 0, 1), y: 22 },
    //           { x: new Date(2016, 1, 1), y: 21 },
    //           { x: new Date(2016, 2, 1), y: 25},
    //           { x: new Date(2016, 3, 1), y: 20 },
    //           { x: new Date(2016, 4, 1), y: 25 },
    //           { x: new Date(2016, 5, 1), y: 27 },
    //           { x: new Date(2016, 6, 1), y: 28 },
    //           { x: new Date(2016, 7, 1), y: 28 },
    //           { x: new Date(2016, 8, 1), y: 24 },
    //           { x: new Date(2016, 9, 1), y: 26},
    //           { x: new Date(2016, 10, 1), y: null},
    //           { x: new Date(2016, 11, 1), y: 24}
            
    //           ]
    //         },
    //         {        
    //           type: "line",
    //           dataPoints: [
          
          
    //           { x: new Date(2016, 1, 1), y: 25},
    //           { x: new Date(2016, 2, 1), y: 20 },
    //           { x: new Date(2016, 3, 1), y: 25 },
    //           { x: new Date(2016, 4, 1), y: 27 },
    //           { x: new Date(2016, 5, 1), y: null },
    //           { x: new Date(2016, 6, 1), y: 28 },
    //           { x: new Date(2016, 7, 1), y: 24 },
    //           { x: new Date(2016, 8, 1), y: 26},
    //           { x: new Date(2016, 9, 1), y: 21},
    //           { x: new Date(2016, 10, 1), y: 24}
              
    //           ]
    //           }
    //         ]
            
    //     });
      
    //       this.chart.render();
    //     }
		
		// }
  onLogoutClick() {
    this.router.navigate(['']);
    localStorage.clear();
  }


}

