use sqlx::PgPool;
use tauri::async_runtime::Mutex as AsyncMutex;

mod db;

struct AppState {
    pub database: AsyncMutex<Option<PgPool>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            database: AsyncMutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            db::establish_connection,
            db::db_is_healthy,
            db::fetch_all_submits,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
