import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ================= DATABASE =================
const db = new Database("neurolearn.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    modules TEXT,
    difficulty TEXT,
    domain TEXT,
    duration_weeks INTEGER DEFAULT 12
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_email TEXT,
    question_id TEXT,
    prompt TEXT,
    answer TEXT,
    evaluation_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS career_assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    user_email TEXT,
    stage1_answers TEXT,
    stage1_scores TEXT,
    top_domains TEXT,
    stage2_answers TEXT,
    stage2_scores TEXT,
    primary_domain TEXT,
    secondary_domain TEXT,
    compatibility_score INTEGER,
    roadmap_json TEXT,
    recommended_courses_json TEXT,
    skill_gap_analysis TEXT,
    estimated_time_to_job_ready TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add columns for comments and course video if they don't exist (safe on repeated runs)
try {
  db.exec("ALTER TABLE assessments ADD COLUMN comments_json TEXT;");
} catch (e) {}

try {
  db.exec("ALTER TABLE courses ADD COLUMN video TEXT;");
} catch (e) {}

try {
  db.exec("ALTER TABLE courses ADD COLUMN domain TEXT;");
} catch (e) {}

try {
  db.exec("ALTER TABLE courses ADD COLUMN duration_weeks INTEGER DEFAULT 12;");
} catch (e) {}

// Seed Users
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as any;
if (userCount.count === 0) {
  const userInsert = db.prepare(
    "INSERT INTO users (username, email, password, role, level, xp) VALUES (?, ?, ?, ?, ?, ?)"
  );

  userInsert.run("John Student", "student@neurolearn.com", "password123", "student", 5, 1250);
  userInsert.run("Jane Doe", "jane@neurolearn.com", "password123", "student", 3, 750);
  userInsert.run("Admin Teacher", "admin@neurolearn.com", "admin123", "admin", 10, 5000);
  
  const allUsers = db.prepare("SELECT id, username, email, role FROM users").all();
  console.log("✅ Seeded users:", allUsers);
}

// Seed Courses
const courseCount = db.prepare("SELECT count(*) as count FROM courses").get() as any;
if (courseCount.count === 0) {
  const insert = db.prepare(
    "INSERT INTO courses (title, description, modules, difficulty, domain, duration_weeks) VALUES (?, ?, ?, ?, ?, ?)"
  );

  // AI & Data Science courses
  insert.run(
    "Quantum Computing Basics",
    "Introduction to qubits, superposition, and entanglement.",
    JSON.stringify(["Qubits 101", "Superposition", "Entanglement", "Quantum Gates"]),
    "Hard",
    "Quantum Computing",
    16
  );

  insert.run(
    "Neural Networks & Deep Learning",
    "Build neural networks from scratch using Python and TensorFlow.",
    JSON.stringify(["Perceptrons", "Backpropagation", "CNNs", "RNNs", "Transfer Learning"]),
    "Medium",
    "Artificial Intelligence",
    12
  );

  insert.run(
    "Data Science Fundamentals",
    "Master data analysis, visualization, and machine learning basics.",
    JSON.stringify(["Python for Data", "Pandas & NumPy", "Visualization", "Statistical Analysis", "ML Algorithms"]),
    "Medium",
    "Data Science",
    12
  );

  insert.run(
    "Advanced Machine Learning",
    "Dive into advanced ML techniques including ensemble methods and NLP.",
    JSON.stringify(["Ensemble Methods", "NLP Fundamentals", "Feature Engineering", "Model Optimization", "Production ML"]),
    "Hard",
    "Artificial Intelligence",
    14
  );

  // Cybersecurity courses
  insert.run(
    "Cybersecurity Essentials",
    "Learn core cybersecurity principles, threats, and defense mechanisms.",
    JSON.stringify(["Security Fundamentals", "Network Security", "Cryptography Basics", "Access Control", "Incident Response"]),
    "Medium",
    "Cybersecurity",
    12
  );

  insert.run(
    "Ethical Hacking & Penetration Testing",
    "Master penetration testing techniques and ethical hacking methodologies.",
    JSON.stringify(["Hacking Tools", "Vulnerability Assessment", "Penetration Testing", "Wireless Security", "Social Engineering"]),
    "Hard",
    "Cybersecurity",
    14
  );

  // Web Development courses
  insert.run(
    "Full-Stack Web Development",
    "Build modern web applications with React, Node.js, and MongoDB.",
    JSON.stringify(["HTML/CSS/JS", "React Fundamentals", "Node.js Backend", "MongoDB", "Deployment"]),
    "Medium",
    "Web Development",
    12
  );

  insert.run(
    "Advanced React & Frontend Architecture",
    "Master advanced React patterns, state management, and frontend optimization.",
    JSON.stringify(["Advanced React Hooks", "Redux/Context API", "Performance Optimization", "Testing", "Micro-frontends"]),
    "Hard",
    "Web Development",
    10
  );

  // Finance & Analytics
  insert.run(
    "Financial Analytics & Data Science",
    "Apply data science techniques to financial markets and analytics.",
    JSON.stringify(["Financial Markets", "Time Series Analysis", "Risk Analysis", "Portfolio Optimization", "Statistical Modeling"]),
    "Hard",
    "Finance & Analytics",
    14
  );

  insert.run(
    "Business Intelligence & Analytics",
    "Learn BI tools, data warehousing, and business analytics.",
    JSON.stringify(["Power BI/Tableau", "SQL", "Data Warehouse", "ETL Processes", "Business Metrics"]),
    "Medium",
    "Finance & Analytics",
    10
  );

  // Design & UI/UX
  insert.run(
    "UI/UX Design Principles",
    "Master user experience design, wireframing, and prototyping.",
    JSON.stringify(["Design Thinking", "User Research", "Wireframing", "Prototyping", "Usability Testing"]),
    "Medium",
    "Design & UI/UX",
    10
  );

  insert.run(
    "Advanced Product Design",
    "Learn comprehensive product design and design systems.",
    JSON.stringify(["Design Systems", "Interaction Design", "Animation", "Accessibility", "Tools Mastery"]),
    "Hard",
    "Design & UI/UX",
    12
  );

  // Robotics
  insert.run(
    "Robotics & Automation Basics",
    "Introduction to robotics, automation, and embedded systems.",
    JSON.stringify(["Hardware Basics", "Microcontrollers", "Sensors", "Robotics Frameworks", "ROS Intro"]),
    "Medium",
    "Robotics",
    12
  );

  insert.run(
    "Advanced Robotics & AI",
    "Combine robotics with AI for autonomous systems and intelligent robots.",
    JSON.stringify(["Computer Vision", "Motion Planning", "SLAM", "ROS Advanced", "Robot Learning"]),
    "Hard",
    "Robotics",
    14
  );

  // Biotechnology
  insert.run(
    "Biotech & Computational Biology",
    "Learn computational methods in biotechnology and genomics.",
    JSON.stringify(["Molecular Biology Basics", "Bioinformatics", "Genomics", "Protein Analysis", "Drug Discovery Basics"]),
    "Hard",
    "Biotechnology",
    14
  );

  insert.run(
    "Bioinformatics Tools & Databases",
    "Master bioinformatics tools, databases, and data analysis.",
    JSON.stringify(["Sequence Analysis", "Biological Databases", "BLAST & Alignment", "Python for Bio", "Data Visualization"]),
    "Medium",
    "Biotechnology",
    10
  );
}

// ================= GEMINI INIT =================
// ⚠️ Replace with your NEW key after revoking old one
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDiGs51CF3O9Qh_Yzc3JT4G5hSWQTLukX0"
});

