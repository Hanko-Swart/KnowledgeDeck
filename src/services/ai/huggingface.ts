import type { AIService, AIResponse, TagGenerationResponse, SummaryGenerationResponse, SimilaritySearchResponse } from '@/types/ai';

export class HuggingFaceService implements AIService {
  private apiKey: string;
  private static readonly API_URL = 'https://api-inference.huggingface.co/models';
  
  // Model endpoints
  private static readonly MODELS = {
    summarization: 'facebook/bart-large-cnn',
    tagging: 'dbmdz/bert-large-cased-finetuned-conll03-english',
    similarity: 'sentence-transformers/all-MiniLM-L6-v2'
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async query<T>(model: string, inputs: any): Promise<AIResponse<T>> {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T
      };
    } catch (error) {
      console.error('HuggingFace API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateTags(content: string): Promise<AIResponse<TagGenerationResponse>> {
    interface NERResponse {
      word: string;
      score: number;
      entity: string;
    }

    const response = await this.query<NERResponse[]>(HuggingFaceService.MODELS.tagging, content);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to generate tags'
      };
    }

    // Process the NER results into tags
    const entities = new Set(response.data
      .filter(item => item.score > 0.5)
      .map(item => item.word.toLowerCase()));

    return {
      success: true,
      data: {
        tags: Array.from(entities),
        confidence: 0.8 // Average confidence score
      }
    };
  }

  async generateSummary(content: string): Promise<AIResponse<SummaryGenerationResponse>> {
    interface SummaryResponse {
      summary_text: string;
      score?: number;
    }

    const response = await this.query<SummaryResponse[]>(HuggingFaceService.MODELS.summarization, content);
    
    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to generate summary'
      };
    }

    return {
      success: true,
      data: {
        summary: response.data[0].summary_text,
        confidence: response.data[0].score || 0.8
      }
    };
  }

  async findSimilarContent(content: string, items: string[]): Promise<AIResponse<SimilaritySearchResponse>> {
    // Get embeddings for the query content
    const queryResponse = await this.query<number[]>(HuggingFaceService.MODELS.similarity, content);
    
    if (!queryResponse.success || !queryResponse.data) {
      return {
        success: false,
        error: queryResponse.error || 'Failed to get query embeddings'
      };
    }

    // Get embeddings for all items
    const itemsResponse = await this.query<number[][]>(HuggingFaceService.MODELS.similarity, items);
    
    if (!itemsResponse.success || !itemsResponse.data) {
      return {
        success: false,
        error: itemsResponse.error || 'Failed to get item embeddings'
      };
    }

    // Calculate cosine similarity between query and items
    const similarities = itemsResponse.data.map((embedding: number[], index: number) => ({
      id: index.toString(),
      score: this.cosineSimilarity(queryResponse.data, embedding)
    }));

    // Sort by similarity score
    similarities.sort((a, b) => b.score - a.score);

    return {
      success: true,
      data: {
        similarItems: similarities
      }
    };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
} 