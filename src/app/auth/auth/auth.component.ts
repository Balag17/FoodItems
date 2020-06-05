import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLogInMode:boolean = true;
  isLoading:boolean = false;

  error:string = null;

  constructor(private authService:AuthService,private router : Router) { }

  ngOnInit() {
  }

  onSwitchMode(){
    this.isLogInMode = !this.isLogInMode;
  }

  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs : Observable<AuthResponseData>;

    if(this.isLogInMode){
      authObs = this.authService.logIn(email,password);
    }else{
      authObs = this.authService.signUp(email,password);
    }

    authObs.subscribe(authData=>{
      console.log("!!!!",authData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    },
    errorMessage=>{
      this.error = errorMessage;
      console.log("@@@@",errorMessage);
      this.isLoading = false;
    });

    console.log(form.value);
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

}
