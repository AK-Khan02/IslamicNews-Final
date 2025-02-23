import React, { useState, useEffect } from 'react';
import { Menu, Search, Settings, Moon, Sun, AlertCircle, X } from 'lucide-react';
import { NewsCard } from './components/NewsCard';
import { FeedbackForm } from './components/FeedbackForm';
import { fetchNews } from './lib/news';
import { searchNews } from './lib/newsapi';
import type { NewsArticle } from './types';

const categories = ['For You', 'Breaking', 'Palestine', 'Syria', 'Uyghurs', 'India', 'America', 'Islamophobia'];

function App() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const fetchedNews = await fetchNews(selectedCategory);
      setNews(fetchedNews);
      setLoading(false);
    }
    loadNews();
  }, [selectedCategory]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (globalSearchQuery.trim()) {
        setIsSearching(true);
        setSearchError(null);
        try {
          const results = await searchNews(globalSearchQuery);
          setSearchResults(results);
        } catch (error) {
          setSearchError(error instanceof Error ? error.message : 'Failed to search news');
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [globalSearchQuery]);

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const displayedNews = globalSearchQuery ? searchResults : filteredNews;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setGlobalSearchQuery('');
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {showFeedbackForm && <FeedbackForm onClose={() => setShowFeedbackForm(false)} />}
      
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Categories</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="container mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-[22px] text-gray-800 dark:text-white hidden sm:block">
                Islamic News
              </h1>
              <h1 className="text-[18px] text-gray-800 dark:text-white sm:hidden">
                Islamic News
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Search className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Desktop Search */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search current news"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none dark:text-white transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search global news"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-48 pl-10 pr-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-blue-300 dark:focus:border-blue-500 focus:outline-none dark:text-white transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
              </div>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="sm:hidden px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search current news"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none dark:text-white transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search global news"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-blue-300 dark:focus:border-blue-500 focus:outline-none dark:text-white transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </div>
          )}
          
          {/* Categories - Only show on desktop */}
          <div className="hidden sm:block px-4 py-2 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category && !globalSearchQuery
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {searchError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{searchError}</p>
          </div>
        )}
        
        {loading || isSearching ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isSearching ? 'Searching news...' : 'Loading news...'}
            </p>
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {globalSearchQuery ? 'No search results found.' : 'No news articles found.'}
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {displayedNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;