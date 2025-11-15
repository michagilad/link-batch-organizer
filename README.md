<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Link Batch Organizer & List Comparator

A modern web application with two powerful tools:

## 🔗 Batch Organizer
Organize links or IDs into manageable batches. Perfect for processing large sets of URLs or identifiers.

**Features:**
- Batch links or IDs by size
- Optional total link limit
- Add backstage.eko.com URL prefix automatically
- Copy batches with one click
- Real-time link counter

## 📋 List Comparator
Find the symmetric difference between two lists instantly. Identify which items are unique to each list.

**Features:**
- Compare two lists side-by-side
- Detect duplicate items within each list
- View unique items from each list
- Real-time item counter

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Deploy to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   ```
   Follow the prompts to create a new site or link to an existing one.

4. Set your environment variable:
   ```bash
   netlify env:set GEMINI_API_KEY your-api-key-here
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify UI

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Netlify](https://app.netlify.com/) and sign in

3. Click "Add new site" → "Import an existing project"

4. Connect your Git provider and select your repository

5. Configure build settings (these should be auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

6. Add environment variable:
   - Go to Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your API key value

7. Click "Deploy site"

Your app will be live at a Netlify URL (e.g., `your-app-name.netlify.app`)!
