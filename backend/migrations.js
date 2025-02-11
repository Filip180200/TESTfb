import { Umzug, FilesystemMigrationStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});

const umzug = new Umzug({
    migrations: {
        glob: ['migrations/*.js', { cwd: __dirname }],
    },
    context: sequelize.getQueryInterface(),
    storage: new FilesystemMigrationStorage(),
    logger: console,
});

export async function runMigrations() {
    try {
        const migrations = await umzug.up();
        console.log('Migrations completed', migrations);
    } catch (error) {
        console.error('Migration failed', error);
        throw error;
    }
}

export async function downMigrations() {
    try {
        const migrations = await umzug.down();
        console.log('Migrations rolled back', migrations);
    } catch (error) {
        console.error('Migration rollback failed', error);
        throw error;
    }
}

export default { runMigrations, downMigrations };