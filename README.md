# 💬 WhatsApp Clone — Tearline Design System Edition

A responsive, feature-complete WhatsApp Web and Mobile chat interface crafted using the **Tearline Design System** with **React 19**, **Vite 8**, **TypeScript 7**, and **Tailwind CSS v4**.

---

## 📌 Summary: What, Why & How

| Question | Explanation |
| :--- | :--- |
| **What is it?** | A frontend clone of WhatsApp Web and Mobile faithfully adopting the **Tearline Design System** (`design/tearline/index.html`): Space Grotesk headings, IBM Plex Mono timestamps & tags, Inter body typography, Cobalt & Paper color palettes, ticket tags, perforated dividers, and a global `⌘K` command palette. |
| **Why?** | To demonstrate a production-grade frontend messaging architecture matching the exact aesthetic, tokens, and micro-interactions of the Tearline component library with the latest modern dependencies. |
| **How does it work?** | Built using React Contexts (`AuthContext`, `ChatContext`, `CallContext`, `ThemeContext`) for real-time reactivity and local persistence, styled with Tailwind CSS v4 `@tailwindcss/vite`, and bundled with Vite 8. |

---

## 🛠️ Upgraded Modern Tech Stack

- **Framework**: **React 19.2.8** + **TypeScript 7.0.2**
- **Build Engine**: **Vite 8.2.1** with native lightning-fast compilation (`707ms` production builds)
- **Styling Engine**: **Tailwind CSS 4.3.3** (`@tailwindcss/vite` + `@tailwindcss/postcss`)
- **Icons**: Lucide React + WhatsApp SVG icons
- **Audio Engine**: Web Audio API (real-time message sounds & voice note waveforms)
- **Package Manager**: `pnpm` exclusively

---

## 🎨 Tearline Design Tokens & Foundations

- **Typography**:
  - `Space Grotesk` (`font-display`): Specimen titles, contact names, modal headers, brand tile.
  - `Inter` (`font-sans`): Clean body text, messages, composer inputs, list items.
  - `IBM Plex Mono` (`font-mono`): Monospace timestamps, ticket tags, SKU badges, OTP digits.
- **Color Palettes**:
  - Light: `paper` (`#F6F5F1`), `surface` (`#FFFFFF`), `ink` (`#1B1D22`), `slate` (`#666B75`), `line` (`#E4E2DC`)
  - Dark: `inkdark` (`#14161A`), `surfacedark` (`#1D2027`), `linedark` (`#2C2F37`), `slatedark` (`#9A9EA8`), `paperdark` (`#F1F0EC`)
  - Accents: `cobalt` (`#2A4CDB`), `amber` (`#E8A33D`), `mint` (`#1F9D66`), `rose` (`#D64545`)
- **Tearline Primitives**:
  - `.ticket-tag`: Dashed ticket tags with icons and mono text.
  - `.mini-tag`: Compact uppercase metadata labels.
  - `.perf` & `.perf-notch`: Perforated dividers with circular punch notches.
  - `.kbd`: Sleek keyboard shortcut badges (`⌘K`).
  - `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-icon`.
  - `.field`: Unified input container with Cobalt focus glow.
  - `CommandPaletteModal`: Global `⌘K` / `Ctrl+K` command & search overlay.

---

## 📁 Project Architecture & Tree View

```text
whatsapp-clone/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
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
    │   ├── auth/                       # PhoneLogin, OtpVerification (3-dash-3), ProfileSetup
    │   ├── chat/                       # ChatList, ChatListItem, ChatHeader, ChatComposer, EmptyChatState
    │   ├── messages/                   # MessageBubble, Text, Images, Videos, Voice, Docs, Locations, DateSeparator
    │   ├── media/                      # AttachmentMenu, MediaViewer (Lightbox), VideoPlayer, Camera, LocationPicker
    │   ├── profile/                    # ContactInfoDrawer, SharedMediaTab, StarredMessages, SettingsModal
    │   ├── call/                       # VoiceCallModal, VideoCallModal
    │   ├── layout/                     # NavigationRail, Sidebar, ResponsiveContainer
    │   └── common/                     # CommandPaletteModal (⌘K), Avatar, Modal, Dropdown, EmojiPicker, Toast (Sonner)
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
    │   └── soundEffects.ts             # Web Audio API sound synthesis
    │
    ├── types/                          # TypeScript Interfaces
    │   └── index.ts                    # User, Contact, Message, Attachment, Call types
    │
    ├── index.css                       # Tearline custom scrollbars, tags, buttons & CSS layers
    ├── vite-env.d.ts                   # Vite client declarations
    └── main.tsx                        # DOM mount entry
```

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
Press **`⌘K`** or **`Ctrl+K`** to open the Tearline Command Palette.
