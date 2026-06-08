import express from "express";
import { index, show, store, update, modify, destroy } from '../controllers/postsControllers.js'
import idValidator from "../middlewares/idValidator.js";
import postExist from "../middlewares/postExist.js";
import dataValidator from "../middlewares/dataValidator.js";
const router = express.Router()

/* http://localhost:3000 */
router.get('/', index);

/* http://localhost:3000/:id */
router.get('/:id', idValidator, show);

/* http://localhost:3000 */
router.post('/', [dataValidator, store])

/* http://localhost:3000/:id */
router.put('/:id', [idValidator, dataValidator, update])

/* http://localhost:3000/:id */
router.patch('/:id', [idValidator, dataValidator, modify])

/* http://localhost:3000/:id */
router.delete('/:id', [idValidator], destroy)

export default router