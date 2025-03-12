import { AuthService } from './services/AuthService';
import { FacebookService } from './services/FacebookService';

// Create instances of the services
const authService = new AuthService();
const facebookService = new FacebookService();

// Demo function to showcase authentication
async function runAuthDemo() {
    console.log('=== Facebook LLD Authentication Demo ===');
    
    try {
        // 1. Register users
        console.log('\n1. Registering users');
        const user1 = await authService.register(1, 'alice', 'password123');
        const user2 = await authService.register(2, 'bob', 'password456');
        const user3 = await authService.register(3, 'charlie', 'password789');
        
        console.log('User 1 registered:', user1);
        console.log('User 2 registered:', user2);
        console.log('User 3 registered:', user3);
        
        // 2. Login with a user
        console.log('\n2. Logging in with user1');
        const loginResult = await authService.login('alice', 'password123');
        console.log('Login result:', loginResult);
        
        // 3. Verify the token
        console.log('\n3. Verifying the token');
        const decoded = authService.verifyToken(loginResult.token);
        console.log('Decoded token:', decoded);
        
        // 4. Create posts for users
        console.log('\n4. Creating posts for users');
        facebookService.post(1, 101); // User 1 creates a post
        facebookService.post(2, 201); // User 2 creates a post
        facebookService.post(3, 301); // User 3 creates a post
        
        // 5. User 1 follows User 2 and User 3
        console.log('\n5. User 1 follows User 2 and User 3');
        facebookService.follow(1, 2);
        facebookService.follow(1, 3);
        
        // 6. Get User 1's news feed
        console.log('\n6. Getting User 1\'s news feed');
        const feed = facebookService.getNewsFeed(1);
        console.log('User 1\'s feed:', feed);
        
        // 7. Try to login with incorrect password
        console.log('\n7. Trying to login with incorrect password');
        try {
            await authService.login('alice', 'wrongpassword');
        } catch (error: any) {
            console.log('Error:', error.message);
        }
        
        // 8. Try to verify an invalid token
        console.log('\n8. Trying to verify an invalid token');
        try {
            authService.verifyToken('invalid.token.here');
        } catch (error: any) {
            console.log('Error:', error.message);
        }
        
    } catch (error: any) {
        console.error('Error in demo:', error.message);
    }
}

// Run the demo
runAuthDemo(); 