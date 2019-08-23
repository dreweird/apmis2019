import { Component, OnInit } from '@angular/core';
import { BackendService } from '../_services/index';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  isAuthenticating = false;
  loginForm: FormGroup;

  constructor( private router: Router, 
    private backendService: BackendService, private fb: FormBuilder) {
      this.loginForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        password: new FormControl('', [
          Validators.required,
        ]),
      });
   }

  ngOnInit() {
    this.backendService.logout();
  }

  login(){
    this.isAuthenticating = true;

    // Use the backend service to login
    this.backendService.login(this.loginForm.value.email, this.loginForm.value.password)
        .then((data) => {
          console.log(data);
            this.isAuthenticating = false;
            if(data){
              localStorage.setItem('currentUser', this.loginForm.value.email);
              this.router.navigate(['/home', 'commodity']);
            }            
           
        }).catch(error => {
            this.isAuthenticating = false;
        });
  }
   
}




