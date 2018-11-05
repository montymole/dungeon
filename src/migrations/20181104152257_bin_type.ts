import * as Knex from 'knex';
import { TABLES } from '../constants';

exports.up = async function (knex: Knex) {
    await knex.schema.table(TABLES.BINARIES, (table) => {
        table.string('type');
    });
};

exports.down = async function (knex: Knex) {
    await knex.schema.table(TABLES.BINARIES, (table) => {
        table.dropColumn('type');
    });
};
