<template>
  <div>
    <Transition name="modal">
      <div v-if="true" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print" @click.self="closeModal" 
      role="dialog" aria-modal="true" :aria-labelledby="formData.id ? 'edit-recipe-title' : 'add-recipe-title'">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <h2 :id="formData.id ? 'edit-recipe-title' : 'add-recipe-title'" class="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span aria-hidden="true">{{ formData.id ? '✏️' : '➕' }}</span>
              <span>{{ formData.id ? 'Edit Recipe' : 'Add New Recipe' }}</span>
            </h2>

            <button type="button" @click="closeModal" class="secondary small inline-mobile text-gray-500 hover:text-gray-700" aria-label="Close dialog">
              ✕
            </button>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="submitRecipe" class="p-6 space-y-5">
            <!-- Title Field -->
            <div>
              <label for="recipe-title" class="required">Recipe Title</label>
              <input type="text" id="recipe-title" v-model="formData.title" required placeholder="e.g., Chocolate Chip Cookies" 
              aria-required="true" autocomplete="off"/>
            </div>

            <!-- Ingredients Field -->
            <div>
              <label for="recipe-ingredients" class="required">Ingredients</label>
              <p class="text-xs text-gray-500 mb-2">Separate each ingredient with a comma</p>

              <textarea id="recipe-ingredients" v-model="formData.ingredients" required rows="4" 
              placeholder="e.g., 2 cups flour, 1 cup sugar, 2 eggs, 1 tsp vanilla" aria-required="true" aria-describedby="ingredients-help"
              ></textarea>

              <p id="ingredients-help" class="text-xs text-gray-500 mt-1">Tip: Be specific with measurements for best results</p>
            </div>

            <!-- Steps Field -->
            <div>
              <label for="recipe-steps" class="required">Cooking Instructions</label>
              <textarea id="recipe-steps" v-model="formData.steps" required rows="6" placeholder="Describe the step-by-step process..." 
              aria-required="true"></textarea>
            </div>

            <!-- Category Field -->
            <div>
              <label for="recipe-category">Category</label>
              <input type="text" id="recipe-category" v-model="formData.category" placeholder="e.g., Dessert, Main Course, Appetizer"
                list="category-suggestions" autocomplete="off"/>

              <datalist id="category-suggestions">
                <option value="Breakfast"/>
                <option value="Lunch"/>
                <option value="Dinner"/>
                <option value="Dessert"/>
                <option value="Appetizer"/>
                <option value="Snack"/>
                <option value="Beverage"/>
              </datalist>
            </div>

            <!-- Rating Field -->
            <div>
              <label for="recipe-rating">
                Rating: 
                <span class="text-yellow-500 text-lg ml-2" aria-hidden="true">{{ formData.rating > 0 ? '⭐'.repeat(formData.rating) : '☆☆☆☆☆' }}</span>
                <span class="text-base font-normal text-gray-600 ml-2">({{ formData.rating }}/5)</span>
              </label>

              <input type="range" id="recipe-rating" min="0" max="5" step="1" v-model.number="formData.rating" aria-valuemin="0"
                aria-valuemax="5" :aria-valuenow="formData.rating" aria-label="Recipe rating from 0 to 5 stars"/>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>No rating</span>
                <span>Excellent</span>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex gap-3 pt-4 border-t border-gray-200">
              <button type="submit" class="flex-1 success flex items-center justify-center gap-2" :disabled="!isFormValid">
                <span aria-hidden="true">💾</span>
                <span>{{ formData.id ? 'Update Recipe' : 'Save Recipe' }}</span>
              </button>
              <button type="button" @click="closeModal" class="flex-1 secondary flex items-center justify-center gap-2">
                <span aria-hidden="true">✕</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import { addOrUpdateRecipe, type Recipe } from '../composables/useRecipes'

const props = defineProps<{
  recipe?: Recipe
}>();

const emit = defineEmits(['saved', 'close']);

const getInitialFormData = () => ({
  id: undefined as number | undefined,
  title: '',
  ingredients: '',
  steps: '',
  category: '',
  rating: 0,
});

const formData = reactive(getInitialFormData());

// Form validation
const isFormValid = computed(() => {
  return formData.title.trim() !== '' && formData.ingredients.trim() !== '' && formData.steps.trim() !== '';
});

// Populate form when editing
watch(() => props.recipe, (recipe) => {
  if (recipe) {
    formData.id = recipe.id;
    formData.title = recipe.title;
    formData.ingredients = recipe.ingredients.join(', ');
    formData.steps = recipe.steps;
    formData.category = recipe.category || '';
    formData.rating = recipe.rating || 0;
  } else Object.assign(formData, getInitialFormData());
}, { immediate: true });

async function submitRecipe() {
  if (!isFormValid.value) return;

  const recipe: Recipe = {
    title: formData.title.trim(),
    ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
    steps: formData.steps.trim(),
    category: formData.category.trim() || '',
    rating: formData.rating || 0,
  };

  // Include id if editing
  if (formData.id) recipe.id = formData.id;

  await addOrUpdateRecipe(recipe);
  emit('saved');

  // Reset form
  Object.assign(formData, getInitialFormData());
}

function closeModal() {
  emit('close');
}

// Handle Escape key to close modal
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') closeModal();
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}

/* Smooth scrollbar for modal */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
