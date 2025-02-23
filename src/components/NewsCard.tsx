import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Bot, Volume2, VolumeX } from 'lucide-react';
import Groq from 'groq-sdk';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export function NewsCard({ article }: NewsCardProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string[] | null>(article.aiSummary ? article.aiSummary.split('\n') : null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const generateAISummary = async () => {
    if (isGeneratingSummary || aiSummary) return;

    setIsGeneratingSummary(true);
    setError(null);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: `Analyze the article at ${article.url} and provide a clear, concise summary in 3-5 bullet points. Each point should be a complete thought but brief. Focus on the main facts and key takeaways. Do not use markdown formatting or special characters. Start each point with a dash (-).`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 200,
        top_p: 1,
        stream: false,
      });

      const summary = completion.choices[0]?.message?.content;

      if (!summary) {
        throw new Error('Could not generate a summary. Please try again.');
      }

      const bulletPoints = summary
        .split('\n')
        .map(point => point.trim())
        .filter(point => point.startsWith('-'))
        .map(point => point.substring(1).trim());

      if (bulletPoints.length === 0) {
        throw new Error('Could not generate proper bullet points. Please try again.');
      }

      setAiSummary(bulletPoints);
      article.aiSummary = bulletPoints.join('\n');
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const getBestVoice = (): SpeechSynthesisVoice | null => {
    // Preferred voices in order (these are common high-quality voices)
    const preferredVoices = [
      'Google UK English Female',
      'Microsoft Libby Online (Natural)',
      'Microsoft Catherine',
      'Alex',
      'Samantha'
    ];

    // Try to find a preferred voice first
    for (const preferredVoice of preferredVoices) {
      const voice = voices.find(v => v.name === preferredVoice);
      if (voice) return voice;
    }

    // Fall back to any natural-sounding English voice
    const naturalVoice = voices.find(
      voice => voice.name.toLowerCase().includes('natural') && voice.lang.startsWith('en')
    );
    if (naturalVoice) return naturalVoice;

    // Fall back to any English voice
    const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
    if (englishVoice) return englishVoice;

    // If no English voice is found, return null and let the browser use the default
    return null;
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setSpeechSynthesis(null);
      return;
    }

    const text = `${article.title}. ${article.summary}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set speech properties for more natural sound
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Get the best available voice
    const bestVoice = getBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    // Add slight pauses for more natural speech
    const processedText = text
      .replace(/\. /g, '... ') // Add slight pause after periods
      .replace(/\! /g, '!... ') // Add slight pause after exclamation marks
      .replace(/\? /g, '?... ') // Add slight pause after question marks
      .replace(/\, /g, ', '); // Slight pause after commas

    utterance.text = processedText;

    // Handle speech end
    utterance.onend = () => {
      setIsPlaying(false);
      setSpeechSynthesis(null);
    };

    // Handle speech error
    utterance.onerror = () => {
      setIsPlaying(false);
      setSpeechSynthesis(null);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setSpeechSynthesis(utterance);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  // Format the summary text with proper paragraphs
  const formattedSummary = article.summary
    .split('\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {paragraph.trim()}
      </p>
    ));

  return (
    <article className="py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{article.source}</span>
          <span>•</span>
          <span>{format(new Date(article.publishedAt), 'MMM d')}</span>
        </div>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h2>
        <div className="relative">
          <div className={`text-gray-600 dark:text-gray-300 text-sm space-y-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {formattedSummary}
          </div>
          {article.summary.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none mt-2"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateAISummary}
            disabled={isGeneratingSummary}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors ${
              isGeneratingSummary
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-wait'
                : error
                ? 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900'
                : aiSummary
                ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isGeneratingSummary
                ? 'Generating...'
                : error
                ? 'Try Again'
                : aiSummary
                ? 'AI Summary Ready'
                : 'Generate AI Summary'}
            </span>
            <span className="sm:hidden">
              {isGeneratingSummary
                ? '...'
                : error
                ? 'Retry'
                : aiSummary
                ? 'Ready'
                : 'AI'}
            </span>
          </button>

          <button
            onClick={toggleSpeech}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors ${
              isPlaying
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={isPlaying ? 'Stop reading' : 'Read article'}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Stop' : 'Read'}</span>
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
        {aiSummary && !error && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg space-y-2">
            {aiSummary.map((point, index) => (
              <div key={index} className="flex gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">•</span>
                <p>{point}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}