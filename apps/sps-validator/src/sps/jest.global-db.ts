import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'fs';
import knex from 'knex';
import path from 'path';

const TEMPLATE_DB_NAME = 'sps_validator_test_template';

export class JestGlobalDb {
    private readonly structure: string;

    private postgresContainer: StartedPostgreSqlContainer | null = null;

    constructor() {
        this.structure = fs.readFileSync(path.resolve(__dirname, '../__tests__/structure.sql'), 'utf8');
    }

    async init() {
        this.postgresContainer = await new PostgreSqlContainer().withReuse().withDatabase(TEMPLATE_DB_NAME).start();

        // create template db
        const knexInstance = knex({
            client: 'pg',
            connection: {
                connectionString: this.postgresContainer.getConnectionUri(),
            },
            searchPath: 'public',
        });
        await knexInstance.raw(`DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;`);
        await knexInstance.raw(this.structure!);
        await knexInstance.raw(`SET SEARCH_PATH = public;`);
        await knexInstance.raw(`CREATE DATABASE control_db;`);
        await knexInstance.destroy();

        return {
            templateDb: TEMPLATE_DB_NAME,
            connectionString: this.postgresContainer.getConnectionUri(),
        };
    }

    async destroy() {
        if (this.postgresContainer === null) {
            throw new Error('db not initialized. did you call init()?');
        }

        await this.postgresContainer.stop();
    }
}

export default new JestGlobalDb();
