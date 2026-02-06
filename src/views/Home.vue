<template>
  <div class="min-h-screen">
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
          <span class="text-4xl" role="img" aria-label="Recipe book">📖</span>
          <span>Recipe Collector</span>
        </h1>
        <p class="text-gray-600 mt-2 text-sm sm:text-base">Your personal recipe collection</p>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search and Filters Section -->
      <section class="bg-white rounded-xl shadow-md mb-6" aria-label="Search and filter recipes">
        <div class="space-y-4">
          <!-- Search Bar -->
          <div>
            <SearchBar @search="onSearch" />
          </div>

          <!-- Action Buttons and Category Filter -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <button @click="openAddForm" class="inline-mobile flex items-center justify-center gap-2" aria-label="Add new recipe">
              <span class="text-xl" aria-hidden="true">➕</span>
              <span>Add Recipe</span>
            </button>
            
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              <label for="categoryFilter" class="text-sm font-medium text-gray-700 sm:whitespace-nowrap">
                Filter by Category:
              </label>
              <select id="categoryFilter" v-model="selectedCategory" @change="applyFilters" class="flex-1 sm:max-w-xs" aria-label="Filter recipes by category">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Results Count -->
          <div class="text-sm text-gray-600" role="status" aria-live="polite">
            Showing {{ filteredRecipes.length }} of {{ recipes.length }} recipe{{ recipes.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </section>

      <!-- Recipe Form Modal -->
      <RecipeForm v-if="showForm" :recipe="editingRecipe" @close="closeForm" @saved="onSaved"/>

      <!-- Recipes Grid -->
      <section aria-label="Recipe cards">
        <!-- Empty State -->
        <div v-if="filteredRecipes.length === 0 && recipes.length === 0" class="text-center py-16 bg-white rounded-xl shadow-md">
          <div class="text-6xl mb-4" role="img" aria-label="Empty cookbook">📕</div>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Recipes Yet</h2>
          <p class="text-gray-500 mb-6">Start building your collection by adding your first recipe!</p>
          <button @click="openAddForm" class="inline-mobile">
            <span class="text-xl mr-2" aria-hidden="true">➕</span>
            Add Your First Recipe
          </button>
        </div>

        <!-- No Results State -->
        <div v-else-if="filteredRecipes.length === 0" class="text-center py-16 bg-white rounded-xl shadow-md">
          <div class="text-6xl mb-4" role="img" aria-label="No results">🔍</div>
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">No Recipes Found</h2>
          <p class="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button @click="clearFilters" class="secondary inline-mobile">Clear Filters</button>
        </div>

        <!-- Recipe Cards Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <RecipeCard v-for="(recipe, index) in filteredRecipes" :key="recipe.id" :recipe="recipe" :style="{ animationDelay: `${index * 0.05}s` }"
            class="fade-in-up" @edit="editRecipe" @delete="deleteRecipeById"/>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getRecipes, deleteRecipe } from '../composables/useRecipes';
import RecipeCard from '../components/RecipeCard.vue';
import RecipeForm from '../components/RecipeForm.vue';
import SearchBar from '../components/SearchBar.vue';

const recipes = ref([]);
const filteredRecipes = ref([]);
const showForm = ref(false);
const editingRecipe = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');

// Get unique categories from recipes
const categories = computed(() => {
  const cats = recipes.value.map(recipe => recipe.category).filter(cat => cat && cat.trim() !== '');
  return [...new Set(cats)].sort();
});

async function loadRecipes() {
  recipes.value = await getRecipes();
  applyFilters();
}

onMounted(async () => loadRecipes());

function onSearch(query) {
  searchQuery.value = query;
  applyFilters();
}

function applyFilters() {
  let filtered = recipes.value;

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(recipe => 
      recipe.category === selectedCategory.value
    );
  }

  // Apply search query filter
  if (searchQuery.value) {
    const queryLowercased = searchQuery.value.toLowerCase();
    filtered = filtered.filter(recipe => {
      return recipe.title.toLowerCase().includes(queryLowercased) || 
             recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(queryLowercased));
    });
  }

  filteredRecipes.value = filtered;
}

function editRecipe(recipe) {
  editingRecipe.value = recipe;
  showForm.value = true;
}

async function deleteRecipeById(id) {
  await deleteRecipe(id);
  await loadRecipes();
}

function openAddForm() {
  editingRecipe.value = null;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingRecipe.value = null;
}

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  applyFilters();
}

function onSaved() {
  showForm.value = false;
  editingRecipe.value = null;
  loadRecipes();
}
</script>
