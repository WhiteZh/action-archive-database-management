<script setup lang="ts">
import {ref} from "vue";
import {invoke} from "@tauri-apps/api/core";
import Sidebar from "./components/Sidebar.vue";
import Page from "./components/Page.vue";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsg.value = await invoke("greet", {name: name.value});
}
</script>

<template>
  <div class="max-w-full min-h-screen max-h-screen flex flex-row min-w-3xl">
    <Sidebar/>
    <Page class="grow overflow-hidden"/>
  </div>
</template>

<style>
</style>
