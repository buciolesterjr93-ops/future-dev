import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Code2, Braces, Menu, X, Sun, Moon, Search, Bell, Heart, Flame,
  MessageCircle, Play, CheckCircle2, Award, Users, TrendingUp,
  Settings, LogOut, User, BookOpen, Send, Plus, ChevronRight,
  Star, Trophy, Bot, Image as ImageIcon, Ban, Trash2, ShieldCheck,
  Download, Lock, Mail, ArrowRight, FolderGit2, Sparkles
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ============================================================
   FUTURE DEV — prototype front end
   Brand: Deep Blue #0A192F / Electric Purple #7F5AF0 / Neon Cyan #00F5D4
   Fonts: Poppins (headings) / Inter (body)
   NOTE: This is a fully-designed, click-through demo running on
   mock data held in React state. There is no live server, database,
   or auth behind it — see the chat message for what a production
   build would add (Node/Express/MongoDB, JWT, Cloudinary, sockets).
   ============================================================ */

// ---------- brand tokens ----------
const C = {
  bgDark: "#0A192F",
  bgDarker: "#050D1A",
  bgLight: "#F4F6FB",
  surfaceDark: "#0F2340",
  surfaceLight: "#FFFFFF",
  purple: "#7F5AF0",
  cyan: "#00F5D4",
  white: "#F5F7FA",
  textDarkMuted: "#8FA3C4",
  textLightMuted: "#5B6B85",
};

// ---------- mock data ----------
const COURSES = [
  { id: "html", name: "HTML", tagline: "Structure the web", color: "#E96443", lessons: 24, level: "Beginner" },
  { id: "css", name: "CSS", tagline: "Style everything", color: "#00F5D4", lessons: 28, level: "Beginner" },
  { id: "js", name: "JavaScript", tagline: "Make it interactive", color: "#F0DB4F", lessons: 42, level: "Intermediate" },
  { id: "python", name: "Python", tagline: "Code with clarity", color: "#4B8BBE", lessons: 36, level: "Beginner" },
  { id: "java", name: "Java", tagline: "Build at scale", color: "#7F5AF0", lessons: 40, level: "Intermediate" },
  { id: "cpp", name: "C++", tagline: "Master performance", color: "#00599C", lessons: 38, level: "Advanced" },
];

const BADGES = [
  { id: 1, name: "Beginner Coder", icon: Star, earned: true },
  { id: 2, name: "Java Master", icon: Trophy, earned: true },
  { id: 3, name: "7-Day Streak", icon: Flame, earned: true },
  { id: 4, name: "Bug Hunter", icon: ShieldCheck, earned: false },
];

const WEEKLY_ACTIVE = [
  { day: "Mon", users: 320 }, { day: "Tue", users: 410 }, { day: "Wed", users: 380 },
  { day: "Thu", users: 460 }, { day: "Fri", users: 510 }, { day: "Sat", users: 300 }, { day: "Sun", users: 340 },
];

