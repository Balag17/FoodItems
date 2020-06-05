import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {path:'', redirectTo:'/recipes', pathMatch:'full'},
  { path: 'recipes' , loadChildren : './recipes/recipes.module#RecipesModule' },
  { path: 'auth' , loadChildren : './auth/auth.module#AuthModule' },
  { path: 'shopping-list' , loadChildren : './shopping-list/shopping-list.module#ShoppingListModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes , {preloadingStrategy : PreloadAllModules} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
