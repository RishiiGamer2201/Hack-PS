```markdown
# Cracking Hackathon

HackPS Engine is a web-based AI copilot that helps hackathon teams answer one question:

> “Which problem statement are we actually built to win in 24 hours?”

It analyses team skills, time constraints, and domain fit using a set of OnDemand AI agents (including
a Gemini-powered Media tool) and then surfaces strategy recommendations plus poster-ready visual briefs.


## 🚀 Live Demo

https://rishiigamer2201.github.io/Hack-PS/


## 🧩 What It Solves

Most teams lose hours debating ideas and often pick problems that are either too ambitious for the
timebox or misaligned with their actual skills. That leads to rushed architectures, half-finished demos,
and submissions that are hard for judges to understand.

HackPS Engine:

- Maps team composition and past projects into a “squad architecture”.
- Aligns that architecture with Open Innovation ideas and sponsor problem statements.
- Generates clear strategy explanations and visual briefs so teams can spend more time building and less time
 guessing.


## ✨ Core Features

- Landing experience (index.html)  
  - Neon, glassmorphism UI built with TailwindCSS and custom animations.  
  - Explains the concept of team synergy, execution probability, and dual tracks.

- Open Innovations (open.html)  
  - Text area for describing the team (members, stack, time) and open-ended idea.  
  - “🎨 Generate Problem Visual” button that calls an OnDemand Media agent with a Gemini-backed
      fulfillment prompt and returns:
    - `caption` – poster title  
    - `description` – vivid scene description  
    - `style` – art direction for the visual  
  - Output is displayed as a visual brief that can be plugged into image tools.

- Problem Statements (problem.html)  
  - Hero section explaining sponsor-constrained tracks and execution science.  
  - Interactive **Squad Architecture** grid where users add/remove members and log:
    - Name, branch, skills, past projects  
  - Second Media agent section that turns a sponsor’s problem statement into a visual brief
    (caption, description, style).

- HackPS Strategy Sidebar (index.html + script.js)  
  - Floating AI chat on the main page using OnDemand `/chat/v1/sessions/query`.  
  - Users can describe their team and constraints; the agent responds with strategy
    text on which problem they’re likely to execute well.  
  - Typing animation, “thinking” state, and smooth scroll-reveal interactions.


## 🧱 Tech Stack

- Frontend:  
  - HTML5 (index.html, open.html, problem.html)  
  - Tailwind CSS via CDN + custom `styles.css` for glow, glass, and animations  
  - Vanilla JavaScript (`script.js`) for:
    - OnDemand API calls
    - IntersectionObserver scroll reveals
    - Chat sidebar logic
    - Media agent “Generate Problem Visual” actions

- AI / Backend Services:  
  - Airev OnDemand Chat API (`/chat/v1/sessions/query`)  
  - OnDemand Media Agent using Gemini 3.0 Pro via fulfillment prompt for structured JSON visual briefs  
  - Endpoints and agent IDs configured directly in the frontend for hackathon demo purposes
    (would be proxied behind a backend in production).


## 🛠️ Local Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/hackps-engine.git
   cd hackps-engine
   ```

2. **Configure API keys & agent IDs**

   Open `index.html`, `open.html`, and `problem.html` and update:

   ```js
   const ONDEMAND_API_KEY = "YOUR_ONDEMAND_KEY_HERE";
   const BOTID / MEDIA_AGENT_ID = "YOUR_AGENT_ID_HERE";
   const ENDPOINT_ID = "predefined-gemini-3.0-pro"; // or your deployed endpoint
   ```

   > For a real deployment, move these calls into a backend; exposing keys in the frontend here is acceptable only
     for hackathon demo use.

3. **Run locally**

   Since this is a static frontend, you can use any static server:

   ```bash
   # Option 1: VS Code Live Server extension
   # Option 2: simple Python server
   python -m http.server 8000
   ```

   Then open:

   - `http://localhost:8000/index.html` – main landing + strategy sidebar  
   - `http://localhost:8000/open.html` – Open Innovations track  
   - `http://localhost:8000/problem.html` – Problem Statements & Squad Architecture  

4. **Test the flows**

   - On **index.html**, open the AI sidebar, describe your team, and click **Analyze**.  
   - On **open.html**, describe your open-ended idea and click **Generate Problem Visual** to get
     a caption/description/style brief.  
   - On **problem.html**, paste a sponsor problem statement and generate another visual brief.

---

## 🧠 Architecture Overview

- **Presentation Layer** – Three pages (`index`, `open`, `problem`) share a consistent visual language
   (neon cyberpunk, glass panels, radial gradients) implemented with Tailwind utility classes plus custom CSS.
- **Agent Layer (OnDemand)**  
  - Strategy agent: receives free-form team description and returns planning advice.  
  - Media agent: receives team/problem text and uses a strict fulfillment prompt to return structured JSON
     with `caption`, `description`, and `style`.  
- **Interaction Layer (script.js + inline scripts)**  
  - Fetch wrappers around OnDemand endpoints.  
  - JSON parsing + error handling to render friendly UI states.  
  - Scroll-triggered reveals and animations for a smooth storytelling experience.

---

## 🚧 Limitations & Future Work

- API keys are stored in the frontend for speed during the hackathon; a production version would proxy all AI calls through a
  secure backend.
- The strategy and media agents currently assume English input; adding multilingual support would make it more inclusive.
- Visual briefs are text-only; the next step is wiring them directly into a Gemini image-generation endpoint and rendering preview
  images inline.

---

## 👥 Team

Built by a first-year squad for the HackPS hackathon, combining:

- Frontend/UI design  
- Prompt & agent engineering on OnDemand  
- Integration of Google Gemini API for media-oriented outputs  

HackPS Engine is our attempt to turn hackathon chaos into a guided, winnable strategy.
```
