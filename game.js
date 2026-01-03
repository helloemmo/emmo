{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww30040\viewh15600\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const SECRET_PASSWORD = \'93Adamsdinner\'94; // Change this for your private group\
let currentSeed = "";\
let clickCount = 0;\
let startTime;\
let isFirstLoad = true;\
\
// 1. ACCESS CONTROL: Check URL for password or prompt user\
function checkAccess() \{\
    const urlParams = new URLSearchParams(window.location.search);\
    const urlPass = urlParams.get('pass');\
\
    if (urlPass === SECRET_PASSWORD) return; // Automatic entry via link\
\
    const userPass = prompt("Please enter your Invitation Code to play Bollo Game:");\
    if (userPass !== SECRET_PASSWORD) \{\
        document.body.innerHTML = "<div style='color:white;text-align:center;padding:100px;'><h1>
\f1 \uc0\u55357 \u56594 
\f0  Access Denied</h1><p>Ask the host for an invite link.</p></div>";\
        throw new Error("Access Denied");\
    \}\
\}\
checkAccess();\
\
// 2. SEED LOGIC\
function generateSeed() \{\
    const timestamp = Date.now();\
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();\
    currentSeed = `$\{randomStr\}-$\{timestamp\}`;\
    \
    document.getElementById('seed-display').innerText = `Seed Generated!`;\
    document.getElementById('seed-display').style.display = 'block';\
    document.getElementById('seed-input').value = currentSeed;\
    document.getElementById('play-btn').disabled = false;\
    document.getElementById('share-btn').style.display = 'inline-block';\
\}\
\
// 3. INVITE LINK GENERATOR\
async function shareSeed() \{\
    const baseUrl = window.location.href.split('?')[0];\
    const inviteUrl = `$\{baseUrl\}?seed=$\{currentSeed\}&pass=$\{SECRET_PASSWORD\}`;\
\
    if (navigator.share) \{\
        try \{\
            await navigator.share(\{ title: 'Bollo Game Challenge', text: 'Beat me to the target page!', url: inviteUrl \});\
        \} catch (err) \{ console.log("Share cancelled"); \}\
    \} else \{\
        navigator.clipboard.writeText(inviteUrl);\
        alert("Invite Link Copied! Send it to your friend.");\
    \}\
\}\
\
// 4. WAITING ROOM & VIBRATE\
function checkWaitingRoom() \{\
    const val = document.getElementById('seed-input').value.trim();\
    if (!val.includes('-')) return alert("Invalid Seed");\
    \
    const time = parseInt(val.split('-')[1]);\
    if (Date.now() - time > 3600000) return alert("This link has expired (1hr limit). Generate a new one!");\
\
    document.getElementById('start-screen').style.display = 'none';\
    document.getElementById('waiting-room').style.display = 'block';\
    if ("vibrate" in navigator) navigator.vibrate([300, 100, 300]);\
\}\
\
// 5. GAME ENGINE\
function startGame() \{\
    document.getElementById('waiting-room').style.display = 'none';\
    document.getElementById('game-window').style.display = 'block';\
    \
    const frame = document.getElementById('wiki-frame');\
    frame.src = "https://en.wikipedia.org/wiki/Special:Random";\
    \
    frame.onload = () => \{\
        if (!isFirstLoad) \{\
            clickCount++;\
            document.getElementById('click-display').innerText = `Clicks: $\{clickCount\}`;\
        \}\
        isFirstLoad = false;\
    \};\
\
    startTime = Date.now();\
    setInterval(() => \{\
        const elapsed = Math.floor((Date.now() - startTime) / 1000);\
        document.getElementById('timer-display').innerText = `Time: $\{elapsed\}s`;\
    \}, 1000);\
\}\
\
function checkWin() \{\
    const elapsed = Math.floor((Date.now() - startTime) / 1000);\
    alert(`RACE FINISHED!\\nTime: $\{elapsed\}s\\nClicks: $\{clickCount\}`);\
    saveScore(elapsed, clickCount);\
    location.reload(); // Returns to home\
\}\
\
// 6. LEADERBOARD\
function saveScore(t, c) \{\
    let s = JSON.parse(localStorage.getItem('bollo_scores')) || [];\
    s.push(\{t, c, d: new Date().toLocaleDateString()\});\
    s.sort((a,b) => a.c - b.c || a.t - b.t);\
    localStorage.setItem('bollo_scores', JSON.stringify(s.slice(0,5)));\
\}\
\
function toggleLeaderboard() \{\
    const container = document.getElementById('leaderboard-container');\
    const list = document.getElementById('leaderboard-list');\
    container.style.display = container.style.display === 'none' ? 'block' : 'none';\
    const s = JSON.parse(localStorage.getItem('bollo_scores')) || [];\
    list.innerHTML = s.map(x => `<li>$\{x.c\} Clicks | $\{x.t\}s ($\{x.d\})</li>`).join('') || "No scores yet!";\
\}\
\
function goHome() \{ location.reload(); \}\
\
// 7. AUTO-FILL SHARED SEED\
window.onload = () => \{\
    const urlParams = new URLSearchParams(window.location.search);\
    const sharedSeed = urlParams.get('seed');\
    if (sharedSeed) \{\
        document.getElementById('seed-input').value = sharedSeed;\
        document.getElementById('play-btn').disabled = false;\
    \}\
\};}