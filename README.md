# 🖥️ Windows XP Nostalgia Portfolio - Sanjay J

A highly accurate, fully interactive, and responsive portfolio replica of the classic **Windows XP (Luna Theme)** operating system. Built as a showcase for Sanjay J, a Computer Science Engineering student at Loyola-ICAM College of Engineering and Technology (LICET).

---

## 🌟 Interactive Live Experience Features

This project recreates the classic desktop environment of 2001, complete with authentic UX behaviors and widgets:

### 1. 🔑 OS Boot & Logon Screen
*   **Autoplay Audio Compliance:** Starts with the classic blue Windows XP Logon panel to prompt user interaction before playing sound.
*   **Startup Sequence:** Clicking the user profile card triggers the authentic Windows XP startup sound, fades out the logon screen, and loads the desktop.
*   **Power Control:** A functional "Turn Off Computer" button is available on the logon screen.

### 2. 🗂️ Interactive Desktop Icons Grid
Double-clicking on desktop icons (or single-tapping on mobile) launches classic draggable and active-window focused window modals:
*   **My Computer:** Shows system specifications, owner information, and current academic path.
*   **Internet Explorer:** Launches an external shortcut directly to Sanjay J's official GitHub Profile page.
*   **Sanjay J Resume:** Opens a custom WordPad text editor window displaying full resume contents and a retro **Download PDF** button.
*   **My Projects:** Opens an Explorer-style folder displaying individual subfolders for each project (LSTMpredict, Chronos-Kit, TaskOps, NovaVault, Gamepayx, Zombie Invasion, TYPENINJA). Double-clicking a subfolder opens a customized Properties modal showing details and repository buttons.
*   **Control Panel:** Hosts a customization engine enabling users to change the taskbar and window color scheme in real time (Classic Blue, Olive Green, Silver).
*   **Minesweeper:** Launches a classic Minesweeper puzzle game.
*   **Recycle Bin:** Opens the recycle bin file drawer. Users can click "Empty Recycle Bin" to purge files, updating system states.
*   **Zombie Invasion:** Runs a quick shortcut launcher, redirecting directly to Sanjay J's Phaser action-shooter game hosted on itch.io.
*   **Media Player:** Recreates the metallic Windows Media Player application.

### 💿 3. Windows Media Player (Dynamic Local Playlist & CD Spinner)
*   **CD Disc Visualization:** Features a dark disk turntable with a silver CD core in the center that spins smoothly while music plays and pauses when playback is stopped/paused.
*   **Background Listening:** Minimizing the Media Player window keeps the audio playing continuously in the background, allowing users to surf other parts of the desktop. Closing the window pauses and stops playback.
*   **Dynamic Music Scan (Local dev only):** Queries the `/music/` directory dynamically to scan and import any `.mp3` files found there.
*   **Metadata Parsing:** Automatically parses filenames (splits by `-`) to output track titles and artist names.
*   **Static Fallback (Production CDNs):** Includes a fallback array for hosting environments (like Vercel CDN) that do not support directory auto-indexing.

### 💣 4. Minesweeper Classic Game
*   **Full Grid System:** Generates a standard 9x9 board with 10 mines.
*   **Scoreboard Widget:** Real-time mine flag count and puzzle stopwatch timer.
*   **Authentic Visuals:** Features the smiley face reset button (which reacts to click actions, game wins `😎`, and game losses `😵`).
*   **Right-Click Flagging:** Standard flagging mechanics to mark suspects.

### ⚙️ 5. Customizable Themes & Window Manager
*   **Real-time Color Schemes:** Switch the desktop shell theme between **Classic Blue (Luna)**, **Olive Green**, and **Silver**.
*   **Z-Index Focus Management:** Clicking on any window brings it to active focus (brightening the blue/silver title bar) and pulls its z-index stack to the top.
*   **Taskbar Sync:** Open windows are synced to tabs on the taskbar. Clicking a tab toggles the window between minimize and restore.

### 📅 6. System Tray Widgets
*   **System Clock:** Live updating time widget at the bottom right.
*   **Calendar Widget:** Clicking the system clock triggers a fully styled Date and Time Properties Calendar widget showing current days, months, and years.

---

## 🛠️ Tech Stack & Architecture

*   **Markup:** Semantic HTML5
*   **Styles:** Pure Vanilla CSS3 (curated HSL palettes, Windows XP gradients, custom sliders, spin keyframes)
*   **Logic:** Client-Side JavaScript (ES6+, DOM API, HTML5 Audio API, DOMParser, TextDecoder)
*   **Dev Server:** Node.js HTTP-Server

---


## 🌐 Deploying to Vercel

This portfolio is statically hosted on Vercel:

1. Create a repository on GitHub and push your files.
2. Log into [Vercel](https://vercel.com/) using your GitHub account.
3. Import the repository and click **Deploy**. Vercel will automatically host it on a global CDN!

### 🎵 Adding Songs in Production (Vercel)
Since Vercel's static CDN does not allow scanning directories on the fly, you can add new songs to the playlist when deployed by updating the fallback list in `app.js`:

```javascript
/* Located at loadPlaylistFromMusicFolder() inside app.js */
} catch (e) {
    return [
        {
            url: 'music/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3',
            filename: 'Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3',
            title: 'Sunflower (Spider-Man: Into the Spider-Verse)',
            artist: 'Post Malone, Swae Lee'
        },
        /* Add new songs here: */
        {
            url: 'music/your-new-song.mp3',
            filename: 'Artist - Title.mp3',
            title: 'Title',
            artist: 'Artist'
        }
    ];
}
```

---

## 📄 License & Credits

*   Bliss wallpaper and classic branding are trademarks of Microsoft Corp. (used here for nostalgic portfolio reproduction purposes).
*   Built with ❤️ by Sanjay J.
