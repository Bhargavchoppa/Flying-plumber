
import React, { useState, useEffect } from 'react';
import { AppScreen, GameStats, UserProfile, AppSettings } from '../types';
import { Play, Home, RefreshCw, Trophy, ShoppingBag, User, Settings, Star, Heart, Volume2, VolumeX, Moon, Sun, ArrowLeft, Smartphone, CreditCard, Globe, Zap, GraduationCap, Cpu, CheckCircle, Share2 } from 'lucide-react';
import { getCrashAnalysis, getMissionBriefing } from '../services/geminiService';

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '' }: any) => {
  const baseClass = "w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-wide transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 border-2 text-xl";
  
  const variants = {
    primary: "bg-red-500 border-red-600 text-white hover:bg-red-400", // Mario Red
    secondary: "bg-green-500 border-green-600 text-white hover:bg-green-400", // Luigi Green
    accent: "bg-yellow-400 border-yellow-500 text-black hover:bg-yellow-300", // Coin Yellow
    premium: "bg-purple-500 border-purple-600 text-white hover:bg-purple-400",
    neutral: "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-100",
    gpay: "bg-black border-slate-800 text-white hover:bg-slate-900", // GPay style
  };
  
  return (
    <button className={`${baseClass} ${(variants as any)[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-3xl p-6 shadow-2xl border-4 border-slate-200 ${className}`}>
    {children}
  </div>
);

// --- Screen Components ---

export const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#5c94fc]">
      <div className="w-full max-w-md space-y-4 animate-in bounce-in duration-700">
        
        {/* CUSTOM ORIGINAL SVG BIRD (Safe for Copyright) */}
        <div className="mx-auto w-32 h-32 animate-bounce hover:scale-110 transition-transform relative z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" style={{ overflow: 'visible' }}>
                {/* Wings (Back) */}
                <ellipse cx="40" cy="45" rx="15" ry="10" fill="white" stroke="black" strokeWidth="3" />
                
                {/* Body */}
                <rect x="20" y="20" width="60" height="50" rx="15" fill="#fbbf24" stroke="black" strokeWidth="4" />
                
                {/* Eye */}
                <circle cx="60" cy="35" r="14" fill="white" stroke="black" strokeWidth="4" />
                <circle cx="64" cy="35" r="5" fill="black" />
                
                {/* Beak */}
                <path d="M75 45 L95 45 L95 55 L85 65 L75 65 Z" fill="#f97316" stroke="black" strokeWidth="4" />
                
                {/* Wing (Front) */}
                <ellipse cx="35" cy="55" rx="18" ry="12" fill="white" stroke="black" strokeWidth="4" />
                
                {/* Highlights */}
                <path d="M25 25 Q 40 25 50 30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none" />
            </svg>
        </div>

        <div className="text-center space-y-4 relative z-20 -mt-6">
            <h1 className="text-6xl font-black text-white drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] stroke-black tracking-tight leading-tight">
            FLYING<br/>
            <span className="text-yellow-300">PLUMBER</span>
            </h1>
            <p className="text-white font-bold text-lg bg-black/20 inline-block px-4 py-1 rounded-full">It's-a time to fly!</p>
        </div>

        <Card className="transform rotate-1 mt-8">
            <div className="space-y-4">
                <div className="text-center text-slate-500 font-bold mb-2">
                    Start new adventure
                </div>
                <Button onClick={onLogin} className="mt-2 text-2xl py-6">START GAME</Button>
            </div>
        </Card>
      </div>
    </div>
  );
};

