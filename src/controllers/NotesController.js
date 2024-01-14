const knex = require('../database/knex')

class NotesController {
	async create(req, res) {
		const { title, description, tags, links } = req.body
		const { user_id } = req.params

		// retorna um array com o id na 1 posição. transfere isso pra variável note_id com a desestruturação
		const [note_id] = await knex('notes').insert({
			title,
			description,
			user_id,
		})

		await knex('links').insert(
			links.map((link) => {
				return {
					note_id,
					url: link,
				}
			})
		)

		await knex('tags').insert(
			tags.map((tag) => {
				return {
					note_id,
					user_id,
					name: tag,
				}
			})
		)

		return res.json()
	}

	async showAll(req, res) {
		const { user_id, title, tags } = req.query

		let notes

		if (tags) {
			const filterTags = tags.split(',').map((tag) => tag.trim())

			notes = await knex('tags')
				.select(['notes.id', 'notes.title', 'notes.user_id'])
				.where('notes.user_id', user_id)
				.whereLike('notes.title', `%${title}%`)
				.whereIn('name', filterTags)
				.innerJoin('notes', 'notes.id', 'tags.note_id') // tabela a conectar, chaves de relação
				.orderBy('notes.title')
		} else {
			notes = await knex('notes')
				.where({ user_id })
				.whereLike('title', `%${title}%`)
				.orderBy('title')
		}

		const userTags = await knex('tags').where({ user_id })

		const notesWithTags = notes.map((note) => {
			const noteTags = userTags.filter((tag) => tag.note_id === note.id)

			return {
				...note,
				tags: noteTags,
			}
		})

		return res.json(notesWithTags)
	}

	async showUnique(req, res) {
		const { id } = req.params

		const note = await knex('notes').where({ id }).first()
		const tags = await knex('tags').where({ note_id: id }).orderBy('name')
		const links = await knex('links').where({ note_id: id }).orderBy('created_at')

		return res.json({
			...note,
			tags,
			links,
		})
	}

	async delete(req, res) {
		const { id } = req.params

		const note = await knex('notes').where({ id }).delete()

		return res.json()
	}
}

module.exports = NotesController
