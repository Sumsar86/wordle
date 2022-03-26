import "./App.css";
import React from "react";
import { Grid, Paper } from "@mui/material";

const classes = {
	paperGrid: {
		width: "50px",
		height: "50px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "28px",
		fontWeight: "700",
	userSelect: "none",
	},
	paperKeyboard: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "18px",
		fontWeight: "700",
		padding: "8px",
		userSelect: "none",
	},
};

const keyboardEnum = Object.freeze({ 12: 0, 11: 1, 9: 2 });

class GridRow extends React.Component {
	squareColour(data) {
		if (data === "match") return "#79b851";
		if (data === "found") return "#f3c237";
		if (data === "wrong") return "#a4aec4";
		return "##fbfcff";
	}

	textColour(data) {
		if (data) return "white";
		return "black";
	}

	render() {
		return Array.from(Array(30)).map((_, index) => (
			<Grid item xs={1} md={1} key={index}>
				<Paper
					className='paper'
					style={{
						...classes.paperGrid,
						backgroundColor: this.squareColour(
							this.props.grid[Math.floor(index / 5)][index % 5][1]
						),
						color: this.textColour(
							this.props.grid[Math.floor(index / 5)][index % 5][1]
						),
					}}
					elevation={2}>
					{this.props.grid[Math.floor(index / 5)][index % 5][0]}
				</Paper>
			</Grid>
		));
	}
}

class KeyboardRow extends React.Component {
	squareColour(data) {
		if (data === "match") return "#79b851";
		if (data === "found") return "#f3c237";
		if (data === "wrong") return "#a4aec4";
		return "#dee1e9";
	}

	hoverSquareColour(data) {
		if (data === "match") return "#79b851";
		if (data === "found") return "#f3c237";
		if (data === "wrong") return "#a4aec4";
		return "darkgrey !important";
	}

	textColour(data) {
		if (data) return "white";
		return "black";
	}

	addButton(index, key) {
		// console.log(key, this.props.keyboard.keyData[key]);
		return (
			<Grid item xs md key={index}>
				<Paper
					className={classes.Paper}
					sx={[
						{
							"&:hover": {
								backgroundColor: this.hoverSquareColour(
									this.props.keyboard.keyData[key]
								),
							},
						},
					]}
					style={{
						...classes.paperKeyboard,
						backgroundColor: this.squareColour(
							this.props.keyboard.keyData[key]
						),
						color: this.textColour(
							this.props.keyboard.keyData[key]
						),
					}}
					onClick={() =>
						this.props.onClick(
							keyboardEnum[this.props.keyboard.keyboard.length],
							index
						)
					}>
					{this.props.keyboard.keyboard[index]}
				</Paper>
			</Grid>
		);
	}

	addEnterButton() {
		return (
			<Grid item xs md key={-2}>
				<Paper
					className={classes.Paper}
					sx={[
						{
							"&:hover": {
								backgroundColor: "darkgrey !important",
							},
						},
					]}
					style={{
						...classes.paperKeyboard,
						backgroundColor: "#dee1e9",
						color: "black",
					}}
					onClick={() => this.props.onClick(2, -2)}>
					ENTER
				</Paper>
			</Grid>
		);
	}

	addDeleteButton() {
		return (
			<Grid item xs md key={-1}>
				<Paper
					className={classes.Paper}
					sx={[
						{
							"&:hover": {
								backgroundColor: "darkgrey !important",
							},
						},
					]}
					style={{
						...classes.paperKeyboard,
						backgroundColor: "#dee1e9",
						color: "black",
					}}
					onClick={() => this.props.onClick(2, -1)}>
					DEL
				</Paper>
			</Grid>
		);
	}

