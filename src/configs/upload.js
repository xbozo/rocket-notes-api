const path = require('path')
const multer = require('multer')
const crypto = require('crypto')

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

const MULTER = {
	storage: multer.diskStorage({
		destination: TMP_FOLDER, // onde o arquivo vai ser salvo
		filename(req, file, callback) {
			const fileHash = crypto.randomBytes(10).toString('hex') // criar um hash de prefixo pro nome de cada arquivo
			const fileName = `${fileHash}-${file.originalname}`

			return callback(null, fileName)
		},
	}),
}

module.exports = {
	TMP_FOLDER,
	UPLOADS_FOLDER,
	MULTER,
}
