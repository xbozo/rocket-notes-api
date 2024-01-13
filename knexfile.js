const path = require('path')

module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve(__dirname, 'src', 'database', 'database.db'),
		},
		pool: {
			// Habilita o delete em cascata pro SQLite (que por padrão é disabled)
			afterCreate: (connection, callback) => connection.run('PRAGMA foreign_keys = ON', callback),
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations'),
		},
		useNullAsDefault: true,
	},
}
