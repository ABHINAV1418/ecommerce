import { expect } from 'chai';
import { User } from '../../src/models/User';

describe('User Model', () => {
    let user: User;
    
    beforeEach(() => {
        user = new User(1);
    });
    
    it('should create a user with the correct ID', () => {
        expect(user.id).to.equal(1);
    });
    
    it('should initialize with empty following set and posts array', () => {
        expect(user.following.size).to.equal(0);
        expect(user.posts.length).to.equal(0);
    });
    
    it('should add a user to following', () => {
        user.follow(2);
        expect(user.following.has(2)).to.be.true;
    });
    
    it('should not allow a user to follow themselves', () => {
        user.follow(1);
        expect(user.following.has(1)).to.be.false;
    });
    
    it('should remove a user from following', () => {
        user.follow(2);
        user.unfollow(2);
        expect(user.following.has(2)).to.be.false;
    });
    
    it('should add a post to the user\'s posts', () => {
        user.addPost(101);
        expect(user.posts).to.include(101);
    });
    
    it('should remove a post from the user\'s posts', () => {
        user.addPost(101);
        user.removePost(101);
        expect(user.posts).to.not.include(101);
    });
    
    it('should return an array of following user IDs', () => {
        user.follow(2);
        user.follow(3);
        const following = user.getFollowing();
        expect(following).to.have.members([2, 3]);
    });
}); 