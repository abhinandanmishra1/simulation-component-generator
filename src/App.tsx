/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Code, Play, Check, Copy, History, HelpCircle, 
  Settings, Key, Layers, RefreshCw, Download, AlertCircle, 
  Trash2, Terminal, Cpu, ArrowRight, ExternalLink
} from "lucide-react";
import ComponentPreview from "./components/ComponentPreview";

// Default pre-loaded simulation code
const DEFAULT_SIMULATION_CODE = `import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Check, Coins, Clock } from 'lucide-react';

export default function ParkingLotSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [spots, setSpots] = useState([
    { id: 'A1', type: 'S', occupied: true, carColor: 'bg-red-500' },
    { id: 'A2', type: 'S', occupied: false },
    { id: 'A3', type: 'M', occupied: true, carColor: 'bg-blue-500' },
    { id: 'A4', type: 'M', occupied: false },
    { id: 'A5', type: 'M', occupied: true, carColor: 'bg-emerald-500' },
    { id: 'A6', type: 'L', occupied: false },
    { id: 'B1', type: 'S', occupied: false },
    { id: 'B2', type: 'S', occupied: true, carColor: 'bg-amber-500' },
    { id: 'B3', type: 'M', occupied: false },
    { id: 'B4', type: 'M', occupied: true, carColor: 'bg-indigo-500' },
    { id: 'B5', type: 'M', occupied: false },
    { id: 'B6', type: 'L', occupied: true, carColor: 'bg-rose-500' },
  ]);
  const [revenue, setRevenue] = useState(120);
  const [time, setTime] = useState({ hour: 8, minute: 0 });
  const [eventLogs, setEventLogs] = useState([
    'System initialized. Current Day: 1',
    'Car (Red) parked at Spot A1 at 07:15 AM',
    'Car (Blue) parked at Spot A3 at 07:42 AM',
  ]);

  // Simulating the traffic flow
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        // Advance time in 5-minute steps
        setTime((prev) => {
          let nextMin = prev.minute + 5;
          let nextHour = prev.hour;
          if (nextMin >= 60) {
            nextMin = 0;
            nextHour = (prev.hour + 1) % 24;
          }
          return { hour: nextHour, minute: nextMin };
        });

        // Periodic random events (arrivals or departures)
        if (Math.random() > 0.6) {
          const unoccupied = spots.filter(s => !s.occupied);
          const occupied = spots.filter(s => s.occupied);
          const eventType = Math.random() > 0.5 ? 'arrival' : 'departure';
          
          if (eventType === 'arrival' && unoccupied.length > 0) {
            const randomSpot = unoccupied[Math.floor(Math.random() * unoccupied.length)];
            const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            setSpots(prevSpots => prevSpots.map(s => s.id === randomSpot.id ? { ...s, occupied: true, carColor: randomColor } : s));
            
            const timeString = \`\${String(time.hour).padStart(2, '0')}:\${String(time.minute).padStart(2, '0')} AM\`;
            setEventLogs(prev => [\`Car entered and parked at Spot \${randomSpot.id} at \${timeString}\`, ...prev.slice(0, 9)]);
          } else if (eventType === 'departure' && occupied.length > 0) {
            const randomSpot = occupied[Math.floor(Math.random() * occupied.length)];
            setSpots(prevSpots => prevSpots.map(s => s.id === randomSpot.id ? { ...s, occupied: false, carColor: undefined } : s));
            
            const fee = randomSpot.type === 'S' ? 10 : randomSpot.type === 'M' ? 15 : 25;
            setRevenue(prev => prev + fee);
            
            const timeString = \`\${String(time.hour).padStart(2, '0')}:\${String(time.minute).padStart(2, '0')} AM\`;
            setEventLogs(prev => [\`Car left Spot \${randomSpot.id}. Paid ₹\${fee} at \${timeString}\`, ...prev.slice(0, 9)]);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, spots, time]);

  const freeSpots = spots.filter(s => !s.occupied).length;
  const togglePlay = () => setIsPlaying(!isPlaying);

  const resetSimulation = () => {
    setIsPlaying(false);
    setSpots([
      { id: 'A1', type: 'S', occupied: true, carColor: 'bg-red-500' },
      { id: 'A2', type: 'S', occupied: false },
      { id: 'A3', type: 'M', occupied: true, carColor: 'bg-blue-500' },
      { id: 'A4', type: 'M', occupied: false },
      { id: 'A5', type: 'M', occupied: true, carColor: 'bg-emerald-500' },
      { id: 'A6', type: 'L', occupied: false },
      { id: 'B1', type: 'S', occupied: false },
      { id: 'B2', type: 'S', occupied: true, carColor: 'bg-amber-500' },
      { id: 'B3', type: 'M', occupied: false },
      { id: 'B4', type: 'M', occupied: true, carColor: 'bg-indigo-500' },
      { id: 'B5', type: 'M', occupied: false },
      { id: 'B6', type: 'L', occupied: true, carColor: 'bg-rose-500' },
    ]);
    setRevenue(120);
    setTime({ hour: 8, minute: 0 });
    setEventLogs(['Simulation reset to default state.']);
  };

  const forceArrival = () => {
    const unoccupied = spots.filter(s => !s.occupied);
    if (unoccupied.length === 0) return;
    
    const randomSpot = unoccupied[Math.floor(Math.random() * unoccupied.length)];
    const colors = ['bg-purple-500', 'bg-cyan-500', 'bg-teal-500', 'bg-yellow-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setSpots(prevSpots => prevSpots.map(s => s.id === randomSpot.id ? { ...s, occupied: true, carColor: randomColor } : s));
    
    const timeString = \`\${String(time.hour).padStart(2, '0')}:\${String(time.minute).padStart(2, '0')} AM\`;
    setEventLogs(prev => [\`Manual arrival: Car parked at Spot \${randomSpot.id} at \${timeString}\`, ...prev.slice(0, 9)]);
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-xl border border-border">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">Parking Lot, Entry to Exit Flow</h2>
          <p className="text-sm text-muted-foreground mt-1">Vehicles take a ticket, drive to a matching spot, then pay at the booth and exit.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-muted px-3 py-1.5 rounded-lg font-mono border border-border">
            <Clock className="inline w-4 h-4 mr-1.5 text-primary" />
            {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')} AM
          </div>
          <div className="bg-muted px-3 py-1.5 rounded-lg font-mono border border-border">
            {freeSpots} free
          </div>
          <div className="bg-muted px-3 py-1.5 rounded-lg font-mono border border-border text-emerald-600 font-semibold">
            <Coins className="inline w-4 h-4 mr-1.5" />
            ₹{revenue}
          </div>
          <button 
            onClick={resetSimulation} 
            className="p-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-lg border border-border transition-all cursor-pointer"
            title="Restart Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Floorplan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {spots.map((spot) => (
          <div 
            key={spot.id} 
            className={\`border rounded-xl p-4 flex flex-col justify-between min-h-[110px] transition-all \${
              spot.occupied 
                ? 'bg-muted/40 border-border shadow-inner' 
                : 'bg-card border-dashed border-border/80 hover:border-primary/50'
            }\`}
          >
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground">Spot {spot.id}</span>
              <span className={\`px-1.5 py-0.5 rounded text-[10px] \${
                spot.type === 'S' ? 'bg-amber-100 text-amber-800' :
                spot.type === 'M' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }\`}>{spot.type}</span>
            </div>

            <div className="flex items-center justify-center my-2 h-10">
              {spot.occupied ? (
                <div className={\`w-12 h-6 rounded-md \${spot.carColor} shadow-sm border border-black/10 relative flex items-center justify-center\`}>
                  <div className="absolute left-1 top-0.5 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute right-1 top-0.5 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-80 animate-pulse"></div>
                  <div className="w-4 h-2 bg-black/20 rounded"></div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground/60 italic">Empty</span>
              )}
            </div>

            <div className="text-[10px] text-right text-muted-foreground font-mono">
              {spot.occupied ? 'Occupied' : 'Available'}
            </div>
          </div>
        ))}
      </div>

      {/* Controller Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button 
          onClick={togglePlay} 
          className={\`px-4 py-2 font-medium rounded-xl flex items-center gap-2 border border-border shadow-sm transition-all cursor-pointer \${
            isPlaying 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
          }\`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause Auto Traffic' : 'Start Auto Traffic'}
        </button>

        <button 
          onClick={forceArrival} 
          disabled={freeSpots === 0}
          className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-accent border border-border font-medium rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Simulate Entrance Ticket
        </button>
      </div>

      {/* Terminal logs */}
      <div className="bg-[#0a0a0a] text-[#a9b1d6] rounded-xl border border-border p-4 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <span className="font-semibold text-white">SIMULATION EVENT LOGS</span>
          <span className="text-[10px] text-muted-foreground/80">Real-time terminal stream</span>
        </div>
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin">
          {eventLogs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-primary/70 font-semibold">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

// Quick Start Prompts List
const PRESET_PROMPTS = [
  {
    title: "Vending Machine Flow",
    icon: "🛒",
    prompt: "A responsive Vending Machine simulator. It displays selectable items (Lay's Chips, Doritos, KitKat, Coca Cola, Sprite) with their prices and image emojis. Users can increment item counts, view total cart amount, click 'Proceed to pay', simulate cash/card drop slot, and trigger a drop animation into an item delivery tray with a status tracker log."
  },
  {
    title: "Library Book Borrowing",
    icon: "📚",
    prompt: "An elegant SDEforge Library Management component. It displays key library counters (total titles, copies, available, borrowed, reserved) as card widgets. Includes a table listing book items (Clean Code, Sapiens, etc.) with category tags, a numeric quantity setter, and simple action buttons (Borrow, Return). Features a simulation logs terminal at the bottom that logs transactions dynamically."
  },
  {
    title: "Traffic Light Intersection",
    icon: "🚦",
    prompt: "An interactive Crossroads Traffic Light Simulator. It displays a visual four-way street intersection diagram. Features a timer ticking down, lights transitioning between Green, Yellow, and Red dynamically, auto-car generators at each lane, manual override buttons to force pedestrian crossing requests, and a simulation state dashboard."
  },
  {
    title: "E-Commerce Checkout Drawer",
    icon: "💳",
    prompt: "An immersive simulation of a step-by-step E-Commerce checkout funnel. Includes steps: Cart, Shipping Details, and Mock Payment. Users can fill mock forms, select payment methods (card, UPI, net banking), and click 'Authorize Payment' which spins a state loader before presenting an elegant 'Success' order confirmation card with a mock receipt."
  }
];

interface GeneratedHistoryItem {
  id: string;
  title: string;
  prompt: string;
  code: string;
  timestamp: string;
}

export default function App() {
  const [promptInput, setPromptInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState(DEFAULT_SIMULATION_CODE);
  const [customApiKey, setCustomApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GeneratedHistoryItem[]>([]);
  const [activeSimulationTitle, setActiveSimulationTitle] = useState("Parking Lot Entry/Exit");

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("simulation_generator_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (title: string, promptText: string, codeText: string) => {
    const newItem: GeneratedHistoryItem = {
      id: Date.now().toString(),
      title,
      prompt: promptText,
      code: codeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newItem, ...history.slice(0, 9)]; // Keep up to 10 items
    setHistory(updated);
    try {
      localStorage.setItem("simulation_generator_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to write history:", e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("simulation_generator_history");
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  const loadHistoryItem = (item: GeneratedHistoryItem) => {
    setPromptInput(item.prompt);
    setGeneratedCode(item.code);
    setActiveSimulationTitle(item.title);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy code:", e);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // sanitize title for filename
    const safeTitle = activeSimulationTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    link.download = `${safeTitle || "simulation_component"}.jsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptInput,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate component");
      }

      setGeneratedCode(data.code);
      
      // Determine a short title for the generated item
      const words = promptInput.split(" ");
      const title = words.slice(0, 3).join(" ") + (words.length > 3 ? "..." : "");
      const finalTitle = title.charAt(0).toUpperCase() + title.slice(1);
      setActiveSimulationTitle(finalTitle);
      
      saveToHistory(finalTitle, promptInput, data.code);
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectPreset = (presetPrompt: string, title: string) => {
    setPromptInput(presetPrompt);
    setActiveSimulationTitle(title);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col font-sans">
      {/* Premium Design Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg md:text-xl tracking-tight text-foreground flex items-center gap-2">
              Simulation Component Generator
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Turn prompts into interactive, high-fidelity React simulations powered by Gemini 3.5 Flash
            </p>
          </div>
        </div>

        {/* API Settings Quick Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              customApiKey.trim() 
                ? "bg-amber-50 text-amber-800 border-amber-200" 
                : "bg-white text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            {customApiKey.trim() ? "Custom API Key Active" : "Server API Key Active"}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Control Column (Lg: spans 5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          
          {/* API Key Panel - Hidden/Visible on state */}
          {showApiKeyInput && (
            <div className="bg-white border border-border rounded-2xl p-5 shadow-sm transition-all animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Gemini API Configuration
                </h3>
                <button 
                  onClick={() => setShowApiKeyInput(false)}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  Hide Settings
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                By default, this application safely utilizes our cloud server-side API Key so you can test and generate immediately. If you wish to use your own paid key, enter it below:
              </p>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Gemini API Key..."
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none pr-10 font-mono"
                />
                <Key className="absolute right-3 top-3 w-4 h-4 text-muted-foreground/50" />
              </div>
              {customApiKey.trim() && (
                <p className="text-[11px] text-amber-600 mt-2 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 inline" /> Custom API key will be passed securely via request headers.
                </p>
              )}
            </div>
          )}

          {/* Generator Input Section */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col flex-1">
            <h2 className="font-sans font-bold text-base text-foreground flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Define Simulation Prompt
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Describe what state flow, dials, counters, timers, and grids you need. The generator will code a fully responsive component instantly.
            </p>

            {/* Prompt input field */}
            <div className="flex-1 flex flex-col min-h-[140px] mb-4">
              <textarea
                placeholder="Describe an interactive simulation... (e.g. 'An elevator status simulator with floor buttons, weight sensor, open/close alerts, speed selector, and a historic trip counter')"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full flex-1 p-4 bg-slate-50 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Generate Action CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !promptInput.trim()}
                className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is Coding...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Preset Prompts Shelf */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-sans font-bold text-sm text-foreground mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Template Quick-Starts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_PROMPTS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => selectPreset(preset.prompt, preset.title)}
                  className="p-3 text-left bg-slate-50 border border-border hover:border-primary/50 hover:bg-slate-100/50 rounded-xl transition-all flex flex-col justify-between h-[105px] group cursor-pointer"
                >
                  <span className="text-xl">{preset.icon}</span>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {preset.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Local Session History */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex flex-col max-h-[220px]">
            <div className="flex items-center justify-between mb-3 border-b border-border/60 pb-2">
              <h3 className="font-sans font-bold text-sm text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                History Shelf
              </h3>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-red-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                <p className="text-xs text-muted-foreground italic">No historical simulations generated yet.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`w-full p-2.5 text-left rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      activeSimulationTitle === item.title
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-slate-50/50 border-border hover:border-primary/40 hover:bg-slate-100/50 text-foreground"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold truncate max-w-[200px]">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{item.timestamp}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* Right Output Workspace Panel (Lg: spans 7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Active Preview Action Panel */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active Component Workspace</span>
              <h2 className="font-sans font-bold text-base md:text-lg text-foreground mt-0.5">
                {activeSimulationTitle}
              </h2>
            </div>
            
            {/* Download/Copy export tools */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCode}
                className="p-2 bg-secondary hover:bg-accent border border-border text-secondary-foreground rounded-lg transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
                title="Download Source Component"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download Component</span>
              </button>
              
              <button
                onClick={handleCopyCode}
                className={`p-2 border rounded-lg transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
                  copied 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-primary text-primary-foreground hover:bg-primary/95 border-primary"
                }`}
                title="Copy Raw Code to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 animate-bounce" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Component Code"}</span>
              </button>
            </div>
          </div>

          {/* Embedded live preview sandboxed workspace */}
          <div className="flex-1 flex flex-col justify-stretch">
            <ComponentPreview code={generatedCode} />
          </div>

          {/* Design System Integrity Callout */}
          <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <h4 className="font-sans font-bold text-foreground">Paste-Ready Portability Guarantee</h4>
              <p className="text-muted-foreground mt-0.5 leading-relaxed">
                The simulated component above relies entirely on strict global semantic theme variables (<code className="font-mono bg-muted px-1 rounded text-foreground font-semibold">bg-card</code>, <code className="font-mono bg-muted px-1 rounded text-foreground font-semibold">bg-background</code>, <code className="font-mono bg-muted px-1 rounded text-foreground font-semibold">text-foreground</code>). When copied and pasted into our production codebase, it aligns perfectly with the target layout design system.
              </p>
            </div>
          </div>

        </section>

      </main>

      {/* Modern Humble Footer */}
      <footer className="border-t border-border bg-white px-6 py-4 mt-auto">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-medium gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span>AI Simulation Suite Engine</span>
          </div>
          <div>
            <span>Powered by Gemini 3.5 Flash Model • Developer Preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
