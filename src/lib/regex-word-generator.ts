const db = {
	a: [/a/, /A/i, /./],
	b: [/b/],
	c: [/c/],
	d: [/d/]
} as const;

const words = Object.keys(db) as (keyof typeof db)[];
const allPossibleRegexes = Object.values(db).flat();

function randomArrayEntry<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function createWordWithRegex(): { word: string; regex: RegExp } {
	const word = randomArrayEntry(words);
	const regex = randomArrayEntry<RegExp>(db[word] as unknown as RegExp[]);
	return {
		word,
		regex
	};
}

export function randomRegex(): RegExp {
	return randomArrayEntry(allPossibleRegexes);
}
