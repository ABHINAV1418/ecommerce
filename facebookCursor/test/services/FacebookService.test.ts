import { expect } from 'chai';
import { FacebookService } from '../../src/services/FacebookService';
import sinon from 'sinon';

describe('FacebookService', () => {
    let facebookService: FacebookService;
    let clock: sinon.SinonFakeTimers;
    
    beforeEach(() => {
        facebookService = new FacebookService();
        clock = sinon.useFakeTimers(new Date('2023-01-01').getTime());
    });
    
    afterEach(() => {
        clock.restore();
    });
    
    describe('post', () => {
        it('should create a post for a user', () => {
            facebookService.post(1, 101);
            
            // Get the user's feed to verify the post was created
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.include(101);
        });
    });
    
    describe('follow/unfollow', () => {
        it('should allow a user to follow another user', () => {
            // User 1 follows User 2
            facebookService.follow(1, 2);
            
            // User 2 creates a post
            facebookService.post(2, 201);
            
            // User 1's feed should include User 2's post
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.include(201);
        });
        
        it('should allow a user to unfollow another user', () => {
            // User 1 follows User 2
            facebookService.follow(1, 2);
            
            // User 2 creates a post
            facebookService.post(2, 201);
            
            // User 1 unfollows User 2
            facebookService.unfollow(1, 2);
            
            // User 1's feed should not include User 2's post
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.not.include(201);
        });
    });
    
    describe('getNewsFeed', () => {
        it('should return a user\'s own posts', () => {
            facebookService.post(1, 101);
            facebookService.post(1, 102);
            
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.have.members([101, 102]);
        });
        
        it('should return posts from followed users', () => {
            // User 1 follows User 2
            facebookService.follow(1, 2);
            
            // User 1 and User 2 create posts
            facebookService.post(1, 101);
            facebookService.post(2, 201);
            
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.have.members([101, 201]);
        });
        
        it('should return posts in reverse chronological order', () => {
            // User 1 creates a post
            facebookService.post(1, 101);
            
            // Advance time
            clock.tick(1000);
            
            // User 1 creates another post
            facebookService.post(1, 102);
            
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.deep.equal([102, 101]);
        });
    });
    
    describe('getNewsFeedPaginated', () => {
        it('should return paginated results', () => {
            // Create 15 posts
            for (let i = 1; i <= 15; i++) {
                facebookService.post(1, i);
                clock.tick(1000); // Advance time for each post
            }
            
            // Get first page (10 posts)
            const page1 = facebookService.getNewsFeedPaginated(1, 0);
            expect(page1.length).to.equal(10);
            expect(page1[0]).to.equal(15); // Most recent post first
            
            // Get second page (5 posts)
            const page2 = facebookService.getNewsFeedPaginated(1, 1);
            expect(page2.length).to.equal(5);
            expect(page2[0]).to.equal(5); // Continuing from first page
        });
    });
    
    describe('deletePost', () => {
        it('should remove a post from a user\'s posts', () => {
            facebookService.post(1, 101);
            facebookService.deletePost(101);
            
            const feed = facebookService.getNewsFeed(1);
            expect(feed).to.not.include(101);
        });
    });
}); 