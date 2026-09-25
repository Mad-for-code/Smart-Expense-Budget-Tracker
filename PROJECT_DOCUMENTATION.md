# Smart Expense & Budget Tracker - Complete Project Documentation 📖

A full-stack, cross-platform mobile & web application built with **React Native**, **Expo SDK 51**, **JavaScript**, **AsyncStorage**, and **React Navigation v6**.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Tech Stack & Dependencies](#-tech-stack--dependencies)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Step-by-Step Installation Guide](#-step-by-step-installation-guide)
5. [How to Run the Application](#-how-to-run-the-application)
   - [Running on Web Browser](#1-running-on-web-browser)
   - [Running on Apple iPhone (iOS)](#2-running-on-apple-iphone-ios)
   - [Running on Android Phone](#3-running-on-android-phone)
   - [Building Standalone APK / IPA Files](#4-building-standalone-apk--ipa-files)
6. [Detailed Project Directory Structure](#-detailed-project-directory-structure)
7. [Component & Screen Breakdown](#-component--screen-breakdown)
8. [Data Models & AsyncStorage Schema](#-data-models--asyncstorage-schema)
9. [Feature Deep Dive](#-feature-deep-dive)
10. [Troubleshooting & Common Issues](#-troubleshooting--common-issues)

---

## 🎯 Project Overview

The **Smart Expense & Budget Tracker** is designed for personal financial management. It allows users to:
- Log daily expenses and incomes with detailed metadata (title, amount, category, date, payment method, notes).
- Set overall monthly spending targets and category-specific budget limits with real-time visual progress bars and danger/warning alerts.
- Analyze spending habits using interactive **SVG Donut Charts** (category breakdown) and **7-Day Spending Bar Graphs**.
- Search and filter transaction history by keyword, type (Expense/Income), or category.
- Customize preferences including **Dark Mode vs Light Mode**, currency units (`$`, `€`, `£`, `₹`, `C$`, `A$`, `¥`), and raw **CSV export**.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Expo SDK 51 / React Native 0.74 | Cross-platform core framework for iOS, Android, and Web |
| **Language** | JavaScript (ES6+) | Application logic and state management |
| **Navigation** | `@react-navigation/native` & `@react-navigation/bottom-tabs` & `@react-navigation/stack` | Screen transitions, tab navigation, modal presentation |
| **Local Storage** | `@react-native-async-storage/async-storage` | Offline-first JSON data persistence |
| **Graphics & Charts** | `react-native-svg` | Render responsive SVG donut charts and trend bar graphs |
| **Icons** | `@expo/vector-icons` (Ionicons) | Modern visual icon system |
| **Layout & UI** | `react-native-safe-area-context` | Dynamic safe area insets management for modern notched displays |
| **Web Runtime** | `react-native-web` & `react-dom` | Web compilation engine enabling browser deployment |

---

## 🏗️ System Architecture & Data Flow

```
+-----------------------------------------------------------------------+
|                              App.js                                   |
|   (SafeAreaProvider + StatusBar + AppProvider + ToastNotification)    |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                           AppContext.js                               |
| (Central State Management: Transactions, Budgets, Theme, Currency)    |
+-----------------------------------------------------------------------+
                                  |
              +-------------------+-------------------+
              |                                       |
              v                                       v
+---------------------------+           +---------------------------+
|    StorageService.js      |           |     AppNavigator.js       |
| (AsyncStorage Persistence)|           | (Bottom Tabs & Modals)    |
+---------------------------+           +---------------------------+
                                                      |
    +-----------------+-----------------+-------------+-------------+
    |                 |                 |             |             |
    v                 v                 v             v             v
[HomeScreen] [AnalyticsScreen] [AddExpense] [BudgetScreen] [Settings]
```

---

## 📥 Step-by-Step Installation Guide

### Prerequisites
Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher): [Download Node.js](https://nodejs.org/)
- **NPM** (v9.0.0 or higher) or **Yarn** / **PNPM**
- (Optional) **Git** for version control
- (Optional for Mobile) **Expo Go App** on your iOS (App Store) or Android (Play Store) device

### Installation Commands

1. **Open your terminal or command prompt** and navigate to your workspace folder:
   ```bash
   cd "c:\Users\admin\Desktop\Smart Expense & Budget Tracker"
   ```

2. **Install all project dependencies**:
   ```bash
   npm install
   ```
   *Note: On Windows systems running PowerShell where script execution policy is restricted, use `cmd /c npm install`.*

---

## 🚀 How to Run the Application

### 1. Running on Web Browser

To export and launch the static web build on local port 8081:
```bash
npm run build:web
npx serve dist -p 8081
```
Open your web browser and visit: **`http://localhost:8081`**

Alternatively, to start the Expo live dev server with web support:
```bash
npx expo start --web
```

---

### 2. Running on Apple iPhone (iOS)

#### Method A: Instant Web PWA (No Installation Required)
1. Ensure your iPhone and computer are on the same Wi-Fi network.
2. Find your computer's local IP address (e.g. `192.168.1.5`).
3. Open **Safari** on your iPhone and visit:
   ```
   http://192.168.1.5:8081
   ```
4. Tap the **Share icon** at the bottom of Safari and select **"Add to Home Screen"**.
5. The application is now installed on your iPhone home screen!

#### Method B: Expo Go App on iPhone
1. Download **Expo Go** from the Apple App Store.
2. In your terminal on the computer, run:
   ```bash
   npx expo start
   ```
3. Scan the QR code displayed in the terminal using your iPhone Camera app to launch it inside Expo Go.

---

### 3. Running on Android Phone

#### Method A: Expo Go App
1. Download **Expo Go** from Google Play Store.
2. Run `npx expo start` in your terminal.
3. Open Expo Go on your Android phone and scan the QR code.

#### Method B: Android Emulator
1. Launch Android Studio and open your Virtual Device (AVD).
2. Run `npx expo start`.
3. Press **`a`** in the terminal to automatically open the app on the emulator.

---

### 4. Building Standalone APK / IPA Files

This project includes a pre-configured [`eas.json`](file:///c:/Users/admin/Desktop/Smart%20Expense%20&%20Budget%20Tracker/eas.json) file for Expo Application Services (EAS).

#### Building an Android `.apk` File:
```bash
# Log in to your Expo account (free)
npx eas-cli login

# Start preview APK build
npx eas-cli build -p android --profile preview
```
Once the build completes in the cloud, Expo provides a direct download link for your `.apk` installer file.

---

## 📁 Detailed Project Directory Structure

```
Smart Expense & Budget Tracker/
├── App.js                      # Main App wrapper & Context injection
├── index.js                    # Cross-platform entry point with web shims
├── app.json                    # Expo project configuration
├── eas.json                    # Expo Application Services build config
├── package.json                # npm manifest & project dependencies
├── babel.config.js             # Babel JS transpiler configuration
├── src/
│   ├── components/
│   │   ├── Header.js           # Header with title & theme toggle button
│   │   ├── SummaryCard.js      # Balance, income, expense, & progress card
│   │   ├── TransactionItem.js  # Transaction item list row component
│   │   ├── CategoryPieChart.js # Responsive SVG Donut Chart component
│   │   ├── SpendingBarChart.js # Responsive 7-Day Spending SVG Bar Graph
│   │   └── ToastNotification.js# Popdown feedback toast notification bar
│   ├── constants/
│   │   ├── categories.js       # Category definitions, icons, colors, presets
│   │   └── theme.js            # Dark & Light color design tokens & currencies
│   ├── context/
│   │   └── AppContext.js       # App State, calculations, & operations Provider
│   ├── navigation/
│   │   └── AppNavigator.js     # Bottom Tabs & Stack Modal navigator
│   ├── screens/
│   │   ├── HomeScreen.js       # Dashboard overview, search bar, & activity list
│   │   ├── AddExpenseScreen.js # Managed form with useState hooks
│   │   ├── AnalyticsScreen.js  # Graphs, donut breakdown, & spending stats
│   │   ├── BudgetScreen.js     # Monthly overall & category budget management
│   │   └── SettingsScreen.js   # Theme toggle, currency switcher, CSV export
│   └── services/
│       └── storage.js          # AsyncStorage read/write/seed helper service
```

---

## 🧩 Component & Screen Breakdown

| File Name | Role & Responsibility | Key React Hooks Used |
| :--- | :--- | :--- |
| **`AppContext.js`** | Manages global transactions list, budget allocations, theme state, currency symbol, and computed balances. | `createContext`, `useContext`, `useState`, `useEffect` |
| **`HomeScreen.js`** | Displays balance cards, live search bar, category pills, type filter tabs (Expense/Income), and recent activity list. | `useState`, `useApp` |
| **`AddExpenseScreen.js`** | Form screen to log or edit transactions. Features quick presets, category grids, payment selectors, and input validation. | `useState`, `useEffect`, `useApp` |
| **`AnalyticsScreen.js`** | Displays 7-day spending trends bar graph, category donut chart, daily average expense, top spending category, and savings rate. | `useState`, `useApp` |
| **`BudgetScreen.js`** | Allows users to edit overall monthly limits and individual category limits. Shows warnings when budget > 80% or > 100%. | `useState`, `useApp` |
| **`SettingsScreen.js`** | Handles theme switching (Dark/Light), currency selection modal, CSV raw report export modal, and demo data reset. | `useState`, `useApp` |
| **`StorageService.js`** | Encapsulates all `@react-native-async-storage/async-storage` reads, writes, initial seeding, and deletions. | Async/Await functions |

---

## 🗄️ Data Models & AsyncStorage Schema

Data is stored locally under five specific keys:

### 1. Transactions Array (`@smart_tracker_transactions_v2`)
```json
[
  {
    "id": "tx_1727289000_a1b2c",
    "title": "Whole Foods Grocery",
    "amount": 124.50,
    "type": "expense",
    "categoryId": "shopping",
    "paymentMethod": "credit",
    "date": "2026-09-24T18:30:00.000Z",
    "notes": "Weekly groceries and organic produce"
  }
]
```

### 2. Budgets Object (`@smart_tracker_budgets_v2`)
```json
{
  "monthlyOverall": 2500,
  "categories": {
    "food": 400,
    "transport": 250,
    "housing": 1500,
    "utilities": 200,
    "shopping": 350,
    "entertainment": 150,
    "health": 100
  }
}
```

### 3. Currency Symbol (`@smart_tracker_currency_v2`)
`"$"` / `"€"` / `"£"` / `"₹"` / `"C$"` / `"A$"` / `"¥"`

### 4. Theme Preference (`@smart_tracker_theme_v2`)
`"dark"` or `"light"`

---

## ❓ Troubleshooting & Common Issues

### Issue 1: `File script cannot be loaded because running scripts is disabled on this system` (PowerShell)
**Fix**: Run commands prefixed with `cmd /c`, for example:
```bash
cmd /c npm install
cmd /c npx expo start
```

### Issue 2: Web export throws `registerWebModule is not a function`
**Fix**: `index.js` contains a polyfill shim for `registerWebModule` that handles constructor function instantiation cleanly on React Native Web.

### Issue 3: Can't install `.apk` on iPhone
**Fix**: iOS cannot run Android `.apk` installer packages. Use **Option 1 (Safari Add to Home Screen PWA)** or **Option 2 (Expo Go App)** on iPhone.

---

*Smart Expense & Budget Tracker Documentation - Built with React Native & Expo*
