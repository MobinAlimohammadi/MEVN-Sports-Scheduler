import express from 'express'
import { ObjectId } from 'mongodp';
import {connectDB} from '../config/db.js';
const router = express.Router();

router.get('/')