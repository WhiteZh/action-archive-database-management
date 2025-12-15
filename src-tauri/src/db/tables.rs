use sqlx::{Error, PgPool};

#[derive(sqlx::FromRow, serde::Serialize)]
pub struct Submit {
    id: i32,
    name: String,
    grade: i16,
    school: String,
    email: String,
    ig_handle: String,
    referee: String,
    description: String,
}

impl Submit {
    pub async fn select_all(pg_pool: &PgPool) -> Result<Vec<Submit>, Error> {
        sqlx::query_as::<_, Submit>("SELECT * FROM submits")
            .fetch_all(pg_pool)
            .await
    }
}
