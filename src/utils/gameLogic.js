
/**
 * Returns a shuffled copy of an array.
 * The original array remains unchanged.
 */
export function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Creates one round using the selected difficulty level.
 */
export function createRound(wordBank, level) {
  // Remove duplicate words from the word bank.
  const uniqueWords = [...new Set(wordBank)];

  // Check whether enough words are available.
  if (uniqueWords.length < level.words) {
    throw new Error(
      `This level needs ${level.words} unique words, ` +
      `but only ${uniqueWords.length} are available.`
    );
  }

  // Select the number of words required for this level.
  const selectedWords = shuffleArray(uniqueWords)
    .slice(0, level.words);

  // Randomly choose which selected words will disappear.
  const missingWords = shuffleArray(selectedWords)
    .slice(0, level.missing);

  // Display all selected words except the missing ones.
  const missingSet = new Set(missingWords);

  const visibleWords = selectedWords.filter(
    (word) => !missingSet.has(word)
  );

  return {
    allWords: selectedWords,
    visibleWords,
    missingWords
  };
}

/**
 * Creates answer options containing the correct answers
 * and four incorrect alternatives.
 */
export function createAnswerOptions(
  wordBank,
  missingWords,
  distractorCount = 4
) {
  const missingSet = new Set(missingWords);

  // Distractors must not be correct answers.
  const distractorPool = [...new Set(wordBank)].filter(
    (word) => !missingSet.has(word)
  );

  if (distractorPool.length < distractorCount) {
    throw new Error(
      "Not enough unique words to generate answer options."
    );
  }

  const distractors = shuffleArray(distractorPool)
    .slice(0, distractorCount);

  // Combine correct answers and distractors, then shuffle.
  return shuffleArray([
    ...missingWords,
    ...distractors
  ]);
}
