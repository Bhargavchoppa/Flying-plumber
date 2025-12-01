import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AppScreen, GameStatus, GameStats, UserProfile, AppSettings } from './types';
import { GameScene } from './components/GameScene';
import { AuthScreen, MainMenu, HUD, GameOverScreen, ShopScreen, SettingsScreen, DonationScreen } from './components/UI';

// Random User Generation Helper
const ADJECTIVES = ['Super', 'Mega', 'Turbo', 'Bouncy', 'Speedy', 'Lucky', 'Happy', 'Crazy', 'Rocket', 'Neon'];
const NOUNS = ['Plumber', 'Toad', 'Yoshi', 'Luigi', 'Koopa', 'Star', 'Mushroom', 'Pipe', 'Cloud', 'Brick'];

const generateRandomUser = (): UserProfile => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 999);
    const username = `${adj}${noun}${num}`;
    
    // Using Robohash set 4 for Cats/Animals
    const avatarUrl = `https://robohash.org/${username}.png?set=set4&size=128x128`;
    
    return {
        id: `u_${Date.now()}`,
        username: username,
        avatarUrl: avatarUrl,
        highScore: 0,
        credits: 50, // Start with some credits
        isPremium: false,
        isDonor: false
    };
};

const DEFAULT_SETTINGS: AppSettings = {
  musicVolume: true,
  sfxVolume: true,
  highQuality: true,
  sensitivity: 50
};

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.AUTH);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // Game Stats for current run
  const [currentScore, setCurrentScore] = useState(0);
  const [currentCoins, setCurrentCoins] = useState(0);
  const [stats, setStats] = useState<GameStats>({ score: 0, distance: 0, speed: 0, coins: 0 });

  const handleLogin = () => {
    const newUser = generateRandomUser();
    setUser(newUser);
    setScreen(AppScreen.HOME);
  };

  const startGame = () => {
    setCurrentScore(0);
    setCurrentCoins(0);
    setGameStatus(GameStatus.PLAYING);
    setScreen(AppScreen.GAME);
  };

  const handleCrash = () => {
    setGameStatus(GameStatus.CRASHED);
    // Calculate final stats
    const finalStats = {
      score: currentScore,
      distance: currentScore * 18 + (Math.random() * 10), 
      speed: 12 + (currentScore * 0.2),
      coins: currentCoins
    };
    setStats(finalStats);
    
    // Update High Score logic
    if (user) {
        let newCredits = user.credits + currentCoins;
        let newHighScore = Math.max(user.highScore, finalStats.score);
        setUser({ ...user, highScore: newHighScore, credits: newCredits });
    }

    // Small delay before showing game over screen for impact
    setTimeout(() => {
      setScreen(AppScreen.GAME_OVER);
    }, 800);
  };

  const handleScore = () => {
    setCurrentScore(prev => prev + 1);
  };

  const handleCoin = () => {
    setCurrentCoins(prev => prev + 1);
  };

  const goHome = () => {
    setGameStatus(GameStatus.IDLE);
    setScreen(AppScreen.HOME);
  };

  const restartGame = () => {
    setGameStatus(GameStatus.IDLE);
    // Small timeout to allow state reset before starting
    setTimeout(() => {
        startGame();
    }, 100);
  };

  const handleDonate = (amount: number) => {
    // We update the user state silently. The UI (DonationScreen) handles the success message.
    if (user) {
        setUser({ ...user, isDonor: true, credits: user.credits + (amount * 50) });
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#5c94fc] overflow-hidden select-none font-sans">
      
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas 
            camera={{ position: [0, 0, 0], fov: 60 }} 
            shadows={settings.highQuality}
            dpr={[1, 1.5]} // Cap DPR to 1.5 for mobile performance
        >
          <Suspense fallback={null}>
             <GameScene 
                status={gameStatus === GameStatus.CRASHED ? GameStatus.IDLE : gameStatus} 
                onCrash={handleCrash} 
                onScore={handleScore} 
                onCoin={handleCoin}
                settings={settings}
             />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Layer */}
      {screen === AppScreen.AUTH && <AuthScreen onLogin={handleLogin} />}
      
      {screen === AppScreen.HOME && user && (
        <MainMenu 
            onPlay={startGame} 
            onNavigate={setScreen}
            user={user} 
        />
      )}

      {screen === AppScreen.GAME && (
        <HUD score={currentScore} coins={currentCoins} />
      )}

      {screen === AppScreen.GAME_OVER && (
        <GameOverScreen 
            stats={stats} 
            onRestart={restartGame} 
            onHome={goHome} 
        />
      )}

      {screen === AppScreen.SHOP && user && (
          <ShopScreen onBack={goHome} user={user} />
      )}
      
      {screen === AppScreen.SETTINGS && (
          <SettingsScreen onBack={goHome} settings={settings} onUpdateSettings={setSettings} />
      )}

      {screen === AppScreen.DONATE && user && (
          <DonationScreen onBack={goHome} onDonate={handleDonate} user={user} />
      )}

    </div>
  );
};

export default App;