	render() {
		let row = Array.from(Array(this.props.keyboard.keyboard.length)).map(
			(_, index) =>
				this.addButton(index, this.props.keyboard.keyboard[index])
		);

		if (keyboardEnum[this.props.keyboard.keyboard.length] == 2) {
			row.splice(0, 0, this.addDeleteButton());
			row.splice(
				this.props.keyboard.keyboard.length + 1,
				0,
				this.addEnterButton()
			);
		}

		return row;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: [
				Array.from(Array(5), () => ["", null]),
				Array.from(Array(5), () => ["", null]),
				Array.from(Array(5), () => ["", null]),
				Array.from(Array(5), () => ["", null]),
				Array.from(Array(5), () => ["", null]),
				Array.from(Array(5), () => ["", null]),
			],
			keyboard: ["QWERTYUIOPÜÕ", "ASDFGHJKLÖÄ", "ZXCVBNMŠŽ"],
			keyData: {
				A: null,
				B: null,
				C: null,
				D: null,
				E: null,
				F: null,
				G: null,
				H: null,
				I: null,
				J: null,
				K: null,
				L: null,
				M: null,
				N: null,
				O: null,
				P: null,
				Q: null,
				R: null,
				S: null,
				Š: null,
				Z: null,
				Ž: null,
				T: null,
				U: null,
				V: null,
				W: null,
				Õ: null,
				Ä: null,
				Ö: null,
				Ü: null,
				X: null,
				Y: null,
			},
			currentRow: 0,
			currentColumn: 0,
			gameOver: false,
			gameState: null,
			dailyWord: null,
			meaning: null,
		};
	}

	handleClick(i, keyIndex) {
		if (this.state.gameOver || (!i && i >= 3)) return;

		const grid = this.state.grid.slice();
		const keyData = { ...this.state.keyData };
		const col = this.state.currentColumn;
		const row = this.state.currentRow;
		const key =
			keyIndex >= 0
				? this.state.keyboard[i][keyIndex]
				: keyIndex === -1
				? "DEL"
				: "ENTER";

		if (key === "DEL") {
			grid[row][col > 0 ? col - 1 : 0][0] = "";
			return this.setState({
				grid: grid,
				currentColumn: col > 0 ? col - 1 : 0,
				gameState: null,
			});
		}
		if (key === "ENTER") {
			wordExists(grid[row]).then((exists) => {
				if (col < 5 || !exists) {
					let state;
					if (col < 5) state = { gameState: "Liiga lühikene!" };
					if (!exists)
						state = { gameState: "Sellist sõna pole olemas!" };
					return this.setState(state);
				}
				const [result, nKeyData] = checkWord(
					grid[row],
					keyData,
					this.state.dailyWord
				);
				grid[this.state.currentRow] = result;

				let sum = 0;
				for (const [, c] of grid[this.state.currentRow])
					if (c === "match") sum++;
				if (sum === 5) {
					return this.setState({
						gameState: "Võit!",
						gameOver: true,
					});
				}
				if (row + 1 === 6) {
					return this.setState({
						gameState: "Mäng läbi!",
						gameOver: true,
					});
				}

				return this.setState({
					grid: grid,
					keyData: nKeyData,
					currentColumn: 0,
					currentRow: row < 6 ? row + 1 : 6,
					gameState: null,
				});
			});
			return;
		}
		if (grid[row][col] && grid[row][col][0] === "") grid[row][col][0] = key;
		return this.setState({
			grid: grid,
			currentColumn: col < 5 ? col + 1 : 5,
			gameState: null,
		});
	}

	async componentDidMount() {
		await fetch("/word_of_day")
			.then((res) => res.json())
			.then((json) =>
				this.setState({
					dailyWord: json.word,
				})
			)
			.catch((error) => console.error("Error:", error));

		const params = {
			word: this.state.dailyWord,
		};
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(params),
		};
		await fetch("/word_of_day_meaning", options)
			.then((res) => res.json())
			.then((json) =>
				this.setState({
					meaning: json.meaning,
				})
			);
	}

	render() {
		return (
			<div className='game'>
				<Grid
					className='game-grid'
					container
					spacing={{ xs: 1, md: 1 }}
					columns={5}
					style={{
						width: `${50 * 5 + 15 * 5}px`, //"325px",
						height: `${50 * 6 + 15 * 6}px`, //"390px",
						margin: "auto",
						// borderStyle: "solid",
					}}
					justifyContent='space-evenly'
					alignItems='space-evenly'>
					<GridRow grid={this.state.grid} />
				</Grid>
				<div
					className='daily-word-meaning'
					dangerouslySetInnerHTML={{
						__html:
							this.state.gameOver &&
							this.state.gameState === "Võit!"
								? this.state.meaning
								: null,
					}}
				/>
				<div className='game-state'>{this.state.gameState}</div>
				<Grid
					className='game-keyboard'
					container
					spacing={{ xs: 0.2, md: 1 }}
					style={{
						width: "60%",
						minWidth: "400px",
						height: "60px",
						margin: "auto",
						// marginTop: `10%`,
						// borderStyle: "solid",
						// borderColor: "darkorange",
					}}>
					<Grid
						className='game-keyboard-row1'
						container
						item
						spacing={{ xs: 0.2, md: 1 }}
						columns={12}>
						<KeyboardRow
							keyboard={{
								keyboard: this.state.keyboard[0],
								keyData: this.state.keyData,
							}}
							onClick={(i, keyIndex) =>
								this.handleClick(i, keyIndex)
							}
						/>
					</Grid>
					<Grid
						className='game-keyboard-row2'
						container
						item
						spacing={{ xs: 0.2, md: 1 }}
						columns={11}>
						<KeyboardRow
							keyboard={{
								keyboard: this.state.keyboard[1],
								keyData: this.state.keyData,
							}}
							onClick={(i, keyIndex) =>
								this.handleClick(i, keyIndex)
							}
						/>
					</Grid>
					<Grid
						className='game-keyboard-row3'
						container
						item
						spacing={{ xs: 0.2, md: 1 }}
						columns={9}>
						<KeyboardRow
							keyboard={{
								keyboard: this.state.keyboard[2],
								keyData: this.state.keyData,
							}}
							onClick={(i, keyIndex) =>
								this.handleClick(i, keyIndex)
							}
						/>
					</Grid>
				</Grid>
			</div>
		);
	}
}

