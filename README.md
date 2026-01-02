<div align="center">

# 🛒 Skipline Go

### **Smart Mall Checkout System** — Skip the Line, Just Go!

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

**🏆 TechSprint 2026 Competition Entry — MyTech Team**

[Live Demo](#-live-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

<br/>

<img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status"/>
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>

</div>

---

## 📖 About The Project

**Skipline Go** is a revolutionary smart checkout system that eliminates long queues at malls and retail stores. Customers can scan products with their phone, pay in-app, and simply walk out with a verified QR code — no cashier needed!

### 🎯 Problem Statement
> Long checkout queues waste customer time and require expensive staffing for retailers.

### 💡 Our Solution
A mobile-first checkout system with:
- **Self-scanning** via phone camera
- **In-app payment** (UPI, Cards, Wallets)
- **Exit verification** with encrypted QR codes
- **AI-powered** theft prevention

---

## ✨ Features

### 📱 Customer Experience
| Feature | Description |
|---------|-------------|
| 🔍 **Smart Scanning** | Real-time barcode scanning using device camera (60 FPS) |
| 🛒 **Live Cart** | Instant cart updates with quantity controls |
| 💳 **Multi-Payment** | UPI, Google Pay, Credit/Debit Cards, Wallets |
| 🤖 **AI Assistant** | "Sahayak" chatbot for product queries & help |
| 🎫 **Exit QR Code** | JWT-encrypted QR for secure exit verification |
| 📥 **Invoice Download** | PDF invoice generation after payment |

### 👨‍💼 Staff Dashboard
| Feature | Description |
|---------|-------------|
| ✅ **QR Verification** | Instant transaction validation at exit |
| 📊 **Analytics** | Real-time sales and traffic dashboard |
| 🚨 **Theft Scoring** | AI-based risk assessment per transaction |
| 📈 **Reports** | Daily/weekly transaction summaries |

### 🔧 Technical Highlights
- ⚡ **Offline-First** — Works without internet, syncs when connected
- 🔐 **Secure** — JWT tokens, Firebase Auth, encrypted data
- 📱 **PWA Ready** — Installable on mobile devices
- 🎨 **Modern UI** — Glass morphism, smooth animations
- 🌐 **Cross-Platform** — Works on any device with a browser

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** ([Download](https://git-scm.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/skipline-go.git

# 2. Navigate to project directory
cd skipline-go

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The app will open at `http://localhost:3000` 🎉

### Environment Setup (Optional)

For full functionality with Firebase:

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
```

See [Firebase Setup Guide](docs/FIREBASE_SETUP.md) for detailed instructions.

---

## 🏗️ Project Structure

```
skipline-go/
│
├── 📁 components/              # Reusable UI components
│   ├── AIChatbot.tsx          # Sahayak AI assistant
│   ├── AnimatedLogo.tsx       # Animated brand logo
│   ├── CameraScanner.tsx      # Barcode/QR scanner (60 FPS)
│   ├── ExitQRCode.tsx         # JWT QR code generator
│   └── GlassCard.tsx          # Glass morphism card
│
├── 📁 views/                   # Main application views
│   ├── CustomerView.tsx       # Shopping experience
│   └── StaffView.tsx          # Exit verification & dashboard
│
├── 📁 services/                # Business logic & APIs
│   ├── firebaseService.ts     # Firebase CRUD operations
│   ├── geminiService.ts       # Google Gemini AI integration
│   └── transactionStore.ts    # Local transaction management
│
├── 📁 config/                  # Configuration files
│   └── firebase.ts            # Firebase initialization
│
├── App.tsx                    # Main app with routing
├── constants.ts               # Mock data & constants
├── types.ts                   # TypeScript interfaces
├── index.tsx                  # Application entry point
├── index.css                  # Global styles (Tailwind)
└── vite.config.ts             # Vite configuration
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="150">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br/><b>React 19</b>
<br/><sub>UI Framework</sub>
</td>
<td align="center" width="150">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br/><b>TypeScript</b>
<br/><sub>Type Safety</sub>
</td>
<td align="center" width="150">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br/><b>Tailwind CSS</b>
<br/><sub>Styling</sub>
</td>
<td align="center" width="150">
<img src="https://skillicons.dev/icons?i=firebase" width="48" height="48" alt="Firebase" />
<br/><b>Firebase</b>
<br/><sub>Backend</sub>
</td>
<td align="center" width="150">
<img src="https://skillicons.dev/icons?i=vite" width="48" height="48" alt="Vite" />
<br/><b>Vite</b>
<br/><sub>Build Tool</sub>
</td>
</tr>
</table>

### Additional Technologies
- **Google Gemini AI** — Intelligent chatbot & theft analysis
- **BarcodeDetector API** — Native browser barcode scanning
- **jose** — JWT token generation for secure QR codes
- **html2canvas + jsPDF** — Invoice PDF generation

---

## 📱 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        SKIPLINE GO FLOW                         │
└─────────────────────────────────────────────────────────────────┘

  👤 CUSTOMER                                          👨‍💼 STAFF
      │                                                    │
      ▼                                                    │
  ┌───────────┐                                           │
  │  Sign In  │  (Guest / Google)                         │
  └─────┬─────┘                                           │
        │                                                  │
        ▼                                                  │
  ┌───────────┐                                           │
  │   Scan    │  📷 Point camera at barcodes              │
  │ Products  │                                           │
  └─────┬─────┘                                           │
        │                                                  │
        ▼                                                  │
  ┌───────────┐                                           │
  │  Review   │  🛒 View cart, adjust quantities          │
  │   Cart    │                                           │
  └─────┬─────┘                                           │
        │                                                  │
        ▼                                                  │
  ┌───────────┐                                           │
  │   Pay     │  💳 UPI / Card / Wallet                   │
  │  In-App   │                                           │
  └─────┬─────┘                                           │
        │                                                  │
        ▼                                                  │
  ┌───────────┐         ┌─────────────┐         ┌───────────┐
  │  Get Exit │ ──────▶ │   QR Code   │ ──────▶ │  Verify   │
  │  QR Code  │         │  (JWT Token)│         │  at Exit  │
  └───────────┘         └─────────────┘         └─────┬─────┘
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │  ✅ Pass  │
                                                │  or 🚨    │
                                                └───────────┘
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | Firebase Auth (Google + Anonymous) |
| **Exit Tokens** | JWT with HMAC-SHA256 signature |
| **Token Expiry** | 30-minute validity window |
| **Data Encryption** | Firestore security rules |
| **Theft Detection** | AI-based behavior analysis |

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/skipline-go)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

### **MyTech Team**

*TechSprint 2026 Competition*

</div>

---

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) — Backend infrastructure
- [Google Gemini](https://ai.google.dev/) — AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) — Styling framework
- [Lucide Icons](https://lucide.dev/) — Beautiful icons
- [Vite](https://vitejs.dev/) — Lightning fast build tool

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by **MyTech Team**

</div>
