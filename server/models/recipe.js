var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Recipes Schema
var recipeSchema = new Schema({
  name: String,
  ingredients: [Schema.Types.Mixed],
  instructions: [String],
  estimatedTime: Number,
});

var Recipe = (module.exports = mongoose.model('Recipe', recipeSchema));

// Get Recipes
module.exports.getRecipes = function(callback, limit) {
  Recipe.find(callback).limit(limit);
};

// Get RecipeById
module.exports.getRecipeById = function(id, callback) {
  Recipe.findById(id, callback);
};

// Add Recipe
module.exports.addRecipe = function(recipe, callback) {
  Recipe.create(recipe, callback);
};

// Delete by ID
module.exports.deleteRecipe = function(id, callback) {
  var query = { _id: id };
  Recipe.remove(query, callback);
};
