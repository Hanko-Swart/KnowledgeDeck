export type AIProvider = 'huggingface' | 'none';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TagGenerationResponse {
  tags: string[];
  confidence: number;
}

export interface SummaryGenerationResponse {
  summary: string;
  confidence: number;
}

export interface SimilaritySearchResponse {
  similarItems: Array<{
    id: string;
    score: number;
  }>;
}

export interface AIService {
  generateTags(content: string): Promise<AIResponse<TagGenerationResponse>>;
  generateSummary(content: string): Promise<AIResponse<SummaryGenerationResponse>>;
  findSimilarContent(content: string, items: string[]): Promise<AIResponse<SimilaritySearchResponse>>;
} 