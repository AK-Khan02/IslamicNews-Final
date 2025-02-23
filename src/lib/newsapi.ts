const API_KEY = '4d173c1c7fac4bbbb1e444810e28c837';
const BASE_URL = 'https://corsproxy.io/?https://newsapi.org/v2';

interface NewsAPIResponse {
  status: string;
  totalResults?: number;
  articles?: Array<{
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
  message?: string;
  code?: string;
}

export async function searchNews(query: string) {
  try {
    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: API_KEY
    });

    const response = await fetch(`${BASE_URL}/everything?${params}`);
    const data: NewsAPIResponse = await response.json();

    if (data.status === 'error') {
      console.error('NewsAPI Error:', data.message);
      throw new Error(data.message || 'Failed to fetch news');
    }

    if (data.status === 'ok' && Array.isArray(data.articles)) {
      return data.articles
        .filter(article => article.title && article.description) // Filter out articles without title or description
        .map(article => ({
          id: article.url,
          title: article.title,
          summary: article.description || article.content?.split('[+')[0] || '', // Use content as fallback, remove "[+N chars]" suffix
          source: article.source.name,
          category: 'Search',
          publishedAt: article.publishedAt,
          url: article.url,
          imageUrl: article.urlToImage || undefined
        }));
    }

    return [];
  } catch (error) {
    console.error('Error searching news:', error);
    throw error; // Let the component handle the error
  }
}