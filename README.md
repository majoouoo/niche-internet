# niche internet

**[niche internet](https://niche-internet.vercel.app/)** is a platform to discover and highlight lesser-known YouTube creators who produce quality content. The website connects users with hidden gems by letting them submit, vote, and explore creators, making it easier for small creators to gain visibility.

Check it out at https://niche-internet.vercel.app/

## Features

### 🎥 Channel Discovery

- Submit YouTube channels by ID, link, or @handle.
- User-submitted descriptions add a personal touch to highlight why each creator is worth exploring.
- Detailed channel information is displayed, including number of subscribers and profile pictures.

### 📊 Sorting Algorithm

- Our algorithm ensures fairness by ranking channels based on:
  - Number of votes
  - Number of subscribers (favoring fewer subscribers)
  - Date of submission (newer submissions get a slight boost initially).

### 🔎 Search Functionality

- Find creators based on:
  - Keywords provided by YouTube API
  - Descriptions (both user-provided and YouTube-provided)
  - Channel names or @handles.

### 🚦 Content Moderation

- The platform is regulated to prevent misuse or inappropriate content.
- Users can report submissions that violate guidelines.
- The owner reserves the right to ban specific channels if necessary.
- Submissions are limited by IP address to prevent spam.

## How It Works

1. **Submit a Channel**

   - Users can submit a YouTube channel using its ID, link, or @handle.
   - Provide a brief description to explain why the channel is worth checking out.

2. **Vote for Favorites**

   - Users can browse submitted channels and vote for the ones they enjoy.

3. **Explore Channels**

   - Use the search feature to find channels based on your interests, exploring hidden gems based on tags, descriptions, and names.

4. **Algorithm in Action**

   - Channels are ranked dynamically, ensuring those with fewer subscribers but high-quality content can shine.

5. **Report and Moderation**
   - If you encounter a problematic submission, use the report feature to notify moderators.

## Technology Stack

- **Frontend**: Svelte
- **Backend**: SvelteKit
- **Database**: PostgreSQL
- **YouTube Data API**: To fetch channel information and metadata.

## Licenses

See NOTICE.txt for licenses of open source projects used.
