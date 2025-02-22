import type { AIService, AIConfig, AIResponse, TagGenerationResponse, SummaryGenerationResponse, SimilaritySearchResponse } from '@/types/ai';
import { AIConfigManager } from './config';
import { HuggingFaceService } from './huggingface';
import { FallbackAIService } from './fallback';

export class AIServiceFactory {
  private static instance: AIService | null = null;
  private static config: AIConfig | null = null;
  private static fallbackService: FallbackAIService = new FallbackAIService();
  private static healthCheckInterval: number | null = null;

  static async getInstance(): Promise<AIService> {
    if (!this.instance || !this.config) {
      await this.initialize();
    }
    return this.instance!;
  }

  static async initialize(): Promise<void> {
    this.config = await AIConfigManager.getConfig();
    
    if (this.config.provider === 'huggingface' && this.config.apiKey) {
      try {
        const service = new HuggingFaceService(this.config.apiKey);
        // Test the service
        const testResponse = await service.generateTags('test');
        if (testResponse.success) {
          this.instance = service;
          await this.startHealthCheck(service);
          return;
        }
        // If test fails, fall through to fallback
        console.warn('AI service test failed, using fallback service');
      } catch (error) {
        console.error('Failed to initialize AI service:', error);
      }
    }
    
    // Use fallback service if no provider configured or initialization failed
    console.log('Using fallback AI service');
    this.instance = this.fallbackService;
  }

  private static async startHealthCheck(service: AIService): Promise<void> {
    // Clear existing health check
    if (this.healthCheckInterval !== null) {
      clearInterval(this.healthCheckInterval);
    }

    // Perform health checks every 5 minutes
    this.healthCheckInterval = window.setInterval(async () => {
      try {
        const response = await service.generateTags('health check');
        if (!response.success) {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.warn('AI service health check failed:', error);
        this.instance = this.fallbackService;
      }
    }, 5 * 60 * 1000);
  }

  static async updateConfig(config: AIConfig): Promise<void> {
    await AIConfigManager.setConfig(config);
    await this.initialize();
  }
}

// Export a convenient way to access the AI service
export const getAIService = AIServiceFactory.getInstance.bind(AIServiceFactory); 