#!/bin/bash

# Function to create TypeScript project
create_ts_project() {
  local project_name=$1
  
  # Create project directory
  mkdir -p "$project_name"
  cd "$project_name"
  
  # Create only src directory (no subdirectories)
  mkdir -p src
  
  # Initialize npm project
  npm init -y
  
  # Update package.json with better defaults
  cat > package.json << EOF
{
  "name": "${project_name}",
  "version": "1.0.0",
  "description": "A TypeScript project",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts",
    "build": "tsc -p tsconfig.build.json",
    "clean": "find src -name \"*.js\" -type f -delete"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOF
  
  # Install dependencies
  echo "Installing dependencies..."
  npm install express
  npm install --save-dev typescript ts-node @types/node @types/express nodemon
  
  # Create tsconfig.json
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
  cat > tsconfig.build.json << EOF
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "sourceMap": true
  }
}
EOF
  
  # Create sample index.ts
  cat > src/index.ts << EOF
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ${project_name} API' });
});

// Example route to demonstrate hot reloading
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world! Try changing this message and save the file.' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
  console.log('Hot reloading enabled - changes will automatically restart the server');
});
EOF

  # Create README.md with installation instructions
  cat > README.md << EOF
# ${project_name}

A TypeScript project with hot reloading.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development with Hot Reloading

\`\`\`bash
npm run dev
\`\`\`

The server will automatically restart when you make changes to any TypeScript file.

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`
EOF
  
  echo "Project setup complete!"
  echo "To get started:"
  echo "  cd ${project_name}"
  echo "  npm run dev"
  echo ""
  echo "The server will automatically restart when you make changes to any TypeScript file."
}

# Main script
if [ "$#" -eq 0 ]; then
  read -p "Enter project name (lowercase, no spaces): " project_name
else
  project_name=$1
fi

create_ts_project "$project_name" 