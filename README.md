# TrizenAI Photo Sharing Platform

A full-stack photo-sharing platform that allows event administrators to manage events and team members, collect photos, select photos for a customer gallery, and securely share published galleries using a PIN.

## Live Application

- Frontend: https://trizenai-photo-sharing-platform.vercel.app
- Backend API: https://trizenai-photo-sharing-platform-g2g9.onrender.com

## Features

### Admin / Lead

- Register and log in as an administrator
- Create and manage events
- Add team members to events
- View photos uploaded by team members
- Select photos for the customer gallery
- Create a gallery for an event
- Update selected photos in an existing gallery
- Regenerate the gallery PIN
- Publish the gallery
- Share the gallery URL and PIN with customers

### Team Member

- Register and log in
- View assigned events
- Upload photos to assigned events
- View their own uploaded photos
- Cannot create or publish galleries
- Cannot manage other users' photos

### Customer

- No account required
- Open a shared gallery URL
- Enter the gallery PIN
- View photos from the published gallery

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- JavaScript

### Backend

- Node.js
- Express.js
- JWT authentication
- bcryptjs for password and PIN hashing
- Multer for file uploads

### Database

- MongoDB Atlas
- Mongoose

### Storage

- Cloudinary

### Deployment

- Vercel for frontend
- Render for backend
- MongoDB Atlas for database
- Cloudinary for image storage

## Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │   Gallery + PIN     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │ Vercel Deployment   │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Express Backend    │
                    │ Render Deployment   │
                    └──────┬───────┬──────┘
                           │       │
                  ┌────────┘       └─────────┐
                  ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │  MongoDB Atlas  │        │    Cloudinary   │
        │ Metadata / Auth │        │ Photo Storage   │
        └─────────────────┘        └─────────────────┘

```

## User Flow

### Admin Flow

```text

Admin Login
    │
    ▼
Create Event
    │
    ▼
Add Team Members
    │
    ▼
Team Members Upload Photos
    │
    ▼
Admin Views Photos
    │
    ▼
Select Photos
    │
    ▼
Create / Update Gallery
    │
    ▼
Publish Gallery
    │
    ▼
Share Gallery URL + PIN

```

### Team Member Flow

```text

Team Member Login
       │
       ▼
View Assigned Events
       │
       ▼
Open Event
       │
       ▼
Upload Photos
       │
       ▼
View Own Uploaded Photos

```

### Customer Flow

```text

Receive Gallery URL + PIN
          │
          ▼
Open Gallery
          │
          ▼
Enter PIN
          │
          ▼
PIN Verification
          │
          ▼
View Published Photos

```

## Database Design

### User

Stores application users.

Fields:

- name
- email
- passwordHash
- role
- createdAt
- updatedAt

Supported roles:

- admin
- team_member

### Event

Stores event information and team assignments.

Fields:

- name
- description
- createdBy
- teamMembers
- createdAt
- updatedAt

### Photo

Stores photo metadata.

Fields:

- eventId
- uploadedBy
- filename
- storageUrl
- publicId
- fileSize
- selected
- createdAt
- updatedAt

The actual image file is stored in Cloudinary. MongoDB stores the photo metadata and Cloudinary reference.

### Gallery

Stores customer gallery information.

Fields:

- eventId
- slug
- selectedPhotos
- pinHash
- published
- publishedAt
- createdAt
- updatedAt

The gallery PIN is stored as a bcrypt hash instead of plain text.

## Authentication and Authorization

Authentication is implemented using JSON Web Tokens (JWT).

Passwords and gallery PINs are hashed using bcrypt.

Protected API routes require a valid authorization token:

Authorization: Bearer <token>

Role-based authorization controls access to administrative and team-member functionality.

Examples:

Only admins can create events.
Only assigned team members can upload photos to an event.
Only event admins can select photos.
Only admins can create, update, and publish galleries.
Team members cannot publish galleries.
Customers do not require an account.
Customers must provide the correct gallery PIN.
Unpublished galleries cannot be accessed through the customer gallery flow.

## Photo Upload Flow

### Team Member

```text
Team Member
     ?
     ?
Select Image
     ?
     ?
Frontend
     ?
     ?
Express API
     ?
     ?
Authentication + Authorization
     ?
     ?
Multer File Validation
     ?
     ?
Cloudinary
     ?
     ?
MongoDB Photo Metadata
```

Supported image formats:

- JPEG
- PNG
- WebP

Maximum upload size:

10 MB

## Gallery Flow

```text
Admin selects photos
        ?
        ?
Create Gallery
        ?
        ?
Gallery slug + PIN generated
        ?
        ?
Admin publishes gallery
        ?
        ?
Customer receives:
    Gallery URL
    +
    PIN
        ?
        ?
Customer enters PIN
        ?
        ?
Published gallery photos displayed
```

If additional photos are selected after a gallery has already been created, the admin can use the Update Gallery feature to synchronize the gallery with the selected photos.

## API Structure

The backend API is organized into the following main route groups:

/api/health
/api/auth
/api/events
/api/photos
/api/gallery

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Events

```http
POST /api/events
GET  /api/events
GET  /api/events/:eventId
POST /api/events/:eventId/team
```

### Photos

```http
POST  /api/photos/events/:eventId
GET   /api/photos/events/:eventId
GET   /api/photos/my
PATCH /api/photos/:photoId/select
```

### Galleries

```http
POST  /api/gallery/events/:eventId
GET   /api/gallery/events/:eventId
PATCH /api/gallery/:slug/update
PATCH /api/gallery/:slug/regenerate-pin
PATCH /api/gallery/:slug/publish
POST  /api/gallery/:slug/verify
```

## Local Development

### Prerequisites

Install the following:

- Node.js
- npm
- MongoDB Atlas account
- Cloudinary account

### Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd trizenai-photo-sharing-platform
```

### Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create a file:

`backend/.env`

Add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_CODE=your_admin_invite_code

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173

Start the backend:

```bash
npm start
```

Backend URL:

`http://localhost:5000`

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

`frontend/.env`

Add:

VITE_API_BASE_URL=http://localhost:5000/api

Start the frontend:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

## Testing

The backend uses Jest and Supertest.

Run the test suite:

```bash
cd backend
npm test
```

Current test result:

Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
Snapshots:   0 total

The tests cover:

- Authentication
- Authorization
- Event and photo access
- Gallery publishing authorization
- Gallery PIN protection
- Published and unpublished gallery behavior

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The production build completes successfully using Vite.

## Environment Variables

Never commit real credentials or secrets to GitHub.

### Backend Environment Variables

- PORT
- MONGO_URI
- JWT_SECRET
- ADMIN_INVITE_CODE
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- FRONTEND_URL

### Frontend Environment Variables

- VITE_API_BASE_URL

Example environment files are included in the repository using .env.example.

Real .env files are excluded from Git using .gitignore.

## Deployment

### Frontend

The React/Vite frontend is deployed using Vercel.

Production API configuration:

`VITE_API_BASE_URL=https://trizenai-photo-sharing-platform-g2g9.onrender.com/api`

Live frontend:

https://trizenai-photo-sharing-platform.vercel.app

### Backend

The Express API is deployed using Render.

Live backend:

https://trizenai-photo-sharing-platform-g2g9.onrender.com

The backend uses production environment variables configured in Render.

### Database

MongoDB Atlas is used as the hosted MongoDB database.

### Image Storage

Cloudinary is used for image storage.

MongoDB stores photo metadata and Cloudinary references rather than storing image files directly in the database.

## Security Considerations

The application implements several security measures:

- JWT-based authentication
- bcrypt password hashing
- bcrypt gallery PIN hashing
- Role-based authorization
- Event ownership checks
- Team-member assignment checks
- File type validation
- File size validation
- CORS configuration
- Environment variables for sensitive configuration
- .env files excluded from Git
- Customers cannot access unpublished galleries through the application flow
- Team members cannot create or publish galleries
- Team members cannot manage other users' photos

## File Upload Validation

The backend validates uploaded images before sending them to Cloudinary.

Allowed MIME types:

- image/jpeg
- image/png
- image/webp

Maximum file size:

10 MB

Invalid files are rejected by the API.

## Error Handling

The API provides HTTP status codes and JSON error messages for common failures, including:

- Invalid credentials
- Unauthorized access
- Access to unassigned events
- Invalid gallery PIN
- Unpublished gallery access
- Invalid file uploads
- Missing files
- Non-existent resources
- Database errors
- Server errors

## Project Structure

```text
trizenai-photo-sharing-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── galleryController.js
│   │   │   └── photoController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Photo.js
│   │   │   └── Gallery.js
│   │   │
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── eventRoutes.js
│   │       ├── galleryRoutes.js
│   │       ├── healthRoutes.js
│   │       └── photoRoutes.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── authorization.test.js
│   │   ├── photoAccess.test.js
│   │   ├── galleryPublishing.test.js
│   │   ├── galleryPin.test.js
│   │   └── setup.js
│   │
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
├── .gitignore
└── README.md
```

## Known Limitations

The current implementation does not include some optional enhancements such as:

- Automatic thumbnail generation
- Advanced image resizing
- Gallery pagination
- Advanced gallery search/filtering
- Bulk photo upload
- Gallery download functionality
- Gallery expiration
- CDN optimization beyond the capabilities provided by Cloudinary

These features can be added in future iterations.

## Demo Information

For evaluation, provide the following information separately from the source code when required:

Live Frontend URL:
https://trizenai-photo-sharing-platform.vercel.app

Backend API URL:
https://trizenai-photo-sharing-platform-g2g9.onrender.com

GitHub Repository:
<YOUR_GITHUB_REPOSITORY_URL>

Demo Admin:
Email: <ADMIN_EMAIL>
Password: <ADMIN_PASSWORD>

Demo Team Member:
Email: <TEAM_EMAIL>
Password: <TEAM_PASSWORD>

Demo Gallery:
<DEMO_GALLERY_URL>

Gallery PIN:
<DEMO_GALLERY_PIN>

Do not commit real passwords, API keys, database credentials, JWT secrets, or admin invite codes to the repository.

## Final Notes

This project was developed as part of the TrizenAI Full-Stack Internship take-home challenge.

The platform demonstrates:

- Full-stack application development
- React frontend development
- REST API development
- MongoDB database integration
- Cloud image storage
- JWT authentication
- Role-based access control
- Secure password and PIN handling
- File upload validation
- Customer gallery sharing
- Automated backend testing
- Production deployment using Vercel and Render

### After pasting

Save `README.md`.

Then from the project root run:

```powershell
git status
```