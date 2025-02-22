import type { AIService, AIResponse, TagGenerationResponse, SummaryGenerationResponse, SimilaritySearchResponse } from '@/types/ai';

export class FallbackAIService implements AIService {
  private readonly stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
    'this', 'from', 'with', 'by', 'for', 'not', 'are', 'but',
    'what', 'when', 'where', 'how', 'all', 'any', 'both', 'each'
  ]);

  async generateTags(content: string): Promise<AIResponse<TagGenerationResponse>> {
    try {
      // Extract potential tags from content using basic rules
      const words = content.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !this.stopWords.has(word));
      
      const wordFrequency = new Map<string, number>();
      words.forEach(word => {
        wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
      });

      // Sort by frequency and get top 5 words as tags
      const tags = Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

      return {
        success: true,
        data: {
          tags,
          confidence: 0.5 // Lower confidence for fallback method
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate tags using fallback method'
      };
    }
  }

  async generateSummary(content: string): Promise<AIResponse<SummaryGenerationResponse>> {
    try {
      // Basic summary: first few sentences (up to 150 characters)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 2).join('. ').trim();

      return {
        success: true,
        data: {
          summary: summary.length > 150 ? summary.slice(0, 147) + '...' : summary,
          confidence: 0.5
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate summary using fallback method'
      };
    }
  }

  async findSimilarContent(content: string, items: string[]): Promise<AIResponse<SimilaritySearchResponse>> {
    try {
      // Basic similarity: keyword matching
      const keywords = content.toLowerCase().split(/\s+/);
      
      const similarItems = items.map((item, index) => {
        const itemWords = item.toLowerCase().split(/\s+/);
        const matchCount = keywords.filter(word => itemWords.includes(word)).length;
        const score = matchCount / Math.max(keywords.length, itemWords.length);
        
        return {
          id: index.toString(),
          score
        };
      });

      // Sort by score and return top matches
      similarItems.sort((a, b) => b.score - a.score);

      return {
        success: true,
        data: {
          similarItems: similarItems.slice(0, 5)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to find similar content using fallback method'
      };
    }
  }
} 