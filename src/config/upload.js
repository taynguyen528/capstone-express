// yarn add multer
import multer, { diskStorage } from 'multer'
//khai bao noi luu
// doi ten file
 export const upload = multer({
    storage: diskStorage({
        destination: process.cwd() + "/public/img",
        filename: (req, file, callback) => {
            //dd/mm//yyyy hh//mm//ss//ms
            // get milisecond
            let mSecond = new Date().getTime() + '-' + Math.round(Math.random() * 1E9)
            callback(null, mSecond + "_"  + file.originalname)
        }
    })
    // dest: process.cwd() + "/public/img" // quy dinhj url luu file
})