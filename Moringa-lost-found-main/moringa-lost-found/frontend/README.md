# Moringa Lost & Found - Frontend

This is the frontend application for the Moringa Lost & Found project. It is a React-based web application built with Vite as the build tool.

## Features

- User authentication (Sign In / Sign Up)
- Search and browse lost and found items
- Report lost or found items
- User profile management
- Responsive design for desktop and mobile

## Technologies Used

- React
- Vite
- Redux Toolkit for state management
- React Router (if applicable)
- Jest for testing
- CSS Modules / CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:

   ```bash
   cd moringa-lost-found/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

Start the development server with hot reloading:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified by Vite).

### Building for Production

To build the app for production, run:

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Running Tests

To run tests, use:

```bash
npm run test
```

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and icons
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── services/       # API and auth services
│   ├── store/          # Redux store and slices
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json        # Project metadata and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
