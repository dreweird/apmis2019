import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_common/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CommodityComponent } from './commodity/commodity.component';
import { CommodityDetailsComponent } from './commodity-details/commodity-details.component';
import { CommodityValidationComponent } from './commodity-validation/commodity-validation.component';


const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home'},
  
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
              path: '', pathMatch: 'full', redirectTo: 'commodity'

            },
            {
                path: 'commodity', component: CommodityComponent, 

            },
            {
                path: 'commodity-details/:id', component: CommodityDetailsComponent, 

            },
            {
                path: 'commodity-validation/:id', component: CommodityValidationComponent, 

            },

            { path: 'login', component: LoginComponent },
           
        ]
    },


    // otherwise redirect to home
   // { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true,
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }

export const routedComponents = [HomeComponent, CommodityComponent, LoginComponent, CommodityValidationComponent, 
CommodityDetailsComponent];