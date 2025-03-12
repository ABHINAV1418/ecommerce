import { expect } from 'chai';
import { AuthService } from '../../src/services/AuthService';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
    let authService: AuthService;
    
    beforeEach(() => {
        authService = new AuthService();
    });
    
    describe('register', () => {
        it('should register a new user and return a token', async () => {
            const result = await authService.register(1, 'testuser', 'password123');
            
            expect(result).to.have.property('token');
            expect(result.token).to.be.a('string');
        });
        
        it('should not allow duplicate usernames', async () => {
            await authService.register(1, 'testuser', 'password123');
            
            try {
                await authService.register(2, 'testuser', 'password456');
                // If we get here, the test should fail
                expect.fail('Should have thrown an error for duplicate username');
            } catch (error: any) {
                expect(error.message).to.equal('Username already exists');
            }
        });
    });
    
    describe('login', () => {
        beforeEach(async () => {
            // Register a user for login tests
            await authService.register(1, 'testuser', 'password123');
        });
        
        it('should login a user with correct credentials', async () => {
            const result = await authService.login('testuser', 'password123');
            
            expect(result).to.have.property('token');
            expect(result).to.have.property('userId', 1);
        });
        
        it('should reject login with incorrect password', async () => {
            try {
                await authService.login('testuser', 'wrongpassword');
                expect.fail('Should have thrown an error for incorrect password');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid username or password');
            }
        });
        
        it('should reject login with non-existent username', async () => {
            try {
                await authService.login('nonexistentuser', 'password123');
                expect.fail('Should have thrown an error for non-existent username');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid username or password');
            }
        });
    });
    
    describe('verifyToken', () => {
        let token: string;
        
        beforeEach(async () => {
            // Register a user and get a token
            const result = await authService.register(1, 'testuser', 'password123');
            token = result.token;
        });
        
        it('should verify a valid token', () => {
            const decoded = authService.verifyToken(token);
            
            expect(decoded).to.have.property('userId', 1);
            expect(decoded).to.have.property('username', 'testuser');
        });
        
        it('should reject an invalid token', () => {
            try {
                authService.verifyToken('invalid.token.here');
                expect.fail('Should have thrown an error for invalid token');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid token');
            }
        });
        
        it('should reject an expired token', () => {
            // Create a stub for jwt.verify to simulate an expired token
            const verifyStub = sinon.stub(jwt, 'verify');
            verifyStub.throws(new Error('jwt expired'));
            
            try {
                authService.verifyToken(token);
                expect.fail('Should have thrown an error for expired token');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid token');
            } finally {
                verifyStub.restore();
            }
        });
    });
}); 