import * as $ from 'jquery';
import { Recipe } from './recipe/recipe.model';
import { Ingredient } from './ingredient/ingredient.model';
import { Fridge } from './fridge/fridge.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable()
export class RecipeManagementService {
  constructor(private http: HttpClient) {}

  checkIngredients = false;
  shoppingList: Ingredient[][];
  ingredientsCount: Array<Ingredient> = [new Ingredient('', 0)];
  formBinding: Recipe = new Recipe('', [new Ingredient('', 0)], [''], 0);
  selectedItem: Recipe = null;
  showEditComponent = false;
  recipeID;
  recipes: Array<any> = [];
  fridge = new Fridge([
    new Ingredient('large onion', 1),
    new Ingredient('large carrots', 2),
    new Ingredient('potatos', 5),
    new Ingredient('cups of water', 2),
    new Ingredient('tablespoon of oil', 1),
  ]);
  // END OF VARIABLE DECLARATION

  select(recipe) {
    this.selectedItem = recipe;
    this.discard();
  }

  delete(recipe) {
    this.deleteRecipe(recipe._id); // Delete recipe from server
    this.selectedItem = null;
    this.discard();
    this.checkIngredients = false;
  }

  saveRecipe() {
    if (this.formBinding.name !== '' && this.formBinding.instructions.toString() !== '' && this.createIngredients().length !== 0) {
      const recipe = new Recipe(
        this.formBinding.name,
        this.createIngredients(),
        new Array(this.formBinding.instructions.toString()),
        this.formBinding.estimatedTime
      );
      this.addRecipe(recipe); // Add recipe to server
      // Clear the page
      this.discard();
      this.showEditComponent = false;
      this.selectedItem = null;
    }
  }

  discard() {
    this.formBinding = new Recipe('', [new Ingredient('', 0)], [''], 0);
    this.ingredientsCount = [new Ingredient('', 0)];
    this.showEditComponent = false;
    this.checkIngredients = false;
  }

  edit(recipe) {
    this.formBinding.name = this.selectedItem.name;
    this.formBinding.instructions = this.selectedItem.instructions;
    this.formBinding.estimatedTime = this.selectedItem.estimatedTime;
    this.ingredientsCount = [];
    this.showEditComponent = true;

    for (let i = 0; i < this.selectedItem.ingredients.length; i++) {
      this.ingredientsCount.push(new Ingredient(this.selectedItem.ingredients[i].name, this.selectedItem.ingredients[i].quantity));
    }
    this.selectedItem = null;
  }

  createIngredients() {
    const ingredients: Array<Ingredient> = [];
    const x = Array.from($('.ingredients'));

    for (let i = 0; i < this.ingredientsCount.length; i++) {
      const quantity = x[i + 1].children[0] as HTMLInputElement;
      const item = x[i + 1].children[1] as HTMLInputElement;
      if (item.value !== '' && quantity.valueAsNumber > 0) {
        ingredients.push(new Ingredient(item.value, quantity.valueAsNumber));
      }
    }
    return ingredients;
  }

  addNewIngredientField() {
    this.ingredientsCount.push(new Ingredient('', 0));
  }

  addIngredientToFridge(ingredientName, ingredientQuantity) {
    this.fridge.add(new Ingredient(ingredientName, ingredientQuantity));
  }

  checkRecipe() {
    this.shoppingList = this.fridge.checkRecipe(this.selectedItem);
    this.checkIngredients = true;
  }

  getRecipesList(): Promise<any> {
    const request = this.http
      .request(new HttpRequest('GET', 'http://localhost:8000/recipelist'))
      .toPromise()
      .catch(reason => {
        return reason;
      });

    request.then((response: any) => {
      // console.log(response.body);
      return response;
    });
    return request;
  }

  getRecipe(id): Promise<any> {
    const request = this.http
      .request(new HttpRequest('GET', 'http://localhost:8000/retrieverecipe/' + id))
      .toPromise()
      .catch(reason => {
        return reason;
      });

    request.then((response: any) => {
      console.log(response.body);
      this.select(response.body);
      return response;
    });
    return request;
  }

  // Add recipe to server
  addRecipe(recipe: Recipe) {
    console.log(recipe);
    this.http
      .post('http://localhost:8000/addrecipe', recipe)
      .toPromise()
      .catch(reason => {
        console.log('recipe failed', reason);
      })
      .then((response: any) => {
        console.log('response', response);
        this.onStart();
      });
  }

  deleteRecipe(id) {
    console.log(id);
    this.http
      .delete('http://localhost:8000/deleterecipe/' + id)
      .toPromise()
      .catch(reason => {
        console.log('recipe failed', reason);
      })
      .then((response: any) => {
        console.log('response', response);
        this.onStart();
      });
  }

  onStart() {
    this.getRecipesList()
      .then((response: any) => {
        console.log(response.body.recipes);
        this.recipes = response.body;
        console.log(response);
        return response;
      })
      .catch(() => {});
  }
}
