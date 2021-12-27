import express from 'express'
var router = express.Router();

import { findEmail, signin, signup } from '../controllers/user.js';


router.post('/email', findEmail)
router.post('/signin', signin)
router.post('/signup', signup)


export default router