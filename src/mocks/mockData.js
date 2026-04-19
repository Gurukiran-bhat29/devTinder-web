// =============================================
// Dev-Tinder Backend Mock Data
// Shapes match the actual API response formats
// =============================================

export const MOCK_USER = {
  _id: "user1",
  firstName: "John",
  lastName: "Doe",
  emailId: "john@example.com",
  photoUrl: "https://example.com/photo.jpg",
  about: "Full stack developer",
  age: "25",
  gender: "male",
  isPremiumUser: false,
  membershipType: null,
  skills: ["React", "Node.js"],
  lastSeen: "2026-04-19T10:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-04-19T10:00:00.000Z",
};

export const MOCK_USER_2 = {
  _id: "user2",
  firstName: "Jane",
  lastName: "Smith",
  emailId: "jane@example.com",
  photoUrl: "https://example.com/jane.jpg",
  about: "Backend engineer",
};

export const MOCK_USER_3 = {
  _id: "user3",
  firstName: "Alice",
  lastName: "Johnson",
  emailId: "alice@example.com",
  photoUrl: "https://example.com/alice.jpg",
  about: "UI/UX designer",
};

// GET /feed → { data: [...users] } (USER_SAFE_DATA fields only)
export const MOCK_FEED_RESPONSE = {
  data: [MOCK_USER_2, MOCK_USER_3],
};

// GET /user/connections → { data: [...users] }
export const MOCK_CONNECTIONS_RESPONSE = {
  data: [
    {
      _id: "conn1",
      firstName: "Bob",
      lastName: "Wilson",
      emailId: "bob@example.com",
      photoUrl: "https://example.com/bob.jpg",
      about: "DevOps engineer",
    },
    {
      _id: "conn2",
      firstName: "Carol",
      lastName: "Davis",
      emailId: "carol@example.com",
      photoUrl: "https://example.com/carol.jpg",
      about: "Data scientist",
    },
  ],
};

// GET /user/requests/received → { message: "...", data: [...requests] }
export const MOCK_REQUESTS_RESPONSE = {
  message: "Data fetched successfully",
  data: [
    {
      _id: "req1",
      fromUserId: {
        _id: "reqUser1",
        firstName: "Dave",
        lastName: "Brown",
        photoUrl: "https://example.com/dave.jpg",
        about: "Mobile developer",
      },
      toUserId: "user1",
      status: "interested",
      createdAt: "2026-04-18T10:00:00.000Z",
      updatedAt: "2026-04-18T10:00:00.000Z",
    },
    {
      _id: "req2",
      fromUserId: {
        _id: "reqUser2",
        firstName: "Eve",
        lastName: "Taylor",
        photoUrl: "https://example.com/eve.jpg",
        about: "QA engineer",
      },
      toUserId: "user1",
      status: "interested",
      createdAt: "2026-04-17T10:00:00.000Z",
      updatedAt: "2026-04-17T10:00:00.000Z",
    },
  ],
};

// =============================================
// YouTube API Mock Data
// =============================================

const makeVideoItem = (id, title, channelTitle, viewCount) => ({
  kind: "youtube#video",
  etag: `etag-${id}`,
  id,
  snippet: {
    publishedAt: "2026-04-01T12:00:00Z",
    channelId: `channel-${id}`,
    title,
    description: `Description for ${title}`,
    thumbnails: {
      default: { url: `https://i.ytimg.com/vi/${id}/default.jpg`, width: 120, height: 90 },
      medium: { url: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`, width: 320, height: 180 },
      high: { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360 },
    },
    channelTitle,
    categoryId: "22",
    liveBroadcastContent: "none",
  },
  contentDetails: { duration: "PT10M30S", dimension: "2d", definition: "hd" },
  statistics: { viewCount, likeCount: "1000", commentCount: "50" },
});

// YouTube /videos API response (trending)
export const MOCK_YOUTUBE_DATA = {
  kind: "youtube#videoListResponse",
  etag: "mock-etag",
  items: [
    makeVideoItem("vid1", "Learn React in 10 Minutes", "CodeChannel", "500000"),
    makeVideoItem("vid2", "JavaScript Tips and Tricks", "DevTips", "1200000"),
    makeVideoItem("vid3", "Build a Full Stack App", "TechGuru", "300000"),
  ],
};

// YouTube /search API response
export const MOCK_YOUTUBE_SEARCH_DATA = {
  kind: "youtube#searchListResponse",
  etag: "search-etag",
  items: [
    {
      kind: "youtube#searchResult",
      etag: "sr-etag-1",
      id: { kind: "youtube#video", videoId: "search1" },
      snippet: {
        publishedAt: "2026-03-15T08:00:00Z",
        channelId: "ch-search1",
        title: "React Tutorial for Beginners",
        description: "Complete React tutorial",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/search1/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/search1/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/search1/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "ReactMaster",
        liveBroadcastContent: "none",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "sr-etag-2",
      id: { kind: "youtube#video", videoId: "search2" },
      snippet: {
        publishedAt: "2026-03-20T10:00:00Z",
        channelId: "ch-search2",
        title: "Advanced React Patterns",
        description: "Learn advanced patterns",
        thumbnails: {
          default: { url: "https://i.ytimg.com/vi/search2/default.jpg", width: 120, height: 90 },
          medium: { url: "https://i.ytimg.com/vi/search2/mqdefault.jpg", width: 320, height: 180 },
          high: { url: "https://i.ytimg.com/vi/search2/hqdefault.jpg", width: 480, height: 360 },
        },
        channelTitle: "CodeNinja",
        liveBroadcastContent: "none",
      },
    },
  ],
};

// Google Suggest API response
export const MOCK_SUGGESTIONS_DATA = [
  "react",
  [
    "react tutorial",
    "react hooks",
    "react native",
    "react router",
    "react redux",
    "react testing library",
    "react interview questions",
    "react vs angular",
  ],
  [],
  { "google:suggestsubtypes": [[512], [512], [512], [512], [512], [512], [512], [512]] },
];
