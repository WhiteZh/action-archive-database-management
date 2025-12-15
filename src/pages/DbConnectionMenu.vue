<script setup lang="ts">
import {onMounted, ref} from "vue";
import {states} from "../global.ts";
import RoundInput from "../components/shared/RoundInput.vue";
import GlobeAlt from "../components/icons/GlobeAlt.vue";
import UserIcon from "../components/icons/UserIcon.vue";
import LockClosedIcon from "../components/icons/LockClosedIcon.vue";
import TableCellsIcon from "../components/icons/TableCellsIcon.vue";
import {Database, decodeMagicWord, defaultDatabase, defaultDbUser} from "../lib/db.ts";
import BeakerIcon from "../components/icons/BeakerIcon.vue";

const dbHostInput = ref<{ input: HTMLInputElement }>();
const dbUserInput = ref<{ input: HTMLInputElement }>();
const dbPasswordInput = ref<{ input: HTMLInputElement }>();
const dbDatabaseInput = ref<{ input: HTMLInputElement }>();
const dbMagicWordInput = ref<{ input: HTMLInputElement }>();

const submitButton = ref<HTMLButtonElement>();

onMounted(() => {
  if (states.dbConnection.value === null) {
    if (dbUserInput.value !== undefined) {
      dbUserInput.value.input.value = defaultDbUser;
    }
    if (dbDatabaseInput.value !== undefined) {
      dbDatabaseInput.value.input.value = defaultDatabase;
    }
  } else {
    const db = states.dbConnection.value;

    if (dbHostInput.value !== undefined) {
      dbHostInput.value.input.value = db.host;
    }
    if (dbUserInput.value !== undefined) {
      dbUserInput.value.input.value = db.user;
    }
    if (dbPasswordInput.value !== undefined) {
      dbPasswordInput.value.input.value = db.password;
    }
    if (dbDatabaseInput.value !== undefined) {
      dbDatabaseInput.value.input.value = db.database;
    }
  }
});

const connectToDatabase = async () => {
  const {
    host,
    user,
    password,
    database
  } = (() => {
    if (dbMagicWordInput.value !== undefined && dbMagicWordInput.value.input.value.length > 0) {
      return decodeMagicWord(dbMagicWordInput.value.input.value) ?? {
        host: undefined,
        user: undefined,
        password: undefined,
        database: undefined
      };
    } else {
      return {
        host: dbHostInput.value?.input.value,
        user: dbUserInput.value?.input.value,
        password: dbPasswordInput.value?.input.value,
        database: dbDatabaseInput.value?.input.value,
      }
    }
  })();

  if (host !== undefined &&
      user !== undefined &&
      password !== undefined &&
      database !== undefined
  ) {
    if (host.trim().length > 0 &&
        user.trim().length > 0 &&
        password.trim().length > 0 &&
        database.trim().length > 0
    ) {
      const submitButtonDisabledOriginalStatus = submitButton.value?.disabled ?? false;
      if (submitButton.value !== undefined) {
        submitButton.value.disabled = true;
      }

      try {
        states.dbConnection.value = await Database.establishConnection({host, user, password, database});

        window.alert("New database connection established");

        states.cache.dashboard.submits.value = null;
        states.cache.dashboard.submitsFetchingStatus.value = null;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        window.alert(`Failed to establish connection to the database: ${message}`)
      }

      if (submitButton.value !== undefined) {
        submitButton.value.disabled = submitButtonDisabledOriginalStatus;
      }
    } else {
      window.alert("Please fill out all the required information");
    }
  } else if (dbMagicWordInput.value !== undefined && dbMagicWordInput.value.input.value.length > 0) {  // I know there's better ways but I'm tired
    window.alert("Provide magic word is in invalid format");
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 px-2">
    <h1 class="text-2xl text-center text-red-900">Database Connection Information</h1>
    <div class="relative text-neutral-700 focus-within:text-red-900">
      <div class="absolute h-full aspect-square flex items-center justify-center">
        <GlobeAlt class="size-5"/>
      </div>
      <RoundInput ref="dbHostInput"
                  class="db-input"
                  placeholder="Host"/>
    </div>
    <div class="relative text-neutral-700 focus-within:text-red-900">
      <div class="absolute h-full aspect-square flex items-center justify-center">
        <UserIcon class="size-5"/>
      </div>
      <RoundInput ref="dbUserInput"
                  class="db-input"
                  placeholder="User"/>
    </div>
    <div class="relative text-neutral-700 focus-within:text-red-900">
      <div class="absolute h-full aspect-square flex items-center justify-center">
        <LockClosedIcon class="size-5"/>
      </div>
      <RoundInput ref="dbPasswordInput"
                  class="db-input"
                  placeholder="Password"
                  type="password"/>
    </div>
    <div class="relative text-neutral-700 focus-within:text-red-900">
      <div class="absolute h-full aspect-square flex items-center justify-center">
        <TableCellsIcon class="size-5"/>
      </div>
      <RoundInput ref="dbDatabaseInput"
                  class="db-input"
                  placeholder="Database"/>
    </div>
    <div>- or -</div>
    <div class="relative text-neutral-700 focus-within:text-red-900 max-w-full shrink">
      <div class="absolute h-full aspect-square flex items-center justify-center">
        <BeakerIcon class="size-5"/>
      </div>
      <RoundInput ref="dbMagicWordInput"
                  class="db-input max-w-full"
                  placeholder="Magic word"/>
    </div>
    <button
        class="outline-red-800 bg-red-800 hover:outline-red-900 hover:bg-red-900 rounded-full px-3 h-8 text-white hover:text-neutral-200 cursor-pointer disabled:cursor-default disabled:bg-black/75 disabled:text-white"
        @click="connectToDatabase"
        ref="submitButton"
    >
      Submit
    </button>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.db-input {
  @apply placeholder-neutral-400 focus:placeholder-red-900/50 focus:outline-red-900 border-neutral-400 h-8 font-mono field-sizing-content min-w-sm px-2 ps-8 text-sm tracking-tight;
}
</style>