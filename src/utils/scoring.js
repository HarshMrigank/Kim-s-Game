export function evaluateAnswers(selectedAnswers = [], missingWords = []) {
  const correctSet = new Set(missingWords);
  const selectedSet = new Set(selectedAnswers);

  const correctAnswers = [...selectedSet].filter((word) => correctSet.has(word));
  const incorrectAnswers = [...selectedSet].filter((word) => !correctSet.has(word));
  const missedWords = missingWords.filter((word) => !selectedSet.has(word));

  const totalAnswers = missingWords.length;
  const score = correctAnswers.length * 10;

  const accuracy =
    totalAnswers === 0
      ? 0
      : Math.round((correctAnswers.length / totalAnswers) * 10000) / 100;

  return {
    score,
    accuracy,
    correctAnswers,
    incorrectAnswers,
    missedWords,
    unansweredCount: missedWords.length,
    totalAnswers,
  };
}
