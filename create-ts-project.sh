#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== TypeScript Project Generator ===${NC}"
echo -e "${YELLOW}This script will set up a complete TypeScript project with proper configurations.${NC}"
echo ""

# Get project name
read -p "Enter project name (lowercase, no spaces): " PROJECT_NAME

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo -e "${GREEN}Creating project structure...${NC}"

# Create directory structure
mkdir -p src/models src/services src/controllers src/routes src/utils

# Initialize npm project
echo -e "${GREEN}Initializing npm project...${NC}"
npm init -y

# Update package.json with better defaults
echo -e "${GREEN}Configuring package.json...${NC}"
cat > package.json << EOF
{
  "name": "${PROJECT_NAME}",
  "version": "1.0.0",
  "description": "A TypeScript project",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc -p tsconfig.build.json",
    "clean": "find src -name \"*.js\" -type f -delete",
    "lint": "eslint . --ext .ts",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOF

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install express
npm install --save-dev typescript ts-node @types/node @types/express eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Create tsconfig.json
echo -e "${GREEN}Creating TypeScript configuration...${NC}"
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOF

# Create tsconfig.build.json
echo -e "${GREEN}Creating build configuration...${NC}"
cat > tsconfig.build.json << EOF
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "sourceMap": true
  }
}
EOF

# Create .eslintrc.js
echo -e "${GREEN}Creating ESLint configuration...${NC}"
cat > .eslintrc.js << EOF
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Add custom rules here
  },
};
EOF

# Create .gitignore
echo -e "${GREEN}Creating .gitignore...${NC}"
cat > .gitignore << EOF
# Dependencies
node_modules/

# Build
dist/

# Logs
logs
*.log
npm-debug.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

# Create README.md
echo -e "${GREEN}Creating README.md...${NC}"
cat > README.md << EOF
# ${PROJECT_NAME}

A TypeScript project.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
${PROJECT_NAME}/
├── src/
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   ├── controllers/  # Request handlers
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   └── index.ts      # Application entry point
├── dist/             # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
\`\`\`
EOF

# Create sample index.ts
echo -e "${GREEN}Creating sample index.ts...${NC}"
cat > src/index.ts << EOF
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${PROJECT_NAME} API' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
EOF

echo -e "${GREEN}Project setup complete!${NC}"
echo -e "${YELLOW}To get started:${NC}"
echo -e "  cd ${PROJECT_NAME}"
echo -e "  npm run dev"
echo ""
echo -e "${BLUE}Happy coding!${NC}" 