export const MainMenu = ({ onPlay, onNavigate, user }: { onPlay: () => void, onNavigate: (s: AppScreen) => void, user: UserProfile }) => {
  const [briefing, setBriefing] = useState<string>("Loading...");
  
  useEffect(() => {
      getMissionBriefing().then(setBriefing);
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 pb-12 pointer-events-none">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-full border-2 border-slate-200 shadow-md">
             <div className="w-12 h-12 rounded-full bg-red-500 border-2 border-white overflow-hidden shadow-inner">
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div>
                <div className="text-xs text-slate-500 font-black uppercase">Player 1</div>
                <div className="font-bold text-slate-800 text-lg leading-none">{user.username}</div>
             </div>
        </div>
        <div className="flex flex-col items-end gap-2">
             <div className="bg-yellow-400 p-2 px-4 rounded-full border-2 border-yellow-500 shadow-md flex items-center gap-2 text-yellow-900">
                <Trophy size={20} className="fill-current" />
                <span className="font-black text-lg">{user.highScore}</span>
             </div>
             <div className="bg-white p-2 px-4 rounded-full border-2 border-slate-200 shadow-sm flex items-center gap-2 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600"></div>
                <span className="font-black text-sm">{user.credits}</span>
             </div>
        </div>
      </div>

      {/* Briefing Text Bubble */}
      <div className="self-center text-center max-w-lg mb-8 animate-bounce">
         <div className="bg-white border-4 border-black text-black font-bold p-4 rounded-2xl relative shadow-lg">
            "{briefing}"
            <div className="absolute -bottom-3 left-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-black transform rotate-45 -translate-x-1/2"></div>
         </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto pointer-events-auto">
         <Button onClick={onPlay} variant="secondary" className="text-2xl py-6 shadow-[0_8px_0_#15803d]">
            <div className="flex items-center justify-center gap-3">
                <Play className="fill-current" size={32} /> PLAY GAME
            </div>
         </Button>
         
         <div className="grid grid-cols-2 gap-3">
             <Button variant="primary" onClick={() => onNavigate(AppScreen.SHOP)} className="!py-4 !px-2 flex flex-col items-center justify-center gap-1 text-sm shadow-[0_4px_0_#b91c1c] w-full">
                <ShoppingBag size={24} />SHOP
             </Button>

             <Button variant="neutral" onClick={() => onNavigate(AppScreen.SETTINGS)} className="!py-4 !px-2 flex flex-col items-center justify-center gap-1 text-sm shadow-[0_4px_0_#94a3b8] w-full">
                <Settings size={24} />SETTINGS
             </Button>
             
             {/* GLOWING DONATE BUTTON - Full Width Bottom */}
             <div className="col-span-2 relative group w-full h-full">
                <div className="absolute -inset-1 bg-purple-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-200 animate-[pulse_2s_infinite]"></div>
                <Button variant="premium" onClick={() => onNavigate(AppScreen.DONATE)} className="relative w-full h-full !py-4 !px-2 flex flex-col items-center justify-center gap-1 text-sm shadow-[0_4px_0_#6b21a8] border-purple-400">
                    <Heart size={24} fill="currentColor" className="animate-pulse" />DONATE
                </Button>
             </div>
         </div>
      </div>
    </div>
  );
};

export const HUD = ({ score, coins }: { score: number, coins: number }) => (
  <div className="absolute inset-0 z-30 pointer-events-none p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start mt-4">
        <div className="text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] stroke-black tracking-tight" style={{ WebkitTextStroke: '2px black' }}>
            {score}
        </div>
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/20">
             <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-inner"></div>
             <span className="text-2xl font-black text-white">{coins}</span>
        </div>
    </div>
    <div className="self-center mb-12 text-white font-bold text-xl drop-shadow-md animate-pulse">
        TAP TO JUMP!
    </div>
  </div>
);

export const GameOverScreen = ({ stats, onRestart, onHome }: { stats: GameStats, onRestart: () => void, onHome: () => void }) => {
  const [analysis, setAnalysis] = useState<string>("Asking Toad for advice...");

  useEffect(() => {
    getCrashAnalysis(stats).then(setAnalysis);
  }, [stats]);

  const handleShare = () => {
      // Short & Punchy Marketing Text
      const text = `FPV #FlappyBird in 3D! 🍄✈️ Can you beat my score of ${stats.score}? Play: ${window.location.href}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in zoom-in duration-300">
        <Card className="w-full max-w-md border-red-500 bg-white">
            <div className="text-center mb-6">
                <h2 className="text-5xl font-black text-red-500 uppercase tracking-tighter mb-2 drop-shadow-sm">Mama Mia!</h2>
                <div className="text-sm text-slate-500 font-bold uppercase">Game Over</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
                 <div className="bg-yellow-100 p-2 py-4 rounded-xl border-2 border-yellow-300 text-center">
                    <div className="text-yellow-700 text-[10px] font-bold uppercase">Score</div>
                    <div className="text-2xl font-black text-yellow-600">{stats.score}</div>
                 </div>
                 <div className="bg-blue-100 p-2 py-4 rounded-xl border-2 border-blue-300 text-center">
                    <div className="text-blue-700 text-[10px] font-bold uppercase">Distance</div>
                    <div className="text-2xl font-black text-blue-600">{stats.distance.toFixed(0)}m</div>
                 </div>
                 <div className="bg-green-100 p-2 py-4 rounded-xl border-2 border-green-300 text-center">
                    <div className="text-green-700 text-[10px] font-bold uppercase">Coins</div>
                    <div className="text-2xl font-black text-green-600">{stats.coins}</div>
                 </div>
            </div>

            {/* AI Analysis Section */}
            <div className="mb-6 bg-slate-100 p-4 rounded-xl border-l-4 border-red-500 relative">
                <div className="absolute -top-3 -right-2">
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-md">
                         <RefreshCw size={16} className="animate-spin-slow" />
                    </div>
                </div>
                <div className="text-xs font-black text-red-500 uppercase mb-2">
                    Toad Says:
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                    "{analysis}"
                </p>
            </div>

            <div className="space-y-3">
                <Button onClick={onRestart} variant="secondary" className="text-xl shadow-[0_6px_0_#15803d]">TRY AGAIN</Button>
                <div className="flex gap-3">
                     <Button variant="accent" onClick={onHome} className="flex-1 shadow-[0_6px_0_#ca8a04]">
                        <Home size={20} /> MENU
                     </Button>
                     <Button variant="neutral" onClick={handleShare} className="flex-1 shadow-[0_6px_0_#1e40af] bg-blue-500 border-blue-600 text-white hover:bg-blue-400">
                        <Share2 size={20} /> SHARE
                     </Button>
                </div>
            </div>
        </Card>
    </div>
  );
};

export const ShopScreen = ({ onBack, user }: { onBack: () => void, user: UserProfile }) => (
    <div className="absolute inset-0 z-50 bg-[#5c94fc] p-6 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-3 bg-white rounded-full text-slate-800 shadow-md hover:scale-110 transition-transform"><Home size={24}/></button>
                <h2 className="text-3xl font-black text-white drop-shadow-md">Item Shop</h2>
                <div className="ml-auto flex items-center gap-1 text-yellow-900 bg-yellow-400 px-4 py-2 rounded-full shadow-md border-2 border-yellow-500">
                    <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                    <span className="font-black text-lg">{user.credits}</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 space-y-6">
                 {/* Power Ups */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-700 uppercase">Power-Ups</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                                <Heart size={32} fill="currentColor" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-800">Extra Life</div>
                                <div className="text-xs text-slate-500">Continue after crashing</div>
                            </div>
                            <Button variant="accent" className="!w-auto !py-2 !px-4 text-xs shadow-none border-0">
                                50 Coins
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                             <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-500">
                                <Star size={32} fill="currentColor" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-800">Invincibility</div>
                                <div className="text-xs text-slate-500">Fly through pipes for 5s</div>
                            </div>
                            <Button variant="accent" className="!w-auto !py-2 !px-4 text-xs shadow-none border-0">
                                100 Coins
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SettingsScreen = ({ onBack, settings, onUpdateSettings }: { onBack: () => void, settings: AppSettings, onUpdateSettings: (s: AppSettings) => void }) => {
    const toggle = (key: keyof AppSettings) => {
        onUpdateSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="absolute inset-0 z-50 bg-[#5c94fc] p-6 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-6">
                 <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-3 bg-white rounded-full text-slate-800 shadow-md hover:scale-110 transition-transform"><ArrowLeft size={24}/></button>
                    <h2 className="text-3xl font-black text-white drop-shadow-md">Settings</h2>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 space-y-6">
                    {/* Volume */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-700 uppercase border-b-2 border-slate-100 pb-2">Audio</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-700 font-bold">
                                {settings.musicVolume ? <Volume2 /> : <VolumeX />} Music
                            </div>
                            <div onClick={() => toggle('musicVolume')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${settings.musicVolume ? 'bg-green-500' : 'bg-slate-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.musicVolume ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-700 font-bold">
                                <Zap size={24} /> SFX
                            </div>
                            <div onClick={() => toggle('sfxVolume')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${settings.sfxVolume ? 'bg-green-500' : 'bg-slate-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.sfxVolume ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                    </div>

                    {/* Graphics */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-700 uppercase border-b-2 border-slate-100 pb-2">Graphics</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-700 font-bold">
                                {settings.highQuality ? <Sun /> : <Moon />} High Quality (Shadows)
                            </div>
                            <div onClick={() => toggle('highQuality')} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${settings.highQuality ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${settings.highQuality ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 <div className="text-center text-white/60 font-bold text-sm">
                    Flying Plumber v1.1
                </div>
            </div>
        </div>
    );
};

export const DonationScreen = ({ onBack, onDonate, user }: { onBack: () => void, onDonate: (amount: number) => void, user: UserProfile }) => {
    const [customAmount, setCustomAmount] = useState<string>('');
    const [waitingForPayment, setWaitingForPayment] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    // --- CONFIGURATION START ---
    const RECEIVER_UPI_ID = 'choppabhargav95@okhdfcbank'; 
    const RECEIVER_NAME = 'Super Plumber Dev';
    // Exchange rate to convert USD input to INR for payment logic
    const USD_TO_INR = 87.00;
    
    // REPLACE THIS WITH YOUR ACTUAL PAYPAL.ME LINK for international support
    const INTERNATIONAL_LINK = 'https://paypal.me/choppabhargav'; 
    // --- CONFIGURATION END ---

    const getAmountUSD = () => {
        const amt = parseFloat(customAmount || '5');
        return (amt && !isNaN(amt) && amt > 0) ? amt : 5;
    }

    const currentAmountUSD = getAmountUSD();
    const currentAmountINR = currentAmountUSD * USD_TO_INR;

    // Use 'am' for amount, 'cu' for Currency (INR)
    
    // Generic UPI URL for QR Code (compatible with all apps)
    const upiUrl = `upi://pay?pa=${RECEIVER_UPI_ID}&pn=${encodeURIComponent(RECEIVER_NAME)}&am=${currentAmountINR.toFixed(2)}&cu=INR`;
    
    // Google Pay (Tez) Specific URL for button (Prioritizes GPay app)
    const gpayUrl = `tez://upi/pay?pa=${RECEIVER_UPI_ID}&pn=${encodeURIComponent(RECEIVER_NAME)}&am=${currentAmountINR.toFixed(2)}&cu=INR`;
    
    // Generate QR Code URL using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

    const handleGPay = () => {
        if (!customAmount && !window.confirm(`Donate $${currentAmountUSD} (approx ₹${currentAmountINR.toFixed(0)})?`)) return;
        
        // Attempt to open the app using location.href to strictly follow the deep link
        // logic on mobile devices and prioritize Google Pay.
        window.location.href = gpayUrl;
        
        // Show confirmation UI instead of triggering onDonate immediately
        // This prevents the "Thank you" logic from interrupting the app switch
        setWaitingForPayment(true);
    };

    const handlePaymentConfirmation = () => {
        onDonate(currentAmountUSD);
        setWaitingForPayment(false);
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 5000);
    };

    return (
    <div className="absolute inset-0 z-50 bg-[#5c94fc] p-6 overflow-y-auto">
         <div className="max-w-md mx-auto space-y-6">
             <div className="flex items-center gap-4 mb-4">
                <button onClick={onBack} className="p-3 bg-white rounded-full text-slate-800 shadow-md hover:scale-110 transition-transform"><ArrowLeft size={24}/></button>
                <h2 className="text-3xl font-black text-white drop-shadow-md">Donate</h2>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 text-center space-y-6 relative">
                
                {/* Thank You Overlay */}
                {showThankYou && (
                    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur flex flex-col items-center justify-center p-6 rounded-3xl animate-in zoom-in duration-300">
                         <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 border-4 border-green-200">
                            <CheckCircle size={64} className="text-green-500" />
                         </div>
                         <h3 className="text-2xl font-black text-slate-800 mb-2">Thank You!</h3>
                         <p className="text-slate-500 font-medium text-center mb-6">Your support helps build better AI education tools.</p>
                         <Button onClick={() => setShowThankYou(false)} variant="secondary">Awesome!</Button>
                    </div>
                )}

                <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-100">
                    <h3 className="text-purple-900 font-black text-lg mb-1">Fuel the Future of AI</h3>
                    <p className="text-purple-700/80 text-sm leading-relaxed">
                        Your donation directly supports the development of <span className="font-bold">Open Source AI Tools</span> and free <span className="font-bold">Student Education</span> resources.
                    </p>
                    
                     <div className="flex gap-2 mt-4 justify-center">
                        <div className="bg-white p-2 px-3 rounded-lg shadow-sm flex items-center gap-2 text-xs font-bold text-slate-600">
                            <GraduationCap size={16} className="text-purple-500"/> Education
                        </div>
                        <div className="bg-white p-2 px-3 rounded-lg shadow-sm flex items-center gap-2 text-xs font-bold text-slate-600">
                             <Cpu size={16} className="text-purple-500"/> R&D
                        </div>
                    </div>
                </div>

                {/* Amount Selection */}
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 5, 10, 20].map(amount => (
                            <button 
                                key={amount}
                                onClick={() => setCustomAmount(amount.toString())}
                                className={`p-3 rounded-xl font-black text-lg transition-all border-2 ${customAmount === amount.toString() ? 'bg-purple-500 border-purple-600 text-white shadow-md scale-105' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">$</span>
                        <input 
                            type="number" 
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Custom Amount"
                            className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 focus:outline-none focus:border-purple-500 transition-colors bg-slate-50"
                        />
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                        (Approx. ₹{currentAmountINR.toFixed(2)} INR)
                    </div>
                </div>
                
                {/* QR Code Section for Desktop */}
                <div className="hidden md:block bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-inner">
                     <div className="text-xs font-black text-slate-400 uppercase mb-2">Scan to Pay (UPI)</div>
                     <div className="flex justify-center">
                        <img src={qrCodeUrl} alt="Payment QR" className="w-32 h-32 mix-blend-multiply opacity-90" />
                     </div>
                </div>

                {/* Payment Actions */}
                <div className="space-y-3">
                     {!waitingForPayment ? (
                        <Button onClick={handleGPay} variant="gpay" className="py-4 shadow-[0_6px_0_#1e293b]">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-black">G</span>
                                </div>
                                <span>Pay with GPay</span>
                            </div>
                        </Button>
                     ) : (
                         <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                             <div className="text-sm font-bold text-slate-600 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                                 Check your GPay app to complete the transaction.
                             </div>
                             <Button onClick={handlePaymentConfirmation} variant="secondary">
                                 <CheckCircle size={20} className="mr-2"/> I have completed payment
                             </Button>
                             <button onClick={() => setWaitingForPayment(false)} className="text-xs text-slate-400 font-bold hover:text-slate-600 underline">
                                 Cancel
                             </button>
                         </div>
                     )}
                     
                     <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                         Scan with GPay, Paytm, or PhonePe
                     </div>

                    {/* International Section */}
                    <div className="pt-4 border-t-2 border-slate-100">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Globe size={16} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase">International?</span>
                        </div>
                        <Button 
                            variant="neutral" 
                            className="!py-3 text-sm flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                            onClick={() => window.open(INTERNATIONAL_LINK, '_blank')}
                        >
                            <CreditCard size={16}/> Pay via PayPal / Card
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};
