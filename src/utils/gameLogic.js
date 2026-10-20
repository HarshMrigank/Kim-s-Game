export function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function createRound(wordBank, level, usedWordsInSession = new Set()) {
  const uniqueWords = [...new Set(wordBank)];

  if (!level || !level.words || !level.missing) {
    throw new Error("Invalid level configuration.");
  }

  if (level.missing >= level.words) {
    throw new Error("Missing-word count must be smaller than word count.");
  }

  if (uniqueWords.length < level.words + 4) {
    throw new Error(
      `This level requires at least ${level.words + 4} unique words ` +
      "to create the round and distractors."
    );
  }

  // Prefer fresh words not yet seen in the current session
  const freshWords = uniqueWords.filter((w) => !usedWordsInSession.has(w));
  const pool = freshWords.length >= level.words + 4 ? freshWords : uniqueWords;

  const allWords = shuffleArray(pool).slice(0, level.words);
  const missingWords = shuffleArray(allWords).slice(0, level.missing);
  const missingSet = new Set(missingWords);

  const visibleWords = allWords.filter((word) => !missingSet.has(word));

  return {
    level,
    allWords,
    visibleWords,
    missingWords,
  };
}

export function createAnswerOptions(
  wordBank,
  missingWords,
  distractorCount = 4,
  excludedWords = []
) {
  const excludedSet = new Set([...missingWords, ...excludedWords]);

  let distractorPool = [...new Set(wordBank)].filter(
    (word) => !excludedSet.has(word)
  );

  // Fallback in case excludedSet was almost everything
  if (distractorPool.length < distractorCount) {
    distractorPool = [...new Set(wordBank)].filter(
      (word) => !new Set(missingWords).has(word)
    );
  }

  const distractors = shuffleArray(distractorPool).slice(0, distractorCount);

  return shuffleArray([...missingWords, ...distractors]);
}
