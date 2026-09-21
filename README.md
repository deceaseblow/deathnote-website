
# ☠ DEATH NOTE — Personal Blog

<p align="center">
  <img src="./ref_images/reference_pic.webp" alt="Death Note Website" width="900">
</p>

<p align="center">
  <b>A dark little corner of the internet.</b><br>
  <i>A personal blogging website inspired by Death Note and the strange beauty of the early web.</i>
</p>

<p align="center">
  ◈ BLOGS &nbsp; ✦ &nbsp; USERS &nbsp; ◈ &nbsp; PROFILES &nbsp; ✦ &nbsp; AUTH
</p>

---

## ☠ About

**Death Note** is a full-stack personal blogging website built around a dark, minimalist aesthetic inspired by *Death Note*, Japanese web design, and the early-2000s internet.

The goal was to create something that feels less like a modern social-media platform and more like an old personal website you might have discovered somewhere deep in the internet.

Users can create accounts, publish blog posts, manage their profiles, and browse other users and their posts.

The project originally used **MongoDB Atlas** for persistence and was later migrated to **Firebase Firestore**, while keeping the existing frontend and API architecture mostly intact.

> A tiny corner of the internet that probably shouldn't exist.

---

## The Vibe

The visual direction takes inspiration from:

- early-2000s personal websites
- dark internet aesthetics
- Japanese web design
- Death Note
- old-school blogs
- minimalist black-and-white interfaces
- personal websites that actually feel personal

No attempt was made to make it look like another generic SaaS dashboard.


---

#  Screenshots

## Home

<p align="center">
  <img src="./ref_images/1.png" alt="Homepage" width="900">
</p>

## Blogs

<p align="center">
  <img src="./ref_images/4.png" alt="Blogs page" width="900">
</p>

## Blog

<p align="center">
  <img src="./ref_images/10.png" alt="Single blog page" width="900">
</p>

## Profile

<p align="center">
  <img src="./ref_images/9.png" alt="User profile" width="900">
</p>


---

# Features

### Authentication

- User registration
- Login with username or email
- JWT-based authentication
- Persistent authentication using `localStorage`
- Logout functionality
- User-specific profiles

### Blog System

- Create blog posts
- View all blogs
- View individual blog posts
- Edit blog posts
- Delete blog posts
- Display author information
- Display publication dates
- View posts belonging to a specific user

### User Profiles

- Username
- Biography
- Profile image
- User's published blogs
- Profile editing
- Username changes
- Clickable usernames throughout the website

### Account Management

Users can update:

- Username
- Biography
- Profile image

The profile page also provides:

- Create New Blog
- Update Account
- Logout

---

# Tech Stack

### Frontend

- **Next.js 16**
- **React**
- **JavaScript**
- **Tailwind CSS**

### Backend

- **Next.js API Routes**
- **Node.js**
- **JWT**
- **UUID**

### Database

- **Firebase Firestore**
- **Firebase Admin SDK**

---

# 🔌 API

The application uses **Next.js API Routes** instead of a separate Express backend.

## Authentication

### `POST /api/auth/signup`

Creates a new user.

```json
{
  "username": "username",
  "email": "email@example.com",
  "password": "password"
}
```

### `POST /api/auth/login`

Authenticates an existing user.

```json
{
  "login": "username",
  "password": "password"
}
```

---

## Blogs

### `GET /api/blogs`

Returns all blogs.

### `GET /api/blogs?userId=<id>`

Returns blogs belonging to a specific user.

### `POST /api/blogs`

Creates a new blog.

```json
{
  "title": "My first post",
  "content": "Hello from the internet.",
  "userId": "user-id"
}
```

### `GET /api/blogs/:id`

Returns a specific blog.

### `PUT /api/blogs/:id`

Updates a blog.

```json
{
  "title": "Updated title",
  "content": "Updated content."
}
```

### `DELETE /api/blogs/:id`

Deletes a blog.

---

## Users

### `GET /api/users`

Returns users without exposing passwords.

