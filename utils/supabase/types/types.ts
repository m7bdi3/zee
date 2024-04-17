export type Topic = {
  created_at?: string;
  created_by?: string;
  description: string;
  id?: string;
  image: string;
  slug: string;
};

export type Post = {
  content: string;
  created_at: string;
  deletedAt: string | null;
  id: string;
  imageUrl: string | null;
  isDeleted: boolean;
  isEdited: boolean;
  topicId: string;
  updatedAt: string | null;
  userId: string;
  videoUrl: string | null;
};

export type PostWithData = {
  content: string;
  created_at: string;
  deletedAt: string | null;
  id: string;
  slug: string;
  imageUrl: string | null;
  isDeleted: boolean;
  isEdited: boolean;
  topicId: string;
  updatedAt: string | null;
  userId: string;
  videoUrl: string | null;
  user: {
    lastname: string;
    username: string;
    firstname: string;
    avatar_url: string | null;
  };
  likes: {
    id: string;
    user_id: string;
    user: {
      lastname: string;
      username: string;
      firstname: string;
      avatar_url: string | null;
    };
  }[];
  comments: {
    content: string;
    created_at: string | null;
    deleted_at: string | null;
    id: string;
    is_deleted: boolean | null;
    is_edited: boolean | null;
    parent_id: string | null;
    post_id: string;
    updated_at: string | null;
    user_id: string;
    user: {
      lastname: string;
      username: string;
      firstname: string;
      avatar_url: string | null;
    };
  }[];
};

export type PostsLikedByUser = {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  comment_id: null;
  posts: {
    id: string;
    slug: string;
    user: {
      lastname: string;
      username: string;
      firstname: string;
      avatar_url: string | null;
    };
    likes: {
      id: string;
      user_id: string;
      user: {
        lastname: string;
        username: string;
        firstname: string;
        avatar_url: string | null;
      };
    }[];
    userId: string;
    content: string;
    topicId: string;
    comments: {
      content: string;
      created_at: string | null;
      deleted_at: string | null;
      id: string;
      is_deleted: boolean | null;
      is_edited: boolean | null;
      parent_id: string | null;
      post_id: string;
      updated_at: string | null;
      user_id: string;
      user: {
        lastname: string;
        username: string;
        firstname: string;
        avatar_url: string | null;
      };
    }[];
    imageUrl: string | null;
    isEdited: boolean;
    videoUrl: string | null;
    deletedAt: string | null;
    isDeleted: boolean;
    updatedAt: string | null;
    created_at: string;
  };
};
export type profile = {
  avatar_url: string | null;
  cover_url: string | null;
  email: string;
  firstname: string;
  id: string;
  bio: string | null;
  lastname: string;
  username: string;
  followers: ({
    id: string;
    username: string;
    avatar_url: string | null;
  } | null)[];
  following: ({
    id: string;
    username: string;
    avatar_url: string | null;
  } | null)[];
};

export type CommentsWithData = {
  content: string;
  created_at: string | null;
  deleted_at: string | null;
  id: string;
  is_deleted: boolean | null;
  is_edited: boolean | null;
  parent_id: string | null;
  post_id: string;
  updated_at: string | null;
  user_id: string;
  user: {
    lastname: string;
    username: string;
    firstname: string;
    avatar_url: string | null;
  };
  likes: {
    id: string;
    user_id: string;
    user: {
      lastname: string;
      username: string;
      firstname: string;
      avatar_url: string | null;
    };
  }[];
};

export type conversationWithData = {
  created_at: string;
  id: string;
  latest_message: string & {
    content: string;
    created_at: string;
    senderProfile: {
      id: string;
      username: string;
      avatar_url: string | null;
      firstname: string;
      lastname: string;
    } | null;
  };
  member_one: string;
  member_two: string;
  memberOne: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  }[];
  memberTwo: {
    id: string;
    username: string;
    avatar_url: string | null;
    firstname: string;
    lastname: string;
  }[];
};

export type notificationWithData = {
  id: string;
  created_at: string;
  created_by: string;
  read: boolean;
  is_cleared: boolean;
  post_id: string | null;
  comment_id: string | null;
  follow_id: string | null;
  like_id: string | null;
  user_id: string;
  type: "LIKE" | "COMMENT" | "FOLLOW" | "MESSAGE";
  CreatedByProfile: {
    id: string;
    lastname: string;
    username: string;
    firstname: string;
    avatar_url: string;
  };
  Post: {
    id: string;
    slug: string;
    userId: string;
    content: string;
    created_at: string;
  };
}

export const NotificationType = {
  LIKE: "LIKE",
  COMMENT: "COMMENT",
  FOLLOW: "FOLLOW",
  MESSAGE: "MESSAGE",
};
