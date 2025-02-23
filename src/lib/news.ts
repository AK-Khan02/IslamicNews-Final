import type { NewsArticle } from '../types';

const API_KEY = 'wjd88kyr8mfd5vctil91ndte0rkxeemphvmuy2vc';

// Keywords that indicate importance in Islamic news
const IMPORTANCE_KEYWORDS = {
  CRITICAL: [
    'emergency',
    'urgent',
    'breaking',
    'alert',
    'crisis',
    'immediate',
    'warning'
  ],
  HIGH: [
    'announcement',
    'important',
    'update',
    'statement',
    'declaration',
    'official'
  ],
  COMMUNITY: [
    'event',
    'gathering',
    'celebration',
    'fundraising',
    'charity',
    'donation',
    'community'
  ]
};

// Canadian Islamic News Sources with importance weights
const CANADIAN_NEWS_SOURCES = [
  // Primary Ontario Sources (Weight: 1.5)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmuslimlinkcanada.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.5
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.iqra.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.5
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nccm.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.5
  },
  // Major Islamic Organizations (Weight: 1.3)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.isna.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.3
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.icna.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.3
  },
  // Ontario Islamic Centers (Weight: 1.2)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.iit.org%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.2
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.islamictoronto.com%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.2
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.taric.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.2
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.noorculturalcentre.ca%2Ffeed&api_key=${API_KEY}`,
    category: 'Canada',
    weight: 1.2
  }
];

// Rest of the news sources with weights
const NEWS_SOURCES = [
  // Breaking News & General (Weight: 1.0)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.middleeasteye.net%2Frss&api_key=${API_KEY}`,
    category: 'Breaking',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Fworld%2Fmiddle_east%2Frss.xml&api_key=${API_KEY}`,
    category: 'Breaking',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.aljazeera.com%2Fxml%2Frss%2Fall.xml&api_key=${API_KEY}`,
    category: 'Breaking',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.reuters.com%2Ffeed%2Fworld%2F&api_key=${API_KEY}`,
    category: 'Breaking',
    weight: 1.0
  },
  
  // Palestine News (Weight: 1.1)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.middleeasteye.net%2Ftopics%2Fpalestine.rss&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpalestinechronicle.com%2Ffeed&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.palestineaction.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.btselem.org%2Frss%2Fenglish%2Fall&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpalsolidarity.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.dci-palestine.org%2Frss&api_key=${API_KEY}`,
    category: 'Palestine',
    weight: 1.1
  },
  
  // Syria News (Weight: 1.1)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsyrianobserver.com%2Ffeed&api_key=${API_KEY}`,
    category: 'Syria',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.middleeasteye.net%2Ftopics%2Fsyria.rss&api_key=${API_KEY}`,
    category: 'Syria',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsyriadirect.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Syria',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsyriahr.com%2Fen%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Syria',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsyriancivilwarmap.com%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Syria',
    weight: 1.1
  },
  
  // Uyghur News (Weight: 1.1)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.uyghurcongress.org%2Fen%2Ffeed&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fuhrp.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.rfa.org%2Fenglish%2Fnews%2Fuyghur%2Frss2.xml&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fchinadigitaltimes.net%2Ftag%2Fuyghurs%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.amnesty.org%2Fen%2Flatest%2Ftag%2Fuyghurs%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.hrw.org%2Ftaxonomy%2Fterm%2F9698%2Ffeed&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.theguardian.com%2Fworld%2Fuyghurs%2Frss&api_key=${API_KEY}`,
    category: 'Uyghurs',
    weight: 1.1
  },
  
  // America & West (Weight: 1.0)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.islamophobia.org%2Ffeed&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.cair.com%2Fblog%2Ffeed&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.mpac.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.muslimadvocates.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fisna.net%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.icna.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.ampalestine.org%2Ffeed&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.masonicna.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'America',
    weight: 1.0
  },

  // India News (Weight: 1.2 for primary sources, 1.1 for others)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.muslimmirror.com%2Feng%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Findiatomorrow.net%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fclarionindia.net%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftwocircles.net%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmaktoobmedia.com%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmillattimes.com%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Primary source for Indian Muslim news
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fenglish.madhyamam.com%2Ffeed&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Major Indian Muslim newspaper
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fsiasat.com%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.2 // Major Indian Muslim newspaper
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Findiaspend.com%2Ftag%2Findian-muslims%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.1 // Data journalism on Indian Muslim issues
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Findianexpress.com%2Fsection%2Findia%2Fcommunities%2Fmuslims%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.1 // Mainstream coverage of Muslim issues
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcaravanarabic.com%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.1 // Indian Muslim cultural and social issues
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.jamaat.org%2Fen%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'India',
    weight: 1.1 // Indian Muslim organization news
  },

  // Islamophobia News (Weight: 1.1)
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Ftopics%2Fc1n985jw6z6t%2Frss.xml&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.aljazeera.com%2Ftag%2Fislamophobia%2Ffeed&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fislamophobia.me%2Ffeed&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fbridge.georgetown.edu%2Fresearch%2Ffeed&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.tellmamauk.org%2Ffeed&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.islamophobiawatch.co.uk%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fislamophobiastudies.org%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.ihrc.org.uk%2Fcategory%2Fpublications%2Fbriefings%2Ffeed%2F&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.equalityhumanrights.com%2Fen%2Ftag%2Fislamophobia%2Ffeed&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  },
  {
    url: `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.oic-oci.org%2Ffeed%2F%3Flan%3Den&api_key=${API_KEY}`,
    category: 'Islamophobia',
    weight: 1.1
  }
];