### `GET /api/users/:handle`

Returns a user's public profile.

### `PUT /api/users/:handle`

Updates a user's profile.

```json
{
  "username": "newusername",
  "bio": "Something about me.",
  "img": "https://example.com/image.jpg"
}
```

---

## News

### `GET /api/news`

Returns available news entries.

### `GET /api/news?id=<id>`

Returns a specific news entry.

---

# Firebase Setup

The application uses **Firebase Admin SDK** to communicate with Firestore from the server.

Create a Firebase project and enable **Cloud Firestore**.

Then create a `.env.local` file in the root directory.

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

JWT_SECRET=your-jwt-secret
```

### Important

Never commit `.env.local` to GitHub.

Firebase service-account credentials and JWT secrets must remain private.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd deathnote-next
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

and add your Firebase and JWT configuration.

## 4. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Main Dependencies

Some of the main packages used by the project are:

```text
next
react
react-dom
firebase-admin
jsonwebtoken
jwt-decode
uuid
```

Install everything with:

```bash
npm install
```

---

# Architecture

The application follows a simple full-stack structure.

The frontend communicates with the backend through HTTP requests.

The API handles:

- Authentication
- User lookup
- Blog CRUD operations
- Profile updates
- Firestore operations

Firestore is accessed from the server through the Firebase Admin SDK.

---

# Data Model

## Users

A user document contains information such as:

```json
{
  "id": "uuid",
  "username": "username",
  "email": "user@example.com",
  "password": "...",
  "bio": "Something about me.",
  "img": "",
  "blogs": []
}
```

## Blogs

A blog document contains:

```json
{
  "id": "uuid",
  "title": "Some title",
  "content": "Some content",
  "userId": "user-uuid",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## News

News documents contain:

```json
{
  "id": "news-id",
  "title": "News title",
  "date": "2026-01-01",
  "content": "News content"
}
```

---

#  Why Firestore?

This allows the frontend to continue using familiar endpoints such as:

```text
/api/blogs
/api/blogs/:id
/api/users
/api/users/:handle
/api/news
```

without having to rebuild the application around a completely different API structure.

---

#  Security Notes

This project is primarily a personal/learning project.

Before using it as a production application, several areas should be strengthened.

### Password Hashing

Passwords should be hashed using a secure password hashing algorithm such as `bcrypt` rather than being stored directly.

### API Authorization

Protected API operations should verify the JWT on the server.

For example:

```text
Client
  │
  ▼
Send JWT
  │
  ▼
Verify JWT
  │
  ▼
Identify authenticated user
  │
  ▼
Perform operation
```

The server should not blindly trust a `userId` supplied by the client.

### Profile Updates

Profile update requests should verify that the authenticated user owns the profile being modified.

### Environment Variables

Never commit:

```text
.env
.env.local
Firebase private keys
JWT secrets
database credentials
```

---

# Design Philosophy

The project intentionally avoids the polished, corporate appearance of many modern web applications.

The design takes inspiration from an older internet:

```text
        black backgrounds
        white text
        personal profiles
        strange little buttons
        blogs
        Japanese typography
        dark imagery
        simple layouts
        minimal animations
```

The goal isn't to perfectly recreate the old web.

It's to recreate the **feeling** of finding a strange personal website that someone clearly cared about.

---

# ☠ Future Ideas

- [ ] Password hashing
- [ ] Server-side JWT authorization
- [ ] Image uploads
- [ ] Firebase Storage
- [ ] Comments
- [ ] Likes
- [ ] Blog search
- [ ] Blog categories
- [ ] Markdown editor
- [ ] Pagination
- [ ] Account deletion
- [ ] Email verification
- [ ] Password reset
- [ ] More early-web interactions
- [ ] More Death Note inspired UI elements

---

# Credits

Built as a personal full-stack web project.

Inspired by:

- *Death Note*
- early-2000s personal websites
- Japanese web aesthetics
- old-school blogging
- the wonderfully questionable design decisions of the early internet

---
