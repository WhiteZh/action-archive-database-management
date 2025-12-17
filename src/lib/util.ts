import {load as loadStore} from "@tauri-apps/plugin-store";
import {dbConnectionStoreKey, storeLocation} from "../global.ts";
import {match, P} from "ts-pattern";

export async function loadStoredDbConnection(): Promise<{
    host: string,
    user: string,
    password: string,
    database: string
} | null> {
    const store = await loadStore(storeLocation);
    const storedDb = await store.get(dbConnectionStoreKey);

    return match(storedDb)
        .with({
            host: P.string,
            user: P.string,
            password: P.string,
            database: P.string
        }, it => it)
        .otherwise(() => null);
}

export async function writeStoredDbConnection(newDbConnection: {
    host: string,
    user: string,
    password: string,
    database: string
}): Promise<void> {
    const store = await loadStore(storeLocation);

    await store.set(dbConnectionStoreKey, newDbConnection);

    await store.save();
}