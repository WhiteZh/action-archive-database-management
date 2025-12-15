<script setup lang="ts">
import {pages, states} from "../global.ts";
import {computed} from "vue";
import CircleStack from "./icons/CircleStack.vue";

const computePageSelectionButtonClass = (page: string) => {
  return {
    'text-white': states.currentPage.value === page,
    'text-neutral-300': states.currentPage.value !== page,
  };
};

const pageSelections = [
  {
    name: "Dashboard",
    page: "dashboard",
  },
] as const satisfies {
  name: string,
  page: typeof states.currentPage.value
}[];

const onDbConnectionClick = () => {
  states.currentPage.value = "db-connection-menu";
};

</script>

<template>
  <div class="min-w-xs max-w-xs w-xs bg-red-900 p-3 flex flex-col text-neutral-200 gap-1">
    <div class="text-left px-3 py-2">
      <h1 class="text-xl text-neutral-100">Action Archive D.B.M.S</h1>
      <h2 class="text-sm text-neutral-300 tracking-wider -mt-1 text-right">Database Management System</h2>
    </div>
    <button
        v-for="pageSelection in pageSelections"
        :key="pageSelection.page"
        class="sidebar-button text-left"
        :class="computePageSelectionButtonClass(pageSelection.page)"
        @click="() => states.currentPage.value = pageSelection.page"
    >
      {{ pageSelection.name }}
    </button>
    <div class="grow"/>
    <div
        class="sidebar-button flex flex-row text-ellipsis justify-center"
        @click="onDbConnectionClick"
    >
      <button class="grow text-left text-sm">
        {{ states.dbConnection.value === null ? "No Database Connection..." : "Database Connected" }}
      </button>
      <button
          :class="{
            'text-amber-300': states.dbConnection.value === null,
            'text-green-400': states.dbConnection.value !== null
          }"
      >
        <CircleStack class="size-4"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.sidebar-button {
  @apply transition duration-200 h-12 px-3 hover:bg-black/10 w-full rounded-lg cursor-pointer *:cursor-pointer;
}
</style>