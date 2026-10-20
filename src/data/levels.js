export const LEVELS = [
  { level: 1, name: "Baby’s First Memory Test", words: 8, missing: 2, time: 8 },
  { level: 2, name: "Completely Average", words: 10, missing: 3, time: 7 },
  { level: 3, name: "Getting Mildly Confused", words: 13, missing: 4, time: 6 },
  { level: 4, name: "Brain Cells Firing", words: 16, missing: 5, time: 6 },
  { level: 5, name: "The Illusion of Competence", words: 20, missing: 7, time: 5 },
  { level: 6, name: "Oh Look, You Made It", words: 24, missing: 9, time: 5 },
  { level: 7, name: "Approaching Memory Loss", words: 28, missing: 11, time: 4 },
  { level: 8, name: "Dazed and Confused", words: 33, missing: 13, time: 4 },
  { level: 9, name: "Complete Mental Collapse", words: 38, missing: 16, time: 3 },
  { level: 10, name: "Certified Amnesiac", words: 45, missing: 20, time: 3 },
];

export function getLevel(levelNumber) {
  return LEVELS.find((level) => level.level === Number(levelNumber));
}