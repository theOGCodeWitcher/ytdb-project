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

export type ReviewFormData = {
  channelId: string;
  rating: number;
  tags: string[];
  review: string;
  userId: string;
};

export type ReviewFormProps = {
  onSubmit: (data: ReviewFormData, clearFormCallback: () => void) => void;
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

export type User = {
  given_name?: string;
  family_name?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  locale?: string;
  updated_at?: string;
  email?: string;
  email_verified?: boolean;
  sub?: string;
  _id?: string;
};
export type ProfileProps = {
  name?: string;
  picture?: string;
  email?: string;
  bio?: string;
  age?: number;
  country?: string;
  ytdbUsername?: string;
};

export type ReviewCardProps = {
  review: { id: string; rating: number; review: string; tags: string[] };
  userName: string;
  ytdbUsername: string;
};

export type OwnReviewCardProps = {
  rating: number;
  review: string;
  tags: string[];
};

export type AddFavOrWishlist = {
  channelId: string;
  userId: string;
};
