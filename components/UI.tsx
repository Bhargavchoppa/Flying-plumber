import React, { useState, useEffect } from 'react';
import { AppScreen, GameStats, UserProfile, AppSettings } from '../types';
import { Play, Home, RefreshCw, Trophy, ShoppingBag, User, Settings, Star, Heart, Volume2, VolumeX, Moon, Sun, ArrowLeft, Smartphone, CreditCard, Globe, Zap, GraduationCap, Cpu, CheckCircle } from 'lucide-react';
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

export const DonationScreen = ({ onBack, onDonate, user }: { onBack: () => void, onDonate: (amount: number) => void, user: UserProfile }) => {
    const [customAmount, setCustomAmount] = useState<string>('');
    const [waitingForPayment, setWaitingForPayment] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    // --- CONFIGURATION START ---
    const RECEIVER_UPI_ID = 'choppabhargav95@okhdfcbank'; 
    const RECEIVER_NAME = 'Super Plumber Dev';
    
    // REPLACE THIS WITH YOUR ACTUAL PAYPAL.ME LINK for international support
    const INTERNATIONAL_LINK = 'https://paypal.me/choppabhargav'; 
    // --- CONFIGURATION END ---

    const getAmount = () => {
        const amt = parseFloat(customAmount || '5');
        return (amt && !isNaN(amt) && amt > 0) ? amt : 5;
    }

    const currentAmount = getAmount();
    // Use 'am' for amount, 'cu' for Currency (INR)
    
    // Generic UPI URL for QR Code (compatible with all apps)
    const upiUrl = `upi://pay?pa=${RECEIVER_UPI_ID}&pn=${encodeURIComponent(RECEIVER_NAME)}&am=${currentAmount.toFixed(2)}&cu=INR`;
    
    // Google Pay (Tez) Specific URL for button (Prioritizes GPay app)
    const gpayUrl = `tez://upi/pay?pa=${RECEIVER_UPI_ID}&pn=${encodeURIComponent(RECEIVER_NAME)}&am=${currentAmount.toFixed(2)}&cu=INR`;
    
    // Generate QR Code URL using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

    const handleGPay = () => {
        if (!customAmount && !window.confirm(`Donate $${currentAmount}?`)) return;
        
        // Attempt to open the app using location.href to strictly follow the deep link
        // logic on mobile devices and prioritize Google Pay.
        window.location.href = gpayUrl;
        
        // Show confirmation UI instead of triggering onDonate immediately
        // This prevents the "Thank you" logic from interrupting the app switch
        setWaitingForPayment(true);
    };

    const handlePaymentConfirmation = () => {
        onDonate(currentAmount);
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
                         <h3 className="text-3xl font-black text-slate-800 mb-2">Thank You!</h3>
                         <p className="text-slate-500 font-medium">You are a legend!</p>
                    </div>
                )}

                {/* Header Mission */}
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute top-10 -left-10 w-24 h-24 bg-yellow-400 opacity-20 rounded-full blur-xl"></div>
                    
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                        <Zap size={32} fill="currentColor" className="text-yellow-300" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 leading-tight">Fuel the Future of AI</h3>
                    <p className="text-purple-100 text-xs font-bold uppercase tracking-wide opacity-90">
                        Become a Patron of Innovation
                    </p>
                </div>

                {/* Impact Info */}
                <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col gap-2">
                         <div className="p-2 bg-blue-100 w-fit rounded-lg text-blue-600">
                             <GraduationCap size={20} />
                         </div>
                         <div>
                             <div className="font-bold text-slate-800 text-sm">Education</div>
                             <div className="text-[10px] text-slate-500 leading-tight">Creating free AI tools for students.</div>
                         </div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col gap-2">
                         <div className="p-2 bg-emerald-100 w-fit rounded-lg text-emerald-600">
                             <Cpu size={20} />
                         </div>
                         <div>
                             <div className="font-bold text-slate-800 text-sm">Open Source</div>
                             <div className="text-[10px] text-slate-500 leading-tight">Advancing public AI research.</div>
                         </div>
                    </div>
                </div>

                {/* Amount Selector */}
                <div className="grid grid-cols-4 gap-2">
                    {[1, 5, 10, 20].map((amount) => (
                        <button 
                            key={amount}
                            onClick={() => setCustomAmount(amount.toString())}
                            className={`group relative overflow-hidden border-2 p-2 rounded-xl transition-all transform hover:scale-105 active:scale-95 ${customAmount === amount.toString() ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white'}`}
                        >
                            <div className={`text-xl font-black transition-colors ${customAmount === amount.toString() ? 'text-purple-500' : 'text-slate-400'}`}>${amount}</div>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                        <input 
                            type="number" 
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Custom Amount"
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 pl-10 text-2xl font-black text-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-center"
                        />
                    </div>
                    
                    {waitingForPayment ? (
                         <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 animate-in fade-in duration-300">
                            <p className="text-sm font-bold text-slate-600 mb-3">Checking for payment...</p>
                            <div className="space-y-2">
                                <Button variant="secondary" onClick={handlePaymentConfirmation} className="shadow-[0_4px_0_#15803d]">
                                    I have sent ${currentAmount}
                                </Button>
                                <button onClick={() => setWaitingForPayment(false)} className="text-xs text-slate-400 font-bold underline py-2">
                                    Cancel
                                </button>
                            </div>
                         </div>
                    ) : (
                        <Button variant="gpay" onClick={handleGPay} className="flex items-center justify-center gap-2 shadow-[0_6px_0_#1e293b]">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-lg tracking-tight">G</span>
                                <span className="font-bold text-lg tracking-tight text-blue-400">Pay</span>
                            </div>
                            <span className="text-sm font-medium text-slate-400 border-l border-slate-700 pl-3 ml-1">Donate ${currentAmount.toFixed(2)}</span>
                        </Button>
                    )}
                </div>

                {/* QR CODE SECTION */}
                <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-10">
                         <Smartphone size={100} />
                     </div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-3 relative z-10">
                        Playing on Desktop?
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 inline-block shadow-sm relative z-10">
                        <img src={qrCodeUrl} alt="Payment QR" className="w-32 h-32 object-contain" />
                    </div>
                    <div className="text-[10px] text-slate-800 font-black mt-3 uppercase tracking-wide relative z-10">
                        Scan with GPay, Paytm, or any UPI App
                    </div>
                </div>

                {/* INTERNATIONAL SECTION */}
                <div className="pt-2">
                     <div className="flex items-center gap-4 my-4">
                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                        <span className="font-black text-slate-800 uppercase">OR SCAN QR ABOVE</span>
                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                     </div>
                     <div className="flex items-center gap-4 my-4">
                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                        <span className="text-xs font-bold text-slate-300 uppercase">International</span>
                        <div className="h-0.5 bg-slate-100 flex-1"></div>
                     </div>
                     <Button variant="neutral" onClick={() => window.open(INTERNATIONAL_LINK, '_blank')} className="flex items-center justify-center gap-2 shadow-[0_4px_0_#94a3b8] !py-3">
                        <Globe size={20} />
                        <span className="text-sm">Support via PayPal / Card</span>
                     </Button>
                </div>

                {user.isDonor && (
                    <div className="bg-yellow-100 p-4 rounded-xl border-2 border-yellow-300 animate-bounce">
                        <div className="flex items-center justify-center gap-2 text-yellow-700 font-black text-sm mb-1">
                             <Star size={18} fill="currentColor" />
                             <span>HERO OF THE FUTURE!</span>
                             <Star size={18} fill="currentColor" />
                        </div>
                        <div className="text-xs text-yellow-600 font-medium">
                            Thank you for empowering our AI research!
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
    );
}

export const SettingsScreen = ({ onBack, settings, onUpdateSettings }: { onBack: () => void, settings: AppSettings, onUpdateSettings: (s: AppSettings) => void }) => {
    
    const toggle = (key: keyof AppSettings) => {
        onUpdateSettings({
            ...settings,
            [key]: !settings[key as any]
        });
    };

    return (
        <div className="absolute inset-0 z-50 bg-[#5c94fc] p-6 overflow-y-auto">
             <div className="max-w-md mx-auto space-y-6">
                 <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-3 bg-white rounded-full text-slate-800 shadow-md hover:scale-110 transition-transform"><ArrowLeft size={24}/></button>
                    <h2 className="text-3xl font-black text-white drop-shadow-md">Settings</h2>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-100 space-y-6">
                    
                    {/* Audio Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-slate-700 uppercase border-b-2 border-slate-100 pb-2">Audio</h3>
                        
                        <div className="flex items-center justify-between p-2">
                             <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${settings.musicVolume ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {settings.musicVolume ? <Volume2 size={24}/> : <VolumeX size={24}/>}
                                 </div>
                                 <span className="font-bold text-slate-700 text-lg">Music</span>
                             </div>
                             <button onClick={() => toggle('musicVolume')} className={`w-14 h-8 rounded-full transition-colors relative ${settings.musicVolume ? 'bg-green-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${settings.musicVolume ? 'left-7' : 'left-1'}`}></div>
                             </button>
                        </div>

                        <div className="flex items-center justify-between p-2">
                             <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${settings.sfxVolume ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Trophy size={24}/> 
                                 </div>
                                 <span className="font-bold text-slate-700 text-lg">Sound FX</span>
                             </div>
                             <button onClick={() => toggle('sfxVolume')} className={`w-14 h-8 rounded-full transition-colors relative ${settings.sfxVolume ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${settings.sfxVolume ? 'left-7' : 'left-1'}`}></div>
                             </button>
                        </div>
                    </div>

                    {/* Gameplay Section */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-black text-slate-700 uppercase border-b-2 border-slate-100 pb-2">Gameplay</h3>
                        
                        <div className="flex items-center justify-between p-2 pt-4">
                             <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-lg ${settings.highQuality ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {settings.highQuality ? <Sun size={24}/> : <Moon size={24}/>}
                                 </div>
                                 <span className="font-bold text-slate-700 text-lg">High Quality</span>
                             </div>
                             <button onClick={() => toggle('highQuality')} className={`w-14 h-8 rounded-full transition-colors relative ${settings.highQuality ? 'bg-yellow-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${settings.highQuality ? 'left-7' : 'left-1'}`}></div>
                             </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t-2 border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase">Flying Plumber v1.1</p>
                    </div>

                </div>
             </div>
        </div>
    )
}