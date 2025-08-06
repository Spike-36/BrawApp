// progressStorage.js
// Temporary dummy replacement – no AsyncStorage or FileSystem used

let memoryStore = {};

export const getProgress = async (wordId) => {
  return memoryStore[wordId] ?? 0;
};

export const setProgress = async (wordId, value) => {
  memoryStore[wordId] = value;
};

export const resetProgress = async () => {
  memoryStore = {};
};
