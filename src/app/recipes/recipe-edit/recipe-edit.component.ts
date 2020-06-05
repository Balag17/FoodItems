import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id:number;
  editMode:boolean =  false;
  recipeFrom : FormGroup;

  constructor(private route:ActivatedRoute,private rService:RecipesService,
              private router:Router) { }


  get ingredientsControls() {
    return (this.recipeFrom.get('ingredients') as FormArray).controls;
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.id = params['id'];
      this.editMode = params['id']!=null;
      this.initForm();
    })
  }

  onAddIngredient(){
    (<FormArray>this.recipeFrom.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null,Validators.required),
        'amount': new FormControl(null,[
          Validators.pattern(/^[1-9]+[0-9]*$/),
          Validators.required]
          )
      })
    );
  }

  initForm(){

    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      const recip = this.rService.getRecipeById(this.id);
      recipeName = recip.name;
      recipeImagePath = recip.imagePath;
      recipeDescription = recip.description;
      if(recip['ingredients']){
        for(let ing of recip.ingredients){
          recipeIngredients.push(
            new FormGroup({
              'name' : new FormControl(ing.name,Validators.required),
              'amount' : new FormControl(ing.amount,[
                Validators.pattern(/^[1-9]+[0-9]*$/),
                Validators.required]
                )
            })
          );
        }
      }
    }

    this.recipeFrom = new FormGroup({
      'name': new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit(){
    if(this.editMode){
      this.rService.updateRecipe(this.id,this.recipeFrom.value);
    }
    else{
      this.rService.addRecipe(this.recipeFrom.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(["../"],{relativeTo:this.route});
  }

  onDeleteIngredient(index:number){
    (<FormArray>this.recipeFrom.get('ingredients')).removeAt(index);
  }

}