// ================= SERVER =================
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Simple admin check helper (relies on header or body/query since no auth layer exists yet)
  function requireAdmin(req: any, res: any) {
    const roleHeader = (req.headers['x-user-role'] || req.query.role || req.body.user_role || '').toString();
    if (roleHeader !== 'admin') {
      res.status(403).json({ error: 'admin access required' });
      return false;
    }
    return true;
  }

  // Courses Route
  app.get("/api/courses", (req, res) => {
    const courses = db.prepare("SELECT * FROM courses").all();
    res.json(courses);
  });

  // Login Route
  app.post("/api/login", (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log(`Login attempt - Email: ${email}, Role: ${role}`);
    
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = ?").get(email, role) as any;

    if (!user) {
      console.log(`User not found for email: ${email}, role: ${role}`);
      const allUsers = db.prepare("SELECT id, username, email, role FROM users").all();
      console.log("Available users:", allUsers);
      return res.status(401).json({ error: "Invalid email or role" });
    }

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Return user data
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      xp: user.xp
    });
  });

  // Localization Route (support for multiple languages including Tamil)
  app.post("/api/localize", async (req, res) => {
    try {
      const { text, targetLang, simplify } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({ error: "Text and targetLang are required" });
      }

      // Predefined Tamil translations for common phrases
      const tamilTranslations: Record<string, string> = {
        // Common navigation
        "Dashboard": "டாஷ்போர்ட்",
        "Career Guidance": "வேலை வழிகாட்டுதல்",
        "Courses": "கோர்சுக்கள்",
        "Assessment": "மதிப்பீடு",
        "Virtual Labs": "மெய்நிகர் ஆய்வகங்கள்",
        "Profile": "சுயவிவரம்",
        "Teacher": "ஆசிரியர்",
        
        // Dashboard
        "Welcome back": "மீண்டும் வரவேற்கிறோம்",
        "Your cognitive performance is peaking today": "உங்கள் அறிவாற்றல் செயல்திறன் இன்று உச்சத்தில் உள்ளது",
        "Total XP": "மொத்த XP",
        "Focus Time": "கவனம் செலுத்தும் நேரம்",
        "Knowledge Nodes": "அறிவு முனைகள்",
        "Avg. Accuracy": "சராசரி துல்லியம்",
        "Learning Velocity": "கற்றல் வேகம்",
        "AI Brain Twin": "AI மூளை இரட்டை",
        "Live Sync": "நேரலை ஒத்திசைவு",
        "Memory Retention": "நினைவு தக்கவைப்பு",
        "Cognitive Load": "அறிவாற்றல் சுமை",
        "Optimal": "சிறந்தது",
        "High": "உচ்சம்",
        
        // Courses
        "Available Courses": "கிடைக்கக்கூடிய கோர்சுக்கள்",
        "Expand your neural network with new knowledge nodes": "புதிய அறிவு முனைகளுடன் உங்கள் நரம்பு வலையம் விரிவுபடுத்தவும்",
        "Search modules": "தொகுதிகளைத் தேடுங்கள்",
        "Watch Video": "வீடியோ பார்க்கவும்",
        "Start Module": "தொகுதி தொடங்கவும்",
        
        // Career Guidance
        "Finding Yourself": "நিজை கண்டுபிடித்தல்",
        "Aptitude Check": "திறன் சோதனை",
        "Career Path": "வேலை பாதை",
        "Select Domains": "களங்களைத் தேர்ந்தெடுக்கவும்",
        "Back": "பின்னால் செல்ல",
        
        // Common actions
        "Analyze Skills": "திறன்களைப் பகுப்பாய்வு செய்யவும்",
        "Start Learning": "கற்றல் தொடங்கவும்",
        "Sign Out": "வெளியே செல்ல",
        "System Online": "அமைப்பு ஆன்லைனில்",
      };

      // Check if we have a direct translation
      if (tamilTranslations[text] && targetLang.toLowerCase().includes('tamil')) {
        return res.json({ translatedText: tamilTranslations[text] });
      }

      // Try to use AI for translation
      try {
        const genAI = new GoogleGenAI({
          apiKey: process.env.GOOGLE_API_KEY || ''
        });

        if (!process.env.GOOGLE_API_KEY) {
          // Fallback: return text as-is if no API key
          return res.json({ translatedText: text });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const simplifyPrompt = simplify ? " Use simple, beginner-friendly language." : "";
        const prompt = `Translate the following text to ${targetLang}:${simplifyPrompt}\n\n"${text}"\n\nProvide ONLY the translation, nothing else.`;

        const response = await model.generateContent(prompt);
        const translatedText = response.response.text().trim();

        return res.json({ translatedText });
      } catch (error) {
        console.error('AI translation error:', error);
        // Return original text if AI translation fails
        return res.json({ translatedText: text });
      }
    } catch (error) {
      console.error('Localization error:', error);
      res.status(500).json({ error: 'Localization failed', translatedText: text });
    }
  });

  // Admin: list students
  app.get('/api/admin/students', (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const students = db.prepare("SELECT id, username, email, level, xp FROM users WHERE role = 'student'").all();
      res.json(students);
    } catch (e) {
      console.error('Failed to fetch students', e);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  });

  // Admin: list assessments (optionally filter by email)
  app.get('/api/admin/assessments', (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const email = req.query.email as string | undefined;
      let rows;
      if (email) {
        rows = db.prepare('SELECT * FROM assessments WHERE user_email = ? ORDER BY created_at DESC').all(email);
      } else {
        rows = db.prepare('SELECT * FROM assessments ORDER BY created_at DESC LIMIT 200').all();
      }
      res.json(rows);
    } catch (e) {
      console.error('Failed to fetch assessments', e);
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  });

  // Admin: save an evaluation
  app.post('/api/admin/assessments', (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const { user_email, user_id, question_id, prompt, answer, evaluation } = req.body as any;
      if (!user_email || !question_id) return res.status(400).json({ error: 'user_email and question_id required' });
      const insert = db.prepare('INSERT INTO assessments (user_id, user_email, question_id, prompt, answer, evaluation_json) VALUES (?, ?, ?, ?, ?, ?)');
      const info = insert.run(user_id || null, user_email, question_id.toString(), prompt || '', answer || '', JSON.stringify(evaluation || {}));
      res.json({ ok: true, id: info.lastInsertRowid });
    } catch (e) {
      console.error('Failed to save assessment', e);
      res.status(500).json({ error: 'Failed to save assessment' });
    }
  });

  // Public: student submits an assessment result (saved for teacher review)
  app.post('/api/assessments', (req, res) => {
    try {
      const { user_id, user_email, question_id, prompt, answer, evaluation } = req.body as any;
      if (!user_email || !question_id) return res.status(400).json({ error: 'user_email and question_id required' });
      const insert = db.prepare('INSERT INTO assessments (user_id, user_email, question_id, prompt, answer, evaluation_json) VALUES (?, ?, ?, ?, ?, ?)');
      const info = insert.run(user_id || null, user_email, question_id.toString(), prompt || '', answer || '', JSON.stringify(evaluation || {}));
      res.json({ ok: true, id: info.lastInsertRowid });
    } catch (e) {
      console.error('Failed to save student assessment', e);
      res.status(500).json({ error: 'Failed to save assessment' });
    }
  });

  // Admin: add a comment to an assessment
  app.post('/api/admin/assessments/:id/comment', (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const id = Number(req.params.id);
      const { comment, teacher_email } = req.body as any;
      if (!id || !comment) return res.status(400).json({ error: 'id and comment required' });

      const row = db.prepare('SELECT comments_json FROM assessments WHERE id = ?').get(id) as any;
      let comments: any[] = [];
      if (row && row.comments_json) {
        try { comments = JSON.parse(row.comments_json); } catch { comments = []; }
      }
      comments.push({ comment, teacher_email: teacher_email || req.headers['x-user-email'] || 'teacher', created_at: new Date().toISOString() });

      db.prepare('UPDATE assessments SET comments_json = ? WHERE id = ?').run(JSON.stringify(comments), id);
      res.json({ ok: true, comments });
    } catch (e) {
      console.error('Failed to add comment', e);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  });

  // Admin: upload video (base64 payload)
  app.post('/api/admin/upload-video', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const { filename, dataBase64 } = req.body as any;
      if (!filename || !dataBase64) return res.status(400).json({ error: 'filename and dataBase64 required' });
      const buffer = Buffer.from(dataBase64, 'base64');
      const videosDir = path.join(__dirname, 'public', 'videos');
      try { await fs.promises.mkdir(videosDir, { recursive: true }); } catch {}
      const outPath = path.join(videosDir, path.basename(filename));
      await fs.promises.writeFile(outPath, buffer);
      res.json({ ok: true, url: `/videos/${path.basename(filename)}` });
    } catch (e) {
      console.error('Upload failed', e);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Career Route - Stage 1: Generate discovery questions
  app.post("/api/career/stage1/questions", async (req, res) => {
    try {
      const { selected_domains } = req.body as any;
      
      if (!selected_domains || !Array.isArray(selected_domains)) {
        return res.status(400).json({ error: 'selected_domains array required' });
      }

      const domainsStr = selected_domains.join(', ');
      const prompt = `
        Generate 5-7 joyful, scenario-based discovery questions for these domains: ${domainsStr}.
        Questions should feel engaging and conversational, not like an exam.
        For each question, return JSON object with:
        - id (unique ID)
        - domain (which domain it maps to)
        - question (the scenario-based question)
        - options (array of 4-5 options)
        
        Make questions explore interests, cognitive patterns, and natural inclinations.
        Return only JSON array.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text);
        return res.json(result);
      } catch (e) {
        console.warn('LLM Stage1 question generation failed, using fallback', e?.message || e);
        
        // Fallback: Generate deterministic questions based on domains
        const fallback = [
          {
            id: 's1-q1',
            domain: selected_domains[0],
            question: 'When faced with complex problems, you naturally prefer to:',
            options: [
              'Analyze data patterns and find underlying logic',
              'Build solutions hands-on and test them',
              'Explore creative and unconventional approaches',
              'Break problems into manageable tasks'
            ]
          },
          {
            id: 's1-q2',
            domain: selected_domains[1],
            question: 'Which type of work environment energizes you most?',
            options: [
              'Fast-paced with constant learning and innovation',
              'Collaborative with diverse perspectives',
              'Structured with clear processes and outcomes',
              'Autonomous with room for creativity'
            ]
          },
          {
            id: 's1-q3',
            domain: selected_domains[2],
            question: 'Your ideal career outcome in 5 years would be:',
            options: [
              'Technical expert recognized in your field',
              'Leader of innovative projects or teams',
              'Well-rounded professional adapting to change',
              'Specialist solving critical problems'
            ]
          },
          {
            id: 's1-q4',
            domain: selected_domains[0],
            question: 'When learning something new, you typically:',
            options: [
              'Read documentation and understand theory first',
              'Jump in and learn by doing',
              'Follow tutorials and examples',
              'Experiment across different approaches'
            ]
          },
          {
            id: 's1-q5',
            domain: selected_domains[1],
            question: 'What achievement would feel most rewarding?',
            options: [
              'Creating something that impacts many people',
              'Solving a problem nobody else could solve',
              'Building expertise in a specialized area',
              'Leading a successful initiative'
            ]
          }
        ];
        return res.json(fallback);
      }
    } catch (err: any) {
      console.error('Stage1 questions error', err?.message || err);
      res.status(500).json({ error: 'Failed to generate Stage 1 questions' });
    }
  });

  // Career Route - Stage 1: Evaluate answers
  app.post("/api/career/stage1/evaluate", async (req, res) => {
    try {
      const { answers } = req.body as any;
      
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'answers array required' });
      }

      // Count domain interest from answers
      const domainScores: Record<string, number> = {};
      const allDomains = [
        "Artificial Intelligence", "Data Science", "Cybersecurity", "Web Development",
        "Quantum Computing", "Finance & Analytics", "Design & UI/UX", "Robotics", "Biotechnology"
      ];

      allDomains.forEach(d => { domainScores[d] = 0; });

      // Simple heuristic: domain field is passed in answers
      answers.forEach((a: any) => {
        if (a.domain && domainScores.hasOwnProperty(a.domain)) {
          domainScores[a.domain] += 1;
        }
      });

      // Get top 2 domains
      const sortedDomains = Object.entries(domainScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2);

      const topDomains = sortedDomains.length > 0 
        ? sortedDomains.map(([d]) => d)
        : allDomains.slice(0, 2);

      const message = `You show strong interest in ${topDomains.join(' and ')}. These domains align well with your analytical thinking and problem-solving approach.`;

      res.json({
        top_domains: topDomains,
        domain_scores: domainScores,
        message,
        interest_score: Math.min(100, (sortedDomains[0]?.[1] || 0) * 20 + 40)
      });

    } catch (err: any) {
      console.error('Stage1 evaluation error', err?.message || err);
      res.status(500).json({ error: 'Failed to evaluate Stage 1' });
    }
  });

  // Career Route - Stage 2: Generate aptitude questions
  app.post("/api/career/stage2/questions", async (req, res) => {
    try {
      const { top_domains } = req.body as any;
      
      if (!top_domains || !Array.isArray(top_domains)) {
        return res.status(400).json({ error: 'top_domains array required' });
      }

      const domainContext = top_domains.join(', ');
      const prompt = `
        Generate 4-5 aptitude assessment questions for these domains: ${domainContext}.
        Include:
        - Logical reasoning questions
        - Situational judgment questions
        - Basic domain-specific aptitude questions
        
        For each question, return JSON object with:
        - id (unique ID)
        - category (Logical Reasoning | Situational Judgment | Domain Aptitude)
        - prompt (open-ended question text)
        - guidance (1-2 sentence guidance)
        
        Questions should evaluate practical thinking, goal clarity, and confidence.
        Return only JSON array.
      `;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text);
        return res.json(result);
      } catch (e) {
        console.warn('LLM Stage2 question generation failed, using fallback', e?.message || e);
        
        const fallback = [
          {
            id: 's2-q1',
            category: 'Logical Reasoning',
            prompt: 'You need to optimize a system that processes 1 million records daily. Response time is critical. Describe your approach to identify bottlenecks and solutions.',
            guidance: 'Think systematically about diagnosis and prioritization.'
          },
          {
            id: 's2-q2',
            category: 'Situational Judgment',
            prompt: 'A team member discovers a critical issue in production just before a major release. How would you handle this situation?',
            guidance: 'Consider team dynamics, communication, and decision-making.'
          },
          {
            id: 's2-q3',
            category: 'Domain Aptitude',
            prompt: `Explain how ${top_domains[0]} could be applied to solve a real-world business problem. Provide concrete examples.`,
            guidance: 'Demonstrate understanding and practical application.'
          },
          {
            id: 's2-q4',
            category: 'Goal Clarity',
            prompt: 'Describe your 3-year career roadmap in this domain. What skills, projects, and outcomes matter most?',
            guidance: 'Show clarity of vision and actionable milestones.'
          }
        ];
        return res.json(fallback);
      }
    } catch (err: any) {
      console.error('Stage2 questions error', err?.message || err);
      res.status(500).json({ error: 'Failed to generate Stage 2 questions' });
    }
  });

  // Career Route - Stage 2: Evaluate + Generate final recommendation
  app.post("/api/career/stage2/evaluate", async (req, res) => {
    try {
      const { answers, stage1_results, user_id } = req.body as any;
      
      if (!answers || !stage1_results) {
        return res.status(400).json({ error: 'answers and stage1_results required' });
      }

      // Evaluate responses
      const evalPrompt = `
        Evaluate these assessment responses on:
        - Logical Reasoning (0-100)
        - Situational Judgment (0-100)
        - Domain Aptitude (0-100)
        - Confidence (0-100)
        - Goal Clarity (0-100)
        
        ${answers.map((a: any) => `Q: ${a.prompt}\nA: ${a.answer}`).join('\n\n')}
        
        Return JSON with overall_score and individual scores. Be concise.
      `;

      let stage2Scores: any = {
        reasoning: 75,
        situational: 78,
        aptitude: 80,
        confidence: 82,
        goalClarity: 76
      };

      try {
        const evalResp = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [{ role: 'user', parts: [{ text: evalPrompt }] }],
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(evalResp.text);
        stage2Scores = {
          reasoning: parsed.logical_reasoning || parsed.reasoning || 75,
          situational: parsed.situational_judgment || parsed.situational || 78,
          aptitude: parsed.domain_aptitude || parsed.aptitude || 80,
          confidence: parsed.confidence || 82,
          goalClarity: parsed.goal_clarity || parsed.goalClarity || 76
        };
      } catch (e) {
        console.warn('LLM evaluation failed, using heuristic scores', e?.message || e);
      }

      // Combine Stage 1 interest + Stage 2 aptitude
      const interestScore = stage1_results.interest_score || 70;
      const aptitudeScore = Math.round((stage2Scores.reasoning + stage2Scores.aptitude) / 2);
      const compatibilityScore = Math.round((interestScore * 0.4 + aptitudeScore * 0.6));

      // Determine primary and secondary domains
      const primaryDomain = stage1_results.top_domains[0];
      const secondaryDomain = stage1_results.top_domains[1];

      // Get recommended courses
      const courses = db.prepare("SELECT * FROM courses WHERE domain = ? OR domain = ?")
        .all(primaryDomain, secondaryDomain) as any[];

      const recommendedCourses = courses
        .slice(0, 6)
        .map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          difficulty: c.difficulty,
          duration_weeks: c.duration_weeks,
          modules: JSON.parse(c.modules || '[]')
        }));

      // Build roadmap
      const roadmap = {
        foundation: [
          '📚 Complete foundational course in ' + primaryDomain,
          '🎯 Build understanding of core concepts (2-3 months)',
          '💻 Set up development environment and tools',
          '📖 Read essential books and documentation',
          '🤝 Join community and find mentors'
        ],
        intermediate: [
          '🚀 Complete intermediate-level courses (3-6 months)',
          '💡 Build 2-3 projects applying core concepts',
          '🔍 Deep dive into specialized topics',
          '📊 Contribute to open-source or team projects',
          '🎓 Pursue relevant certifications'
        ],
        advanced: [
          '🏆 Master advanced concepts and techniques (6-9 months)',
          '🌟 Build portfolio with 4-5 significant projects',
          '🔬 Explore research or cutting-edge applications',
          '👨‍💼 Take on leadership or mentorship roles',
          '📈 Establish yourself as an expert'
        ],
        placement_prep: [
          '💼 Polish resume and LinkedIn profile',
          '🖥️ Practice technical interviews (3-4 weeks)',
          '💬 Prepare behavioral interview answers',
          '🌐 Network with industry professionals',
          '✅ Apply to target roles and companies'
        ]
      };

      // Skill gap analysis
      const strengthAreas = [];
      if (stage2Scores.reasoning >= 75) strengthAreas.push('Strong logical thinking');
      if (stage2Scores.aptitude >= 75) strengthAreas.push('Good domain understanding');
      if (stage2Scores.goalClarity >= 75) strengthAreas.push('Clear career vision');

      const skillGapAnalysis = [
        ...strengthAreas,
        stage2Scores.confidence < 70 ? 'Build practical experience to increase confidence' : '',
        stage2Scores.reasoning < 70 ? 'Strengthen problem-solving and algorithm skills' : '',
        stage2Scores.aptitude < 70 ? 'Deepen domain-specific knowledge' : ''
      ].filter(Boolean);

      const estimatedTime = '9-12 months';

      // Save to database
      if (user_id) {
        try {
          db.prepare(`
            INSERT INTO career_assessments (
              user_id, stage1_answers, stage1_scores, top_domains,
              stage2_answers, stage2_scores, primary_domain, secondary_domain,
              compatibility_score, roadmap_json, recommended_courses_json,
              skill_gap_analysis, estimated_time_to_job_ready
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            user_id,
            JSON.stringify(answers),
            JSON.stringify(stage2Scores),
            JSON.stringify(stage1_results.top_domains),
            JSON.stringify(answers),
            JSON.stringify(stage2Scores),
            primaryDomain,
            secondaryDomain,
            compatibilityScore,
            JSON.stringify(roadmap),
            JSON.stringify(recommendedCourses),
            JSON.stringify(skillGapAnalysis),
            estimatedTime
          );
        } catch (dbErr) {
          console.warn('Failed to save career assessment', dbErr);
        }
      }

      res.json({
        primary_domain: primaryDomain,
        secondary_domain: secondaryDomain,
        compatibility_score: compatibilityScore,
        interest_score: interestScore,
        aptitude_score: aptitudeScore,
        stage2_scores: stage2Scores,
        recommended_courses: recommendedCourses,
        roadmap,
        skill_gap_analysis: skillGapAnalysis,
        estimated_time_to_job_ready: estimatedTime
      });

    } catch (err: any) {
      console.error('Stage2 evaluation error', err?.message || err);
      res.status(500).json({ error: 'Failed to evaluate Stage 2' });
    }
  });

  // Stage 2 Assessment - generate and evaluate open-ended responses
  app.post("/api/assessment/stage2", async (req, res) => {
    try {
      const { action, responses, questions } = req.body as any;

      if (action === 'generate') {
        const prompt = `
          Generate 3 open-ended assessment prompts for a Stage 2 evaluation.
          Categories: Logical reasoning, Situational judgment, Basic domain aptitude (computer science/AI).
          For each item return a JSON object with keys: id, category, prompt, guidance (1-2 sentence guidance for candidate).
          Return only JSON array.
        `;

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: { responseMimeType: 'application/json' }
          });

          const result = JSON.parse(response.text);
          return res.json(result);
        } catch (e) {
          console.warn('LLM generate failed, using fallback questions', e?.message || e);
          const fallback = [
            { id: 1, category: 'Logical Reasoning', prompt: 'Explain a strategy to solve the following puzzle: You have 3 switches outside a closed room and 3 light bulbs inside. How can you determine which switch controls which bulb if you may enter the room only once?', guidance: 'Describe steps and reasoning; consider observations and timing.' },
            { id: 2, category: 'Situational Judgment', prompt: 'You are leading a small team and a critical deadline is at risk due to one member falling behind. How would you address the situation to both meet the deadline and support the team member?', guidance: 'Outline concrete actions, communication, and prioritization.' },
            { id: 3, category: 'Domain Aptitude', prompt: 'Describe how you would explain the concept of overfitting in machine learning to a colleague with basic programming knowledge.', guidance: 'Give an intuitive explanation and a short example.' }
          ];
          return res.json(fallback);
        }
      }

      if (action === 'evaluate') {
        // responses: [{ id, prompt, answer }] and optional questions metadata
        if (!responses || !Array.isArray(responses)) {
          return res.status(400).json({ error: 'responses array required' });
        }

        // Build evaluation prompt
        const evalPromptHeader = `
          You are an expert assessor. Evaluate each candidate response for the following axes:
          - Logical Reasoning (0-100)
          - Situational Judgment (0-100)
          - Domain Aptitude (0-100)
          - Confidence (0-100) inferred from phrasing
          - Goal Clarity (0-100): how clear and actionable the candidate's stated goals are.

          For each response provide: id, summary (1-2 sentences), scores {reasoning, situational, aptitude, confidence, goalClarity}, overall (0-100), and targeted feedback bullet points (2-4).
          Return only JSON array of evaluations.
        `;

        // Combine responses into prompt
        const itemsText = responses.map((r: any, idx: number) => `ITEM ${idx + 1} - id: ${r.id}\nPROMPT: ${r.prompt}\nANSWER: ${r.answer}\n`).join('\n');

        const evalPrompt = evalPromptHeader + '\n' + itemsText;

        try {
          const evalResp = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ role: 'user', parts: [{ text: evalPrompt }] }],
            config: { responseMimeType: 'application/json' }
          });

          const evalResult = JSON.parse(evalResp.text);
          return res.json(evalResult);
        } catch (e) {
          console.warn('LLM evaluate failed, using fallback evaluator', e?.message || e);

          // Simple fallback evaluator heuristics
          const fallbackEval = responses.map((r: any, idx: number) => {
            const text = (r.answer || '').trim();
            const lengthScore = Math.min(100, Math.round((text.split(/\s+/).length / 50) * 100));
            const reasoning = Math.min(100, lengthScore + (text.includes('because') ? 10 : 0));
            const situational = Math.min(100, lengthScore + (text.includes('prioritize') || text.includes('communicate') ? 10 : 0));
            const aptitude = Math.min(100, lengthScore + (text.includes('example') || text.match(/model|overfit|regulariza/i) ? 15 : 0));
            const confidence = text.match(/\b(I think|maybe|perhaps|could)\b/i) ? Math.max(20, lengthScore - 10) : Math.min(90, lengthScore + 10);
            const goalClarity = text.match(/\b(goal|objective|deliverable|deadline)\b/i) ? Math.min(100, lengthScore + 10) : Math.max(20, lengthScore - 20);

            const overall = Math.round((reasoning + situational + aptitude + confidence + goalClarity) / 5);

            const summary = text.split(/[\.\n]/)[0].slice(0, 200) || 'No response provided.';
            const feedback: string[] = [];
            if (!text) feedback.push('No answer provided; encourage concise, focused responses.');
            else {
              if (lengthScore < 20) feedback.push('Expand your answer with concrete steps or an example.');
              if (reasoning < 50) feedback.push('Make the logical steps explicit and justify choices.');
              if (goalClarity < 40) feedback.push('State clear goals and expected outcomes.');
            }

            return {
              id: r.id,
              summary,
              scores: { reasoning, situational, aptitude, confidence, goalClarity },
              overall,
              feedback
            };
          });

          return res.json(fallbackEval);
        }
      }

      res.status(400).json({ error: 'invalid action' });
    } catch (err: any) {
      console.error('Stage2 assessment error', err?.message || err);
      res.status(500).json({ error: 'Assessment generation/evaluation failed' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();