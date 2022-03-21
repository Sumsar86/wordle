import "./App.css";
import React from "react";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const ButtonEnter = styled.button`
	background-color: lightgrey;
	color: black;
	font-size: 20px;
	height: 50px;
	width: 120px;
	border-radius: 3px;
	margin: 2px;
	cursor: pointer;
	text-shadow: 5px 5px 10px white, -5px -5px 10px white, 5px -5px 10px white,
		-5px 5px 10px white;
	color: black;
`;
const ButtonDel = styled.button`
	background-color: lightgrey;
	color: black;
	font-size: 20px;
	height: 50px;
	width: 66px;
	border-radius: 3px;
	margin: 2px;
	cursor: pointer;
	text-shadow: 5px 5px 10px white, -5px -5px 10px white, 5px -5px 10px white,
		-5px 5px 10px white;
	color: black;
`;
const Button = styled.button`
	background-color: ${(props) => props.theme.main};
	color: black;
	font-size: 20px;
	height: 50px;
	width: 50px;
	border-radius: 3px;
	margin: 2px;
	cursor: pointer;
	text-shadow: 5px 5px 10px white, -5px -5px 10px white, 5px -5px 10px white,
		-5px 5px 10px white;
	color: black;
`;
Button.defaultProps = {
	theme: {
		main: "lightgrey",
	},
};
const themeMatch = {
	main: "green",
};
const themeFound = {
	main: "yellow",
};
const themeWrong = {
	main: "grey",
};
const classes = {
	root: {
		flexGrow: 1,
	},
	paper: {
		width: "50px",
		height: "50px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
};

function CustomButton(props) {
	if (props.value.key === "ENTER")
		return (
			<ButtonEnter onClick={props.onClick}>{props.value.key}</ButtonEnter>
		);

	if (props.value.key === "DEL")
		return <ButtonDel onClick={props.onClick}>{props.value.key}</ButtonDel>;

	if (props.value.data === "match")
		return (
			<Button theme={themeMatch} onClick={props.onClick}>
				{props.value.key}
			</Button>
		);
	if (props.value.data === "found")
		return (
			<Button theme={themeFound} onClick={props.onClick}>
				{props.value.key}
			</Button>
		);
	if (props.value.data === "wrong")
		return (
			<Button theme={themeWrong} onClick={props.onClick}>
				{props.value.key}
			</Button>
		);
	return <Button onClick={props.onClick}>{props.value.key}</Button>;
}

class GridRow extends React.Component {
	squareColour(data) {
		if (data === "match") return "#79b851";
		if (data === "found") return "#f3c237";
		if (data === "wrong") return "#a4aec4";
		return "##dee1e9";
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
						...classes.paper,
						backgroundColor: this.squareColour(
							this.props.grid[Math.floor(index / 5)][
								index % 5
							][1]
						),
						color: this.textColour(
							this.props.grid[Math.floor(index / 5)][
								index % 5
							][1]
						),
					}}
					elevation={3}>
					{this.props.grid[Math.floor(index / 5)][index % 5][0]}
				</Paper>
			</Grid>
		));
	}
}

// function Square(props) {
// 	if (props[1] === "match")
// 		return <div className='square match'>{props[0]}</div>;
// 	if (props[1] === "found")
// 		return <div className='square found'>{props[0]}</div>;
// 	if (props[1] === "wrong")
// 		return <div className='square wrong'>{props[0]}</div>;
// 	return <div className='square'>{props[0]}</div>;
// }

// class Board extends React.Component {
// 	renderRow(i) {
// 		return (
// 			<div className='board-row'>
// 				<Square value={this.props.board[i][0]} />
// 				<Square value={this.props.board[i][1]} />
// 				<Square value={this.props.board[i][2]} />
// 				<Square value={this.props.board[i][3]} />
// 				<Square value={this.props.board[i][4]} />
// 			</div>
// 		);
// 	}

// 	render() {
// 		return (
// 			<div>
// 				{this.renderRow(0)}
// 				{this.renderRow(1)}
// 				{this.renderRow(2)}
// 				{this.renderRow(3)}
// 				{this.renderRow(4)}
// 				{this.renderRow(5)}
// 			</div>
// 		);
// 	}
// }

class Keyboard extends React.Component {
	renderKeyRow(i) {
		let keys = [];
		let row = this.props.keyboard.keyboard[i];
		for (let keyIndex in row)
			keys.push(
				<CustomButton
					key={keyIndex}
					value={{
						key: row[keyIndex],
						data: this.props.keyboard.keyData[row[keyIndex]],
					}}
					onClick={() => this.props.onClick(i, keyIndex)}
				/>
			);
		if (i === 0) {
			keys.push(
				<CustomButton
					key={{ key: -1, data: null }}
					value={{ key: "DEL", data: null }}
					onClick={() => this.props.onClick(i, -1)}
				/>
			);
		} else if (i === 1) {
			keys.push(
				<CustomButton
					key={{ key: -2, data: null }}
					value={{ key: "ENTER", data: null }}
					onClick={() => this.props.onClick(i, -2)}
				/>
			);
		}
		return <div>{keys}</div>;
	}

	render() {
		return (
			<div>
				<div className='key-row'> {this.renderKeyRow(0)}</div>
				<div className='key-row'> {this.renderKeyRow(1)}</div>
				<div className='key-row'> {this.renderKeyRow(2)}</div>
			</div>
		);
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

	handleClick(i, j) {
		if (this.state.gameOver) return;

		const grid = this.state.grid.slice();
		const keyData = { ...this.state.keyData };
		const col = this.state.currentColumn;
		const row = this.state.currentRow;
		const key =
			j >= 0 ? this.state.keyboard[i][j] : i === 0 ? "DEL" : "ENTER";

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
		if (grid[row][col] && grid[row][col][0] === "")
			grid[row][col][0] = key;
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
						borderStyle: "solid",
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
				<div className='game-keyboard'>
					<div className='game-state'>{this.state.gameState}</div>
					<Keyboard
						keyboard={{
							keyboard: this.state.keyboard,
							keyData: this.state.keyData,
						}}
						onClick={(i, j) => this.handleClick(i, j)}
					/>
				</div>
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
			if (letters[word[i]] <= 1) nData[word[i]] = "match";
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
