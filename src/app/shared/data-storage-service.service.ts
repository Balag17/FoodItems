import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageServiceService {

  constructor(private http:HttpClient,private recipeService:RecipesService,private authService:AuthService) { }

  saveRecipes(){
    const allRecipe = this.recipeService.getRecipe();
    this.http.put("https://ng-course-recipe-book-27a0f.firebaseio.com/recipes.json",allRecipe).subscribe(data=>{
      console.log("this is my data",data);
    });
  }

  fetchRecipe(){
    return this.http.get<Recipe[]>("https://ng-course-recipe-book-27a0f.firebaseio.com/recipes.json")
    .pipe(
          map(recipes => {
          return recipes.map(recipe => {
            return {...recipe,ingredients:recipe.ingredients?recipe.ingredients:[]};
          });
        }),
        tap(recipes=>{
          this.recipeService.setRecipe(recipes);
        })
        );
    
  }

}
