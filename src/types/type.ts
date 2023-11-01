export type ChannelItem = {
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

export type ChannelCollectionResponse = ChannelItem[];

export type ReviewFormProps = {
  onSubmit: (formData: {
    rating: number;
    comment: string;
    attributes: string[];
  }) => void;
};

export type VideoItem = {
  title: string;
  videoId: string;
  publishedAt: string;
  publishedAtRelative: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
};

export type VideoItemResponse = VideoItem[];