const FEED_SEED = [
  {
    id: 1, name: "Ana Reyes", handle: "@anareyes", time: "2h",
    text: "Finally got recursion to click today 🎉 here's my factorial function:",
    code: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}`,
    lang: "javascript", likes: 24, hearts: 9, fires: 14, comments: 6, tag: "#JavaHelp",
  },
  {
    id: 2, name: "Miguel Santos", handle: "@miggy_codes", time: "5h",
    text: "Shipped my first portfolio site using flexbox only, no grid. Small win but felt huge.",
    code: null, lang: null, likes: 41, hearts: 18, fires: 7, comments: 12, tag: "#WebDev",
  },
  {
    id: 3, name: "Future Dev Team", handle: "@futuredev", time: "1d",
    text: "New course module just dropped: Python — List Comprehensions. Go check it out!",
    code: `squares = [x**2 for x in range(10) if x % 2 == 0]`,
    lang: "python", likes: 88, hearts: 30, fires: 22, comments: 19, tag: "#Python",
  },
];

const TRENDING = ["#JavaHelp", "#WebDev", "#Python", "#100DaysOfCode", "#CppTips"];

const USERS_ADMIN = [
  { id: 1, name: "Ana Reyes", email: "ana@mail.com", status: "active", posts: 12 },
  { id: 2, name: "Miguel Santos", email: "miggy@mail.com", status: "active", posts: 5 },
  { id: 3, name: "Carlo Dizon", email: "carlo@mail.com", status: "banned", posts: 2 },
  { id: 4, name: "Lester P. Bucio Jr.", email: "lester@futuredev.dev", status: "active", posts: 31, admin: true },
];

const LEADERBOARD = [
  { rank: 1, name: "Miguel Santos", points: 4820 },
  { rank: 2, name: "Ana Reyes", points: 4510 },
  { rank: 3, name: "Jin Park", points: 4210 },
  { rank: 4, name: "You", points: 3980, isYou: true },
  { rank: 5, name: "Carlo Dizon", points: 3760 },
];

// one lesson + one quiz bank per language, so every course in COURSES has a real page
const LESSONS = {
  html: {
    module: "Module 1: Basics", title: "Structuring a Page",
    notes: [
      "HTML pages are built from nested tags — an opening tag, content, and a closing tag.",
      "Headings run from <h1> (biggest) to <h6> (smallest); use them in order, don't skip levels.",
      "The <body> holds everything visible on the page.",
    ],
    starterCode: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello, Future Dev!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>`,
    output: "Renders: a big heading \"Hello, Future Dev!\" and a paragraph below it.",
    quiz: [
      { q: "Which tag defines the biggest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correct: 2, explain: "<h1> is the largest heading; <h6> is the smallest." },
      { q: "Which tag holds everything visible on the page?", options: ["<head>", "<body>", "<html>", "<div>"], correct: 1, explain: "<head> holds metadata; <body> holds visible content." },
    ],
  },
  css: {
    module: "Module 1: Basics", title: "Selectors & the Box Model",
    notes: [
      "A CSS rule is a selector plus declarations in curly braces: selector { property: value; }.",
      "Every element is a box: content, padding, border, then margin, from the inside out.",
      "Class selectors (.card) can be reused on many elements; ID selectors (#header) should be unique.",
    ],
    starterCode: `.card {\n  padding: 16px;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n  margin: 12px;\n}`,
    output: "Renders: a boxed card with 16px inner spacing, a thin border, rounded corners, 12px of space around it.",
    quiz: [
      { q: "What's the order of the box model, inside out?", options: ["Margin, border, padding, content", "Content, padding, border, margin", "Content, border, padding, margin", "Padding, content, margin, border"], correct: 1, explain: "Content sits innermost, then padding, then border, then margin." },
      { q: "Which selector targets a reusable class?", options: ["#card", ".card", "*card", "card()"], correct: 1, explain: "A dot (.) selects a class; a hash (#) selects an ID." },
    ],
  },
  js: {
    module: "Module 2: Functions", title: "Writing Your First Function",
    notes: [
      "A function is a reusable block of code — define it once, call it as many times as you need.",
      "Parameters are placeholders; arguments are the real values you pass in when calling it.",
      "return sends a value back out of the function; without it, a function returns undefined.",
    ],
    starterCode: `function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Future Dev"));`,
    output: "Hello, Future Dev!",
    quiz: [
      { q: "What does a function return if it has no return statement?", options: ["null", "0", "undefined", "an error"], correct: 2, explain: "Without an explicit return, a JS function returns undefined." },
      { q: "In greet(name), what is `name`?", options: ["An argument", "A parameter", "A return value", "A comment"], correct: 1, explain: "`name` is the parameter; the actual value passed in (like \"Future Dev\") is the argument." },
    ],
  },
  python: {
    module: "Module 1: Basics", title: "Variables & Loops",
    notes: [
      "Python doesn't need semicolons or type declarations — indentation defines code blocks.",
      "A for loop over range(n) repeats n times, with the loop variable counting 0 to n-1.",
      "Use f-strings (f\"...{value}...\") to build strings with variables inside them.",
    ],
    starterCode: `for i in range(3):\n    print(f"Lesson {i + 1} complete!")`,
    output: "Lesson 1 complete!\nLesson 2 complete!\nLesson 3 complete!",
    quiz: [
      { q: "What defines a code block in Python?", options: ["Curly braces", "Indentation", "Semicolons", "Parentheses"], correct: 1, explain: "Python uses consistent indentation instead of braces." },
      { q: "range(3) produces which values?", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"], correct: 1, explain: "range(3) counts from 0 up to, but not including, 3." },
    ],
  },
  java: {
    module: "Module 2: Control Flow", title: "If / Else Statements",
    notes: [
      "An if statement runs a block of code only when its condition is true.",
      "Use else if to check additional conditions, and else as the fallback.",
      "Conditions must evaluate to a boolean — comparisons like >, <, == are your building blocks.",
    ],
    starterCode: `public class Main {\n  public static void main(String[] args) {\n    int score = 82;\n\n    if (score >= 90) {\n      System.out.println("Grade: A");\n    } else if (score >= 80) {\n      System.out.println("Grade: B");\n    } else {\n      System.out.println("Grade: C or below");\n    }\n  }\n}`,
    output: "Grade: B",
    quiz: [
      { q: "What does the else if branch do?", options: ["Runs only when the first condition is true", "Checks another condition if the first was false", "Always runs after the if block"], correct: 1, explain: "else if only runs when the earlier condition(s) were false." },
      { q: "Which type do Java conditions evaluate to?", options: ["int", "String", "boolean", "void"], correct: 2, explain: "if/else conditions must resolve to true or false — a boolean." },
    ],
  },
  cpp: {
    module: "Module 1: Basics", title: "Variables & Output",
    notes: [
      "Every C++ program needs a main() function — that's where execution starts.",
      "Variables must declare a type (int, double, string) before you use them.",
      "std::cout << sends output to the console; << can be chained to print several things.",
    ],
    starterCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n  int lessons = 5;\n  cout << "Completed " << lessons << " lessons!" << endl;\n  return 0;\n}`,
    output: "Completed 5 lessons!",
    quiz: [
      { q: "Which function is the entry point of a C++ program?", options: ["start()", "main()", "run()", "init()"], correct: 1, explain: "Execution always begins in main()." },
      { q: "What does cout do?", options: ["Reads input", "Declares a variable", "Prints to the console", "Defines a loop"], correct: 2, explain: "cout (with <<) writes output to the console." },
    ],
  },
};

// beginner-friendly practice problems, grouped by language — shown under the Practice tab
const PRACTICE_PROBLEMS = [
  { id: 1, course: "html", title: "Build a simple bio card", difficulty: "Beginner" },
  { id: 2, course: "html", title: "Make a 3-item nav bar", difficulty: "Beginner" },
  { id: 3, course: "css", title: "Center a div three different ways", difficulty: "Beginner" },
  { id: 4, course: "css", title: "Style a button hover effect", difficulty: "Beginner" },
  { id: 5, course: "js", title: "FizzBuzz 1 to 20", difficulty: "Beginner" },
  { id: 6, course: "js", title: "Reverse a string", difficulty: "Beginner" },
  { id: 7, course: "python", title: "Sum all numbers in a list", difficulty: "Beginner" },
  { id: 8, course: "python", title: "Check if a word is a palindrome", difficulty: "Intermediate" },
  { id: 9, course: "java", title: "Check if a number is even or odd", difficulty: "Beginner" },
  { id: 10, course: "java", title: "Print a multiplication table", difficulty: "Intermediate" },
  { id: 11, course: "cpp", title: "Swap two numbers without a third variable", difficulty: "Beginner" },
  { id: 12, course: "cpp", title: "Find the largest of three numbers", difficulty: "Beginner" },
];

// ---------- small building blocks ----------
function Logo({ size = 28, dark = true }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="flex items-center justify-center rounded-xl font-bold"
        style={{
          width: size + 14, height: size + 14,
          background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <span style={{ fontSize: size * 0.62, color: C.bgDarker, letterSpacing: -1 }}>{"{FD}"}</span>
      </div>
      <span
        className="font-bold tracking-tight"
        style={{ fontFamily: "Poppins, sans-serif", fontSize: size * 0.62, color: dark ? C.white : C.bgDark }}
      >
        FUTURE DEV
      </span>
    </div>
  );
}

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
      style={{ borderColor: dark ? "#1E3A5F" : "#D8DEEA", color: dark ? C.cyan : C.purple }}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
      style={{
        background: active ? C.purple : "transparent",
        color: active ? "#fff" : "inherit",
        border: active ? "none" : "1px solid currentColor",
        opacity: active ? 1 : 0.6,
      }}
    >
      {children}
    </button>
  );
}

// ---------- typing terminal (single orchestrated hero moment) ----------
const TERMINAL_LINES = [
  { t: "function", c: C.purple }, { t: " buildFuture", c: C.cyan }, { t: "(you) {\n", c: "#fff" },
  { t: "  const skills", c: "#fff" }, { t: " = ", c: "#fff" }, { t: "learn", c: C.purple }, { t: "(you);\n", c: "#fff" },
  { t: "  return ", c: C.purple }, { t: "skills", c: "#fff" }, { t: ".", c: "#fff" }, { t: "build", c: C.cyan }, { t: "();\n}", c: "#fff" },
];
function TypingTerminal() {
  const full = TERMINAL_LINES.map(l => l.t).join("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= full.length) {
      const reset = setTimeout(() => setCount(0), 1800);
      return () => clearTimeout(reset);
    }
    const speed = full[count] === "\n" ? 120 : 32;
    const t = setTimeout(() => setCount(c => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, full]);

  // rebuild colored spans up to `count` chars
  let remaining = count;
  const spans = [];
  for (let i = 0; i < TERMINAL_LINES.length && remaining > 0; i++) {
    const seg = TERMINAL_LINES[i].t;
    const take = Math.min(seg.length, remaining);
    spans.push(<span key={i} style={{ color: TERMINAL_LINES[i].c }}>{seg.slice(0, take)}</span>);
    remaining -= take;
  }

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-md"
      style={{ background: C.bgDarker, border: `1px solid #1E3A5F` }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid #1E3A5F" }}>
        <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F56" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
        <div className="w-3 h-3 rounded-full" style={{ background: "#27C93F" }} />
        <span className="ml-3 text-xs" style={{ color: C.textDarkMuted, fontFamily: "Inter, sans-serif" }}>main.js</span>
      </div>
      <pre className="p-5 text-sm leading-relaxed" style={{ fontFamily: "'Fira Code', monospace", minHeight: 160 }}>
        {spans}
        <span className="inline-block w-2 h-4 align-middle ml-0.5" style={{ background: C.cyan, animation: "fd-blink 1s step-end infinite" }} />
      </pre>
    </div>
  );
}

