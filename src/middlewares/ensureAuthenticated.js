const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(req, res, next) {
	const authHeader = req.headers.authorization

	if (!authHeader) throw new AppError('JWT Token não informado.', 401)

	const [, token] = authHeader.split(' ') // Bearer / Token

	try {
		const { sub: user_id } = verify(token, authConfig.jwt.secret)

		// Insere dentro da requisição a prop. user com o ID do usuário, o que passa a ser acessível na função do next
		req.user = {
			id: Number(user_id),
		}

		return next()
	} catch (err) {
		throw new AppError('JWT Token inválido.', 401)
	}
}

module.exports = ensureAuthenticated
