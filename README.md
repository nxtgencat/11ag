# 💬 WhatsApp Clone (React + TypeScript + Tailwind CSS)

A responsive, feature-complete WhatsApp Web and Mobile chat interface built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**.

---

## 📌 Summary: What, Why & How

| Question | Explanation |
| :--- | :--- |
| **What is it?** | A frontend clone of WhatsApp Web and Mobile with authentic layouts, 50+ populated contacts, multi-media chat, voice notes with waveforms, real file attachments, simulated audio/video calls, and dark/light themes. |
| **Why?** | To demonstrate a scalable, production-grade frontend messaging architecture with clean state management, modular components, responsive design, and fluid UX interactions without requiring an immediate backend. |
| **How does it work?** | Built using React Contexts (`AuthContext`, `ChatContext`, `CallContext`, `ThemeContext`) for real-time reactivity and local persistence, styled with Tailwind utility classes, and optimized with Vite bundler. |

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (Lightning-fast HMR)
- **Styling**: Tailwind CSS (Authentic WhatsApp light & dark palettes + doodle wallpaper)
- **Icons**: Lucide React + WhatsApp SVG icons
- **Audio Engine**: Web Audio API (real-time message sounds & voice note waveforms)
- **Package Manager**: `pnpm` exclusively

---

## 📁 Project Architecture & Tree View

```text
whatsapp-clone/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
│
└── src/
    ├── app/
    │   ├── App.tsx                     # Root providers wrapper
    │   └── routes.tsx                  # Auth vs Main app router
    │
    ├── context/                        # Global State Management
    │   ├── AuthContext.tsx             # Login, OTP verification, user profile
    │   ├── ChatContext.tsx             # 50+ chats, messaging, search, filters
    │   ├── CallContext.tsx             # Voice and Video call simulator
    │   └── ThemeContext.tsx            # Light/Dark mode & wallpaper picker
    │
    ├── components/                     # Reusable UI Primitives
    │   ├── auth/                       # PhoneLogin, OtpVerification, ProfileSetup
    │   ├── chat/                       # ChatList, ChatListItem, ChatHeader, ChatComposer
    │   ├── messages/                   # MessageBubble, Text, Images, Videos, Voice, Docs, Locations
    │   ├── media/                      # AttachmentMenu, MediaViewer (Lightbox), VideoPlayer, Camera, LocationPicker
    │   ├── profile/                    # ContactInfoDrawer, SharedMediaTab, StarredMessages, SettingsModal
    │   ├── call/                       # VoiceCallModal, VideoCallModal
    │   ├── layout/                     # NavigationRail, Sidebar, ResponsiveContainer
    │   └── common/                     # Avatar, Modal, Dropdown, EmojiPicker, Toast
    │
    ├── data/                           # Mock Datasets
    │   ├── contacts.ts                 # 52 unique realistic contacts & groups
    │   ├── messages.ts                 # Multi-message threads with rich media
    │   ├── countries.ts                # 45+ international dialing codes & flags
    │   └── sampleMedia.ts              # Preset photos, videos, links & docs
    │
    ├── hooks/                          # Custom React Hooks
    │   ├── useVoiceRecorder.ts         # Animated audio waveform & timer recorder
    │   ├── useMediaQuery.ts            # Mobile / Tablet / Desktop breakpoint detection
    │   └── useDebounce.ts              # Instant search query optimizer
    │
    ├── utils/                          # Helper Functions
    │   ├── formatters.ts               # WhatsApp timestamps, file sizes, timer format
    │   └── soundEffects.ts             # Web Audio API sound synthesis (pop, swoosh)
    │
    ├── types/                          # TypeScript Interfaces
    │   └── index.ts                    # User, Contact, Message, Attachment, Call types
    │
    ├── index.css                       # Custom WhatsApp scrollbars, tails & wallpapers
    └── main.tsx                        # DOM mount entry
```

---

## ✨ Key Features for Meeting Demo

1. **Authentication Flow**:
   - Phone number input with country flag selector.
   - 6-box auto-advancing OTP verification (with `123456` one-click autofill).
   - Profile setup with customizable avatar, name, and status presets.

2. **50+ Rich Conversations**:
   - 52 realistic individual contacts and team groups.
   - Pinned chats, Muted chats, and an Archived chats folder.
   - Filter pills: **All**, **Unread**, **Favorites**, **Groups**.
   - Instant search across contact names, phone numbers, bios, and message text.

3. **Message Types & Real File Sending**:
   - **Text** (with link detection and `*bold*`, `_italic_` formatting).
   - **Real Photos & Videos** with preview modal, caption input, and clipboard paste (`Ctrl+V`).
   - **Real Documents** (PDF, DOCX, XLSX, TXT) with filename, file size, and download.
   - **Real Audio & Voice Notes** with green waveform scrubbing and speed controls (`1x / 1.5x / 2x`).
   - **Locations** (Google Maps preview card) and **Shared Contacts**.

4. **Message & Chat Actions**:
   - Emoji reactions bar (`👍 ❤️ 😂 😮 😢 🙏 + Custom`).
   - Quoted replies (click to scroll to original message).
   - Star messages, forward to multiple contacts, and delete (*for me* vs *for everyone*).
   - Pin, Mute, Archive, Clear Chat, Block Contact.

5. **Simulated Voice & Video Calls**:
   - Full-screen audio call overlay with pulsating sound waves.
   - Full-screen video call with picture-in-picture local camera window.

6. **Responsive Layout**:
   - **Desktop/Tablet**: Split pane (Nav Rail + Chat List + Conversation + Sliding Contact Drawer).
   - **Mobile**: Seamless single-page transitions (**Chat List → Fullscreen Chat → Back**).

---

## ⚡ Quick Start / Run Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm run dev

# 3. Build for production
pnpm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
