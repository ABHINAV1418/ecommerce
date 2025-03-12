import { FacebookService } from './services/FacebookService';

// Create a new instance of the Facebook service
const facebook = new FacebookService();

// Demo function to showcase all the APIs
function runDemo() {
    console.log('=== Facebook LLD Demo ===');
    
    // Create users (implicitly by using them)
    const user1 = 1;
    const user2 = 2;
    const user3 = 3;
    
    // User1 follows User2 and User3
    console.log('\n1. User1 follows User2 and User3');
    facebook.follow(user1, user2);
    facebook.follow(user1, user3);
    
    // User2 follows User3
    console.log('2. User2 follows User3');
    facebook.follow(user2, user3);
    
    // Create posts
    console.log('\n3. Creating posts');
    // User1 creates posts
    facebook.post(user1, 101);
    facebook.post(user1, 102);
    
    // User2 creates posts
    facebook.post(user2, 201);
    facebook.post(user2, 202);
    facebook.post(user2, 203);
    
    // User3 creates posts
    facebook.post(user3, 301);
    facebook.post(user3, 302);
    facebook.post(user3, 303);
    facebook.post(user3, 304);
    
    // Get User1's news feed
    console.log('\n4. User1\'s news feed:');
    const user1Feed = facebook.getNewsFeed(user1);
    console.log(user1Feed);
    
    // Get User2's news feed
    console.log('\n5. User2\'s news feed:');
    const user2Feed = facebook.getNewsFeed(user2);
    console.log(user2Feed);
    
    // User1 unfollows User2
    console.log('\n6. User1 unfollows User2');
    facebook.unfollow(user1, user2);
    
    // Get User1's news feed after unfollowing User2
    console.log('\n7. User1\'s news feed after unfollowing User2:');
    const user1FeedAfterUnfollow = facebook.getNewsFeed(user1);
    console.log(user1FeedAfterUnfollow);
    
    // Delete a post
    console.log('\n8. Deleting post 301 from User3');
    facebook.deletePost(301);
    
    // Get User1's news feed after post deletion
    console.log('\n9. User1\'s news feed after post deletion:');
    const user1FeedAfterDeletion = facebook.getNewsFeed(user1);
    console.log(user1FeedAfterDeletion);
    
    // Create more posts for pagination demo
    console.log('\n10. Creating more posts for pagination demo');
    for (let i = 1; i <= 15; i++) {
        facebook.post(user3, 400 + i);
    }
    
    // Get paginated news feed for User1
    console.log('\n11. User1\'s paginated news feed (page 0):');
    const user1FeedPage0 = facebook.getNewsFeedPaginated(user1, 0);
    console.log(user1FeedPage0);
    
    console.log('\n12. User1\'s paginated news feed (page 1):');
    const user1FeedPage1 = facebook.getNewsFeedPaginated(user1, 1);
    console.log(user1FeedPage1);
}

// Run the demo
runDemo(); 