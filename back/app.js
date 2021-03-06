const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
require("dotenv").config({ path: "../.env" });

const apiKey = process.env.API_KEY;

mongoose
	.connect(`${apiKey}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("La connexion à MongoDB à réussie !"))
	.catch(() => console.log("La connexion à MongoDB à échouée !"));

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(bodyParser.json());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
