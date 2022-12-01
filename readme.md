const uBaseURL = "/api/user";
const pBaseUR = "/api/project";

router.route("/signup").post((req, res) => userController.signup(req, res));
router.route("/signin").post((req, res) => userController.signin(req, res));
