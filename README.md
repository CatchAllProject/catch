# CatchAll_Project

A web-based parser for `.sav` files from Pokémon Red/Blue, capable of decoding and displaying player progress directly in the browser.

---

## 🚀 Overview

CatchAll_Project reads raw save files and interprets their binary structure using JavaScript, extracting meaningful gameplay data such as player info, progress, and statistics.

This project focuses on low-level data parsing and reverse engineering concepts applied in a web environment.

---

## ✨ Features

- Upload and read `.sav` files directly in the browser
- Decode Trainer and Rival names
- Display Gym Badges (bit flags) (only in console for now)
- Calculate Pokédex progress (seen / caught) (in progress)
- Decode play time (multi-byte values)
- Decode money using BCD format

---

## 🧠 How It Works

The application reads the save file as raw binary data using `Uint8Array`, then parses specific offsets based on the known memory structure of the game.

Core techniques used:

- Offset-based memory reading
- Bitwise operations (flags like badges and Pokédex(in future))
- BCD decoding (currency)
- Little-endian interpretation (multi-byte values)
- Custom binary reader abstraction

---

## 📊 Example Output
Trainer: RED
Rival: BLUE
Badges: 5/8
Play Time: 123:45:12
Money: ₽123456


---

## 🛠 Tech Stack

- JavaScript (Vanilla)
- HTML / CSS
- Binary parsing with `Uint8Array`

---

## ⚠️ Disclaimer

This project does not distribute any game files or assets.

All data is read from user-provided save files.  
Pokémon is a property of Nintendo, Game Freak, and The Pokémon Company.

---

## 👤 Author

- GitHub: https://github.com/IsaacLanzoni

---

## 📖 Data Used For Developing

- https://bulbapedia.bulbagarden.net/wiki/Save_data_structure_(Generation_I)#bank1_main_playtm