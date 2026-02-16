📸 WILL’S PLACE
Sovereign Photography Suite & Digital Asset Infrastructure

Precision. Observation. Sovereignty.

🏗️ Architecture Overview
Will’s Place is a bespoke, high-end business infrastructure engineered for Will Grigsby. This suite bridges the gap between raw artistic observation and sophisticated digital asset management.

Digital Sovereignty: Total ownership and control over photography assets and client data.

Curation Intelligence: AI-powered analysis for valuation estimates and business strategy.

Tiered Licensing: Professional framework for Personal, Editorial, Commercial, and Exclusive rights.

The Vault: Secure, logic-gated client galleries.

🚀 Local Installation
Prerequisites

Node.js (Latest LTS recommended)

Git

1. Clone and Initialize

Bash
# Connect and sync the environment
git init
git remote add origin https://github.com/dustymclean/WillGh.git
git fetch origin
git rebase origin/main
2. Install Dependencies

Bash
npm install
3. Environment Setup

Create a .env.local file in the root directory:

Plaintext
GEMINI_API_KEY=your_api_key_here
4. Launch Development Server

Bash
npm run dev
🌐 Web Deployment (willgh.com)
The suite is configured for automated deployment to GitHub Pages using a custom domain.

The One-Command Deploy

Bash
npm run deploy
Pre-deploy: Automatically triggers npm run build.

Deploy: Pushes the dist/ folder to the gh-pages branch.

Domain: Routing is handled via public/CNAME.

⚡ Developer Shortcuts (Aliases)
To maintain peak efficiency, add these to your ~.zshrc file:

Alias	Command	Description
gs	git status	Check local changes
ga	git add .	Stage all files
gc	git commit -m	Commit changes
gpf	git push origin main --force	Push to main branch
grb	git fetch origin && git rebase origin/main	Sync with GitHub
deploy	npm run deploy	Push build to willgh.com
install	npm install	Update dependencies
reload	source ~/.zshrc	Activate new aliases
🛠️ Configuration Details
Base URL: Set to / in vite.config.ts for custom domain compatibility.

Assets: Remote high-res images are managed via the bimi-assets repository.

Security: Client access is managed via encrypted access codes in constants.ts.

Developed by Dusty McLean as a sovereign business suite for William Ghrigsby.
