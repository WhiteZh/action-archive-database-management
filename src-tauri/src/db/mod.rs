mod tables;

use sqlx::postgres::PgPoolOptions;
use tauri::State;
use crate::AppState;
use crate::db::tables::Submit;

#[tauri::command]
pub async fn establish_connection(connection_string: String, state: State<'_, AppState>) -> Result<(), String> {
    let new_db_conn_res = PgPoolOptions::new()
        .max_connections(1)
        .connect(&connection_string).await;

    match new_db_conn_res {
        Ok(new_db) => {
            *state.database.lock().await = Some(new_db);

            Ok(())
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
pub async fn db_is_healthy(state: State<'_, AppState>) -> Result<bool, ()> {
    let db_guard = state.database.lock().await;

    Ok(match db_guard.as_ref() {
        None => false,
        Some(db) => sqlx::query("SELECT 1").execute(db).await.is_ok(),
    })
}

#[tauri::command]
pub async fn fetch_all_submits(state: State<'_, AppState>) -> Result<Vec<Submit>, String> {
    let db_guard = state.database.lock().await;

    match db_guard.as_ref() {
        None => Err(String::from("no database connection")),
        Some(db) => match Submit::select_all(db).await {
            Ok(res) => Ok(res),
            Err(e) => Err(e.to_string())
        }
    }
}