const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('terminal_questions_compiled.json', 'utf8'));

// Build HTML content
const html = `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>🐧 Linux Commands Lab Quiz 1: Interactive Terminal Simulator (58 Questions)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Fira+Code:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Sarabun', 'system-ui', 'sans-serif'],
            heading: ['Chakra Petch', 'sans-serif'],
            mono: ['"Fira Code"', 'Ubuntu Mono', 'Consolas', 'monospace']
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --term-bg-outer: #1e0517;
      --term-bg: #300a24;
      --term-text: #ffffff;
      --term-prompt-user: #4af626;
      --term-prompt-host: #4af626;
      --term-prompt-path: #729fcf;
      --term-prompt-symbol: #ffffff;
      --term-accent: #e95420;
      --term-border: #5e2750;
      --term-selection: rgba(233, 84, 32, 0.4);
      --term-glow: transparent;
    }

    body.theme-matrix {
      --term-bg-outer: #030804;
      --term-bg: #051208;
      --term-text: #22ff66;
      --term-prompt-user: #00ff55;
      --term-prompt-host: #00ff55;
      --term-prompt-path: #00aa44;
      --term-prompt-symbol: #22ff66;
      --term-accent: #00ff55;
      --term-border: #0d3818;
      --term-selection: rgba(0, 255, 85, 0.3);
      --term-glow: 0 0 10px rgba(0, 255, 85, 0.35);
    }

    body.theme-amber {
      --term-bg-outer: #0d0800;
      --term-bg: #160d00;
      --term-text: #ffb300;
      --term-prompt-user: #ffcc33;
      --term-prompt-host: #ffcc33;
      --term-prompt-path: #d48800;
      --term-prompt-symbol: #ffb300;
      --term-accent: #ff9900;
      --term-border: #4d3000;
      --term-selection: rgba(255, 179, 0, 0.3);
      --term-glow: 0 0 10px rgba(255, 179, 0, 0.35);
    }

    body.theme-dracula {
      --term-bg-outer: #191a21;
      --term-bg: #282a36;
      --term-text: #f8f8f2;
      --term-prompt-user: #50fa7b;
      --term-prompt-host: #8be9fd;
      --term-prompt-path: #bd93f9;
      --term-prompt-symbol: #ff79c6;
      --term-accent: #bd93f9;
      --term-border: #44475a;
      --term-selection: rgba(189, 147, 249, 0.3);
      --term-glow: transparent;
    }

    body.theme-nord {
      --term-bg-outer: #242933;
      --term-bg: #2e3440;
      --term-text: #eceff4;
      --term-prompt-user: #a3be8c;
      --term-prompt-host: #88c0d0;
      --term-prompt-path: #81a1c1;
      --term-prompt-symbol: #d8dee9;
      --term-accent: #88c0d0;
      --term-border: #434c5e;
      --term-selection: rgba(136, 192, 208, 0.3);
      --term-glow: transparent;
    }

    body.theme-vscode {
      --term-bg-outer: #141414;
      --term-bg: #1e1e1e;
      --term-text: #cccccc;
      --term-prompt-user: #4ec9b0;
      --term-prompt-host: #4ec9b0;
      --term-prompt-path: #569cd6;
      --term-prompt-symbol: #dcdcaa;
      --term-accent: #007acc;
      --term-border: #333333;
      --term-selection: rgba(0, 122, 204, 0.35);
      --term-glow: transparent;
    }

    body {
      background-color: var(--term-bg-outer);
      color: var(--term-text);
      font-family: 'Sarabun', sans-serif;
      transition: background-color 0.3s ease;
    }

    .term-window {
      background-color: var(--term-bg);
      border-color: var(--term-border);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.65), 0 0 25px var(--term-glow);
    }

    .term-font {
      font-family: 'Fira Code', 'Ubuntu Mono', Consolas, monospace;
    }

    /* Terminal scrollbar */
    .term-scroll::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .term-scroll::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.25);
    }
    .term-scroll::-webkit-scrollbar-thumb {
      background: var(--term-border);
      border-radius: 4px;
    }
    .term-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--term-accent);
    }

    /* CRT scanlines effect */
    .crt-effect {
      position: relative;
    }
    .crt-effect::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
      z-index: 20;
      background-size: 100% 3px, 6px 100%;
      pointer-events: none;
      opacity: 0.85;
    }

    /* Terminal blinking caret */
    @keyframes termBlink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    .caret-blink {
      animation: termBlink 1s infinite;
    }

    /* Pulsing success */
    @keyframes greenPulse {
      0% { box-shadow: 0 0 0 0 rgba(74, 246, 38, 0.5); }
      70% { box-shadow: 0 0 0 10px rgba(74, 246, 38, 0); }
      100% { box-shadow: 0 0 0 0 rgba(74, 246, 38, 0); }
    }
    .pulse-success {
      animation: greenPulse 1.2s ease-out;
    }

    /* Custom selection */
    ::selection {
      background: var(--term-selection);
      color: #ffffff;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-orange-500/30 selection:text-white">

  <!-- TOP APP BAR -->
  <header class="border-b border-white/10 bg-black/40 backdrop-blur px-3 lg:px-6 py-2.5 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      
      <!-- Brand & Back Link -->
      <div class="flex items-center space-x-3">
        <a href="index.html" class="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition shadow-sm" title="กลับไปหน้า Midterm MCQ Exam">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span>MCQ Exam</span>
        </a>

        <div class="h-4 w-px bg-white/20"></div>

        <div class="flex items-center gap-2">
          <span class="text-xl">🐧</span>
          <div>
            <h1 class="font-heading font-bold text-sm md:text-base text-white tracking-wide flex items-center gap-2">
              <span>Linux Commands Lab 1 Terminal</span>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                58 Questions
              </span>
            </h1>
            <p class="text-[11px] text-slate-400 hidden sm:block">
              Course 2301371 Operating Systems • Type real commands with authentic Linux output
            </p>
          </div>
        </div>
      </div>

      <!-- Live Stats & Tools -->
      <div class="flex items-center flex-wrap gap-2 text-xs">
        
        <!-- Topic Selector Dropdown -->
        <div class="relative">
          <select id="topicSelect" class="bg-black/60 border border-white/20 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono">
            <option value="all">📂 All Topics (58 Questions)</option>
            <option value="Quiz 1: Process Management">⚙️ 1. Process Management (11)</option>
            <option value="Quiz 2: Memory Management">🧠 2. Memory Management (2)</option>
            <option value="Quiz 3: Storage Management">💾 3. Storage Management (9)</option>
            <option value="Quiz 4: User Management">👤 4. User Management (5)</option>
            <option value="Quiz 5: Network Management">🌐 5. Network Management (7)</option>
            <option value="Quiz 6: Utility Management (Part 1)">🛠️ 6. Utility Management Pt.1 (14)</option>
            <option value="Quiz 7: Utility Management (Part 2)">📦 7. Utility Management Pt.2 (10)</option>
          </select>
        </div>

        <!-- Question Grid Button -->
        <button id="btnOpenGrid" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition font-mono">
          <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
          <span>Q: <span id="statQIndex" class="text-white font-bold">1</span>/<span id="statQTotal">58</span></span>
        </button>

        <!-- Score Badge -->
        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-mono">
          <span>⭐</span>
          <span id="statScore">0</span>
          <span class="text-[10px] text-emerald-400/70">XP</span>
        </div>

        <!-- Streak Badge -->
        <div class="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-orange-950/60 border border-orange-600/40 text-orange-300 font-mono">
          <span>🔥</span>
          <span id="statStreak">0</span>
        </div>

        <!-- Timer / Stopwatch -->
        <div id="timerContainer" class="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-black/50 border border-white/15 text-slate-300 font-mono">
          <span class="text-xs text-amber-400">⏱️</span>
          <span id="timerDisplay">00:00</span>
        </div>

        <!-- Cheat Sheet Button -->
        <button id="btnCheatSheet" class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 transition" title="เปิดสรุปคำสั่งแล็บ (Cheat Sheet)">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          <span class="hidden lg:inline">Cheat Sheet</span>
        </button>

        <!-- Theme Picker -->
        <div class="relative">
          <select id="themeSelect" class="bg-black/60 border border-white/20 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none font-mono" title="เลือกธีมเทอร์มินัล">
            <option value="theme-ubuntu">🎨 Ubuntu</option>
            <option value="theme-matrix">🟢 Matrix</option>
            <option value="theme-amber">🟡 Amber CRT</option>
            <option value="theme-dracula">🧛 Dracula</option>
            <option value="theme-nord">❄️ Nord</option>
            <option value="theme-vscode">💻 VS Code</option>
          </select>
        </div>

        <!-- Sound Toggle -->
        <button id="btnSound" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition" title="เปิด/ปิดเสียงพิมพ์และแจ้งเตือน">
          <span id="soundIcon">🔊</span>
        </button>

        <!-- CRT Toggle -->
        <button id="btnCrt" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition font-mono text-[11px]" title="Toggle Retro CRT Scanlines">
          📺 CRT
        </button>
      </div>

    </div>
  </header>

  <!-- MAIN TERMINAL WRAPPER -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6 flex flex-col">

    <!-- QUESTION HUD (Pinned above terminal) -->
    <div id="questionHud" class="mb-3 rounded-xl border border-white/15 bg-black/40 backdrop-blur p-3.5 shadow-lg transition duration-200">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <div class="space-y-1 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span id="hudBadgeTopic" class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Quiz 1: Process Management
            </span>
            <span id="hudBadgeNum" class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Question 1 of 58
            </span>
            <span id="hudStatusPill" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
              ⚪ PENDING
            </span>
          </div>

          <div class="flex items-start gap-2 pt-0.5">
            <span class="text-amber-400 font-bold text-sm select-none">📌</span>
            <h2 id="hudQuestionText" class="text-sm sm:text-base font-semibold text-white tracking-wide leading-relaxed">
              Show Linux distro (distributor, description, release, codename).
            </h2>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center flex-wrap gap-1.5 self-end md:self-center">
          <button id="btnHudHint" class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-mono transition">
            <span>💡</span>
            <span>Hint</span>
          </button>
          
          <button id="btnHudSolve" class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-mono transition">
            <span>👁️</span>
            <span>Solution</span>
          </button>

          <div class="h-4 w-px bg-white/20 mx-0.5"></div>

          <button id="btnHudPrev" class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-mono transition" title="ข้อก่อนหน้า (Alt+Left)">
            ⏮️ Prev
          </button>

          <button id="btnHudNext" class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-mono transition" title="ข้อถัดไป (Alt+Right)">
            Next ⏭️
          </button>
        </div>

      </div>

      <!-- Expandable Hint Box -->
      <div id="hudHintBox" class="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono hidden">
        <div class="flex items-center justify-between font-bold mb-1">
          <span class="flex items-center gap-1">💡 HINT:</span>
          <button id="btnCloseHint" class="text-amber-400/70 hover:text-amber-200 text-sm">✕</button>
        </div>
        <div id="hudHintContent"></div>
      </div>

      <!-- Expandable Solution Box -->
      <div id="hudSolutionBox" class="mt-3 p-3 rounded-lg bg-slate-900/90 border border-rose-500/40 text-slate-200 text-xs font-mono hidden">
        <div class="flex items-center justify-between font-bold text-rose-300 mb-1.5">
          <span class="flex items-center gap-1">👁️ CANONICAL COMMAND:</span>
          <button id="btnCloseSolution" class="text-rose-400/70 hover:text-rose-200 text-sm">✕</button>
        </div>
        <div id="hudSolutionCmd" class="p-2 rounded bg-black/60 text-emerald-400 font-bold text-sm tracking-wide mb-2 select-all"></div>
        <div id="hudSolutionExp" class="text-slate-300 font-sans text-xs leading-relaxed"></div>
      </div>
    </div>

    <!-- TERMINAL WINDOW -->
    <div id="terminalWindow" class="term-window flex-1 rounded-xl border flex flex-col overflow-hidden relative min-h-[500px]">
      
      <!-- Terminal Window Titlebar (macOS / Ubuntu style) -->
      <div class="bg-black/50 border-b border-white/10 px-4 py-2.5 flex items-center justify-between select-none">
        
        <!-- Window Traffic Light Buttons -->
        <div class="flex items-center space-x-2">
          <button id="winBtnClose" class="w-3 h-3 rounded-full bg-rose-500 hover:brightness-125 transition" title="Close Shell"></button>
          <button id="winBtnMinimize" class="w-3 h-3 rounded-full bg-amber-500 hover:brightness-125 transition" title="Clear Screen"></button>
          <button id="winBtnMaximize" class="w-3 h-3 rounded-full bg-emerald-500 hover:brightness-125 transition" title="Toggle Fullscreen"></button>
          <span class="text-xs text-white/40 font-mono ml-2 hidden sm:inline">bash 5.2.15(1)-release</span>
        </div>

        <!-- Terminal Window Title -->
        <div class="text-xs font-mono text-slate-300/90 font-medium tracking-wide flex items-center gap-1.5">
          <span>student@os-lab:~</span>
          <span class="text-white/30">•</span>
          <span class="text-white/60">2301371 Lab Quiz 1</span>
        </div>

        <!-- Session Status -->
        <div class="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="hidden sm:inline">tty1 (online)</span>
        </div>
      </div>

      <!-- Terminal Output & Prompt Area -->
      <div id="terminalBody" class="term-scroll flex-1 p-4 overflow-y-auto term-font text-xs sm:text-sm leading-relaxed cursor-text relative" onclick="focusTerminalInput()">
        
        <!-- Terminal Welcome Banner -->
        <pre class="text-emerald-400/90 select-none text-[10px] sm:text-xs leading-none mb-3 font-mono">
================================================================================
  ___  ____    _     _                 _____                     _             _ 
 / _ \\/ ___|  | |   (_)_ __  _   ___  |_   _|__ _ __ _ __ ___  (_)_ __   __ _| |
| | | \\___ \\  | |   | | &#39;_ \\| | | \\ \\/ / | |/ _ \\ &#39;__| &#39;_ &#39; _ \\ | | &#39;_ \\ / _&#39; | |
| |_| |___) | | |___| | | | | |_| |&gt;  &lt;  | |  __/ |  | | | | | || | | | | (_| | |
 \\___/|____/  |_____|_|_| |_|\\__,_/_/\\_\\ |_|\\___|_|  |_| |_| |_||_|_| |_|\\__,_|_|
================================================================================
🐧 2301371 OPERATING SYSTEMS — LINUX COMMANDS LAB QUIZ 1 SIMULATOR
🎯 Scope: 58 Questions from Lab Exam 1 (Process, Memory, Storage, User, Network, Tools)
💡 Type real Linux commands at the prompt below and press [Enter] to test your syntax!
⌨️  Special commands: 'help', 'hint', 'solve', 'next', 'prev', 'clear', 'ls', 'score'
================================================================================</pre>

        <!-- Command History Stream Container -->
        <div id="historyStream" class="space-y-2"></div>

        <!-- Active Interactive Prompt Line -->
        <div id="activePromptLine" class="flex items-center flex-wrap pt-2">
          <span class="select-none font-bold mr-2">
            <span style="color: var(--term-prompt-user)">student@os-lab</span><span style="color: var(--term-text)">:</span><span style="color: var(--term-prompt-path)">~</span><span style="color: var(--term-prompt-symbol)">$</span>
          </span>
          <div class="flex-1 relative min-w-[200px] flex items-center">
            <input 
              type="text" 
              id="cmdInput" 
              class="w-full bg-transparent border-0 outline-none text-white font-mono text-xs sm:text-sm p-0 m-0 caret-transparent"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="off" 
              spellcheck="false"
              placeholder=""
              autofocus
            />
            <!-- Visual Caret Overlay -->
            <div id="caretOverlay" class="absolute pointer-events-none left-0 top-0 bottom-0 flex items-center">
              <span id="caretMirrorText" class="opacity-0 whitespace-pre"></span>
              <span class="w-2 sm:w-2.5 h-4 sm:h-4.5 bg-emerald-400 caret-blink inline-block" style="background-color: var(--term-accent)"></span>
            </div>
          </div>
        </div>

      </div>

      <!-- Mobile / Quick Terminal Helper Bar -->
      <div class="border-t border-white/10 bg-black/40 px-3 py-1.5 flex items-center justify-between text-xs font-mono overflow-x-auto gap-1 select-none">
        <div class="flex items-center gap-1">
          <button onclick="simulateKey('Tab')" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] border border-white/10 active:scale-95 transition">
            Tab ⇥
          </button>
          <button onclick="simulateInterrupt()" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] border border-white/10 active:scale-95 transition" title="Ctrl+C Interrupt">
            ^C
          </button>
          <button onclick="navigateHistory(-1)" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] border border-white/10 active:scale-95 transition" title="Previous Command">
            ↑ Hist
          </button>
          <button onclick="navigateHistory(1)" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] border border-white/10 active:scale-95 transition" title="Next Command">
            ↓ Hist
          </button>
          <button onclick="executeQuickCommand('clear')" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] border border-white/10 active:scale-95 transition">
            clear
          </button>
        </div>

        <div class="flex items-center gap-1">
          <button onclick="executeQuickCommand('hint')" class="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[11px] border border-amber-500/30 active:scale-95 transition">
            hint
          </button>
          <button onclick="executeQuickCommand('solution')" class="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[11px] border border-rose-500/30 active:scale-95 transition">
            solution
          </button>
          <button onclick="nextQuestion()" class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] border border-emerald-500/30 active:scale-95 transition font-bold">
            next ⏭
          </button>
        </div>
      </div>

    </div>

  </main>

  <!-- QUESTION GRID MODAL (All 58 Questions) -->
  <div id="modalGrid" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="font-heading font-bold text-base text-white flex items-center gap-2">
            <span>📋 Question Navigator</span>
            <span class="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              58 Questions
            </span>
          </h3>
          <p class="text-xs text-slate-400">คลิกที่หมายเลขข้อเพื่อกระโดดไปยังคำถามนั้นทันที</p>
        </div>
        <button id="btnCloseGrid" class="text-slate-400 hover:text-white p-1 rounded-lg text-lg">✕</button>
      </div>

      <!-- Legend -->
      <div class="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-500 inline-block"></span> <span>ถูกต้อง (Correct)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-rose-500 inline-block"></span> <span>ลองแล้ว/ผิด (Attempted)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-500 inline-block"></span> <span>ดูเฉลย (Revealed)</span></div>
        <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-slate-700 inline-block"></span> <span>ยังไม่ตอบ (Pending)</span></div>
      </div>

      <!-- Grid Buttons -->
      <div id="gridButtonsContainer" class="p-4 overflow-y-auto flex-1 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 font-mono text-xs">
        <!-- Rendered via JS -->
      </div>

      <div class="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-slate-400">ความก้าวหน้า: <span id="gridProgressText" class="text-white font-bold">0/58</span> ข้อ</span>
        <button onclick="document.getElementById('modalGrid').classList.add('hidden')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
          ปิดหน้าต่าง
        </button>
      </div>

    </div>
  </div>

  <!-- CHEAT SHEET MODAL (Searchable 58 Linux Commands) -->
  <div id="modalCheatSheet" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="font-heading font-bold text-base text-white flex items-center gap-2">
            <span>📖 Linux Commands Lab 1 Cheat Sheet</span>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              Full Reference
            </span>
          </h3>
          <p class="text-xs text-slate-400">สรุปคำสั่งและไวยากรณ์ทั้ง 58 ข้อสำหรับการสอบ Lab Exam 1</p>
        </div>
        <button id="btnCloseCheatSheet" class="text-slate-400 hover:text-white p-1 rounded-lg text-lg">✕</button>
      </div>

      <!-- Search Box -->
      <div class="p-3 bg-slate-950/60 border-b border-slate-800">
        <div class="relative">
          <input 
            type="text" 
            id="cheatSearchInput" 
            placeholder="🔍 พิมพ์เพื่อค้นหาคำสั่ง เช่น grep, passwd, tar, kill, memory..." 
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      <!-- Table of Commands -->
      <div class="overflow-y-auto flex-1 p-4">
        <table class="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400">
              <th class="py-2 px-2 w-12">#</th>
              <th class="py-2 px-2 w-36">Topic</th>
              <th class="py-2 px-2">Task Description</th>
              <th class="py-2 px-2 w-48">Canonical Command</th>
              <th class="py-2 px-2 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody id="cheatTableBody" class="divide-y divide-slate-800 text-slate-300">
            <!-- Rendered via JS -->
          </tbody>
        </table>
      </div>

      <div class="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
        <span class="text-slate-400">คลิก "Run" เพื่อโหลดคำสั่งและไปที่ข้อนั้นทันที</span>
        <button onclick="document.getElementById('modalCheatSheet').classList.add('hidden')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
          ปิดหน้าต่าง
        </button>
      </div>

    </div>
  </div>

  <!-- CONGRATULATIONS / COMPLETION MODAL -->
  <div id="modalCompletion" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 hidden">
    <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl space-y-4">
      <div class="text-5xl animate-bounce">🎉</div>
      <h3 class="font-heading font-bold text-2xl text-white">ยอดเยี่ยมมาก! สำเร็จครบทุกข้อ!</h3>
      <p class="text-xs sm:text-sm text-slate-300">
        คุณฝึกทำแล็บ Linux Commands Lab 1 ครบตามเป้าหมายเรียบร้อยแล้ว
      </p>

      <div class="grid grid-cols-3 gap-2 py-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs">
        <div class="p-2">
          <div class="text-slate-400">Total Score</div>
          <div id="compScore" class="text-lg font-bold text-emerald-400">0</div>
        </div>
        <div class="p-2 border-x border-white/10">
          <div class="text-slate-400">Accuracy</div>
          <div id="compAccuracy" class="text-lg font-bold text-cyan-400">100%</div>
        </div>
        <div class="p-2">
          <div class="text-slate-400">Time</div>
          <div id="compTime" class="text-lg font-bold text-amber-400">00:00</div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 pt-2">
        <button onclick="restartQuiz()" class="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-600/30">
          🔄 เริ่มฝึกใหม่อีกรอบ
        </button>
        <a href="index.html" class="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center">
          ← กลับไปหน้า MCQ Exam
        </a>
      </div>
    </div>
  </div>

  <!-- EMBEDDED QUIZ DATA & LOGIC -->
  <script>
    const QUIZ_QUESTIONS = ${JSON.stringify(questions, null, 2)};

    // State Variables
    let currentFilterTopic = 'all';
    let filteredQuestions = [...QUIZ_QUESTIONS];
    let currentIndex = 0;
    let score = 0;
    let streak = 0;
    let maxStreak = 0;
    let questionStates = {}; // id -> { status: 'pending'|'correct'|'attempted'|'revealed', attempts: 0, lastTyped: '' }
    let commandHistory = [];
    let historyCursor = -1;
    let soundEnabled = true;
    let timerSeconds = 0;
    let timerInterval = null;

    // Simulated local file tree for realistic ls commands
    const SIMULATED_FILES = [
      'testfile.txt', 'secret.txt', 'rootfile.txt', 'foldername', 
      'hello.c', 'name.txt', 'combined.txt', 'backup.tar.gz'
    ];

    // Audio Synthesizer (Web Audio API)
    let audioCtx = null;
    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    function playKeySound() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + Math.random() * 80, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
      } catch (e) {}
    }

    function playSuccessSound() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = audioCtx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.05, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } catch (e) {}
    }

    function playErrorSound() {
      if (!soundEnabled) return;
      try {
        initAudio();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    }

    // Initialize Question States
    function initQuestionStates() {
      QUIZ_QUESTIONS.forEach(q => {
        questionStates[q.id] = {
          status: 'pending',
          attempts: 0,
          lastTyped: ''
        };
      });
    }

    // Start Timer
    function startTimer() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timerSeconds++;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        document.getElementById('timerDisplay').textContent = mins + ':' + secs;
      }, 1000);
    }

    // Filter Questions by Topic
    function applyTopicFilter(topic) {
      currentFilterTopic = topic;
      if (topic === 'all') {
        filteredQuestions = [...QUIZ_QUESTIONS];
      } else {
        filteredQuestions = QUIZ_QUESTIONS.filter(q => q.section === topic);
      }
      currentIndex = 0;
      loadCurrentQuestion();
      renderGridButtons();
    }

    // Load Question at currentIndex
    function loadCurrentQuestion() {
      if (filteredQuestions.length === 0) return;
      if (currentIndex >= filteredQuestions.length) currentIndex = 0;
      if (currentIndex < 0) currentIndex = filteredQuestions.length - 1;

      const q = filteredQuestions[currentIndex];
      const state = questionStates[q.id] || { status: 'pending', attempts: 0 };

      // Update HUD elements
      document.getElementById('hudBadgeTopic').textContent = q.section;
      document.getElementById('hudBadgeNum').textContent = 'Question ' + (currentIndex + 1) + ' of ' + filteredQuestions.length + ' (ID: #' + q.id + ')';
      document.getElementById('hudQuestionText').textContent = q.question;
      document.getElementById('statQIndex').textContent = currentIndex + 1;
      document.getElementById('statQTotal').textContent = filteredQuestions.length;

      // Status pill
      const statusPill = document.getElementById('hudStatusPill');
      if (state.status === 'correct') {
        statusPill.textContent = '✔ SOLVED';
        statusPill.className = 'text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      } else if (state.status === 'revealed') {
        statusPill.textContent = '👁️ REVEALED';
        statusPill.className = 'text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30';
      } else if (state.status === 'attempted') {
        statusPill.textContent = '✖ ATTEMPTED (' + state.attempts + ')';
        statusPill.className = 'text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30';
      } else {
        statusPill.textContent = '⚪ PENDING';
        statusPill.className = 'text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300';
      }

      // Hide hint & solution boxes when switching
      document.getElementById('hudHintBox').classList.add('hidden');
      document.getElementById('hudSolutionBox').classList.add('hidden');

      // Populate hint & solution contents
      document.getElementById('hudHintContent').textContent = q.hint;
      document.getElementById('hudSolutionCmd').textContent = q.canonical_answer;
      document.getElementById('hudSolutionExp').textContent = q.explanation;

      // Update Grid Buttons
      renderGridButtons();

      // Print announcement in terminal
      appendTerminalNotice(
        '<div class="my-2 p-2 rounded bg-white/5 border border-white/10">' +
        '<div class="text-[11px] text-amber-400 font-bold">📌 [QUESTION ' + (currentIndex + 1) + '/' + filteredQuestions.length + '] ' + escapeHtml(q.section) + '</div>' +
        '<div class="text-xs sm:text-sm text-white font-medium">' + escapeHtml(q.question) + '</div>' +
        '<div class="text-[10px] text-slate-400 mt-1">💡 Hint: type \\'hint\\' | Solution: type \\'solution\\' | Next: type \\'next\\'</div>' +
        '</div>'
      );

      focusTerminalInput();
    }

    function nextQuestion() {
      if (currentIndex < filteredQuestions.length - 1) {
        currentIndex++;
        loadCurrentQuestion();
      } else {
        checkCompletion();
      }
    }

    function prevQuestion() {
      if (currentIndex > 0) {
        currentIndex--;
        loadCurrentQuestion();
      }
    }

    function jumpToQuestion(globalId) {
      const idx = filteredQuestions.findIndex(q => q.id === globalId);
      if (idx !== -1) {
        currentIndex = idx;
        loadCurrentQuestion();
        document.getElementById('modalGrid').classList.add('hidden');
      } else {
        // If topic filter is active, reset topic filter to All
        document.getElementById('topicSelect').value = 'all';
        applyTopicFilter('all');
        const newIdx = filteredQuestions.findIndex(q => q.id === globalId);
        if (newIdx !== -1) {
          currentIndex = newIdx;
          loadCurrentQuestion();
          document.getElementById('modalGrid').classList.add('hidden');
        }
      }
    }

    // Command Validation Engine
    function validateCommand(userCmd, question) {
      const trimmed = userCmd.trim();
      if (!trimmed) return false;

      // Compile regex patterns
      const regexes = question.patterns.map(p => new RegExp(p, 'i'));

      // Check against all patterns
      for (const rgx of regexes) {
        if (rgx.test(trimmed)) {
          return true;
        }
      }

      // Check normalized canonical answer
      const canonicalClean = question.canonical_answer
        .replace(/\\s*\\(.*?\\)/g, '')
        .replace(/\\s+/g, ' ')
        .trim();

      const userClean = trimmed.replace(/\\s+/g, ' ');
      if (userClean.toLowerCase() === canonicalClean.toLowerCase()) {
        return true;
      }

      // Check if user provided multi-command chained via -> or &&
      const normalizedArrow = trimmed.replace(/\\s*->\\s*/g, ' && ');
      for (const rgx of regexes) {
        if (rgx.test(normalizedArrow)) {
          return true;
        }
      }

      return false;
    }

    // Execute Terminal Input
    function handleCommandSubmit() {
      const inputEl = document.getElementById('cmdInput');
      const rawCmd = inputEl.value;
      const cmd = rawCmd.trim();
      inputEl.value = '';
      updateCaretMirror();

      if (!cmd) {
        // Just print prompt line
        appendTerminalLine('<span class="select-none font-bold mr-2"><span style="color: var(--term-prompt-user)">student@os-lab</span>:<span style="color: var(--term-prompt-path)">~</span>$</span>');
        return;
      }

      // Add to bash command history
      commandHistory.push(cmd);
      historyCursor = commandHistory.length;

      // Echo command line in terminal
      appendTerminalLine(
        '<span class="select-none font-bold mr-2"><span style="color: var(--term-prompt-user)">student@os-lab</span>:<span style="color: var(--term-prompt-path)">~</span>$</span> ' +
        '<span class="text-white font-mono font-semibold">' + escapeHtml(rawCmd) + '</span>'
      );

      // Handle Built-in Shell & Quiz Utilities
      const lowerCmd = cmd.toLowerCase();

      if (lowerCmd === 'clear' || lowerCmd === 'cls') {
        clearTerminal();
        return;
      }

      if (lowerCmd === 'help') {
        printHelp();
        return;
      }

      if (lowerCmd === 'hint') {
        showHint();
        return;
      }

      if (lowerCmd === 'solution' || lowerCmd === 'solve' || lowerCmd === 'ans' || lowerCmd === 'answer') {
        revealSolution();
        return;
      }

      if (lowerCmd === 'next' || lowerCmd === 'skip') {
        nextQuestion();
        return;
      }

      if (lowerCmd === 'prev') {
        prevQuestion();
        return;
      }

      if (lowerCmd === 'ls' || lowerCmd === 'dir') {
        appendTerminalLine('<div class="text-blue-400 font-bold">' + SIMULATED_FILES.join('  ') + '</div>');
        return;
      }

      if (lowerCmd === 'pwd') {
        appendTerminalLine('<div>/home/student</div>');
        return;
      }

      if (lowerCmd === 'whoami') {
        appendTerminalLine('<div>student</div>');
        return;
      }

      if (lowerCmd === 'date') {
        appendTerminalLine('<div>' + new Date().toString() + '</div>');
        // If question 57 asks for date, check it!
      }

      if (lowerCmd === 'history') {
        let histHtml = '';
        commandHistory.forEach((h, i) => {
          histHtml += '<div> ' + (i + 1).toString().padStart(4, ' ') + '  ' + escapeHtml(h) + '</div>';
        });
        appendTerminalLine(histHtml);
        return;
      }

      if (lowerCmd.startsWith('goto ')) {
        const targetNum = parseInt(lowerCmd.split(' ')[1]);
        if (!isNaN(targetNum) && targetNum >= 1 && targetNum <= QUIZ_QUESTIONS.length) {
          jumpToQuestion(targetNum);
          return;
        } else {
          appendTerminalLine('<div class="text-rose-400">bash: goto: invalid question number (1-58)</div>');
          return;
        }
      }

      if (lowerCmd === 'score' || lowerCmd === 'stats') {
        appendTerminalLine(
          '<div class="p-2 rounded bg-black/40 border border-white/10 text-xs font-mono">' +
          '<div>⭐ Current Score: <span class="text-emerald-400 font-bold">' + score + ' XP</span></div>' +
          '<div>🔥 Current Streak: <span class="text-orange-400 font-bold">' + streak + '</span> (Max: ' + maxStreak + ')</div>' +
          '<div>⏱️ Elapsed Time: <span class="text-amber-400 font-bold">' + document.getElementById('timerDisplay').textContent + '</span></div>' +
          '</div>'
        );
        return;
      }

      // Process Quiz Question Verification
      const currentQ = filteredQuestions[currentIndex];
      const qState = questionStates[currentQ.id];
      qState.attempts++;
      qState.lastTyped = cmd;

      const isCorrect = validateCommand(cmd, currentQ);

      if (isCorrect) {
        // Correct command!
        playSuccessSound();
        const firstTry = (qState.status === 'pending');
        qState.status = 'correct';

        if (firstTry) {
          score += 100;
          streak++;
          if (streak > maxStreak) maxStreak = streak;
        } else if (qState.status !== 'revealed') {
          score += 50;
        }

        updateStatsDisplay();

        // Print realistic simulated output
        appendTerminalLine(
          '<div class="text-slate-300 font-mono whitespace-pre-wrap">' + escapeHtml(currentQ.simulated_output) + '</div>'
        );

        // Print success banner
        appendTerminalLine(
          '<div class="mt-2 p-2.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono">' +
          '<div class="font-bold flex items-center gap-1.5 text-emerald-400">✔ [SUCCESS] Correct Command Syntax! (+' + (firstTry ? 100 : 50) + ' XP)</div>' +
          '<div class="text-slate-300 mt-1 font-sans">' + escapeHtml(currentQ.explanation) + '</div>' +
          '<div class="text-[11px] text-emerald-400/80 mt-1.5 font-mono">👉 Type \\'next\\' or press [Enter] to continue to the next question.</div>' +
          '</div>'
        );

        // Update HUD
        loadCurrentQuestion();

      } else {
        // Incorrect command!
        playErrorSound();
        streak = 0;
        updateStatsDisplay();
        if (qState.status === 'pending') {
          qState.status = 'attempted';
        }

        // Print realistic bash error
        const cmdName = cmd.split(' ')[0];
        let errorMsg = 'bash: ' + escapeHtml(cmdName) + ': command syntax does not match question requirements';
        if (['lsb_release', 'uname', 'free', 'df', 'top', 'ps', 'grep'].includes(cmdName)) {
          errorMsg = 'bash: ' + escapeHtml(cmd) + ': incorrect flags or arguments for this task.';
        }

        appendTerminalLine(
          '<div class="text-rose-400 font-mono">' + errorMsg + '</div>' +
          '<div class="mt-1 p-2 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-mono">' +
          '<div class="font-bold">✖ [INCORRECT] ลองใหม่อีกครั้ง หรือพิมพ์ \\'hint\\' เพื่อดูคำใบ้</div>' +
          '<div class="text-[11px] text-slate-300 mt-0.5">💡 Hint: ' + escapeHtml(currentQ.hint) + '</div>' +
          '</div>'
        );

        loadCurrentQuestion();
      }

      scrollTerminalToBottom();
    }

    // Terminal Output Append Helper
    function appendTerminalLine(htmlContent) {
      const stream = document.getElementById('historyStream');
      const line = document.createElement('div');
      line.className = 'term-line';
      line.innerHTML = htmlContent;
      stream.appendChild(line);
      scrollTerminalToBottom();
    }

    function appendTerminalNotice(htmlContent) {
      appendTerminalLine(htmlContent);
    }

    function clearTerminal() {
      document.getElementById('historyStream').innerHTML = '';
      scrollTerminalToBottom();
    }

    function scrollTerminalToBottom() {
      const body = document.getElementById('terminalBody');
      body.scrollTop = body.scrollHeight;
    }

    function focusTerminalInput() {
      const input = document.getElementById('cmdInput');
      input.focus();
    }

    // Caret Mirror Sync
    function updateCaretMirror() {
      const input = document.getElementById('cmdInput');
      const mirror = document.getElementById('caretMirrorText');
      mirror.textContent = input.value;
    }

    // Keyboard & Terminal Controls
    document.getElementById('cmdInput').addEventListener('input', () => {
      playKeySound();
      updateCaretMirror();
    });

    document.getElementById('cmdInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCommandSubmit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabAutocomplete();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        simulateInterrupt();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        clearTerminal();
      }
    });

    function navigateHistory(direction) {
      if (commandHistory.length === 0) return;
      historyCursor += direction;
      if (historyCursor < 0) historyCursor = 0;
      if (historyCursor >= commandHistory.length) {
        historyCursor = commandHistory.length;
        document.getElementById('cmdInput').value = '';
      } else {
        document.getElementById('cmdInput').value = commandHistory[historyCursor];
      }
      updateCaretMirror();
    }

    function simulateInterrupt() {
      const input = document.getElementById('cmdInput');
      const typed = input.value;
      input.value = '';
      updateCaretMirror();
      appendTerminalLine(
        '<span class="select-none font-bold mr-2"><span style="color: var(--term-prompt-user)">student@os-lab</span>:<span style="color: var(--term-prompt-path)">~</span>$</span> ' +
        escapeHtml(typed) + '^C'
      );
      scrollTerminalToBottom();
      focusTerminalInput();
    }

    function simulateKey(key) {
      if (key === 'Tab') {
        handleTabAutocomplete();
      }
    }

    function executeQuickCommand(cmd) {
      document.getElementById('cmdInput').value = cmd;
      handleCommandSubmit();
    }

    // Tab Autocompletion Engine
    const AUTOCOMPLETE_LIST = [
      'lsb_release -a', 'uname -r', 'uname -a', 'lscpu', 'nice -n 19 sleep 100',
      'sleep 100 &', 'kill %1', 'fg %2', 'cat /etc/passwd | grep home',
      'uptime -p', 'cat /proc/meminfo', 'free -h', 'touch testfile.txt',
      'mkdir testdir', 'chmod 400 secret.txt', 'sudo chown root:root rootfile.txt',
      'ln -s original_folder symlink_folder', 'df -h', 'du -h /usr/share/dict/american-english',
      'sudo fsck -f /dev/sda1', 'find / -name "filename.txt"', 'passwd', 'users', 'w',
      'sudo passwd root', 'sudo adduser testuser', 'ssh username@hostname',
      'sftp username@hostname', 'ip a', 'nslookup google.com', 'ip link show',
      'ping -c 4 google.com', 'man man', 'head -n 10 /etc/passwd', 'tail -n 10 /etc/passwd',
      'more /usr/share/dict/american-english', 'grep "sys" /etc/passwd',
      'grep "land$" /usr/share/dict/american-english', 'wc -l /usr/share/dict/american-english',
      'nano /usr/share/dict/american-english', 'hexdump -C name.txt', 'gpg -c name.txt',
      'gcc hello.c -o hello && ./hello', 'nohup ./myprogram &', 'sudo shutdown +10',
      'sudo shutdown -c', 'tar -czvf foldername.tar.gz foldername/',
      'sha256sum foldername.tar.gz', 'zip -r foldername.zip foldername/',
      'cut -d: -f1 /etc/passwd', 'lpq', 'date', 'cal',
      '/etc/passwd', '/etc/os-release', '/proc/version', '/proc/cpuinfo', '/proc/meminfo',
      '/usr/share/dict/american-english', 'help', 'hint', 'solution', 'clear', 'history', 'next', 'prev'
    ];

    function handleTabAutocomplete() {
      const input = document.getElementById('cmdInput');
      const val = input.value.trimStart();
      if (!val) return;

      const matches = AUTOCOMPLETE_LIST.filter(item => item.toLowerCase().startsWith(val.toLowerCase()));
      if (matches.length === 1) {
        input.value = matches[0];
        updateCaretMirror();
        playKeySound();
      } else if (matches.length > 1) {
        appendTerminalLine('<div class="text-slate-400 text-xs font-mono my-1">' + matches.join('   ') + '</div>');
        // Find longest common prefix
        let prefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
          while (!matches[i].toLowerCase().startsWith(prefix.toLowerCase())) {
            prefix = prefix.substring(0, prefix.length - 1);
          }
        }
        if (prefix.length > val.length) {
          input.value = prefix;
          updateCaretMirror();
        }
      }
    }

    // Hint & Solution Helpers
    function showHint() {
      const q = filteredQuestions[currentIndex];
      const box = document.getElementById('hudHintBox');
      box.classList.remove('hidden');
      document.getElementById('hudHintContent').textContent = q.hint;
      appendTerminalNotice(
        '<div class="my-1 p-2 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">' +
        '💡 [HINT] ' + escapeHtml(q.hint) +
        '</div>'
      );
    }

    function revealSolution() {
      const q = filteredQuestions[currentIndex];
      const qState = questionStates[q.id];
      qState.status = 'revealed';

      const box = document.getElementById('hudSolutionBox');
      box.classList.remove('hidden');
      document.getElementById('hudSolutionCmd').textContent = q.canonical_answer;
      document.getElementById('hudSolutionExp').textContent = q.explanation;

      appendTerminalNotice(
        '<div class="my-1.5 p-2.5 rounded bg-slate-900 border border-rose-500/40 text-slate-200 text-xs font-mono">' +
        '<div class="text-rose-400 font-bold">👁️ [CANONICAL ANSWER]</div>' +
        '<div class="text-emerald-400 font-bold my-1 text-sm select-all">' + escapeHtml(q.canonical_answer) + '</div>' +
        '<div class="text-slate-300 text-xs font-sans">' + escapeHtml(q.explanation) + '</div>' +
        '</div>'
      );

      loadCurrentQuestion();
    }

    function printHelp() {
      appendTerminalNotice(
        '<div class="p-3 my-2 rounded bg-black/60 border border-white/10 text-xs font-mono space-y-1.5">' +
        '<div class="text-emerald-400 font-bold text-sm">🐧 LINUX TERMINAL QUIZ HELP & COMMANDS</div>' +
        '<div><span class="text-amber-400 font-bold">hint</span> : แสดงคำใบ้ของโจทย์ข้อปัจจุบัน</div>' +
        '<div><span class="text-amber-400 font-bold">solution</span> / <span class="text-amber-400 font-bold">solve</span> : แสดงเฉลยคำสั่งที่ถูกต้องและคำอธิบายภาษาไทย</div>' +
        '<div><span class="text-amber-400 font-bold">next</span> / <span class="text-amber-400 font-bold">prev</span> : ข้ามไปข้อถัดไป หรือย้อนกลับข้อก่อนหน้า</div>' +
        '<div><span class="text-amber-400 font-bold">goto &lt;num&gt;</span> : กระโดดไปยังข้อที่ระบุ (1-58) เช่น goto 15</div>' +
        '<div><span class="text-amber-400 font-bold">score</span> : ดูคะแนน, ความแม่นยำ และ streak ล่าสุด</div>' +
        '<div><span class="text-amber-400 font-bold">clear</span> : ล้างหน้าจอเทอร์มินัล (หรือกด Ctrl+L)</div>' +
        '<div><span class="text-amber-400 font-bold">ls / pwd / whoami</span> : คำสั่งพื้นฐานจำลองของ Linux</div>' +
        '<div class="text-slate-400 pt-1">⌨️ Shortcuts: [Tab] Autocomplete, [↑/↓] Command History, [Ctrl+C] Cancel line</div>' +
        '</div>'
      );
    }

    // Stats Display
    function updateStatsDisplay() {
      document.getElementById('statScore').textContent = score;
      document.getElementById('statStreak').textContent = streak;
    }

    // Check Completion
    function checkCompletion() {
      const solvedCount = Object.values(questionStates).filter(s => s.status === 'correct').length;
      if (solvedCount === filteredQuestions.length) {
        document.getElementById('compScore').textContent = score;
        const accuracy = Math.round((solvedCount / Math.max(1, solvedCount + Object.values(questionStates).filter(s => s.status === 'attempted').length)) * 100);
        document.getElementById('compAccuracy').textContent = accuracy + '%';
        document.getElementById('compTime').textContent = document.getElementById('timerDisplay').textContent;
        document.getElementById('modalCompletion').classList.remove('hidden');
      }
    }

    function restartQuiz() {
      initQuestionStates();
      score = 0;
      streak = 0;
      maxStreak = 0;
      timerSeconds = 0;
      updateStatsDisplay();
      currentIndex = 0;
      document.getElementById('modalCompletion').classList.add('hidden');
      clearTerminal();
      loadCurrentQuestion();
    }

    // Grid Modal Rendering
    function renderGridButtons() {
      const container = document.getElementById('gridButtonsContainer');
      container.innerHTML = '';
      let solved = 0;

      filteredQuestions.forEach((q, idx) => {
        const state = questionStates[q.id] || { status: 'pending' };
        if (state.status === 'correct') solved++;

        const btn = document.createElement('button');
        btn.textContent = (idx + 1).toString();
        btn.className = 'h-9 rounded-lg font-bold flex items-center justify-center transition border ';

        if (idx === currentIndex) {
          btn.className += 'ring-2 ring-white scale-105 ';
        }

        if (state.status === 'correct') {
          btn.className += 'bg-emerald-600/80 hover:bg-emerald-500 text-white border-emerald-500 ';
        } else if (state.status === 'revealed') {
          btn.className += 'bg-amber-600/80 hover:bg-amber-500 text-white border-amber-500 ';
        } else if (state.status === 'attempted') {
          btn.className += 'bg-rose-600/80 hover:bg-rose-500 text-white border-rose-500 ';
        } else {
          btn.className += 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 ';
        }

        btn.onclick = () => {
          currentIndex = idx;
          loadCurrentQuestion();
          document.getElementById('modalGrid').classList.add('hidden');
        };

        container.appendChild(btn);
      });

      document.getElementById('gridProgressText').textContent = solved + '/' + filteredQuestions.length;
    }

    // Cheat Sheet Modal Rendering
    function renderCheatSheet(filterTerm = '') {
      const tbody = document.getElementById('cheatTableBody');
      tbody.innerHTML = '';
      const lowerFilter = filterTerm.toLowerCase();

      QUIZ_QUESTIONS.forEach(q => {
        if (lowerFilter && !q.question.toLowerCase().includes(lowerFilter) && !q.canonical_answer.toLowerCase().includes(lowerFilter) && !q.section.toLowerCase().includes(lowerFilter)) {
          return;
        }

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/5 transition';
        tr.innerHTML = 
          '<td class="py-2.5 px-2 text-slate-400 font-bold">' + q.id + '</td>' +
          '<td class="py-2.5 px-2 text-[11px] text-blue-300">' + escapeHtml(q.section.replace('Quiz ', '')) + '</td>' +
          '<td class="py-2.5 px-2 text-white">' + escapeHtml(q.question) + '</td>' +
          '<td class="py-2.5 px-2 text-emerald-400 font-bold select-all">' + escapeHtml(q.canonical_answer) + '</td>' +
          '<td class="py-2.5 px-2 text-center">' +
          '<button onclick="jumpToAndFill(' + q.id + ', \\'' + escapeAttr(q.canonical_answer) + '\\')" class="px-2 py-1 rounded bg-indigo-600/60 hover:bg-indigo-500 text-white text-[10px] transition">' +
          'Run' +
          '</button>' +
          '</td>';
        tbody.appendChild(tr);
      });
    }

    function jumpToAndFill(globalId, commandText) {
      document.getElementById('modalCheatSheet').classList.add('hidden');
      jumpToQuestion(globalId);
      const cleanCmd = commandText.replace(/\\s*\\(.*?\\)/g, '').trim();
      document.getElementById('cmdInput').value = cleanCmd;
      updateCaretMirror();
      focusTerminalInput();
    }

    // HTML Escape Helper
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function escapeAttr(str) {
      if (!str) return '';
      return String(str).replace(/'/g, "\\\\'");
    }

    // Global Event Listeners
    document.getElementById('topicSelect').addEventListener('change', (e) => {
      applyTopicFilter(e.target.value);
    });

    document.getElementById('themeSelect').addEventListener('change', (e) => {
      document.body.className = e.target.value + ' min-h-screen flex flex-col';
    });

    document.getElementById('btnSound').addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      document.getElementById('soundIcon').textContent = soundEnabled ? '🔊' : '🔇';
    });

    document.getElementById('btnCrt').addEventListener('click', () => {
      document.getElementById('terminalWindow').classList.toggle('crt-effect');
    });

    document.getElementById('btnOpenGrid').addEventListener('click', () => {
      renderGridButtons();
      document.getElementById('modalGrid').classList.remove('hidden');
    });

    document.getElementById('btnCloseGrid').addEventListener('click', () => {
      document.getElementById('modalGrid').classList.add('hidden');
    });

    document.getElementById('btnCheatSheet').addEventListener('click', () => {
      renderCheatSheet();
      document.getElementById('modalCheatSheet').classList.remove('hidden');
    });

    document.getElementById('btnCloseCheatSheet').addEventListener('click', () => {
      document.getElementById('modalCheatSheet').classList.add('hidden');
    });

    document.getElementById('cheatSearchInput').addEventListener('input', (e) => {
      renderCheatSheet(e.target.value);
    });

    // Window controls
    document.getElementById('winBtnClose').addEventListener('click', () => {
      if (confirm('ต้องการกลับไปยังหน้าหลัก MCQ Exam หรือไม่?')) {
        window.location.href = 'index.html';
      }
    });

    document.getElementById('winBtnMinimize').addEventListener('click', () => {
      clearTerminal();
    });

    document.getElementById('winBtnMaximize').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // HUD Button Handlers
    document.getElementById('btnHudHint').addEventListener('click', showHint);
    document.getElementById('btnCloseHint').addEventListener('click', () => {
      document.getElementById('hudHintBox').classList.add('hidden');
    });

    document.getElementById('btnHudSolve').addEventListener('click', revealSolution);
    document.getElementById('btnCloseSolution').addEventListener('click', () => {
      document.getElementById('hudSolutionBox').classList.add('hidden');
    });

    document.getElementById('btnHudPrev').addEventListener('click', prevQuestion);
    document.getElementById('btnHudNext').addEventListener('click', nextQuestion);

    // Keyboard Shortcuts (Alt+Left/Right for nav)
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowRight') {
        nextQuestion();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        prevQuestion();
      }
    });

    // Initialize on Page Load
    window.addEventListener('DOMContentLoaded', () => {
      initQuestionStates();
      applyTopicFilter('all');
      startTimer();
      focusTerminalInput();
      updateCaretMirror();
    });
  </script>

</body>
</html>`;

fs.writeFileSync('terminal.html', html, 'utf8');
console.log('Successfully generated terminal.html (' + html.length + ' bytes)');
