import type { AIService, AIResponse, TagGenerationResponse, SummaryGenerationResponse, SimilaritySearchResponse } from '@/types/ai';
import { AICache } from './cache';

export class HuggingFaceService implements AIService {
  private apiKey: string;
  private static readonly API_URL = 'https://api-inference.huggingface.co/models';
  
  // Model endpoints
  private static readonly MODELS = {
    summarization: 'facebook/bart-large-cnn',
    tagging: 'dbmdz/bert-large-cased-finetuned-conll03-english',
    similarity: 'sentence-transformers/all-MiniLM-L6-v2',
    description: 'facebook/opt-350m'
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async query<T>(model: string, inputs: any): Promise<AIResponse<T>> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(`${HuggingFaceService.API_URL}/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs })
        });

        if (!response.ok) {
          switch (response.status) {
            case 503:
              if (attempt < maxRetries - 1) {
                // Wait with exponential backoff before retrying
                await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
                continue;
              }
              throw new Error('Service is temporarily unavailable. Please try again later.');
            case 429:
              throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
            case 401:
              throw new Error('Invalid API key. Please check your settings.');
            default:
              throw new Error(`API request failed with status: ${response.status}`);
          }
        }

        const data = await response.json();
        return {
          success: true,
          data: data as T
        };
      } catch (error) {
        if (attempt === maxRetries - 1) {
          console.error('HuggingFace API error:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      }
    }

    return {
      success: false,
      error: 'Maximum retry attempts reached'
    };
  }

  async generateTags(content: string): Promise<AIResponse<TagGenerationResponse>> {
    const cacheKey = AICache.createKey('tags', content);
    const cached = await AICache.get<TagGenerationResponse>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.query<TagGenerationResponse>(
      HuggingFaceService.MODELS.tagging,
      content
    );

    if (response.success && response.data) {
      await AICache.set(cacheKey, response.data);
    }

    return response;
  }

  async generateSummary(content: string): Promise<AIResponse<SummaryGenerationResponse>> {
    const cacheKey = AICache.createKey('summary', content);
    const cached = await AICache.get<SummaryGenerationResponse>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    // Format input for BART model - it expects plain text
    const formattedContent = content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1024); // BART has a token limit, so we'll take first 1024 chars

    const response = await this.query<any>(
      HuggingFaceService.MODELS.summarization,
      formattedContent
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to generate summary'
      };
    }

    try {
      // Handle different response formats from the model
      let description = '';
      
      if (Array.isArray(response.data)) {
        description = response.data[0]?.summary_text || '';
      } else if (typeof response.data === 'object') {
        description = response.data.summary_text || response.data.summary || '';
      } else if (typeof response.data === 'string') {
        description = response.data;
      }

      description = description.trim();

      // Ensure we have a valid description
      if (!description) {
        return {
          success: false,
          error: 'Generated description was empty'
        };
      }

      const cleanedResponse = {
        summary: description.length > 250 ? description.slice(0, 247) + '...' : description,
        confidence: 0.8
      };

      await AICache.set(cacheKey, cleanedResponse);
      return { success: true, data: cleanedResponse };
    } catch (error) {
      console.error('Error processing summary response:', error);
      return {
        success: false,
        error: 'Failed to process the generated summary'
      };
    }
  }

  async findSimilarContent(content: string, items: string[]): Promise<AIResponse<SimilaritySearchResponse>> {
    const cacheKey = AICache.createKey('similar', content + items.join(''));
    const cached = await AICache.get<SimilaritySearchResponse>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached };
    }

    const response = await this.query<SimilaritySearchResponse>(
      HuggingFaceService.MODELS.similarity,
      { content, items }
    );

    if (response.success && response.data) {
      await AICache.set(cacheKey, response.data);
    }

    return response;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
} 