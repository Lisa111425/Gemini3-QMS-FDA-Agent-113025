import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Terminal, Activity, FileText, Play, Save, 
  Moon, Sun, Globe, CheckCircle, AlertTriangle, Cpu, Flower 
} from 'lucide-react';

import { FLOWER_THEMES, DEFAULT_TEMPLATE, DEFAULT_OBSERVATIONS, FOLLOW_UP_QUESTIONS_EN, FOLLOW_UP_QUESTIONS_ZH } from './constants';
import { AgentConfig, LogEntry, Language, ModelType, DashboardData } from './types';
import JackslotTheme from './components/JackslotTheme';
import Dashboard from './components/Dashboard';
import { generateGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(FLOWER_THEMES[0]);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  // API Keys (In memory only)
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    anthropic: '',
  });

  // Config
  const [config, setConfig] = useState<AgentConfig>({
    id: 'default-agent',
    name: 'Audit Agent',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    maxTokens: 12000,
    temperature: 0.3,
    systemPrompt: "You are an expert ISO 13485 auditor.",
    userPrompt: "Analyze the observations against the template.",
  });

  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [observations, setObservations] = useState(DEFAULT_OBSERVATIONS);
  const [output, setOutput] = useState("");
  
  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    timeLabels: ['10:00', '10:05', '10:10', '10:15', '10:20'],
    latencyData: [120, 150, 110, 180, 130],
    tokenData: [450, 2300, 1200, 5600, 3100],
  });

  const logsEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
  }, [theme, isDark]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- Helpers ---
  const addLog = (level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const handleRun = async () => {
    setIsProcessing(true);
    setStatus('running');
    setOutput("");
    addLog('info', `Starting pipeline execution with model: ${config.model}`);

    const startTime = Date.now();

    try {
      let resultText = "";

      // Check if we can use real API
      const canUseRealGemini = config.provider === 'gemini' && (apiKeys.gemini || process.env.API_KEY);

      if (canUseRealGemini) {
        // Use real service
        const keyToUse = apiKeys.gemini || process.env.API_KEY || ''; // Fallback safe
        addLog('info', 'Connecting to Google Gemini API...');
        resultText = await generateGeminiResponse(
          keyToUse,
          config.model,
          config.systemPrompt,
          `${config.userPrompt}\n\nTEMPLATE:\n${template}\n\nOBSERVATIONS:\n${observations}`,
          config.maxTokens,
          config.temperature
        );
      } else {
        // Simulation Mode
        addLog('warning', 'No API key provided (or provider not Gemini). Running in Simulation Mode.');
        await new Promise(r => setTimeout(r, 800));
        addLog('info', 'Analyzing Template structure...');
        await new Promise(r => setTimeout(r, 800));
        addLog('info', 'Processing Observations...');
        await new Promise(r => setTimeout(r, 1200));
        
        resultText = `
# Audit Report (SIMULATED OUTPUT)

## 1. Scope
The audit covered the manufacturing process and quality records for Q3 2023.

## 2. Observations
| ID | Type | Description | Clause |
|----|------|-------------|--------|
| 01 | NC   | Missing signature on batch record #B-123 indicates a failure in Good Documentation Practices. | 8.2.1 |
| 02 | NC   | Temperature excursion on 2023-10-15 was not documented in a deviation report. | 6.4 |
| 03 | NC   | SOP-QA-005 training missing for 3 employees. | 6.2 |

## 3. Conclusion
Significant gaps in documentation and environmental monitoring were observed. Immediate CAPA is required.
        `;
      }

      const endTime = Date.now();
      const latency = endTime - startTime;
      
      setOutput(resultText);
      setStatus('success');
      addLog('success', `Execution completed in ${latency}ms`);
      
      // Update Dashboard
      setDashboardData(prev => ({
        timeLabels: [...prev.timeLabels.slice(1), new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})],
        latencyData: [...prev.latencyData.slice(1), latency],
        tokenData: [...prev.tokenData.slice(1), Math.floor(Math.random() * 2000) + 1000], // Simulated token count if not from API
      }));

    } catch (err: any) {
      setStatus('error');
      addLog('error', `Execution failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Render ---
  return (
    <div className="flex h-screen overflow-hidden text-text bg-background font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 bg-surface border-r border-black/5 dark:border-white/5 flex flex-col overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[var(--color-primary)] rounded-lg shadow-lg shadow-[var(--color-primary)]/30">
              <Flower className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AuditFlow AI</h1>
          </div>

          <JackslotTheme currentTheme={theme} onThemeSelect={setTheme} isDark={isDark} />

          <div className="mt-8 space-y-6">
            
            {/* Global Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-50 flex items-center gap-2">
                <Settings className="w-3 h-3" /> System
              </h3>
              
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-black/5 dark:border-white/5">
                <span className="text-sm font-medium flex items-center gap-2">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} 
                  Mode
                </span>
                <button 
                  onClick={() => setIsDark(!isDark)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-[var(--color-accent)]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${isDark ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-black/5 dark:border-white/5">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </span>
                <div className="flex bg-black/5 dark:bg-white/5 rounded p-1">
                  <button onClick={() => setLang('en')} className={`px-2 py-0.5 text-xs rounded ${lang === 'en' ? 'bg-white text-black shadow-sm' : ''}`}>EN</button>
                  <button onClick={() => setLang('zh')} className={`px-2 py-0.5 text-xs rounded ${lang === 'zh' ? 'bg-white text-black shadow-sm' : ''}`}>繁中</button>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-50">API Keys</h3>
              {(['gemini', 'openai', 'anthropic'] as const).map(provider => (
                <div key={provider} className="relative group">
                  <input 
                    type="password"
                    placeholder={`Enter ${provider.charAt(0).toUpperCase() + provider.slice(1)} Key`}
                    value={apiKeys[provider]}
                    onChange={(e) => setApiKeys({...apiKeys, [provider]: e.target.value})}
                    className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  />
                  {/* Visual indicator if key is "present" in env (simulated) */}
                  <div className="absolute right-3 top-2.5 w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Environment Key Available (Simulated)" />
                </div>
              ))}
            </div>

            {/* Model Config */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-50 flex items-center gap-2">
                <Cpu className="w-3 h-3" /> Model Config
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium opacity-70">Model</label>
                <select 
                  value={config.model}
                  onChange={(e) => setConfig({...config, model: e.target.value as ModelType})}
                  className="w-full bg-background border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini (Preview)</option>
                  <option value="gpt5-nano">gpt5-nano (Beta)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-medium opacity-70">Max Tokens</label>
                  <span className="text-xs opacity-50">{config.maxTokens}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="32000" 
                  step="1000"
                  value={config.maxTokens}
                  onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                  className="w-full accent-[var(--color-primary)] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium opacity-70">System Prompt</label>
                <textarea 
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                  className="w-full h-20 bg-background border border-black/10 dark:border-white/10 rounded-lg p-3 text-xs resize-none outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header / Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-black/5 dark:border-white/5 bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`
              px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
              ${status === 'idle' ? 'border-gray-400 text-gray-400' : ''}
              ${status === 'running' ? 'border-[var(--color-accent)] text-[var(--color-accent)] animate-pulse' : ''}
              ${status === 'success' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : ''}
              ${status === 'error' ? 'border-red-500 text-red-500 bg-red-500/10' : ''}
            `}>
              {status === 'running' ? 'Thinking...' : status}
            </div>
            {/* WOW Status Indicator */}
            {status === 'success' && (
              <span className="animate-bounce inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/50">
                WOW!
              </span>
            )}
          </div>

          <button 
            onClick={handleRun}
            disabled={isProcessing}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white shadow-lg transform transition-all active:scale-95
              ${isProcessing ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:shadow-[var(--color-accent)]/30'}
            `}
          >
            {isProcessing ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {isProcessing ? 'Running...' : 'Run Pipeline'}
          </button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold opacity-70">
                <FileText className="w-4 h-4" /> Template (Markdown)
              </label>
              <textarea 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-64 bg-surface border border-black/10 dark:border-white/10 rounded-xl p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                spellCheck={false}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold opacity-70">
                <Activity className="w-4 h-4" /> Observations (Data)
              </label>
              <textarea 
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full h-64 bg-surface border border-black/10 dark:border-white/10 rounded-xl p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Interactive Dashboard */}
          <section>
            <h2 className="text-xl font-bold mb-4">Live Dashboard</h2>
            <Dashboard data={dashboardData} isDark={isDark} />
          </section>

          {/* Execution Log */}
          <section className="bg-black/90 rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <div className="px-4 py-2 bg-white/5 flex items-center gap-2 border-b border-white/10">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-mono text-gray-400">Execution Log</span>
            </div>
            <div className="h-48 overflow-y-auto p-4 font-mono text-xs space-y-1">
              {logs.length === 0 && <span className="text-gray-600 italic">Waiting for execution...</span>}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <span className="text-gray-500">[{log.timestamp}]</span>
                  <span className={`
                    ${log.level === 'info' ? 'text-blue-400' : ''}
                    ${log.level === 'success' ? 'text-emerald-400' : ''}
                    ${log.level === 'warning' ? 'text-yellow-400' : ''}
                    ${log.level === 'error' ? 'text-red-400' : ''}
                  `}>{log.level.toUpperCase()}</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </section>

          {/* Final Output */}
          {output && (
            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Generated Report</h2>
                <button className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-surface border border-black/10 hover:bg-black/5 transition-colors">
                  <Save className="w-3 h-3" /> Save Markdown
                </button>
              </div>
              <div className="bg-surface rounded-xl p-8 shadow-sm border border-black/5 dark:border-white/5 prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
              </div>
            </section>
          )}

          {/* Follow Up Questions */}
          <section className="pb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
              Follow-up Questions (Analysis)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(lang === 'en' ? FOLLOW_UP_QUESTIONS_EN : FOLLOW_UP_QUESTIONS_ZH).map((q, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl bg-surface border border-black/5 dark:border-white/5 hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-[var(--color-primary)] text-xs font-bold mb-2 block">Q{i + 1}</span>
                  <p className="text-sm opacity-80 group-hover:opacity-100">{q}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;