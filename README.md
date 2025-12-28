# ISO 15939 Software Quality Measurement Platform

This project is a web-based simulation tool designed to implement the **ISO/IEC 15939** measurement process and **ISO/IEC 25010** quality models. It allows users to define, plan, collect, and analyze software quality metrics in a structured environment.

## 🚀 Features

* **ISO 15939 Process Flow:** Implements the standard *Define -> Plan -> Collect -> Analyze* cycle.
* **ISO 25010 Integration:** Includes all 8 quality characteristics (Functional Suitability, Performance, Security, etc.) and sub-characteristics based on the standard model.
* **Dynamic Simulation:** Users can create custom evaluation scenarios or use predefined templates (E-commerce, Banking, Student Portal).
* **ISO 25023 Metrics:** Utilizes standard metrics for measurement and calculation.
* **Visual Analysis:** Integrated **Chart.js** for Radar and Bar chart visualizations of quality scores.
* **Smart Recommendations:** Provides automated improvement suggestions based on gap analysis.
* **Dark Mode Support:** Fully responsive interface with theme toggling and local storage preference saving.

## 🛠️ Tech Stack

* **Core:** HTML5, CSS3 (CSS Variables, Flexbox/Grid), Vanilla JavaScript (ES6+).
* **Architecture:** Client-Side Simulation (SPA methodology) - No page reloads required.
* **Visualization:** Chart.js Library.
* **Data Model:** JSON-based implementation of ISO standards without external database dependencies.

## 📂 Project Structure

The project follows a lightweight, flat structure for ease of deployment and review:

```bash
├── index.html          # Main application entry point & Layout
├── style.css           # Styling, Animations, and Dark Mode definitions
├── script.js           # Simulation logic, Calculations, and DOM manipulation
└── README.md           # Project documentation
