import { Router } from "express";

import controllers from "../controllers";

const router = Router();

router.post("/signup", controllers.signUp);

export default router;
