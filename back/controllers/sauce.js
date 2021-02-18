const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	console.log(sauceObject);
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: []
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Objet enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id
	}).then((sauce) => {
		let userId = req.body.userId;
		let like = req.body.like;
		res.status(200).json();
		function arrayLike() {
			if (like === 1) {
				sauce.likes++;
				sauce.usersLiked.push(userId);
				return;
			}
			if (like === -1) {
				// si le nombre arrivant de la requete est -1 alors c'est un dislike on va donc augmenter le compte de dislikes et rajouter l'id de l'utilisateur dans le tableau des dislike
				sauce.dislikes++;
				sauce.usersDisliked.push(userId);
				return;
			}
			if (like === 0) {
				//Si le nombre dans la requète est 0 alors il faut vérifier si l'utilisateur avait auparavant liké ou disliké la sauce en vérifiant sa présence dans chaque tableau pour pouvoir le retirer du tableau concerné et ajuster le compte
				if (sauce.usersLiked.indexOf(userId) === -1) {
					sauce.dislikes--;
					sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
				} else if (sauce.usersLiked.indexOf(userId) !== -1) {
					sauce.likes--;
					sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
				}
			}
		}
		arrayLike();

		sauce.save();
	});
};
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error
			});
		});
};

exports.modifySauce = (req, res, next) => {
	if (req.file) {
		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {});
		});
	}
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Objet supprimé !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error
			});
		});
};
