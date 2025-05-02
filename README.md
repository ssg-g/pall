# Pal - Your Growth Buddy for the Influencer Journey

Pal is a complete growth platform designed for micro-influencers on Instagram. It empowers creators with detailed analytics, AI-powered content suggestions, and a smart post scheduler — all within a clean, theme-switchable UI.

## Features

- **Instagram Analytics Dashboard**: Track follower growth, top-performing posts, audience demographics, and engagement trends
- **Smart Post Scheduler**: Schedule posts with calendar view and optimal time suggestions
- **Content Strategy**: Get AI-powered content suggestions and hashtag recommendations
- **Authentication**: Email/password login via Firebase with Instagram connection
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: Firebase Auth
- **API Integration**: Instagram Graph API (mock data for MVP)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pal.git
   cd pal
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Firebase configuration
   - Create a Firebase project at https://firebase.google.com
   - Enable Email/Password authentication
   - Update the Firebase configuration in `src/services/firebase.ts`

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Development Notes

### Mock Data

For the MVP, the Instagram Graph API integration is simulated with mock data. The mock services in `src/services/instagram.ts` provide realistic data to demonstrate the app's functionality. In a production environment, these would be replaced with actual API calls to the Instagram Graph API.

### Authentication

The authentication system uses Firebase for user management. For Instagram connectivity, the MVP simulates the OAuth process. In production, this would be integrated with the actual Instagram Graph API OAuth flow.

### Local Storage

The scheduled posts are currently stored in localStorage. In a production environment, this would be stored in a database like Firebase Firestore or MongoDB.

## Future Enhancements

- Real Instagram Graph API integration
- Mobile app versions
- Brand deal marketplace
- Media kit generator
- Analytics export
- Comprehensive user onboarding

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Chart.js](https://www.chartjs.org/)
- [Heroicons](https://heroicons.com/)
