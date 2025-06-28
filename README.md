
# 🧬 DNA\_SEQUENCE Web App

A powerful, fast, and user-friendly **DNA sequence analysis tool** built with **Vite + TypeScript + Tailwind CSS**. This app allows users to perform pattern matching, sequence alignment, and mutation detection on DNA strings using algorithms like **Regex matching** and **Needleman-Wunsch**.

---

## 🚀 Features

* 🔍 **DNA Substring Matching** using Regex
* 🧪 **Global Sequence Alignment** using Needleman-Wunsch
* 🧬 Multiple DNA input options (manual entry or file upload)
* 🧠 Mutation classification (substitution, insertion, deletion)
* ⚡️ Fast performance with modern web stack
* 🎨 Clean and responsive UI using Tailwind CSS

---

## 🛠️ Tech Stack

* **Frontend**: TypeScript + Vite
* **Styling**: Tailwind CSS
* **Logic**: Custom implementation of Regex filters & Needleman-Wunsch algorithm
* **Deployment**: (Optional) Vercel / Netlify ready

---

## 📂 Folder Structure

```
DNA_SEQUENCE/
├── public/               # Static files
├── src/                  # Source code (components, logic)
│   ├── algorithms/       # Needleman-Wunsch, Regex utils
│   ├── components/       # UI components
│   └── App.tsx, main.ts  # Entry points
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
```

---

## 🧪 Getting Started

```bash
git clone https://github.com/anish41338/DNA_SEQUENCE.git
cd DNA_SEQUENCE
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧠 Algorithms Used

* **Regex Matching**
  Match all substrings in DNA sequence that follow patterns (e.g., ATG\[ATCG]{3}TAA)

* **Needleman-Wunsch**
  Dynamic programming-based **global alignment** for two sequences
  Used for mutation classification and scoring matches

---

## 👨‍💻 Author

Made with 💻 by [Anish Sihag](mailto:anishsihag12@gmail.com)
GitHub: [@anish41338](https://github.com/anish41338)

---


