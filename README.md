# siidona1 - Classified Ads Platform

A modern classified ads website built with Next.js 16, where users can post ads, guests can browse listings, and admins have full control over the platform.

## Features

### For Guests (Visitors)
- Browse all approved classified ads
- View detailed ad information
- Filter ads by category
- See contact information for sellers

### For Registered Users
- Create an account and login
- Post new classified ads
- Ads are submitted for admin approval
- Include images, pricing, location, and contact details

### For Admins
- Full admin dashboard at `/admin`
- Approve or reject pending ads
- Delete any ad
- Manage categories (add/delete)
- Manage users (view/delete)
- View all platform statistics

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Authentication**: Cookie-based sessions with bcrypt
- **Package Manager**: Bun

## Database Schema

### Users Table
- `id` - Auto-increment primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - Either "user" or "admin"
- `createdAt` - Timestamp

### Categories Table
- `id` - Auto-increment primary key
- `name` - Category name (unique)
- `slug` - URL-friendly slug
- `description` - Optional description
- `createdAt` - Timestamp

### Ads Table
- `id` - Auto-increment primary key
- `title` - Ad title
- `description` - Full description
- `price` - Price as text (e.g., "$500")
- `location` - Optional location
- `contactPhone` - Optional phone number
- `contactEmail` - Optional email
- `imageUrl` - Optional image URL
- `status` - "pending", "approved", or "rejected"
- `userId` - Foreign key to users
- `categoryId` - Foreign key to categories
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Getting Started

### Initial Setup

The database has been set up with migrations. The seed script is available to populate initial data:

**Note**: The seed script (`bun db:seed`) requires database credentials that are only available in the deployed environment. After deployment, you can run the seed script to create:
- An admin user (email: `admin@siidona1.com`, password: `admin123`)
- 8 default categories (Electronics, Vehicles, Real Estate, Furniture, Fashion, Services, Jobs, Other)

Alternatively, you can manually create an admin user by:
1. Registering a new account through `/register`
2. Manually updating the user's role to "admin" in the database
3. Creating categories through the admin dashboard

### Admin Access

1. Login with the admin credentials:
   - Email: `admin@siidona1.com`
   - Password: `admin123`

2. Access the admin dashboard at `/admin`

3. **Important**: Change the admin password after first login!

## Key Pages

- `/` - Home page with all approved ads
- `/login` - User login
- `/register` - User registration
- `/ads/new` - Post a new ad (requires login)
- `/ads/[id]` - View ad details
- `/admin` - Admin dashboard (requires admin role)

## User Workflow

1. **Guest visits site** → Can browse all approved ads
2. **User registers** → Creates account with email/password
3. **User posts ad** → Ad goes to "pending" status
4. **Admin reviews** → Approves or rejects the ad
5. **Approved ads** → Appear on the home page for everyone

## Admin Workflow

1. **Login as admin** → Access admin dashboard
2. **Review pending ads** → Approve or reject submissions
3. **Manage categories** → Add new categories or remove unused ones
4. **Manage users** → View all users and remove problematic accounts
5. **Delete ads** → Remove any ad regardless of status

## Development Commands

```bash
# Start development server
bun dev

# Type checking
bun typecheck

# Linting
bun lint

# Build for production
bun build

# Database commands
bun db:generate  # Generate migrations
bun db:seed      # Seed initial data
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with ad listings
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Registration page
│   ├── admin/page.tsx        # Admin dashboard
│   ├── ads/
│   │   ├── new/page.tsx      # Post new ad
│   │   └── [id]/page.tsx     # Ad detail page
│   └── api/
│       └── auth/             # Authentication API routes
├── db/
│   ├── schema.ts             # Database schema
│   ├── index.ts              # Database client
│   ├── migrate.ts            # Migration runner
│   └── seed.ts               # Seed script
└── lib/
    └── auth.ts               # Authentication utilities
```

## Security Features

- Passwords hashed with bcrypt
- HTTP-only cookies for sessions
- Server-side authentication checks
- Admin-only routes protected
- SQL injection prevention via Drizzle ORM

## Customization

### Adding New Categories

Admins can add categories directly from the admin dashboard at `/admin`.

### Changing Site Name

The site name "siidona1" appears in:
- [`src/app/page.tsx`](src/app/page.tsx) - Header and hero section
- [`src/app/login/page.tsx`](src/app/login/page.tsx) - Login page header
- [`src/app/register/page.tsx`](src/app/register/page.tsx) - Registration page header
- [`src/app/ads/new/page.tsx`](src/app/ads/new/page.tsx) - New ad page header
- [`src/app/ads/[id]/page.tsx`](src/app/ads/[id]/page.tsx) - Ad detail page header

### Styling

The site uses Tailwind CSS 4. Colors and styling can be customized in:
- Global styles: [`src/app/globals.css`](src/app/globals.css)
- Component classes: Inline Tailwind classes in each page

## Future Enhancements

Potential features to add:
- Image upload functionality
- User profile pages
- Favorite/saved ads
- Search functionality
- Email notifications
- Ad expiration dates
- Featured/promoted ads
- User ratings and reviews
- Chat/messaging between users

## License

This project is open source and available for modification and use.
