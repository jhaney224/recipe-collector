<template>
  <div class="relative">
    <label for="search-input" class="sr-only">Search recipes by title or ingredients</label>
    <div class="relative">
      <input id="search-input" v-model="query" @input="$emit('search', query)" type="search" placeholder="Search recipes by title or ingredients..."
        class="w-full pl-12 pr-24" aria-label="Search recipes" autocomplete="off"/>

      <button v-if="query.length > 0" @click="clearSearchBar" class="absolute right-2 top-1/2 -translate-y-1/2 small secondary inline-mobile"
        aria-label="Clear search" type="button">
        ✕ Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search']);
const query = ref('');

function clearSearchBar() {
  query.value = '';
  emit('search', '');
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
