import Dashboard from "./pages/Dashboard.vue";
import {ref, Ref} from "vue";
import DbConnectionMenu from "./pages/DbConnectionMenu.vue";
import {Database} from "./lib/db.ts";

export const pages = {
    "dashboard": Dashboard,
    "db-connection-menu": DbConnectionMenu,
} as const;

export const states: {
    currentPage: Ref<keyof typeof pages>,
    dbConnection: Ref<Database | null>,
    cache: {
        dashboard: {
            submits: Ref<Database.Submit[] | null>,
            submitsFetchingStatus: Ref<'loading' | 'success' | 'failed' | 'no-database' | null>,
        }
    }
} = {
    currentPage: ref("dashboard"),
    dbConnection: ref(null),
    cache: {
        dashboard: {
            submits: ref(null),
            submitsFetchingStatus: ref(null),
        }
    }
};