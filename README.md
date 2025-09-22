# Wordle Web Application

## Overview

This project is a **web version of the popular Wordle game**, built with **HTML, CSS, and JavaScript**.
Players must guess a target word within a limited number of attempts, with visual feedback indicating letter correctness.

---

## Features

* Interactive game grid with color-coded feedback:

  * 🟩 Green: correct letter in the correct position
  * 🟨 Yellow: correct letter in the wrong position
  * ⬜ Gray: incorrect letter
* Input via **physical keyboard** or **on-screen buttons**
* Visual feedback for each guess
* Responsive design for desktop and mobile
* Easily customizable **CSS variables** for colors and styles

---

## Technical Details

* **Languages**: HTML5, CSS3, JavaScript (ES6+)
* **Structure**:

  * `wordle.html`: main game page
  * `style/`: CSS files including variables
  * `js/`: JavaScript scripts for game logic and event handling
* **Linting**: ESLint configured for clean code
* **Event Handling**: keyboard input and button clicks

---

## Project Setup

### Requirements

* Modern web browser (Chrome, Firefox, Edge, Safari)
* No server required, runs locally from HTML file

### Running the Game

1. Clone the repository:

```bash
git clone <REPO_URL>
```

2. Open `wordle.html` in your browser

### Project Structure

```
/wordle-project
│
├─ wordle.html      # Main game page
├─ style/           # CSS files and variables
├─ js/              # JavaScript scripts
├─ .eslintrc.json   # ESLint configuration
├─ package.json     # Dependencies and scripts
└─ .gitignore       # Files to ignore in Git
```

---

## 📅 Changelog

* **Last update**: improved buttons and adapted CSS variables for easier styling
* Previous versions included ESLint initial setup and project configuration



🎮 *Have fun guessing the word and improving your language skills!* 🎉
