const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class UserAvatarController {
	async update(req, res) {
		const user_id = req.user.id // inserido pelo middleware de auth
		const avatarFilename = req.file.filename

		const diskStorage = new DiskStorage()

		const user = await knex('users').where({ id: user_id }).first()

		if (!user) throw new AppError('Somente usuários autenticados podem mudar o avatar.', 401)
		if (user.avatar) {
			await diskStorage.deleteFile(user.avatar)
		}

		const filename = await diskStorage.saveFile(avatarFilename)
		user.avatar = filename

		// o user no update é o objeto com os valores atualizados. o where é de fato o id do usuário
		await knex('users').update(user).where({ id: user_id })
		return res.json(user)
	}
}

module.exports = UserAvatarController
