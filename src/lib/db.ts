import {dbIsHealthy, establishConnection} from "./tauri.ts";

export const decodeMagicWord = (magicWord: string): DatabaseConstructorArgs | null => {
    const words = magicWord.split('.');

    if (words !== undefined && words.length === 4) {
        const decodedWords = words.map(it => atob(it));

        const [host, user, password, database] = decodedWords;

        return {
            host,
            user,
            password,
            database
        };
    } else {
        return null;
    }
};

export const defaultDbUser = "neondb_owner";
export const defaultDatabase = "neondb";

type DatabaseConstructorArgs = {
    host: string,
    user: string,
    password: string,
    database: string
};

export class Database {
    public host: string;
    public user: string;
    public password: string;
    public database: string;

    get connectionUrl(): string {
        return `postgresql://${this.user}:${this.password}@${this.host}/${this.database}`;
    }

    private constructor({host, user, password, database}: DatabaseConstructorArgs) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    public static async establishConnection(constructorArgs: DatabaseConstructorArgs): Promise<Database> {
        const db = new Database(constructorArgs);

        await establishConnection(db.connectionUrl);

        if (!await dbIsHealthy()) {
            throw new Error("database connection is unhealthy");
        }

        return db;
    }
}

export namespace Database {
    export type Submit = {
        id: number,
        name: string,
        grade: number,
        school: string,
        email: string,
        ig_handle: string,
        referee: string,
        description: string
    };
}