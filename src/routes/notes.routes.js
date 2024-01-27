const { Router } = require('express')
const NotesController = require('../controllers/NotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.use(ensureAuthenticated) // aplica o middleware em todas as rotas

notesRoutes.get('/', notesController.showAll)
notesRoutes.get('/:id', notesController.showUnique)
notesRoutes.delete('/:id', notesController.delete)
notesRoutes.post('/', notesController.create)

module.exports = notesRoutes
