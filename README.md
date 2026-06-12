# iNevesht Frontend

A modern blogging and content management platform frontend built with Next.js 16 (App Router) and React 19.

## Features

* Authentication System

  * Login
  * Register
  * Forgot Password
  * Reset Password via Token

* Blog Management

  * Create Posts
  * Edit Posts
  * Dynamic Post Pages
  * Rich Text Editor (React Quill)

* Content Pages

  * Home Page
  * Post Details (`/post/[id]`)
  * Search Page
  * Contact Us Page

* User Experience

  * Responsive Design
  * RTL Support
  * Reusable Components
  * Centralized Error Handling

* API Architecture

  * Dedicated Service Layer
  * Custom Fetch Wrapper
  * Environment Variable Management
  * Centralized Header & Error Handling

## Tech Stack

* Next.js 16 (App Router)
* React 19
* Tailwind CSS v4
* Bootstrap
* React Quill
* ESLint
* PostCSS

## Project Structure

```bash
src/
├── app/
├── components/
├── services/
├── hooks/
├── utils/
└── styles/
```

## Installation

```bash
git clone https://github.com/your-username/inevesht-frontend.git
cd inevesht-frontend
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## Running the Project

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Authentication

The application supports persistent authentication with intelligent token storage:

* sessionStorage for temporary sessions
* localStorage when "Remember Me" is enabled

## Highlights

* Dynamic routing with App Router
* Rich text content management
* Clean API abstraction layer
* Reusable UI architecture
* Responsive and RTL-ready interface

## Author

Developed by [Your Name]
