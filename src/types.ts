export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  url: string;
  aiSummary?: string;
}

export interface PrayerTime {
  name: string;
  time: string;
}