# 🐻 Ultimate Night @ Kattaikonam

A FNAF-inspired web survival horror game built with **React**, **Vite**, **Tailwind CSS**, and the **HTML5 Web Audio API**.

---

## 🎮 Gameplay Features
- **Customizable Survival Shift**: Choose 6 to 13 facility rooms, 3 to 5 enemies with custom AI difficulty (0–20), and 1 upload task per shift.
- **Architectural Asymmetrical CCTV**: Realistically proportioned building floor plan with dynamic room nodes, physical corridor pathways, and an expandable Vent surveillance system.
- **Vent Surveillance & Defense**: Switch to Vent Cams (`VENT 1` through `VENT 5`) to track Ritul crawling through the ductwork before he breaches the office.
- **Mahadev's Music Box**: Wind up Mahadev's counter on the security cams before it expires to prevent a fatal jumpscare.
- **Sjinil Hacker System**: Keep the facility's Internet connection online; if Internet drops for too long, Sjinil breaches and compromises the systems.
- **Ryan's File System**: Manage local files from the desk terminal. Beware of suspicious `.exe` downloads (`free-gta6.exe`, `question-paper.exe`) — delete them before 3:00 AM or face fatal computer corruption!
- **FNAF 3-Inspired Maintenance Subsystem**: Maintain Internet, Cameras, Sounds, and Vents from the desk terminal. Reboot subsystems before animatronics exploit system failures.
- **Custom Upload Operations**:
  - **Ligin**: Classic OMR answer sheet transmission.
  - **Sreekala**: High-throughput student assignment batching.
  - **Vijitha**: Accelerated high-speed upload requiring Class 11 PCM questions.
  - **Danny**: Energetic terminal protocol requiring all-caps communication and vibrant responses.
- **Office Panoramic View & Defenses**:
  - Blast Door toggle (`[D]`)
  - Hallway Light toggle (`[L]`)
  - Security Mask (`[M]` or click desk mask)
  - Teacher Scare Audio (`[A]`) with 10s cooldown
  - Auxiliary Power Generator (Emergency +10–15% at 0% battery)
- **Independent Scoped Storage**: Full `unak:` local storage scoping, completely isolated from upstream repositories on GitHub Pages.
- **PWA & Mobile Support**: Full touchscreen dragging, orientation handling, and installable PWA with offline caching.

---

## 🕹️ Controls
- **Mouse / Touch Drag**: Pan security office left/right
- **[SPACE]**: Flip CCTV camera tablet up / down
- **[D]**: Toggle Blast Door
- **[L]**: Toggle Hallway Light
- **[M]**: Toggle Security Mask (Helmet)
- **[A]**: Play Scare Audio (10s cooldown countdown)
- **[ESC] / [P]**: Pause Shift
- **CAM 1 – 13 / Vents**: Switch active camera feed on the facility map

---

## 🛠️ Development & Deployment
```bash
# Install dependencies
npm install

# Start local dev server (automatically synchronizes photos)
npm run dev

# Build production bundle
npm run build

# Deploy to GitHub Pages
npm run deploy
```
