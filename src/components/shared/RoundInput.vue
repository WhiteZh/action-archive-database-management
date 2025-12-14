<script setup lang="ts">
import {ref} from "vue";

const input = ref<HTMLInputElement>();

defineExpose({
  input
});
</script>

<template>
  <input ref="input"
         class="outline-0 border focus:border-transparent focus:outline-1 rounded-full"
         spellcheck="false"/>
</template>

<style scoped>

</style>