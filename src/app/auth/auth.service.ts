import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { pipe, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';
// import { User } from './auth/user.model';
import { Router } from '@angular/router';
import { User } from './user.model';
import { environment } from '../../environments/environment'

export interface AuthResponseData{
  idToken : string;
  email : string;
  refreshToken : string;
  expiresIn : string;
  localId : string;
  registered ?: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  user = new BehaviorSubject<User>(null);
  // user = new Subject<User>();
  private tokenExpirationTimer : any;

  constructor(private http:HttpClient,private router : Router) { }

  signUp(email:string,password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
    {
      email : email,
      password : password,
      returnSecureToken : true
    }).pipe(
      catchError(this.handleError),
      tap(resData=>{
        this.handleAuthentication(resData.email,resData.localId,resData.idToken,resData.expiresIn);
      })
    );
  }

  logIn(email:string,password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email : email,
        password : password,
        returnSecureToken : true
      }
    ).pipe(catchError(this.handleError),
    tap(resData=>{
      this.handleAuthentication(resData.email,resData.localId,resData.idToken,resData.expiresIn);
      })
    );
  }

  logOut(){
    this.user.next(null);
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogOut(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logOut();
    },expirationDuration)
  }

  autoLogIn(){
    const user : {
      email : string,
      password : string,
      _token : string,
      _tokenExpirationDate : string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!user){
      return;
    }
    const loadedUser = new User(user.email,user.password,user._token,new Date(user._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }
  }

  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = "An unknown email occured";
    if(!errorRes.error || !errorRes.error.error){
      return throwError(errorMessage);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS OPERATION_NOT_ALLOWED':
        errorMessage = "This email already exist!";
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = " Password sign-in is disabled for this project!";
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = "We have blocked all requests from this device due to unusual activity. Try again later!";
        break;
      case 'EMAIL_NOT_FOUND' :
        errorMessage = "There is no user record corresponding to this identifier. The user may have been deleted.";
        break;
      case 'INVALID_PASSWORD' :
        errorMessage = "The password is invalid or the user does not have a password.";
        break;
      case 'USER_DISABLED' :
        errorMessage = "The user account has been disabled by an administrator.";
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(email:string,localId:string,idToken:string,expiresIn:string){
    const expiryDate = new Date(new Date().getTime() + +expiresIn*1000);
    const user = new User(email,localId,idToken,expiryDate);
    this.user.next(user);
    this.autoLogOut(+expiresIn*1000)
    localStorage.setItem('userData',JSON.stringify(user));
  }

}
