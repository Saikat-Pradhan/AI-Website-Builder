import express from 'express'
import isAuth from "../middlewares/isAuth.js";
import { changeWebsite, deployWebsite, generateWebsite, getAllWebsites, getWebsiteById, getWebsiteBySlug } from '../controllers/website.controller.js'

const websiteRouter = express.Router()

websiteRouter.post("/generate", isAuth, generateWebsite)
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById)
websiteRouter.get("/get-all", isAuth, getAllWebsites)
websiteRouter.post("/update/:id", isAuth, changeWebsite)
websiteRouter.get("/deploy/:id", isAuth, deployWebsite)
websiteRouter.get("/get-by-slug/:slug", isAuth, getWebsiteBySlug)

export default websiteRouter