<script setup lang="ts">
import {onMounted, ref} from "vue";
import {states} from "../global.ts";
import {fetchAllSubmits} from "../lib/tauri.ts";
import ArrowPathIcon from "../components/icons/ArrowPathIcon.vue";
import {message as dialogMessage} from "@tauri-apps/plugin-dialog";

const submits = states.cache.dashboard.submits;
const submitsFetchingStatus = states.cache.dashboard.submitsFetchingStatus;

const isShowId = ref<boolean>(false);

const doRefresh = async () => {
  submits.value = null;
  submitsFetchingStatus.value = 'loading';

  if (states.dbConnection.value === null) {
    submitsFetchingStatus.value = 'no-database';
  } else {
    try {
      submits.value = await fetchAllSubmits();
      submitsFetchingStatus.value = 'success';
    } catch (e) {
      submitsFetchingStatus.value = 'failed';

      const message = e instanceof Error ? e.message : String(e);
      await dialogMessage(`Failed to fetch from database: ${message}`, {kind: "info"});
    }
  }
}

const onClickShowId = () => {
  isShowId.value = !isShowId.value;
}

onMounted(async () => {
  if (submitsFetchingStatus.value === null ||
      (submitsFetchingStatus.value === 'no-database' && states.dbConnection.value !== null)
  ) {
    await doRefresh();
  }
});
</script>

<template>
  <div v-if="submitsFetchingStatus === 'success'">
    <div class="overflow-auto max-h-full">
      <div class="w-full sticky top-0 left-0 z-20 bg-white h-6 pt-1 flex flex-row items-center px-2 text-red-800 gap-2">
        <div class="grow"></div>
        <button class="header-button pt-0.5">
          <ArrowPathIcon class="size-4" @click="doRefresh"/>
        </button>
        <button class="header-button px-1" @click="onClickShowId">
          {{ isShowId ? 'Hide ID' : 'Show ID' }}
        </button>
      </div>
      <div class="px-4 w-full">
        <table class="border-collapse">
          <thead class="sticky top-6 z-10 bg-white">
          <tr class="text-red-900 py-2 h-8">
            <th class="px-2" scope="col" v-if="isShowId">ID</th>
            <th class="px-2" scope="col">Name</th>
            <th class="px-2" scope="col">Grade</th>
            <th class="px-2" scope="col">School</th>
            <th class="px-2" scope="col">Email</th>
            <th class="px-2" scope="col">Instagram Handle</th>
            <th class="px-2" scope="col">Referee</th>
            <th class="px-2" scope="col">Description</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="submit in submits" :key="submit.id" class="border-neutral-400 border-t">
            <td class="common-td text-center" v-if="isShowId">{{ submit.id }}</td>
            <td class="common-td">{{ submit.name }}</td>
            <td class="common-td text-center">{{ submit.grade }}</td>
            <td class="common-td">{{ submit.school }}</td>
            <td class="common-td">{{ submit.email }}</td>
            <td class="common-td">{{ submit.ig_handle }}</td>
            <td class="common-td">{{ submit.referee }}</td>
            <td class="common-td min-w-sm">{{ submit.description }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center">
    <h1 class="text-2xl text-center text-red-900 m-2">
      {{
        (() => {
          switch (submitsFetchingStatus) {
            case 'loading':
              return "Retrieving information from database...";
            case 'failed':
              return "Failed to fetch from database";
            case 'no-database':
              return "No database connection established yet";
          }
        })()
      }}
    </h1>
    <button class="text-red-900 cursor-pointer hover:text-red-950 rounded-full p-0.5"
            @click="doRefresh"
            v-if="submitsFetchingStatus === 'failed'"
    >
      <ArrowPathIcon class="size-6" @click="doRefresh"/>
    </button>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.common-td {
  @apply py-1 px-2;
}

.header-button {
  @apply hover:text-red-900 cursor-pointer rounded-full;
}
</style>