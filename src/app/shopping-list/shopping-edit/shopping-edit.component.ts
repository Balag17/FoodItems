import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {

  @ViewChild('f') slForm : NgForm;

  subscription:Subscription;
  editMode:boolean = false;
  editedItemIndex: number;
  editIngredients: Ingredient;

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
    this.subscription =  this.slService.startedEditing.subscribe(
      (index:number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editIngredients =  this.slService.getIngridentsToEdit(index);
        this.slForm.setValue({
          name: this.editIngredients.name,
          amount: this.editIngredients.amount
        })
      }
    );
  }

  onSubmit(form:NgForm){
    const value = form.value;
    const newIngrident = new Ingredient(value.name,value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex,newIngrident);
    }
    else{
      this.slService.addingIngrident(newIngrident);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

}
