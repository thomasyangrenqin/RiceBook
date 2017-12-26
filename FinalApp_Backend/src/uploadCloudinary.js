////////////////////////////////
// Upload files to Cloudinary //
////////////////////////////////
const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')

if (!process.env.CLOUDINARY_URL) {
     process.env.CLOUDINARY_URL="cloudinary://264817262664593:k5b0GFWUrj8cVcOMLw95ZvvehJE@hhejulhfn"
}

const doUpload = (publicId, req, res, next) => {

	const uploadStream = cloudinary.uploader.upload_stream(result => {    	
         // Capture the url and public_id and add to the request
         req.fileurl = result.url
         req.fileid = result.public_id
         next()
	}, { public_id: req.body[publicId]})

	const s = new stream.PassThrough()
	s.end(req.file.buffer)
	s.pipe(uploadStream)
	s.on('end', uploadStream.end)
}


const uploadImage = (publicName) => (req, res, next) => {
	// multer().single('text')(req, res, () => {
	// 	if (!req.body.text) {
	// 		req.content = null;
	// 	} else if (!req.body.text[0] || req.body.text[0] == 'undefined') {
 //     		req.content = 'you can add text here'
 //     	} else {
 //     		req.content = req.body.text[0];
 //     	}
     	
     	
 //    })

	multer().single('image')(req, res, () => {
		if (req.file === undefined) {
			req.file = null;
			next()
		} else {
			doUpload(publicName, req, res, next)
		}
	})
}

module.exports = uploadImage