# Ry_Diner

Built using the MERN Stack

/backend
│
├── /config # Configuration files (e.g., database, environment)
│ └── db.js # MongoDB connection setup
│
├── /controllers # Business logic for routes
│ └── orderController.js
│
├── /middleware # Middleware functions (e.g., authentication, error handling)
│ └── errorMiddleware.js
│
├── /models # Mongoose schemas
│ └── Order.js
│
├── /routes # Route definitions
│ └── orderRoutes.js
│
├── .env # Environment variables
├── package.json # Project metadata and dependencies
├── package-lock.json
└── server.js # Entry point for the backend

/frontend
│
├── /src
│ ├── /api # API request functions
│ │ └── api.js
│ ├── /components # Reusable components
│ │ └── Navbar.js
│ ├── /pages # Pages for the app
│ │ ├── AdminDashboard.js
│ │ ├── Login.js
│ │ ├── Register.js
│ │ └── OrderPage.js
│ ├── /context # Context API for global state management
│ │ └── AuthContext.js
│ ├── App.js # Main app component
│ ├── index.js # React DOM entry point
│ └── styles.css # Styles
