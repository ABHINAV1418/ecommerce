import { expect } from 'chai';
import { Post } from '../../src/models/Post';
import sinon from 'sinon';

describe('Post Model', () => {
    let clock: sinon.SinonFakeTimers;
    
    beforeEach(() => {
        // Create a fake timer to control Date.now()
        clock = sinon.useFakeTimers(new Date('2023-01-01').getTime());
    });
    
    afterEach(() => {
        // Restore the clock
        clock.restore();
    });
    
    it('should create a post with the correct ID and user ID', () => {
        const post = new Post(101, 1);
        expect(post.id).to.equal(101);
        expect(post.userId).to.equal(1);
    });
    
    it('should set the timestamp to the current time', () => {
        const post = new Post(101, 1);
        expect(post.timestamp).to.equal(new Date('2023-01-01').getTime());
    });
    
    it('should create posts with different timestamps when time advances', () => {
        const post1 = new Post(101, 1);
        
        // Advance the clock by 1 second
        clock.tick(1000);
        
        const post2 = new Post(102, 1);
        
        expect(post2.timestamp).to.be.greaterThan(post1.timestamp);
        expect(post2.timestamp - post1.timestamp).to.equal(1000);
    });
}); 