async function wordExists(row) {
	const params = {
		guess: row.map((x) => x[0]).join(""),
	};
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(params),
	};
	const responce = await fetch("/does_word_exist", options)
		.then((res) => res.json())
		.then((json) => json.exists);

	return responce;
}

function checkWord(row, data, dailyWord) {
	const word = row.map((x) => x[0]).join("");
	const nData = { ...data };
	let letters = [...dailyWord].reduce((a, e) => {
		a[e] = a[e] ? a[e] + 1 : 1;
		return a;
	}, {});
	const cLetters = [...dailyWord].reduce((a, e) => {
		a[e] = a[e] ? a[e] + 1 : 1;
		return a;
	}, {});
	let nRow = row.slice();

	for (const i in word) {
		if (word[i] === dailyWord[i]) {
			nRow[i][1] = "match";
			/*if (letters[word[i]] <= 1)*/ nData[word[i]] = "match";
			letters[word[i]]--;

			for (const j in word) {
				if (
					nRow[j][0] === word[i] &&
					nRow[j][1] === "found" &&
					cLetters[nRow[j][0]] <= 1
				)
					nRow[j][1] = "wrong";
			}

			continue;
		}
		if (letters.hasOwnProperty(word[i]) && letters[word[i]] > 0) {
			nRow[i][1] = "found";
			if (!nData[word[i]]) nData[word[i]] = "found";
			letters[word[i]]--;
			continue;
		}
		nRow[i][1] = "wrong";
		if (nData[word[i]] === null) nData[word[i]] = "wrong";
	}

	return [nRow, nData];
}

export default Game;
