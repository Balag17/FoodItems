import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageServiceService } from '../shared/data-storage-service.service';
import { RecipesService } from './recipes.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private ds:DataStorageServiceService,private rs:RecipesService) { }

  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    const recipes = this.rs.getRecipe();
    if(recipes.length===0){
      return this.ds.fetchRecipe();
    }
    else{
      return recipes;
    }
  }

}
