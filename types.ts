export enum AppScreen {
  AUTH = 'AUTH',
  HOME = 'HOME',
  GAME = 'GAME',
  GAME_OVER = 'GAME_OVER',
  SHOP = 'SHOP',
  SETTINGS = 'SETTINGS',
  DONATE = 'DONATE'
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  CRASHED = 'CRASHED'
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  highScore: number;
  credits: number;
  isPremium: boolean;
  isDonor: boolean;
}

export interface PipeData {
  id: number;
  z: number;
  yGapCenter: number;
  passed: boolean;
}

export interface CoinData {
  id: number;
  x: number;
  y: number;
  z: number;
  collected: boolean;
}

export interface GameStats {
  score: number;
  distance: number;
  speed: number;
  coins: number;
}

export interface AppSettings {
  musicVolume: boolean;
  sfxVolume: boolean;
  highQuality: boolean;
  sensitivity: number;
}