<template>
  <article 
    class="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full"
    :aria-label="`Recipe: ${recipe.title}`">
    <!-- Header with Title and Category -->
    <div class="flex justify-between items-start gap-3 mb-3">
      <h2 class="font-bold text-xl text-gray-900 flex-1 leading-tight">
        {{ recipe.title }}
      </h2>
      <span v-if="recipe.category" 
        class="text-xs font-semibold bg-linear-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
        :aria-label="`Category: ${recipe.category}`">
        {{ recipe.category }}
      </span>
    </div>

    <!-- Rating -->
    <div v-if="recipe.rating && recipe.rating > 0" class="flex items-center gap-1 mb-3" :aria-label="`Rating: ${recipe.rating} out of 5 stars`">
      <span class="text-yellow-500 text-lg" aria-hidden="true">{{ '⭐'.repeat(recipe.rating) }}</span>
      <span class="text-sm text-gray-600 ml-1">({{ recipe.rating }}/5)</span>
    </div>

    <!-- Ingredients Preview -->
    <div class="mb-3 flex-1">
      <h3 class="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
        <span aria-hidden="true">🥘</span>
        <span>Ingredients:</span>
      </h3>
      <p class="text-sm text-gray-600 line-clamp-2">
        {{ recipe.ingredients?.slice(0, 3).join(', ') }}
        <span v-if="recipe.ingredients?.length > 3" class="text-gray-400">... +{{ recipe.ingredients.length - 3 }} more</span>
      </p>
    </div>

    <!-- Steps Preview -->
    <div class="mb-4 flex-1">
      <h3 class="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
        <span aria-hidden="true">📝</span>
        <span>Instructions:</span>
      </h3>

      <p class="text-sm text-gray-600 line-clamp-3">{{ recipe.steps }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mt-auto pt-4 border-t border-gray-100">
      <button @click="$emit('edit', recipe)" class="flex-1 small secondary flex items-center justify-center gap-1.5" :aria-label="`Edit ${recipe.title}`">
        <span aria-hidden="true">✏️</span>
        <span>Edit</span>
      </button>
      <button @click="confirmDelete" class="flex-1 small danger flex items-center justify-center gap-1.5" :aria-label="`Delete ${recipe.title}`">
        <span aria-hidden="true">🗑️</span>
        <span>Delete</span>
      </button>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  recipe: Object
})

const emit = defineEmits(['edit', 'delete'])

function confirmDelete() {
  if (confirm(`Are you sure you want to delete "${props.recipe.title}"?`)) emit('delete', props.recipe.id);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
