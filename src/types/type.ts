export type TrendingItem = {
  _id?: string;
  Rank?: string;
  Grade?: string;
  Username?: string;
  uploads?: number;
  Subs?: number;
  VideoViews?: number;
  Category?: string;
  ChannelId?: string;
  Description?: string;
  PublishedAt?: string;
  Thumbnails?: string[];
  Title?: string;
  __v?: number;
  Rating?: string;
  TopicCategories?: string[];
  BannerImage?: string;
};

export type TrendingResponse = TrendingItem[];
