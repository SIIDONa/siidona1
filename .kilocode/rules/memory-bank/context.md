# Active Context: siidona1 Classified Ads Platform

## Current State

**Project Status**: ✅ Fully Functional Classified Ads Platform with Golden Theme, i18n, and Wallet System

The template has been transformed into "siidona1", a complete classified ads platform for Ethiopia where users can post ads, guests can browse listings, and admins have full control. Features a golden-themed footer with social media integration, day/night mode, multilingual support (English, Amharic, Arabic), and wallet system.

## Recently Completed

- [x] Database setup with Drizzle ORM (users, ads, categories tables)
- [x] Authentication system with bcrypt password hashing
- [x] User registration and login pages
- [x] Home page displaying all approved ads
- [x] Ad posting page for logged-in users
- [x] Ad detail view page
- [x] Admin dashboard with full management capabilities
- [x] Category management system
- [x] User management system
- [x] Ad approval workflow (pending → approved/rejected)
- [x] Seed script with admin user and default categories
- [x] Complete styling with Tailwind CSS
- [x] Golden-themed footer with social media links
- [x] Day/night mode toggle
- [x] Dark mode support across the site
- [x] **NEW**: Multilingual support (English, Amharic, Arabic)
- [x] **NEW**: Wallet system with admin-only fund management
- [x] **NEW**: Fully responsive design for all screen sizes
- [x] **NEW**: Golden color theme throughout the site

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page with ad listings | ✅ Complete |
| `src/app/login/page.tsx` | User login | ✅ Complete |
| `src/app/register/page.tsx` | User registration | ✅ Complete |
| `src/app/ads/new/page.tsx` | Post new ad | ✅ Complete |
| `src/app/ads/[id]/page.tsx` | Ad detail view | ✅ Complete |
| `src/app/admin/page.tsx` | Admin dashboard + Wallet | ✅ Complete |
| `src/app/api/auth/` | Auth API routes | ✅ Complete |
| `src/db/schema.ts` | Database schema | ✅ Complete |
| `src/db/seed.ts` | Database seeding | ✅ Complete |
| `src/lib/auth.ts` | Auth utilities | ✅ Complete |
| `src/lib/translations.ts` | i18n translations (EN/AM/AR) | ✅ Complete |
| `src/lib/language-context.tsx` | Language context provider | ✅ Complete |
| `src/components/LanguageSwitcher.tsx` | Language switcher UI | ✅ Complete |

## Key Features Implemented

### User Features
- Registration with email/password
- Login/logout functionality
- Post classified ads with:
  - Title, description, price
  - Category selection
  - Optional: location, contact info, image URL
- View all approved ads
- View detailed ad information

### Admin Features
- Admin dashboard at `/admin`
- Approve/reject pending ads
- Delete any ad
- Add/delete categories
- View/delete users
- **NEW**: Wallet management - add funds to user accounts
- Full platform control

### Internationalization (i18n)
- English (default)
- Amharic (አማርኛ)
- Arabic (العربية) with RTL support
- Language switcher in header/footer
- Persistent language preference (localStorage)

### Wallet System
- Users have wallet balance stored in database (in cents)
- Only admins can add funds to user wallets
- Balance displayed in USD format
- Accessible from admin dashboard

### Security
- Password hashing with bcrypt
- Cookie-based sessions
- Protected routes (admin-only)
- Server-side authentication

## Database Schema

### Tables
1. **users** - User accounts (id, name, email, password, role, **walletBalance**, createdAt)
2. **categories** - Ad categories (id, name, slug, description, createdAt)
3. **ads** - Classified ads (id, title, description, price, location, contact info, imageUrl, status, userId, categoryId, timestamps)

### Default Data (via seed script)
- Admin user: `admin@siidona1.com` / `admin123`
- 8 categories: Electronics, Vehicles, Real Estate, Furniture, Fashion, Services, Jobs, Other

## User Workflows

### Guest Workflow
1. Visit home page
2. Browse approved ads
3. Click ad to view details
4. See seller contact information

### User Workflow
1. Register account
2. Login
3. Post new ad (goes to "pending" status)
4. Wait for admin approval
5. Ad appears on home page when approved

### Admin Workflow
1. Login with admin credentials
2. Access admin dashboard at `/admin`
3. Review pending ads → approve/reject
4. Manage categories and users
5. Manage wallet - add funds to user accounts
6. Delete problematic content

## Technical Details

### Authentication
- Cookie-based sessions (7-day expiry)
- HTTP-only cookies for security
- Server-side session validation
- Role-based access control (user/admin)

### Database
- SQLite with Drizzle ORM
- Migrations in `src/db/migrations/`
- Seed script: `bun db:seed`

### Styling
- Tailwind CSS 4
- **Golden color theme** (yellow-500, yellow-600 primary)
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support
- Clean, modern UI

### Internationalization
- Context-based translations
- RTL support for Arabic
- LocalStorage persistence

## Available Commands

```bash
bun dev          # Start development server
bun build        # Production build
bun typecheck    # Type checking
bun lint         # Linting
bun db:generate  # Generate migrations
bun db:push      # Push migrations to DB
bun db:seed      # Seed database
```

## Session History

| Date | Changes |
|------|---------|
| Initial | Base Next.js template created |
| 2026-02-17 | Added database with users, ads, categories tables |
| 2026-02-17 | Implemented authentication system |
| 2026-02-17 | Created all user-facing pages (home, login, register, ads) |
| 2026-02-17 | Built admin dashboard with full management |
| 2026-02-17 | Added seed script and documentation |
| 2026-02-17 | Added golden footer with social media and day/night mode |
| 2026-02-17 | **Major update**: Golden theme, responsive, i18n (EN/AM/AR), wallet system |

## Next Steps (Optional Enhancements)

- [ ] Add image upload functionality
- [ ] Implement search and filtering
- [ ] Add user profile pages
- [ ] Email notifications for ad approval
- [ ] Favorite/saved ads feature
- [ ] User ratings and reviews
- [ ] Chat/messaging system
