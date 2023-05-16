<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import Skyline from './Skyline.svelte';

	import { createWordWithRegex } from '$lib/regex-word-generator';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	const [a, b, c] = [createWordWithRegex(), createWordWithRegex(), createWordWithRegex()];
	let words = writable<
		{ position: { x: number; y: number }; word: string; state: 'solved' | 'crashed' | 'falling' }[]
	>([
		{ word: a.word, position: { x: 25, y: 0 }, state: 'falling' },
		{ word: b.word, position: { x: 50, y: -25 }, state: 'falling' },
		{ word: c.word, position: { x: 75, y: -50 }, state: 'falling' }
	]);
	let regexes = writable<[RegExp, RegExp, RegExp]>([a.regex, b.regex, c.regex]);
	let arcadeScreen: HTMLElement;

	function checkWords(regex: RegExp) {
		let solvedWithRegex = 0;
		for (let i = 0; i < $words.length; i++) {
			const word = $words[i];
			console.log('testing', regex, 'against', word.word);
			if (word.state !== 'falling') {
				continue;
			}
			if (regex.test(word.word)) {
				$words[i].state = 'solved';
				solvedWithRegex++;
			}
		}
	}

	function loop(maxHeightOfScreen: number) {
		requestAnimationFrame(() => {
			$words = $words.map((word) => {
				console.log({ y: word.position.y, maxHeightOfScreen, state: word.state });
				const y = Math.min(maxHeightOfScreen, word.position.y + 1);
				return {
					...word,
					state: word.position.y === maxHeightOfScreen ? 'crashed' : word.state,
					position: { ...word.position, y }
				};
			});
			if ($words.some((w) => w.state !== 'crashed')) {
				loop(maxHeightOfScreen);
			}
		});
	}

	onMount(() => {
		if (browser) {
			const maxHeightOfScreen = arcadeScreen.scrollHeight;
			console.log({ maxHeightOfScreen });
			loop(maxHeightOfScreen);
		}
	});
</script>

<div class="game">
	<section class="falling-words" bind:this={arcadeScreen}>
		<div class="words">
			{#each $words as { word, position: { x, y }, state }}
				<div class="word" class:isSolved={state === 'solved'} style="top: {y}px; left: {x}%">
					{word}
				</div>
			{/each}
		</div>
		<Skyline downPercentage={$words.filter((w) => w.state === 'crashed').length / 3} />
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
