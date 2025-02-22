import React, { useState, useEffect } from 'react';
import type { AIConfig, AIProvider } from '@/types/ai';
import { AIConfigManager } from '@/services/ai/config';
import { AIServiceFactory } from '@/services/ai';

export const AISettings: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>({ provider: 'none' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await AIConfigManager.getConfig();
      setConfig(savedConfig);
    } catch (err) {
      setError('Failed to load AI configuration');
    }
  };

  const handleProviderChange = (provider: AIProvider) => {
    setConfig(prev => ({ ...prev, provider }));
    if (provider === 'none') {
      setConfig(prev => ({ ...prev, apiKey: undefined }));
    }
  };

  const handleApiKeyChange = (apiKey: string) => {
    setConfig(prev => ({ ...prev, apiKey }));
  };

  const testConnection = async () => {
    setTestResult(null);
    setError(null);
    
    if (!config.apiKey) {
      setError('Please enter an API key');
      return;
    }

    try {
      await AIServiceFactory.updateConfig(config);
      const service = await AIServiceFactory.getInstance();
      const response = await service.generateTags('Test connection');
      
      if (response.success) {
        setTestResult('Connection successful!');
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test connection');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await AIServiceFactory.updateConfig(config);
      setTestResult('Settings saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">AI Service Configuration</h2>
        
        {/* Provider Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1">
            AI Provider
          </label>
          <select
            value={config.provider}
            onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="none">No AI (Basic Features Only)</option>
            <option value="huggingface">Hugging Face (Recommended)</option>
          </select>
        </div>

        {/* API Key Input */}
        {config.provider !== 'none' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your API key"
            />
            <p className="mt-1 text-sm text-muted-foreground">
              Get your free API key from{' '}
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                Hugging Face
              </a>
            </p>
          </div>
        )}

        {/* Test Connection Button */}
        {config.provider !== 'none' && config.apiKey && (
          <button
            type="button"
            onClick={testConnection}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors"
          >
            Test Connection
          </button>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
        {testResult && (
          <div className="mt-4 p-3 bg-primary/10 text-primary rounded-lg">
            {testResult}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </form>
  );
}; 