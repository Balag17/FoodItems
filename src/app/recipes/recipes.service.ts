import { Injectable, Output, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  // recipeSelected = new EventEmitter<Recipe>();

  recipeChanged = new Subject<Recipe[]>();

  constructor(private slService:ShoppingListService) { }

  // private recipes:Recipe[]=[
  //   new Recipe('A test recipe',
  //               'This is a simply a test',
  //               'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2003/9/29/0/ig1a09_roasted_carrots.jpg.rend.hgtvcom.826.620.suffix/1393645736360.jpeg',
  //               [
  //                 new Ingredient('Waffles',2),
  //                 new Ingredient('Coca Cola',4)
  //               ]
  //               ),
  //   new Recipe('Another test recipe',
  //               'This is a simply another test',
  //               'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTIT3I8lECJ8aOdk2mARY10LNonVp7bWZc0N3qdEgtz9oAAzIld',
  //               [
  //                 new Ingredient('French Fries',1),
  //                 new Ingredient('Burger',3)
  //               ]
  //             )
  //       ];

  private recipes:Recipe[]  = [];

  getRecipe(){
    // return this.recipes;
    return this.recipes.slice();
  }

  setRecipe(recipe:Recipe[]){
    this.recipes = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipeById(id:number){
    return this.recipes[id];
  }

  addingIngridentsToShoppingList(ingredients:Ingredient[]){
    this.slService.ingredientAdded(ingredients);
  }

  addRecipe(newRecipe:Recipe){
    this.recipes.push(newRecipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index:number,newRecipe:Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index:number){
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice());
  }

}
