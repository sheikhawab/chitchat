
## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Quick Start](#quick-start)
5. [Code Snippets](#code-snippets)
6. [Assets & More](#assets--more)


## ⚙️ Tech Stack

- **React** for building the user interface
- **Vite** for fast development and build processes
- **TypeScript** for type safety and modern JavaScript features
- **Supabase** for backend services including authentication, real-time data, and storage
- **Tailwind CSS** for rapid and responsive styling

## ⚡️ Features

- **User Authentication via GitHub + Google:**  
  Securely sign in with GitHub and display user avatars and usernames across the site.

- **Post Creation with Image Uploads:**  
  Create posts with rich content and optional image uploads, complete with the creator’s profile picture.

- **Dynamic Voting System:**  
  Thumbs up and thumbs down buttons with subtle white glow effects to indicate your vote.

- **Robust Commenting System:**  
  Engage in threaded discussions with nested replies, each showing the commenter’s username and timestamp.

- **Community & Category Support:**  
  Build a Reddit-like experience where posts are organized by communities, with posts displayed in a responsive grid.

- **Modern Glassmorphism & Glow Effects:**  
  Enjoy a visually striking interface featuring glassy, transparent cards with glowing gradient borders on hover.

- **Real-Time Data Updates:**  
  All interactions (posting, voting, commenting) update in real time using Supabase and React Query.

## 👌 Quick Start

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

### Cloning the Repository

Run the following commands in your terminal:

```bash

git clone https://github.com/sheikhawab/chitchat.git
cd folder name
```

### Installation

Install the dependencies:

```bash
npm install
```

### Environment Variables

Create a file named `.env` in the project root and add your Supabase credentials and other configuration values:

```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Running the Project

Start the development server:

```gitbash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🕸️ Code Snippets

Below are some key code snippets from the project.

### RPC Function with Avatar URL

```sql
CREATE OR REPLACE FUNCTION get_posts_with_counts()
RETURNS TABLE (
  id integer,
  title text,
  content text,
  created_at timestamptz,
  image_url text,
  like_count integer,
  comment_count integer,
  user_avatar_url text
)
LANGUAGE sql
AS $$
  SELECT 
    p.id,
    p.title,
    p.content,
    p.created_at,
    p.image_url,
    (SELECT COUNT(*) FROM votes v WHERE v.post_id = p.id) AS like_count,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
    p.user_avatar_url
  FROM posts p
  ORDER BY p.created_at DESC;
$$;
```

### Vote Deletion RLS Policy

```sql
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Delete own vote" ON votes
FOR DELETE
USING (auth.uid()::text = user_id);
```

## 🚀 More

If you enjoyed this tutorial, check out our other projects and advanced courses to further improve your development skills.

---

Happy coding !
