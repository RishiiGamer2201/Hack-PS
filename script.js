const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Replace with your actual Gemini API Key
const API_KEY = "AIzaSyBMYkpo53lXK0VH4oHalfJvVylE7CoA3qw"; 
let hackathonIdeas = [];

// 1. LOAD CSV ON STARTUP
fs.createReadStream('open_innovation_hackathon_ideas_5000_unique.csv')
    .pipe(csv())
    .on('data', (data) => hackathonIdeas.push(data))
    .on('end', () => console.log(`[Neural Engine] 5,000 Ideas Loaded.`));

// 2. TRUE RANDOM SHUFFLE (Fisher-Yates)
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// 3. PREDICTION ENDPOINT
app.post('/api/predict', (req, res) => {
    const { members, domain } = req.body;
    
    // Filter by Domain (Category)
    let filteredList = hackathonIdeas;
    if (domain && domain !== "General Innovation") {
        const target = domain.toLowerCase().split(' ')[0]; // matches "healthcare", "fintech", etc.
        filteredList = hackathonIdeas.filter(item => 
            (item.category || item.domain || "").toLowerCase().includes(target)
        );
    }

    // Keyword Scoring (to keep it relevant to skills)
    const searchTerms = members.flatMap(m => [
        ...(m.branch ? m.branch.toLowerCase().split(' ') : []),
        ...(m.skills ? m.skills.toLowerCase().split(/, | /) : [])
    ]).filter(term => term.length > 2);

    let scoredIdeas = filteredList.map(item => {
        let score = 0;
        const text = (item.idea + " " + item.core_idea).toLowerCase();
        searchTerms.forEach(term => { if (text.includes(term)) score += 5; });
        return { ...item, score };
    });

    // Take top 50 relevant items
    scoredIdeas.sort((a, b) => b.score - a.score);
    let topRelevantPool = scoredIdeas.slice(0, 50);

    // RANDOMIZE the top pool so they aren't in a sequence
    const finalRandomSelection = shuffle([...topRelevantPool]);

    res.json({
        top5: finalRandomSelection.slice(0, 5).map(r => r.core_idea || r.idea),
        extended: finalRandomSelection.slice(5, 15).map(r => r.core_idea || r.idea)
    });
});

// 4. DESCRIPTION ENDPOINT (Fixes the "undefined" error)
app.post('/api/describe', async (req, res) => {
    const { title } = req.body;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Find local CSV context to feed to the LLM
    const localData = hackathonIdeas.find(i => (i.core_idea || i.idea) === title);
    const context = localData ? localData.idea : "a high-impact hackathon project";

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `Context: ${context}. Project Name: ${title}. Act as a hackathon mentor. Write a professional 3-sentence technical description. Explain the problem, the tech solution, and the social impact. Do not use bold markers.` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        // DEEP VALIDATION of the Gemini Response
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0].text) {
            
            const description = data.candidates[0].content.parts[0].text;
            res.json({ description }); // Success
        } else {
            // Fallback if AI is blocked or empty
            console.warn("AI Response incomplete, using CSV fallback.");
            res.json({ description: `This project focuses on ${title}, specifically designed to address ${context}. It aims to streamline traditional workflows using modern architecture.` });
        }

    } catch (err) {
        console.error("Critical API Error:", err);
        res.status(500).json({ description: "The neural link is unstable. Using manual backup: " + context });
    }
});

app.listen(PORT, () => console.log(`Neural Backend running on http://localhost:${PORT}`));
