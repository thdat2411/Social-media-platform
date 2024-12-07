# [Social Media Platform](<https://mirrored-social-media-platform.vercel.app/>)

This is a comprehensive social media platform project designed to provide users with robust networking, job posting, and communication functionalities. Developed using modern frameworks, it offers an engaging and efficient user experience.

## Features

### Networking

- User Profiles: View and edit personal profiles, including photo upload.
- Networking Feed: Post updates, like, and comment on posts.
- Search: Discover users, posts, and job listings.

### Job Posting

- Create & Manage Jobs: Post job listings, edit or hide them, and manage their visibility.
- Applications Management: View and process applications, including applicant details and attached CVs.
- Notifications: Get notified about new applicants and updates to job posts.

### Communication

- Messaging: Real-time messaging features (in progress).
- Email Integration: Send verification codes and communication emails.

## Technology Stack

- Frontend: Next.js 14, React (for a responsive and dynamic UI)
- Backend: Next.js 14 Route Handlers (for business logic and API endpoints)
- Database: PostgreSQL (for reliable and scalable data storage), Prisma ORM (for simplified database interactions)
- Authentication: NextAuth.js 4 (for secure user authentication), JWT (for session management)
- AI Services: Hugging Face Inference API (for job description generation and recommendations)
- Real-time Notifications: Pusher, WebSockets (for instant updates)
- Media Storage: Cloudinary (for storing images and resumes)

## Installation

### System requirements

- Node.js 20.x.x

### Run the project

**1. Clone the repository:**

```bash
git clone https://github.com/thdat2411/Social-media-platform
cd Social-media-platform
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set environment variables:** Create a .env file and configure the following variables:

```makefile
# Neon PostgreSQL database configuration
# (can use locally but need to change lib/prisma.ts)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Secret used to encrypt the NextAuth.js JWT, and to hash email verification tokens
# Tip: You can run npx auth secret - NextAuth.js CLI - in your project's root, and it will autogenerate a random value and put it in your .env.local file.
NEXTAUTH_SECRET=

# Google Provider Environment Variables
GOOGLE_ID=
GOOGLE_SECRET=

# Email address and password for Nodemailer
EMAIL_USER=
EMAIL_PASS=

# Cloudinary media storage configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# HuggingFace Access Tokens
HUGGING_FACE_API_KEY=

# Pusher project configuration
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

**4. Run database migrations:**

```bash
npx prisma migrate dev
```

**5. Start the development server:**

```bash
npm run dev
```

## Usage

- Access the application at <http://localhost:3000>.
- Sign up as a job seeker or recruiter to explore features.
- Manage your job postings or applications via the dashboard.

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For queries, please contact <thaidat.0901485160@gmail.com>.
