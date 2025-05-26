# Give Protocol

A blockchain-based charitable giving platform built with React, Vite, and Supabase.

## Features

- Transparent donation tracking using blockchain technology
- Volunteer opportunity matching
- Skill endorsement system
- Multiple donation methods (direct, equity pools, portfolio funds)
- Charity verification system
- Monthly donation scheduling

## Tech Stack

- React with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Supabase for backend and authentication
- Ethers.js for blockchain integration
- Hardhat for smart contract development

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/yourusername/give-protocol.git
   cd give-protocol
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your environment variables
   ```
   cp .env.example .env
   ```

4. Run the development server
   ```
   npm run dev
   ```

## Smart Contracts

The project includes several smart contracts:

- `DurationDonation.sol`: Handles direct donations in native tokens
- `CharityScheduledDistribution.sol`: Manages monthly donation schedules
- `VolunteerVerification.sol`: Verifies volunteer applications and hours

To compile contracts:
```
npm run compile
```

To run tests:
```
npm test
```

To deploy contracts to Moonbase Alpha TestNet:
```
npm run deploy:moonbase
```

## Deployment

### Deploying to Netlify

1. Install Netlify CLI
   ```
   npm install -g netlify-cli
   ```

2. Build the project
   ```
   npm run build
   ```

3. Deploy to Netlify
   ```
   netlify deploy --prod --dir=dist
   ```

   Or using an auth token:
   ```
   netlify deploy --prod --dir=dist --auth-token=YOUR_AUTH_TOKEN
   ```

4. Follow the prompts to complete the deployment

## License

MIT