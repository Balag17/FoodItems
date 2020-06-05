import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DataStorageServiceService } from '../shared/data-storage-service.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated : boolean = false;
  private userSub : Subscription;
  

  constructor(private dSService:DataStorageServiceService,
              private authService:AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(userData=>{
      this.isAuthenticated = !userData?false:true;
      console.log(!userData);
      console.log(!!userData);
    })
  }

  saveData(){
    this.dSService.saveRecipes();
  }

  onFetchData(){
    this.dSService.fetchRecipe().subscribe();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onLogOut(){
    this.authService.logOut();
  }

}
