// l'objectif du middleware ici est de faire en sorte que les requests PUT soient forcement du proprietaire de la sauce OU  alert 'vous nêtes pas proprietaire de la sauce'
const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
	const userId = decodedToken.userId;
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		console.log(userId);
		console.log(sauce.userId);
		if (!(sauce.userId === userId)) {
			console.log(
				"Le proprietaire de la sauce et l'utilisateur demandant la modification sont différents"
			);
			res.status(401).json({ message: "vous n'avez pas le droit de modifier cette sauce" });
			return;
		} else {
			next();
		}
	});
};
