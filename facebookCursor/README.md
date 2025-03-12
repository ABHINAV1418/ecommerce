# Facebook LLD Implementation

This is a Low-Level Design (LLD) implementation of a simplified Facebook system, focusing on the core functionality of posting, following/unfollowing users, and retrieving news feeds.

## Features

The implementation provides the following APIs:

1. `post(userId, postId)` - Create a new post for a user
2. `follow(followerId, followeeId)` - Make a user follow another user
3. `unfollow(followerId, followeeId)` - Make a user unfollow another user
4. `getNewsFeed(userId)` - Get the news feed for a user
5. `getNewsFeedPaginated(userId, pageNumber)` - Get a paginated news feed for a user
6. `deletePost(postId)` - Delete a post

## Project Structure

```
facebookCursor/
├── src/
│   ├── models/
│   │   ├── User.ts
│   │   └── Post.ts
│   ├── services/
│   │   └── FacebookService.ts
│   ├── controllers/
│   │   └── FacebookController.ts
│   ├── index.ts
│   └── demo.ts
├── package.json
├── tsconfig.json
└── README.md
```

## How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Install dependencies
npm install
```

### Running the Demo

```bash
# Run the demo script
npx ts-node src/demo.ts
```

### Running the API Server

```bash
# Start the server
npm run dev
```

The server will start on http://localhost:3000.

## API Endpoints

- `POST /api/post` - Create a post
  - Body: `{ "userId": number, "postId": number }`

- `POST /api/follow` - Follow a user
  - Body: `{ "followerId": number, "followeeId": number }`

- `POST /api/unfollow` - Unfollow a user
  - Body: `{ "followerId": number, "followeeId": number }`

- `GET /api/feed/:userId` - Get news feed for a user

- `GET /api/feed/:userId/paginated?page=0` - Get paginated news feed for a user

- `DELETE /api/post/:postId` - Delete a post

## Interview Demonstration

For an interview setting, you can use the `demo.ts` file to showcase the functionality without needing to set up HTTP requests. This file demonstrates all the required APIs in a clear, sequential manner.

To run the demo:

```bash
npx ts-node src/demo.ts
```

This will output a step-by-step demonstration of all the APIs working together. 