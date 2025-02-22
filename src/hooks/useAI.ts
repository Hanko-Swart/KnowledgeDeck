import { useState, useCallback } from 'react';
import type { AIResponse } from '@/services/ai/types';
import { getAIService } from '@/services/ai';

interface UseAIResult {
  isLoading: boolean;
  error: string | null;
  generateTags: (content: string) => Promise<string[]>;
  generateSummary: (content: string) => Promise<string>;
  findSimilarContent: (content: string, items: string[]) => Promise<Array<{ id: string; score: number }>>;
}

export function useAI(): UseAIResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIResponse = <T>(response: AIResponse<T>): T => {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'AI operation failed');
    }
    return response.data;
  };

  const generateTags = useCallback(async (content: string): Promise<string[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const service = await getAIService();
      const response = await service.generateTags(content);
      const result = handleAIResponse(response);
      return result.tags || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate tags';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSummary = useCallback(async (content: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const service = await getAIService();
      const response = await service.generateSummary(content);
      const result = handleAIResponse(response);
      
      if (!result.summary) {
        throw new Error('AI service returned an empty summary');
      }

      const summary = result.summary.trim();
      if (summary === '') {
        throw new Error('AI service returned an empty summary');
      }

      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findSimilarContent = useCallback(async (content: string, items: string[]): Promise<Array<{ id: string; score: number }>> => {
    setIsLoading(true);
    setError(null);
    try {
      const service = await getAIService();
      const response = await service.findSimilarContent(content, items);
      const result = handleAIResponse(response);
      return result.similarItems || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find similar content';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    generateTags,
    generateSummary,
    findSimilarContent,
  };
} 