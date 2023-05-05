<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import Skyline from './Skyline.svelte';

	import { createWordWithRegex } from '$lib/regex-word-generator';

	const [a, b, c] = [createWordWithRegex(), createWordWithRegex(), createWordWithRegex()];
	let words = writable<{ position: { x: number; y: number }; word: string; isSolved: boolean }[]>([
		{ word: a.word, position: { x: 25, y: 50 }, isSolved: false },
		{ word: b.word, position: { x: 50, y: 25 }, isSolved: false },
		{ word: c.word, position: { x: 75, y: 0 }, isSolved: false }
	]);
	let regexes = writable<[RegExp, RegExp, RegExp]>([a.regex, b.regex, c.regex]);

	function checkWords(regex: RegExp) {
		let solvedWithRegex = 0;
		for (let i = 0; i < $words.length; i++) {
			const word = $words[i];
			console.log('testing', regex, 'against', word.word);
			if (word.isSolved) {
				continue;
			}
			if (regex.test(word.word)) {
				$words[i].isSolved = true;
				solvedWithRegex++;
			}
		}
	}
</script>

<div class="game">
	<section class="falling-words">
		<div class="words">
			{#each $words as { word, position: { x, y }, isSolved }}
				<div class="word" class:isSolved style="top: {y}%; left: {x}%">{word}</div>
			{/each}
		</div>
		<Skyline downPercentage={0.9} />
	</section>

	<section class="buttons">
		<button on:click={() => checkWords($regexes[0])}>{$regexes[0]}</button>
		<button on:click={() => checkWords($regexes[1])}>{$regexes[1]}</button>
		<button on:click={() => checkWords($regexes[2])}>{$regexes[2]}</button>
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
	.game {
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
	}
	.falling-words {
		display: flex;
		flex: 1;
		flex-flow: column nowrap;
		justify-content: flex-end;
		position: relative;
	}
	.words {
		position: absolute;
		inset: 0;
	}
	.word {
		position: absolute;
	}
	.isSolved {
		transition: opacity 1s;
		opacity: 0;
	}
	.buttons {
		display: flex;
		height: 3em;
		justify-content: space-evenly;
	}
	.buttons button {
		display: block;
		flex: 1;
	}
</style>
