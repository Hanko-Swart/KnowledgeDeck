import type { AIConfig } from '@/types/ai';

const AI_CONFIG_KEY = 'knowledgeDeck_aiConfig';

export class AIConfigManager {
  static async getConfig(): Promise<AIConfig> {
    const result = await chrome.storage.local.get(AI_CONFIG_KEY);
    return result[AI_CONFIG_KEY] || { provider: 'none' };
  }

  static async setConfig(config: AIConfig): Promise<void> {
    await chrome.storage.local.set({ [AI_CONFIG_KEY]: config });
  }

  static async getApiKey(): Promise<string | undefined> {
    const config = await this.getConfig();
    return config.apiKey;
  }

  static async setApiKey(apiKey: string): Promise<void> {
    const config = await this.getConfig();
    await this.setConfig({ ...config, apiKey });
  }
} 