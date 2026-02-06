# 🍳 Recipe Collector

A small web app for collecting and managing recipes. Built to showcase modern frontend fundamentals with Vue, IndexedDB, and Tailwind CSS.

This project was designed as a lightweight but realistic portfolio piece, focusing on clean component architecture, local persistence, and user experience.

# ✨ Features

* 📦 Storage using IndexedDB (no backend required)
* 📝 Create, edit, and delete recipes
* 🔍 Real-time search by title or ingredients
* 🗂 Categorization and ratings
* 🪟 Modal-based recipe form with click-outside close
* 📱 Responsive layout with Tailwind CSS

# 🛠 Tech Stack

* Vue
* IndexedDB (via idb)
* Tailwind CSS
* Vite

# 💡 Why IndexedDB?

IndexedDB was chosen over localStorage to:
* Handle structured data cleanly
* Avoid size and performance limitations
* Demonstrate knowledge of browser-native persistence APIs

# 🔮 How I Would Improve This Project
* Image uploads for recipes
* Import/export recipes
* PWA support

# 🧠 What I Learned

* **Practical IndexedDB usage beyond localStorage**
Working with IndexedDB highlighted the importance of async data flow, schema planning, and refreshing UI state after mutations.

* **Designing components around intent**
Emitting events instead of mutating shared state, keeping data flow predictable and reducing coupling.

* **Building accessible modal UX patterns**
Implementing click-outside-to-close and transitions reinforced how small UX details significantly improve perceived quality.
