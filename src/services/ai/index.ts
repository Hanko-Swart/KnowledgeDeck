import type { AIService, AIConfig, AIResponse, TagGenerationResponse, SummaryGenerationResponse, SimilaritySearchResponse } from '@/types/ai';
import { AIConfigManager } from './config';
import { HuggingFaceService } from './huggingface';

class NoOpAIService implements AIService {
  async generateTags(): Promise<AIResponse<TagGenerationResponse>> {
    return {
      success: false,
      error: 'AI service is not configured'
    };
  }

  async generateSummary(): Promise<AIResponse<SummaryGenerationResponse>> {
    return {
      success: false,
      error: 'AI service is not configured'
    };
  }

  async findSimilarContent(): Promise<AIResponse<SimilaritySearchResponse>> {
    return {
      success: false,
      error: 'AI service is not configured'
    };
  }
}

export class AIServiceFactory {
  private static instance: AIService | null = null;
  private static config: AIConfig | null = null;

  static async getInstance(): Promise<AIService> {
    if (!this.instance || !this.config) {
      await this.initialize();
    }
    return this.instance!;
  }

  static async initialize(): Promise<void> {
    this.config = await AIConfigManager.getConfig();
    
    switch (this.config.provider) {
      case 'huggingface':
        if (this.config.apiKey) {
          this.instance = new HuggingFaceService(this.config.apiKey);
        } else {
          this.instance = new NoOpAIService();
        }
        break;
      default:
        this.instance = new NoOpAIService();
    }
  }

  static async updateConfig(config: AIConfig): Promise<void> {
    await AIConfigManager.setConfig(config);
    await this.initialize();
  }
}

// Export a convenient way to access the AI service
export const getAIService = AIServiceFactory.getInstance.bind(AIServiceFactory); 