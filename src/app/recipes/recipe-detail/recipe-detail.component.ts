import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  oneSelectedRecipe:Recipe;
  id:number;

  constructor(private recipeService:RecipesService,private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.id = +params['id'];
      this.oneSelectedRecipe = this.recipeService.getRecipeById(this.id);

    })
  }

  onAddingToShopping(){
    this.recipeService.addingIngridentsToShoppingList(this.oneSelectedRecipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }

  onDelete(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }

}
