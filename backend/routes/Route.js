import express from 'express'
import Search from '../controller/SearchController.js';

const router = express.Router()

router.route('/search').post(Search)

export default router;