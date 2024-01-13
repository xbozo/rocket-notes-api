const { Router } = require('express')
const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()
const usersController = new UsersController()

const myMiddleware = (req, res, next) => {
	console.log('Middleware')
	console.log(req.body)
	next()
}

// Instância/método. Endereço. Middleware a ser executado. Função do controller.
usersRoutes.post('/', myMiddleware, usersController.create)
usersRoutes.put('/:id', usersController.update)
usersRoutes.get('/:id', usersController.searchUnique)

module.exports = usersRoutes
