import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
	const [text, setText] = useState("");
	const [author, setAuthor] = useState("");
	const [input, setInput] = useState("");
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [wpm, setWpm] = useState(0);
	const [completed, setCompleted] = useState(false); // Nuovo stato per il completamento del gioco
	const indicatorRef = useRef(null); // Ref per l'indicatore di posizione

	useEffect(() => {
		fetchRandomSentence();
	}, []);

	const fetchRandomSentence = async () => {
		const response = await fetch(
			"https://api.quotable.io/random?maxLength=80"
		);
		const data = await response.json();
		console.log(data);
		setText(data.content);
		setAuthor(data.author);
		resetGame();
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setInput(value);

		if (value === text) {
			const endTime = new Date().getTime();
			setEndTime(endTime);
			const duration = (endTime - startTime) / 1000 / 60; // in minuti
			const words = text.split(" ").length;
			setWpm((words / duration).toFixed(2));
			setCompleted(true); // Imposta lo stato completato su true
		} else if (value.length === 1 && !startTime) {
			setStartTime(new Date().getTime());
		}
	};

	const renderTextWithErrors = () => {
		return text.split("").map((char, index) => {
			let className = "";
			if (index < input.length) {
				className =
					char === input[index]
						? "text-green-500"
						: "underline decoration-red text-red-500";
			} else {
				className = "text-gray-700";
			}
			return (
				<span
					key={index}
					className={className}
					ref={index === input.length ? indicatorRef : null} // Imposta la ref sull'indicatore di posizione
				>
					{char}
				</span>
			);
		});
	};

	const resetGame = () => {
		setInput("");
		setStartTime(null);
		setEndTime(null);
		setWpm(0);
		setCompleted(false);
	};

	useEffect(() => {
		if (indicatorRef.current) {
			// Scrolla l'indicatore di posizione nell'area visibile
			indicatorRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
		}
	}, [input]);

	return (
		<div className="h-screen w-screen max-w-screen max-h-screen flex flex-col items-center justify-center bg-gray-100">
			<h1 className="text-4xl mb-8 text-black">ago-type!</h1>
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-3/4 md:w-1/2">
				<div className="mb-10" id="quote">
					<div className="text-5xl mb-4 text-gray-700">
						{renderTextWithErrors()}
					</div>
					<p className="font-bold text-gray-700">- {author}</p>
				</div>

				<textarea
					id="input"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					value={input}
					onChange={handleChange}
					placeholder="Start typing..."
					rows="4"
					disabled={completed} // Disabilita la textarea se il gioco è completato
					autoFocus
					onBlur={(e) => e.target.focus()} // Rimette il focus sulla textarea se si clicca fuori
				></textarea>
				{endTime && (
					<div className="mt-4 flex flex-col">
						<p>Words: {text.split(" ").length}</p>
						<p>Characters: {text.length}</p>
						<p>
							Time: {(endTime - startTime) / 1000}" -{" "}
							{(endTime - startTime) / 1000 / 60}'
						</p>
						<p className="text-green-500 text-lg text-center">
							Words per minute: {wpm}
						</p>
						<p className="text-green-500 text-lg text-center">
							Words per second: {wpm / 60}
						</p>
						<button
							className="mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							onClick={fetchRandomSentence}
							tabIndex="0" // Permette di cliccare il pulsante con il tasto Tab
						>
							Retry
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
