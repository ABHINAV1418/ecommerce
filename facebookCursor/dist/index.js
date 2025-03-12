"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookService = void 0;
const express_1 = __importDefault(require("express"));
const FacebookController_1 = require("./controllers/FacebookController");
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(express_1.default.json());
// Initialize controller
const facebookController = new FacebookController_1.FacebookController();
// Routes
app.post('/api/post', facebookController.createPost);
app.post('/api/follow', facebookController.followUser);
app.post('/api/unfollow', facebookController.unfollowUser);
app.get('/api/feed/:userId', facebookController.getNewsFeed);
app.get('/api/feed/:userId/paginated', facebookController.getNewsFeedPaginated);
app.delete('/api/post/:postId', facebookController.deletePost);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// For demonstration purposes, let's also expose the API directly
// This allows us to test the API without HTTP requests
exports.facebookService = facebookController['facebookService'];