function calculateImportanceScore(article: NewsArticle, sourceWeight: number): number {
  let score = sourceWeight; // Start with the source weight

  // Check title and summary for importance keywords
  const content = (article.title + ' ' + article.summary).toLowerCase();
  
  // Critical keywords provide the highest boost
  if (IMPORTANCE_KEYWORDS.CRITICAL.some(keyword => content.includes(keyword))) {
    score *= 2.0;
  }
  // High importance keywords provide a significant boost
  else if (IMPORTANCE_KEYWORDS.HIGH.some(keyword => content.includes(keyword))) {
    score *= 1.5;
  }
  // Community keywords provide a moderate boost
  else if (IMPORTANCE_KEYWORDS.COMMUNITY.some(keyword => content.includes(keyword))) {
    score *= 1.25;
  }

  // Calculate time-based score (higher for newer articles)
  const now = new Date().getTime();
  const publishedTime = new Date(article.publishedAt).getTime();
  const hoursSincePublished = (now - publishedTime) / (1000 * 60 * 60);
  
  // Time decay factor: score decreases as article ages
  // Articles less than 6 hours old get full score
  // After 6 hours, score gradually decreases
  const timeDecayFactor = hoursSincePublished <= 6 
    ? 1.0 
    : Math.max(0.5, 1.0 - (hoursSincePublished - 6) / 72);

  return score * timeDecayFactor;
}

async function fetchNewsFromSources(sources: typeof NEWS_SOURCES): Promise<NewsArticle[]> {
  const allNews = await Promise.all(
    sources.map(async (source) => {
      try {
        const response = await fetch(source.url);
        const data: RSSResponse = await response.json();
        
        if (data.status !== 'ok') {
          console.error(`Error fetching from ${source.url}: Invalid status`);
          return [];
        }

        return data.items.map(item => ({
          id: item.guid || item.link,
          title: item.title,
          summary: stripHtml(item.description),
          source: data.feed.title || 'News Source',
          category: source.category,
          publishedAt: item.pubDate,
          url: item.link
        }));
      } catch (error) {
        console.error(`Error fetching from ${source.url}:`, error);
        return [];
      }
    })
  );

  return allNews.flat().filter(Boolean);
}

export async function fetchNews(category?: string): Promise<NewsArticle[]> {
  try {
    let sourcesToFetch = NEWS_SOURCES;
    let cacheKey = category || 'all';
    
    // Check cache first
    const cachedNews = getCache<NewsArticle[]>(cacheKey);
    if (cachedNews) {
      return cachedNews;
    }

    if (category === 'For You') {
      // Fetch Canadian news with higher priority
      const canadianNews = await fetchNewsFromSources(CANADIAN_NEWS_SOURCES);
      
      // Get a selection of general news from other categories
      const categoryCounts = new Map<string, number>();
      const selectedSources = NEWS_SOURCES.filter(source => {
        const count = categoryCounts.get(source.category) || 0;
        if (count < 2) { // Get 2 sources per category for more variety
          categoryCounts.set(source.category, count + 1);
          return true;
        }
        return false;
      });

      const generalNews = await fetchNewsFromSources(selectedSources);
      
      // Calculate importance scores and sort
      const rankedNews = [...canadianNews, ...generalNews].map(article => {
        const source = [...CANADIAN_NEWS_SOURCES, ...NEWS_SOURCES].find(
          s => s.url.includes(new URL(article.url).hostname)
        );
        const weight = source?.weight || 1.0;
        return {
          ...article,
          score: calculateImportanceScore(article, weight)
        };
      });

      // Sort by score in descending order
      const sortedNews = rankedNews.sort((a, b) => b.score - a.score);
      
      // Remove the score property before returning
      const finalNews = sortedNews.map(({ score, ...article }) => article);

      // Cache the results
      if (finalNews.length > 0) {
        setCache(cacheKey, finalNews);
      }

      return finalNews;
    } else if (category && category !== 'All') {
      sourcesToFetch = NEWS_SOURCES.filter(source => source.category === category);
    }

    const news = await fetchNewsFromSources(sourcesToFetch);
    
    // Calculate importance scores for the category
    const rankedNews = news.map(article => {
      const source = sourcesToFetch.find(
        s => s.url.includes(new URL(article.url).hostname)
      );
      const weight = source?.weight || 1.0;
      return {
        ...article,
        score: calculateImportanceScore(article, weight)
      };
    });

    // Sort by score in descending order
    const sortedNews = rankedNews.sort((a, b) => b.score - a.score);
    
    // Remove the score property before returning
    const finalNews = sortedNews.map(({ score, ...article }) => article);
    
    // Cache the results
    if (finalNews.length > 0) {
      setCache(cacheKey, finalNews);
    }

    return finalNews.length > 0 ? finalNews : getFallbackNews();
  } catch (error) {
    console.error('Error fetching news:', error);
    return getFallbackNews();
  }
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

interface RSSResponse {
  status: string;
  feed: {
    title: string;
  };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
  }>;
}

function getFallbackNews(): NewsArticle[] {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'Muslim Community in Karnataka Faces Educational Challenges',
      summary: 'Recent developments in Karnataka highlight concerns over access to education and religious freedom in educational institutions...',
      source: 'Muslim Mirror',
      category: 'India',
      publishedAt: now.toISOString(),
      url: '#'
    },
    {
      id: '2',
      title: 'Advocacy Groups Call for Protection of Muslim Rights in UP',
      summary: 'Civil society organizations raise concerns about the protection of minority rights and religious freedom in Uttar Pradesh...',
      source: 'Clarion India',
      category: 'India',
      publishedAt: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      url: '#'
    },
    {
      id: '3',
      title: 'Indian Muslim Organizations Unite for Social Development',
      summary: 'Coalition of Muslim organizations launches initiatives for education and economic empowerment of the community...',
      source: 'Two Circles',
      category: 'India',
      publishedAt: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
      url: '#'
    }
  ];
}