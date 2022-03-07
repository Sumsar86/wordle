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
		console.log("Pipe data from python script ...", data.toString());
		dataToSend = data.toString().replace("\r\n", "") === "true";
	});
	// in close event we are sure that stream from child process is closed
	python.on("close", (code) => {
		console.log(`child process close all stdio with code ${code}`);
		// send data to browser
		res.send({ word: req.body.guess, exists: dataToSend });
	});
});
