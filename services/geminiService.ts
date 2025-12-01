import { GameStats } from "../types";

const FALLBACK_BRIEFINGS = [
    "Ready to fly? Let's-a go!",
    "It's time for an adventure!",
    "Watch out for those pipes!",
    "Here we go! Good luck!",
    "Press space or tap to fly!",
    "Collect coins for glory!",
    "Don't touch the green pipes!"
];

const FALLBACK_CRASH_ANALYSIS = [
    "Mama Mia! Try again!",
    "Oh no! That was close!",
    "Don't give up! You can do it!",
    "Oof! Watch your head!",
    "So close! Let's-a go again!",
    "Oopsie! One more try?",
    "You can do better! Go!"
];

const getRandomFallback = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getCrashAnalysis = async (stats: GameStats): Promise<string> => {
  // Simulate a very short delay to feel "thoughtful" without waiting for network
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(getRandomFallback(FALLBACK_CRASH_ANALYSIS));
    }, 300);
  });
};

export const getMissionBriefing = async (): Promise<string> => {
  return Promise.resolve(getRandomFallback(FALLBACK_BRIEFINGS));
}