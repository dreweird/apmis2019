import { Component, OnInit} from '@angular/core';
import { routeAnimations, AnimationsService } from '../_animations/index';
import { Router } from '@angular/router';
import { environment as env} from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { BackendService } from '../_services';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations]

})
export class HomeComponent implements OnInit {

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
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

  constructor(private router: Router, private animationService: AnimationsService,
    private logService: BackendService) {
    this.animationService.updateRouteAnimationType(true, true);

   }

  ngOnInit() {
 
   
  }
  onLogoutClick() {
    this.router.navigate(['']);
    localStorage.clear();
  }


}

