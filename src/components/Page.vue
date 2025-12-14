<script setup lang="ts">
import {pages, states} from "../global.ts";
</script>

<template>
  <component :is="pages[states.currentPage.value]"></component>
</template>

<style scoped>

</style>