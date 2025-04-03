# GiveARide

GiveARide is a mobile application built with React Native and Expo, designed to facilitate ride-sharing and transportation services. The app provides a platform for users to offer and request rides, making transportation more accessible and convenient.

## Features

- User authentication and profile management
- Ride sharing functionality
- Real-time location tracking
- Cross-platform support (iOS, Android, Web)
- Modern UI with Tailwind CSS styling

## Tech Stack

- **Frontend**: React Native, Expo
- **Styling**: Tailwind CSS, NativeWind
- **Navigation**: React Navigation
- **State Management**: React Context
- **Authentication**: Firebase Authentication
- **Database**: Firebase
- **Deployment**: Vercel

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd giveARide2
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

## Available Scripts

- `npm start` or `expo start`: Start the Expo development server
- `npm run android`: Start the app on Android emulator
- `npm run ios`: Start the app on iOS simulator
- `npm run web`: Start the app in web browser

## Project Structure

```
giveARide2/
├── assets/           # Images and other static assets
├── context/          # React Context providers
├── functions/        # Firebase Cloud Functions
├── Navigations/      # Navigation configuration
├── screens/          # App screens
├── src/              # Source code
├── styles/           # Global styles
└── web-build/        # Web build output
```

## Deployment

### Web Deployment

1. Build the web version:
```bash
npx expo export --output-dir web-build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Screenshot

<img width="468" alt="Image" src="https://github.com/user-attachments/assets/d80c12c6-e757-45ab-8b74-3ab97badbcad" />


