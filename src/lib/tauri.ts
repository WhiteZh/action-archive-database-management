import {invoke} from "@tauri-apps/api/core";
import {Database} from "./db.ts";

/**
 *
 * @param connectionString
 * @throws string error message
 */
export const establishConnection = async (connectionString: string): Promise<void> => {
    await invoke('establish_connection', {connectionString});
}

export const dbIsHealthy = async (): Promise<boolean> => {
    return await invoke<boolean>('db_is_healthy');
}

/**
 * @throws string error message
 */
export const fetchAllSubmits = async (): Promise<Database.Submit[]> => {
    return await invoke<Database.Submit[]>('fetch_all_submits');
}