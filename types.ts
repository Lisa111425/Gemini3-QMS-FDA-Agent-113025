export type Language = 'en' | 'zh';

export type Theme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

export type ModelType = 
  | 'gpt-4o-mini' 
  | 'gpt-4.1-mini' 
  | 'gpt5-nano' 
  | 'gemini-2.5-flash' 
  | 'gemini-2.5-flash-lite';

export interface AgentConfig {
  id: string;
  name: string;
  provider: 'gemini' | 'openai' | 'anthropic';
  model: ModelType;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  userPrompt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface ExecutionStats {
  latency: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface DashboardData {
  timeLabels: string[];
  latencyData: number[];
  tokenData: number[];
}