// ============================================================
// PAGE: LANDING
// ============================================================
function Landing({ dark, setDark, goto }) {
  const bg = dark ? C.bgDark : C.bgLight;
  const text = dark ? C.white : C.bgDark;
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;

  return (
    <div style={{ background: bg, color: text, fontFamily: "Inter, sans-serif" }} className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 sticky top-0 z-30 backdrop-blur-md" style={{ background: dark ? "rgba(10,25,47,0.85)" : "rgba(244,246,251,0.85)" }}>
        <Logo dark={dark} />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: muted }}>
          <a href="#courses" className="hover:opacity-100" style={{ opacity: 0.85 }}>Courses</a>
          <a href="#community" className="hover:opacity-100" style={{ opacity: 0.85 }}>Community</a>
          <a href="#challenges" className="hover:opacity-100" style={{ opacity: 0.85 }}>Challenges</a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle dark={dark} setDark={setDark} />
          <button onClick={() => goto("login")} className="hidden sm:block text-sm font-medium px-4 py-2" style={{ color: text }}>Log in</button>
          <button
            onClick={() => goto("signup")}
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ background: C.purple, color: "#fff" }}
          >
            Sign up free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-10 md:pt-20 pb-20 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="font-bold leading-[1.05]" style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)" }}>
            Learn to code.<br />Build the future.
          </h1>
          <p className="mt-5 text-lg max-w-md" style={{ color: muted }}>
            Six languages, hands-on lessons, and a community that ships. Write real code in your browser from lesson one — no setup required.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => goto("signup")} className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2" style={{ background: C.cyan, color: C.bgDarker }}>
              Start learning <ArrowRight size={18} />
            </button>
            <button onClick={() => goto("dashboard")} className="px-6 py-3 rounded-lg font-semibold border" style={{ borderColor: muted, color: text }}>
              View demo dashboard
            </button>
          </div>
          <p className="mt-6 text-sm" style={{ color: muted }}>
            By <span style={{ color: C.cyan }}>Lester P. Bucio Jr.</span> — built for learners who want to actually build things, not just watch.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <TypingTerminal />
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl" style={{ fontFamily: "Poppins, sans-serif" }}>Pure Code to Learn</h2>
            <p style={{ color: muted }} className="mt-1">Six languages. One in-browser editor. Zero installs.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COURSES.map(c => (
            <button
              key={c.id}
              onClick={() => goto("course", null, c.id)}
              className="text-left p-5 rounded-2xl transition-transform hover:-translate-y-1"
              style={{ background: surface, border: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: c.color + "22" }}>
                <Code2 size={18} style={{ color: c.color }} />
              </div>
              <h3 className="font-semibold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{c.name}</h3>
              <p className="text-sm mt-1" style={{ color: muted }}>{c.tagline}</p>
              <div className="flex items-center gap-3 mt-4 text-xs" style={{ color: muted }}>
                <span>{c.lessons} lessons</span><span>·</span><span>{c.level}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="community" className="px-6 md:px-12 py-16 max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Users, title: "Learn together", desc: "Post progress, share code, get feedback from other learners." },
          { icon: Bot, title: "Ask AI Tutor", desc: "Stuck on a bug? Ask the tutor and get an explanation, not just an answer." },
          { icon: Flame, title: "Daily challenge", desc: "One problem a day. Climb the leaderboard as you build a streak." },
          { icon: FolderGit2, title: "Project gallery", desc: "Publish what you build and see what everyone else is making." },
        ].map((f, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}>
            <f.icon size={20} style={{ color: C.cyan }} />
            <h3 className="font-semibold mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>{f.title}</h3>
            <p className="text-sm mt-1" style={{ color: muted }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Social proof strip */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto text-center">
        <h2 className="font-bold text-2xl md:text-3xl max-w-2xl mx-auto" style={{ fontFamily: "Poppins, sans-serif" }}>
          Facebook's feed. Codecademy's editor. One platform.
        </h2>
        <button onClick={() => goto("social")} className="mt-6 px-6 py-3 rounded-lg font-semibold" style={{ background: C.purple, color: "#fff" }}>
          Explore the community feed
        </button>
      </section>

      <Footer dark={dark} />
    </div>
  );
}

function Footer({ dark }) {
  return (
    <footer className="px-6 md:px-12 py-8 text-center text-sm" style={{ color: dark ? C.textDarkMuted : C.textLightMuted, borderTop: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}>
      © 2026 FUTURE DEV by Lester P. Bucio Jr. All rights reserved
    </footer>
  );
}

// ============================================================
// PAGE: AUTH (login / signup / forgot)
// ============================================================
function AuthPage({ mode, setMode, dark, goto }) {
  const bg = dark ? C.bgDark : C.bgLight;
  const text = dark ? C.white : C.bgDark;
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const [name, setName] = useState("");

  return (
    <div style={{ background: bg, color: text, fontFamily: "Inter, sans-serif" }} className="min-h-screen flex flex-col">
      <div className="px-6 py-5"><button onClick={() => goto("landing")}><Logo dark={dark} size={22} /></button></div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm p-7 rounded-2xl" style={{ background: surface, border: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}>
          {mode === "forgot" ? (
            <>
              <h1 className="font-bold text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Reset your password</h1>
              <p className="text-sm mb-5" style={{ color: muted }}>Enter your email and we'll send a reset link.</p>
              <Field icon={Mail} placeholder="Email address" />
              <button onClick={() => setMode("login")} className="w-full mt-2 py-2.5 rounded-lg font-semibold" style={{ background: C.purple, color: "#fff" }}>Send reset link</button>
              <button onClick={() => setMode("login")} className="w-full mt-4 text-sm" style={{ color: muted }}>Back to log in</button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm mb-5" style={{ color: muted }}>
                {mode === "login" ? "Log in to continue learning." : "Start with your first lesson today."}
              </p>
              {mode === "signup" && <Field icon={User} placeholder="Full name" value={name} onChange={setName} />}
              <Field icon={Mail} placeholder="Email address" />
              <Field icon={Lock} placeholder="Password" type="password" />
              <button onClick={() => goto("dashboard", name || "Coder")} className="w-full mt-2 py-2.5 rounded-lg font-semibold" style={{ background: C.cyan, color: C.bgDarker }}>
                {mode === "login" ? "Log in" : "Sign up"}
              </button>
              <div className="flex items-center justify-between mt-4 text-sm">
                {mode === "login" ? (
                  <>
                    <button onClick={() => setMode("forgot")} style={{ color: muted }}>Forgot password?</button>
                    <button onClick={() => setMode("signup")} style={{ color: C.cyan }}>Create account</button>
                  </>
                ) : (
                  <button onClick={() => setMode("login")} style={{ color: C.cyan }} className="mx-auto">Already have an account? Log in</button>
                )}
              </div>
              {mode === "signup" && (
                <p className="text-xs mt-4 text-center" style={{ color: muted }}>
                  A verification link will be sent to confirm your email.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, placeholder, type = "text", value, onChange }) {
  return (
    <label className="flex items-center gap-2 mb-3 px-3 py-2.5 rounded-lg" style={{ border: "1px solid #33455F" }}>
      <Icon size={16} className="opacity-60" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        className="bg-transparent outline-none text-sm w-full placeholder:opacity-60"
      />
    </label>
  );
}

// ============================================================
// SHARED APP SHELL (dashboard / course / social / admin)
// ============================================================
function AppShell({ dark, setDark, page, goto, userName, isAdmin, children }) {
  const bg = dark ? C.bgDark : C.bgLight;
  const text = dark ? C.white : C.bgDark;
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const [mobileNav, setMobileNav] = useState(false);

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "course", label: "Courses", icon: BookOpen },
    { id: "social", label: "Feed", icon: Users },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: ShieldCheck }] : []),
  ];

  return (
    <div style={{ background: bg, color: text, fontFamily: "Inter, sans-serif" }} className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 shrink-0 p-5 flex-col justify-between transition-transform md:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"} md:flex`}
        style={{ background: surface, borderRight: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => goto("landing")}><Logo dark={dark} size={20} /></button>
            <button className="md:hidden" onClick={() => setMobileNav(false)}><X size={20} /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map(n => (
              <button
                key={n.id}
                onClick={() => { goto(n.id); setMobileNav(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: page === n.id ? C.purple : "transparent", color: page === n.id ? "#fff" : text, opacity: page === n.id ? 1 : 0.8 }}
              >
                <n.icon size={17} /> {n.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-80"><Settings size={17} /> Settings</button>
          <button onClick={() => goto("landing")} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-80"><LogOut size={17} /> Log out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-4 md:px-8 py-4 sticky top-0 z-20 backdrop-blur-md" style={{ background: dark ? "rgba(10,25,47,0.85)" : "rgba(244,246,251,0.85)", borderBottom: `1px solid ${dark ? "#1E3A5F" : "#E3E8F2"}` }}>
          <button className="md:hidden" onClick={() => setMobileNav(true)}><Menu size={22} /></button>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-md" style={{ background: dark ? C.bgDark : "#EDF0F7" }}>
            <Search size={15} className="opacity-60" />
            <input placeholder="Search lessons, posts, users..." className="bg-transparent outline-none text-sm w-full placeholder:opacity-60" />
          </label>
          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle dark={dark} setDark={setDark} />
            <button className="relative"><Bell size={19} /><span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: C.cyan }} /></button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, color: C.bgDarker }}>
              {(userName || "C")[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: DASHBOARD
// ============================================================
function Dashboard({ dark, userName, goto }) {
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const border = dark ? "#1E3A5F" : "#E3E8F2";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${C.purple}, #4C2FBF)` }}>
        <h1 className="font-bold text-2xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
          Welcome back, {userName || "Coder"}! Continue learning Java →
        </h1>
        <p className="text-white/80 mt-2 text-sm max-w-md">You're on Module 2: Control Flow. 12 lessons left to your Java certificate.</p>
        <button onClick={() => goto("course", null, "java")} className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: C.cyan, color: C.bgDarker }}>
          Resume lesson
        </button>
        <div className="absolute right-6 top-6 hidden sm:block opacity-20"><Code2 size={90} color="#fff" /></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Points", value: "3,980", icon: Star },
          { label: "Badges", value: "3", icon: Award },
          { label: "Day streak", value: "7", icon: Flame },
          { label: "Progress", value: "64%", icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background: surface, border: `1px solid ${border}` }}>
            <s.icon size={16} style={{ color: C.cyan }} />
            <p className="text-xl font-bold mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</p>
            <p className="text-xs" style={{ color: muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress + badges */}
        <div className="md:col-span-2 p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Your badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BADGES.map(b => (
              <div key={b.id} className="flex flex-col items-center text-center p-3 rounded-xl" style={{ opacity: b.earned ? 1 : 0.35, background: dark ? C.bgDark : "#EDF0F7" }}>
                <b.icon size={22} style={{ color: b.earned ? C.cyan : muted }} />
                <p className="text-xs mt-2">{b.name}</p>
              </div>
            ))}
          </div>
          <h2 className="font-semibold mt-6 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Continue a course</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {COURSES.map(c => (
              <button key={c.id} onClick={() => goto("course", null, c.id)} className="flex items-center justify-between p-3 rounded-lg" style={{ background: dark ? C.bgDark : "#EDF0F7" }}>
                <span className="text-sm font-medium">{c.name}</span>
                <ChevronRight size={16} style={{ color: muted }} />
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}><Trophy size={16} style={{ color: C.cyan }} /> Daily challenge leaderboard</h2>
          <div className="flex flex-col gap-2">
            {LEADERBOARD.map(l => (
              <div key={l.rank} className="flex items-center justify-between text-sm py-1.5" style={{ color: l.isYou ? C.cyan : "inherit", fontWeight: l.isYou ? 600 : 400 }}>
                <span>{l.rank}. {l.name}</span>
                <span>{l.points.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: COURSE (lesson + editor + quiz)
// ============================================================
function CoursePage({ dark, courseId = "java", setCourseId }) {
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const border = dark ? "#1E3A5F" : "#E3E8F2";
  const lesson = LESSONS[courseId] || LESSONS.java;
  const courseMeta = COURSES.find(c => c.id === courseId) || COURSES[4];

  const [code, setCode] = useState(lesson.starterCode);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState("notes");
  const [qIndex, setQIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [score, setScore] = useState(0);

  // reset lesson state whenever the learner switches language
  useEffect(() => {
    setCode(lesson.starterCode);
    setOutput(null);
    setQIndex(0);
    setQuizAnswer(null);
    setScore(0);
    setTab("notes");
  }, [courseId]);

  function runCode() {
    setRunning(true);
    setOutput(null);
    setTimeout(() => { setOutput(lesson.output); setRunning(false); }, 700);
  }

  function pickAnswer(i) {
    if (quizAnswer !== null) return; // lock in the first choice
    setQuizAnswer(i);
    if (i === lesson.quiz[qIndex].correct) setScore(s => s + 1);
  }
  function nextQuestion() {
    setQIndex(q => q + 1);
    setQuizAnswer(null);
  }
  function retakeQuiz() {
    setQIndex(0);
    setQuizAnswer(null);
    setScore(0);
  }

  const modules = ["Basics", "Control Flow", "Loops", "OOP", "Exercises", "Final Project"];
  const practiceForCourse = PRACTICE_PROBLEMS.filter(p => p.course === courseId);
  const q = lesson.quiz[qIndex];
  const quizDone = qIndex >= lesson.quiz.length;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Language switcher — pick any of the six courses */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {COURSES.map(c => (
          <Pill key={c.id} active={c.id === courseId} onClick={() => setCourseId && setCourseId(c.id)}>{c.name}</Pill>
        ))}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Module list */}
        <div className="p-4 rounded-2xl h-fit" style={{ background: surface, border: `1px solid ${border}` }}>
          <p className="text-xs font-semibold mb-3" style={{ color: muted }}>{courseMeta.name.toUpperCase()} — MODULES</p>
          <div className="flex flex-col gap-1">
            {modules.map((m, i) => (
              <div key={m} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm" style={{ background: i === 1 ? C.purple : "transparent", color: i === 1 ? "#fff" : "inherit", opacity: i === 1 ? 1 : 0.75 }}>
                {i < 1 ? <CheckCircle2 size={14} style={{ color: C.cyan }} /> : <span className="w-3.5 h-3.5 rounded-full border inline-block" style={{ borderColor: muted }} />}
                {m}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1"><span>Progress</span><span>64%</span></div>
            <div className="w-full h-1.5 rounded-full" style={{ background: dark ? "#1E3A5F" : "#E3E8F2" }}>
              <div className="h-1.5 rounded-full" style={{ width: "64%", background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})` }} />
            </div>
          </div>
        </div>

        {/* Lesson + editor */}
        <div className="flex flex-col gap-6 min-w-0">
          <div className="p-5 md:p-6 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
            <p className="text-xs font-semibold" style={{ color: C.cyan }}>{lesson.module}</p>
            <h1 className="font-bold text-2xl mt-1 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>{lesson.title}</h1>
            <div className="flex gap-2 mb-4">
              <Pill active={tab === "notes"} onClick={() => setTab("notes")}>Notes</Pill>
              <Pill active={tab === "quiz"} onClick={() => setTab("quiz")}>Quiz</Pill>
              <Pill active={tab === "practice"} onClick={() => setTab("practice")}>Practice</Pill>
            </div>

            {tab === "notes" && (
              <>
                <ul className="flex flex-col gap-2 text-sm" style={{ color: muted }}>
                  {lesson.notes.map((n, i) => <li key={i} className="flex gap-2"><span style={{ color: C.purple }}>—</span>{n}</li>)}
                </ul>
                <button className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: C.cyan }}>
                  <Download size={14} /> Download lesson notes (PDF)
                </button>
              </>
            )}

            {tab === "quiz" && (
              quizDone ? (
                <div className="flex flex-col gap-3 items-start">
                  <p className="text-sm">You scored <span className="font-semibold" style={{ color: C.cyan }}>{score} / {lesson.quiz.length}</span> on this module's quiz.</p>
                  <button onClick={retakeQuiz} className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: C.purple, color: "#fff" }}>Retake quiz</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs" style={{ color: muted }}>Question {qIndex + 1} of {lesson.quiz.length}</p>
                  <p className="text-sm">{q.q}</p>
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const chosen = quizAnswer === i;
                    const revealed = quizAnswer !== null;
                    return (
                      <button
                        key={i}
                        onClick={() => pickAnswer(i)}
                        className="text-left text-sm px-3 py-2.5 rounded-lg border"
                        style={{
                          borderColor: revealed && isCorrect ? "#3DDC97" : chosen ? "#F06565" : border,
                          background: revealed && isCorrect ? (dark ? "#0F3A36" : "#E6FFFB") : chosen ? (dark ? "#3A1418" : "#FDEBEB") : "transparent",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                  {quizAnswer !== null && (
                    <>
                      <p className="text-sm" style={{ color: quizAnswer === q.correct ? "#3DDC97" : "#F06565" }}>
                        {quizAnswer === q.correct ? "Correct! " : "Not quite. "}{q.explain}
                      </p>
                      <button onClick={nextQuestion} className="self-start text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: C.cyan, color: C.bgDarker }}>
                        {qIndex + 1 === lesson.quiz.length ? "See score" : "Next question"}
                      </button>
                    </>
                  )}
                </div>
              )
            )}

            {tab === "practice" && (
              <div className="flex flex-col gap-2">
                <p className="text-sm mb-1" style={{ color: muted }}>Beginner-friendly problems to practice what you just learned.</p>
                {practiceForCourse.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: dark ? C.bgDark : "#EDF0F7" }}>
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs" style={{ color: muted }}>{p.difficulty}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: muted }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="rounded-2xl overflow-hidden" style={{ background: C.bgDarker, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid #1E3A5F" }}>
              <span className="text-xs" style={{ color: C.textDarkMuted, fontFamily: "'Fira Code', monospace" }}>Try it yourself — {courseMeta.name}</span>
              <button onClick={runCode} disabled={running} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md" style={{ background: C.cyan, color: C.bgDarker }}>
                <Play size={12} /> {running ? "Running..." : "Run"}
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="w-full bg-transparent outline-none text-sm p-4 text-white resize-none"
              style={{ fontFamily: "'Fira Code', monospace", minHeight: 220, lineHeight: 1.6 }}
            />
            <div className="px-4 py-3 text-sm whitespace-pre-wrap" style={{ borderTop: "1px solid #1E3A5F", color: output ? "#3DDC97" : C.textDarkMuted, fontFamily: "'Fira Code', monospace", minHeight: 44 }}>
              {output ? `> ${output}` : "// Output console"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: SOCIAL FEED
// ============================================================
function SocialPage({ dark }) {
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const border = dark ? "#1E3A5F" : "#E3E8F2";
  const [posts, setPosts] = useState(FEED_SEED);
  const [draft, setDraft] = useState("");

  function react(id, key) {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, [key]: p[key] + 1 } : p));
  }
  function submitPost() {
    if (!draft.trim()) return;
    setPosts(ps => [{ id: Date.now(), name: "You", handle: "@you", time: "now", text: draft, code: null, lang: null, likes: 0, hearts: 0, fires: 0, comments: 0, tag: null }, ...ps]);
    setDraft("");
  }

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_260px] gap-6">
      <div className="flex flex-col gap-4">
        {/* Composer */}
        <div className="p-4 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Share progress, ask a question, or paste a code snippet..."
            className="w-full bg-transparent outline-none text-sm resize-none placeholder:opacity-60"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-3" style={{ color: muted }}>
              <ImageIcon size={17} /> <Code2 size={17} />
            </div>
            <button onClick={submitPost} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: C.purple, color: "#fff" }}>
              <Send size={14} /> Post
            </button>
          </div>
        </div>

        {/* Feed */}
        {posts.map(p => (
          <div key={p.id} className="p-4 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, color: C.bgDarker }}>
                {p.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{p.name} <span className="font-normal opacity-60">{p.handle} · {p.time}</span></p>
              </div>
            </div>
            <p className="text-sm mt-3">{p.text}</p>
            {p.tag && <span className="text-xs" style={{ color: C.cyan }}>{p.tag}</span>}
            {p.code && (
              <pre className="mt-3 p-3 rounded-lg text-xs overflow-x-auto" style={{ background: C.bgDarker, color: "#e5e7eb", fontFamily: "'Fira Code', monospace" }}>
                {p.code}
              </pre>
            )}
            <div className="flex items-center gap-5 mt-4 text-sm" style={{ color: muted }}>
              <button onClick={() => react(p.id, "likes")} className="flex items-center gap-1.5"><Heart size={15} /> {p.likes}</button>
              <button onClick={() => react(p.id, "hearts")} className="flex items-center gap-1.5">💜 {p.hearts}</button>
              <button onClick={() => react(p.id, "fires")} className="flex items-center gap-1.5"><Flame size={15} /> {p.fires}</button>
              <button className="flex items-center gap-1.5 ml-auto"><MessageCircle size={15} /> {p.comments}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4 h-fit">
        <div className="p-4 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Trending</h3>
          <div className="flex flex-wrap gap-2">
            {TRENDING.map(t => <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: dark ? C.bgDark : "#EDF0F7", color: C.cyan }}>{t}</span>)}
          </div>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}><Bot size={15} style={{ color: C.cyan }} /> Ask AI Tutor</h3>
          <p className="text-xs" style={{ color: muted }}>Stuck on something? Describe the bug and get a walkthrough.</p>
          <button className="mt-3 w-full text-sm font-semibold py-2 rounded-lg" style={{ background: C.cyan, color: C.bgDarker }}>Open chat</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: ADMIN
// ============================================================
function AdminPage({ dark }) {
  const muted = dark ? C.textDarkMuted : C.textLightMuted;
  const surface = dark ? C.surfaceDark : C.surfaceLight;
  const border = dark ? "#1E3A5F" : "#E3E8F2";
  const [users, setUsers] = useState(USERS_ADMIN);

  function toggleBan(id) {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
  }
  function removeUser(id) {
    setUsers(us => us.filter(u => u.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-bold text-2xl mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Admin panel</h1>
      <p className="text-sm mb-6" style={{ color: muted }}>Signed in as Lester P. Bucio Jr. — Owner</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total users", value: "1,284" },
          { label: "Active today", value: "342" },
          { label: "Posts today", value: "58" },
          { label: "Open reports", value: "3" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background: surface, border: `1px solid ${border}` }}>
            <p className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</p>
            <p className="text-xs" style={{ color: muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Weekly active users</h2>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={WEEKLY_ACTIVE}>
                <CartesianGrid stroke={dark ? "#1E3A5F" : "#E3E8F2"} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={muted} fontSize={12} />
                <YAxis stroke={muted} fontSize={12} />
                <Tooltip contentStyle={{ background: C.bgDarker, border: "none", color: "#fff" }} />
                <Line type="monotone" dataKey="users" stroke={C.cyan} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: surface, border: `1px solid ${border}` }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Manage users</h2>
          <div className="flex flex-col gap-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${border}` }}>
                <div>
                  <p className="text-sm font-medium">{u.name} {u.admin && <span className="text-xs" style={{ color: C.cyan }}>(Owner)</span>}</p>
                  <p className="text-xs" style={{ color: muted }}>{u.email} · {u.posts} posts</p>
                </div>
                {!u.admin && (
                  <div className="flex gap-2">
                    <button onClick={() => toggleBan(u.id)} title="Ban / unban" className="p-1.5 rounded-md" style={{ color: u.status === "banned" ? "#F06565" : muted }}><Ban size={15} /></button>
                    <button onClick={() => removeUser(u.id)} title="Delete" className="p-1.5 rounded-md" style={{ color: muted }}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl mt-6" style={{ background: surface, border: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>Courses</h2>
          <button className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: C.purple, color: "#fff" }}><Plus size={14} /> New course</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COURSES.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: dark ? C.bgDark : "#EDF0F7" }}>
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-xs" style={{ color: muted }}>{c.lessons} lessons</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [userName, setUserName] = useState("Coder");
  const [activeCourse, setActiveCourse] = useState("java");
  const isAdmin = userName.toLowerCase().includes("lester");

  function goto(target, name, courseId) {
    if (name) setUserName(name);
    if (courseId) setActiveCourse(courseId);
    if (target === "login" || target === "signup") { setAuthMode(target); setPage("auth"); }
    else setPage(target);
    window.scrollTo?.(0, 0);
  }

  const shellPages = ["dashboard", "course", "social", "admin"];

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fd-blink { 50% { opacity: 0; } }
        * { box-sizing: border-box; }
      `}</style>

      {/* quick demo role switch, since there's no real auth behind this prototype */}
      <div className="fixed bottom-3 right-3 z-50 flex gap-2 text-xs">
        <button onClick={() => setUserName("Coder")} className="px-3 py-1.5 rounded-full font-medium" style={{ background: !isAdmin ? C.purple : "#33455F", color: "#fff" }}>Demo: User</button>
        <button onClick={() => setUserName("Lester")} className="px-3 py-1.5 rounded-full font-medium" style={{ background: isAdmin ? C.purple : "#33455F", color: "#fff" }}>Demo: Admin (Lester)</button>
      </div>

      {page === "landing" && <Landing dark={dark} setDark={setDark} goto={goto} />}
      {page === "auth" && <AuthPage mode={authMode} setMode={setAuthMode} dark={dark} goto={goto} />}
      {shellPages.includes(page) && (
        <AppShell dark={dark} setDark={setDark} page={page} goto={goto} userName={userName} isAdmin={isAdmin}>
          {page === "dashboard" && <Dashboard dark={dark} userName={userName} goto={goto} />}
          {page === "course" && <CoursePage dark={dark} courseId={activeCourse} setCourseId={id => goto("course", null, id)} />}
          {page === "social" && <SocialPage dark={dark} />}
          {page === "admin" && (isAdmin ? <AdminPage dark={dark} /> : <Dashboard dark={dark} userName={userName} goto={goto} />)}
        </AppShell>
      )}
    </div>
  );
}
