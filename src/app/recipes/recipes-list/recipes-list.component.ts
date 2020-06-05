import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  // @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes:Recipe[];

  constructor(private recipeService:RecipesService,private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.recipeService.recipeChanged.subscribe(
      (recipes:Recipe[]) => {
        this.recipes = recipes;
      } );
    this.recipes = this.recipeService.getRecipe();
  }

  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.route});

  }

}
