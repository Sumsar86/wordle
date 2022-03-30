const express = require("express");
const request = require("request");
const { parse } = require("node-html-parser");
const { spawn } = require("child_process");
const app = express();
const port = process.env.PORT || 3001;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

// create a GET route
app.get("/word_of_day", (req, res) => {
	let dailyWord;
	// spawn new child process to call the python script
	const python = spawn("python", ["./words/word_of_day.py"]);
	// collect data from script
	python.stdout.on("data", function (data) {
		console.log("Pipe data from python script ...");
		dailyWord = data.toString().replace("\r\n", "");
	});

	// in close event we are sure that stream from child process is closed
	python.on("close", (code) => {
		console.log(`child process close all stdio with code ${code}`);
		// send data to browser
		res.send({ word: dailyWord });
	});
});

// http://www.eki.ee/dict/shs_liides.html
// Materjale tohib paigutada oma leheküljele järgmistel tingimustel
// Päringulahtri või vastuste kõrval peab olema Eesti Keele Instituudi logo või materjali päritolu näitav tekst. Logo/tekst peab olema vormistatud lingina sellele eki.ee lehele, kust materjal pärineb
// Lehekülg peab olema veebis ligipääsetav ilma registreerimisnõudeta.
// Muuta võib väljanägemist, aga mitte sisu.
// Kui mõisted ajax ja json on teile tuttavad, ei ole sõnaraamatu liidese portimine teise veebikeskkonda kuigi keeruline, lisage selleks päringule parameeter Z=json. Kui lisate parameetri &callback=, järgib server jsonp konventsiooni. Näidiseks shs_json.html. Sõnastikusisesed lingid, sobiv css ja javascriptiga tüübiinfo näitamine jääb teie lahendada.

// JSONi kasutamiseks tuleb teil küsida endale parool sõnastike haldajalt (webmaster@eki.ee) ning lisada seegi parameetrina X=minusalasona. Ka muude tehniliste küsimustega palume pöörduda samal meiliaadressil.

app.post("/word_of_day_meaning", (req, res) => {
	let meaning;
	const word = req.body.word;
	request(
		{
			url: `https://www.eki.ee/dict/ekss/index.cgi?Q=` + word,
		},
		(error, response, body) => {
			if (error || response.statusCode !== 200) {
				meaning = res
					.status(500)
					.json({ type: "error", message: err.message });
			}

			meaning = parse(body).querySelectorAll(".tervikart").toString();
			res.send({ word: word, meaning: meaning });
		}
	);
});

app.post("/does_word_exist", (req, res) => {
	let dataToSend;
	// spawn new child process to call the python script
	const python = spawn("python", [
		"./words/does_word_exist.py",
		req.body.guess,
	]);
	// collect data from script
	python.stdout.on("data", function (data) {
		console.log("Pipe data from python script ...");
		dataToSend = data.toString().replace("\r\n", "") === "true";
	});
	// in close event we are sure that stream from child process is closed
	python.on("close", (code) => {
		console.log(`child process close all stdio with code ${code}`);
		// send data to browser
		res.send({ word: req.body.guess, exists: dataToSend });
	});
});
