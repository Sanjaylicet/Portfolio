/* ==========================================================================
   Windows XP Retro JS Engine
   Handles Logon, Draggable Window Management, Theme Switching, Clock,
   Calendar, Sound FX, Run Dialog, and the Minesweeper Easter Egg.
   ========================================================================== */

// 1. Project Data
const PROJECTS_DATA = {
    "lstmpredict": {
        title: "LSTMpredict",
        desc: "Deep learning stock market forecasting system using LSTM, GRU, and Transformers. Developed during an Infosys Springboard Internship. Compares predictive efficiency across deep learning architectures and renders real-time trend charts.",
        demo: "https://sanjayinfosys.vercel.app/",
        github: "https://github.com/Sanjaylicet/StockTrendAI-Stock-Market-Forecasting-Model",
        tech: ["LSTM", "GRU", "Transformers", "Python", "Keras", "Stock Forecast"]
    },
    "chronos-kit": {
        title: "Chronos-Kit",
        desc: "TypeScript integration SDK designed for the Hedera Hashgraph network. Streamlines transaction scheduling, chronological state transitions, ledger communication, and quick dApp prototype assembly.",
        demo: "https://chronos-kit.vercel.app/",
        github: "https://github.com/Sanjaylicet/Chronos-Kit",
        tech: ["TypeScript", "Hedera SDK", "Web3", "NodeJS"]
    },
    "taskops": {
        title: "TaskOps",
        desc: "Highly secure file-sharing system featuring one-time download links, end-to-end data encryption, and automated file-expiration. Secured First Place at the Kriya'25 national engineering hackathon.",
        demo: "https://taskops-one-time-file-sharing.vercel.app/",
        github: "https://github.com/Sanjaylicet/Taskops-One-Time-File-Sharing",
        tech: ["Next.js", "Tailwind CSS", "AES-256", "Supabase", "Hackathon Winner"]
    },
    "novavault": {
        title: "NovaVault",
        desc: "A cross-chain DeFi smart wallet unifying USDC liquidity using Circle's CCTP. Implements ENS domain routing and a unique guardian-based social recovery system that allows secure wallet recovery even after forgetting passwords.",
        demo: "https://nova-vault-ten.vercel.app/",
        github: "https://github.com/Sanjaylicet/NovaVault",
        tech: ["React", "Solidity", "Circle CCTP", "MPC Wallet", "Social Recovery"]
    },
    "gamepayx": {
        title: "Gamepayx",
        desc: "A decentralized gaming assets transaction store built with the Avail Nexus SDK for true cross-chain item ownership. Purchase assets on one chain and utilize them across all supported networks via Avail's DA layer.",
        demo: "https://gamepayx-j00ljy0dv-sanjay-s-projects-49dd4896.vercel.app/",
        github: "https://github.com/Sanjaylicet/Payx",
        tech: ["NextJS", "Avail Nexus", "Smart Contracts", "Ethers", "Cross-chain Assets"]
    },
    "zombie-invasion": {
        title: "Zombie Invasion",
        desc: "An action-packed retro 2D side-scrolling platformer survival game built from scratch using HTML5 Canvas. Fight zombie waves, gather power-ups, manage weapons, and pass through multiple difficulty stages.",
        demo: "https://sailorsanjay.itch.io/zombie-invasion",
        github: "https://github.com/Sanjaylicet/Zombie-Invasion-2D",
        tech: ["HTML5 Canvas", "JavaScript", "Game Physics", "Itch.io"]
    },
    "typeninja": {
        title: "TYPENINJA",
        desc: "A slick, interactive speed-typing training application. Provides real-time calculations for WPM (words per minute), keystroke accuracy percentages, visual keystroke heatmaps, and customizable lesson lengths.",
        demo: "https://typeninja.vercel.app/",
        github: "https://github.com/Sanjaylicet/TypeNinja",
        tech: ["HTML5", "CSS Grid", "JS State Engine", "Typing Physics"]
    }
};

// 2. State & Audio Selectors
let activeZIndex = 100;
const openWindows = new Set();
let clickCount = 0;
let doubleClickTimeout = null;

const sndStartup = document.getElementById('snd-startup');
const sndShutdown = document.getElementById('snd-shutdown');
const sndOpen = document.getElementById('snd-open');

function playSound(audioEl) {
    if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play().catch(err => console.log("Audio play blocked by browser security policy: ", err));
    }
}

// 3. System Tray Clock and Dynamic Date Setup
function updateClock() {
    const timeEl = document.getElementById('tray-clock-text');
    const calTimeEl = document.getElementById('cal-current-time');
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    
    const timeStr = `${hours}:${minutes} ${ampm}`;
    const secondsTimeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
    
    if (timeEl) timeEl.textContent = timeStr;
    if (calTimeEl) calTimeEl.textContent = secondsTimeStr;
}

// 4. Windows XP Style Logon Sequence
document.addEventListener('DOMContentLoaded', () => {
    // Clock setup
    updateClock();
    setInterval(updateClock, 1000);
    
    // Logon interaction
    const logonScreen = document.getElementById('logon-screen');
    const logonBtn = document.getElementById('logon-user-btn');
    const logonShutdown = document.getElementById('logon-shutdown');
    
    if (logonBtn) {
        logonBtn.addEventListener('click', () => {
            playSound(sndStartup);
            logonScreen.style.opacity = '0';
            setTimeout(() => {
                logonScreen.classList.add('hidden');
                // Open Welcome window as automatic OS boot popup
                setTimeout(() => {
                    openWindow('win-my-computer');
                }, 800);
            }, 600);
        });
    }

    if (logonShutdown) {
        logonShutdown.addEventListener('click', () => {
            triggerShutdown();
        });
    }
    
    // Set up dragging listeners
    initDragging();
    
    // Set up start menu triggers
    initStartMenu();
    
    // Set up double-clicks / mobile single-taps for desktop icons
    initDesktopIcons();
    
    // System calendar tray trigger
    initCalendarWidget();
    
    // Window control buttons behavior
    initWindowControlButtons();
    
    // Theme Customizer event listeners
    initThemeSwitcher();
    
    // Outlook mail client Send button
    initOutlookMail();
    
    // Minesweeper loader
    initMinesweeper();
    initMediaPlayer();
    
    // File downloads (Resume Wordpad PDF download)
    const downloadPdfBtn = document.getElementById('btn-download-pdf');
    const downloadPdfBtnBottom = document.getElementById('btn-download-resume-bottom');
    const handleDownload = () => {
        window.open('Sanjay resume.pdf', '_blank');
    };
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', handleDownload);
    }
    if (downloadPdfBtnBottom) {
        downloadPdfBtnBottom.addEventListener('click', handleDownload);
    }
    
    // Outlook run button
    const sysRunBtn = document.getElementById('sys-run-btn');
    if (sysRunBtn) {
        sysRunBtn.addEventListener('click', () => {
            closeStartMenu();
            openWindow('win-run');
        });
    }
    
    // Run dialog submit handlers
    const runBtnOk = document.getElementById('run-btn-ok');
    const runBtnCancel = document.getElementById('run-btn-cancel');
    const runCommandInput = document.getElementById('run-command-input');
    
    if (runBtnCancel) {
        runBtnCancel.addEventListener('click', () => closeWindow('win-run'));
    }
    if (runBtnOk && runCommandInput) {
        runBtnOk.addEventListener('click', () => handleRunSubmit(runCommandInput.value));
        runCommandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleRunSubmit(runCommandInput.value);
        });
    }
    
    // Right column external links
    document.getElementById('places-lnk-linkedin').addEventListener('click', () => window.open('https://www.linkedin.com/in/sanjayjaya2004', '_blank'));
    document.getElementById('places-lnk-github').addEventListener('click', () => window.open('https://github.com/Sanjaylicet', '_blank'));
    document.getElementById('start-ie-link').addEventListener('click', () => { closeStartMenu(); window.open('https://github.com/Sanjaylicet', '_blank'); });
    document.getElementById('sys-item-linkedin').addEventListener('click', () => { closeStartMenu(); window.open('https://www.linkedin.com/in/sanjayjaya2004', '_blank'); });

    // Desktop Internet Explorer Link
    const desktopIe = document.getElementById('desktop-ie-link');
    if (desktopIe) {
        desktopIe.addEventListener('dblclick', () => {
            window.open('https://github.com/Sanjaylicet', '_blank');
        });
        desktopIe.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                window.open('https://github.com/Sanjaylicet', '_blank');
            } else {
                desktopIe.focus();
            }
        });
    }

    // Desktop Photography Link
    const desktopPhotography = document.getElementById('desktop-photography-link');
    if (desktopPhotography) {
        desktopPhotography.addEventListener('dblclick', () => {
            window.open('https://drive.google.com/drive/folders/151144cSArk8go-_5YWoJYFOvVRHCqKzR?usp=sharing', '_blank');
        });
        desktopPhotography.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                window.open('https://drive.google.com/drive/folders/151144cSArk8go-_5YWoJYFOvVRHCqKzR?usp=sharing', '_blank');
            } else {
                desktopPhotography.focus();
            }
        });
    }

    // Recycle bin emptier
    const emptyBinBtn = document.getElementById('btn-empty-bin');
    if (emptyBinBtn) {
        emptyBinBtn.addEventListener('click', () => {
            playSound(sndOpen);
            document.getElementById('recycle-bin-list').classList.add('hidden');
            document.getElementById('empty-bin-msg').classList.remove('hidden');
        });
    }
});

// 5. Window Dragging Engine (Mouse + Touch Support)
let isDragging = false;
let dragWin = null;
let startX = 0, startY = 0;
let winLeft = 0, winTop = 0;

function initDragging() {
    document.addEventListener('mousedown', (e) => {
        const titleBar = e.target.closest('.xp-window-title-bar');
        if (!titleBar) return;
        
        const win = titleBar.closest('.xp-window');
        if (!win || win.classList.contains('maximized')) return;
        if (window.innerWidth <= 768) return; // Disable drag on mobile layout
        
        isDragging = true;
        dragWin = win;
        makeActive(win);
        
        startX = e.clientX;
        startY = e.clientY;
        
        winLeft = win.offsetLeft;
        winTop = win.offsetTop;
        
        document.body.classList.add('dragging-active');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !dragWin) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = winLeft + deltaX;
        let newTop = winTop + deltaY;
        
        // Clamp top to avoid header going off-screen
        if (newTop < 0) newTop = 0;
        
        dragWin.style.left = `${newLeft}px`;
        dragWin.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            dragWin = null;
            document.body.classList.remove('dragging-active');
        }
    });

    // Touch Drag Support for Tablets
    document.addEventListener('touchstart', (e) => {
        const titleBar = e.target.closest('.xp-window-title-bar');
        if (!titleBar) return;
        
        const win = titleBar.closest('.xp-window');
        if (!win || win.classList.contains('maximized')) return;
        if (window.innerWidth <= 768) return;
        
        isDragging = true;
        dragWin = win;
        makeActive(win);
        
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        winLeft = win.offsetLeft;
        winTop = win.offsetTop;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || !dragWin) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        let newLeft = winLeft + deltaX;
        let newTop = winTop + deltaY;
        
        if (newTop < 0) newTop = 0;
        
        dragWin.style.left = `${newLeft}px`;
        dragWin.style.top = `${newTop}px`;
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            dragWin = null;
        }
    });
}

// 6. Window Open, Close, Minimize, Maximize state manager
function openWindow(winId) {
    if (winId === 'win-zombieinvasion') {
        window.open('https://sailorsanjay.itch.io/zombie-invasion', '_blank');
        return;
    }
    const win = document.getElementById(winId);
    if (!win) return;
    
    playSound(sndOpen);
    win.classList.remove('hidden');
    makeActive(win);
    
    // Initialize starting position in pixels to prevent jumping/resizing during first drag
    if (win.style.left && win.style.left.includes('%')) {
        const leftPx = win.offsetLeft;
        const topPx = win.offsetTop;
        win.style.left = `${leftPx}px`;
        win.style.top = `${topPx}px`;
    }
    
    if (!openWindows.has(winId)) {
        openWindows.add(winId);
        createTaskbarTab(winId);
    } else {
        // If minimized, restore it
        win.style.display = 'flex';
        // Re-align position to pixels in case layout changed
        if (win.style.left && win.style.left.includes('%')) {
            const leftPx = win.offsetLeft;
            const topPx = win.offsetTop;
            win.style.left = `${leftPx}px`;
            win.style.top = `${topPx}px`;
        }
    }
}

function closeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    
    win.classList.add('hidden');
    openWindows.delete(winId);
    removeTaskbarTab(winId);
    
    // Stop Media Player playback if closed
    if (winId === 'win-mediaplayer' && typeof stopPlayback === 'function') {
        stopPlayback();
    }
}

function minimizeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    
    win.style.display = 'none'; // hide but keep in DOM and openWindows set
    const tab = document.querySelector(`.taskbar-tab[data-window-id="${winId}"]`);
    if (tab) tab.classList.remove('active');
}

function toggleMaximize(winId) {
    const win = document.getElementById(winId);
    if (!win) return;
    
    win.classList.toggle('maximized');
}

function makeActive(win) {
    // Remove active style from all windows
    document.querySelectorAll('.xp-window').forEach(w => {
        w.classList.remove('active-window');
    });
    
    // Add active style to target window
    win.classList.add('active-window');
    
    // Boost z-index
    activeZIndex += 1;
    win.style.zIndex = activeZIndex;
    
    // Highlight taskbar tab
    document.querySelectorAll('.taskbar-tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.taskbar-tab[data-window-id="${win.id}"]`);
    if (tab) tab.classList.add('active');
}

// 7. Taskbar Tabs Synchronizer
const taskbarTabsContainer = document.getElementById('taskbar-tabs-container');

function createTaskbarTab(winId) {
    const win = document.getElementById(winId);
    if (!win || !taskbarTabsContainer) return;
    
    const title = win.querySelector('.xp-window-title span').textContent;
    
    const tab = document.createElement('div');
    tab.className = 'taskbar-tab active';
    tab.setAttribute('data-window-id', winId);
    tab.textContent = title;
    
    tab.addEventListener('click', () => {
        if (win.style.display === 'none') {
            // Restore window
            win.style.display = 'flex';
            makeActive(win);
        } else if (win.classList.contains('active-window')) {
            // If already active and clicked, minimize it
            minimizeWindow(winId);
        } else {
            // Make active
            makeActive(win);
        }
    });
    
    taskbarTabsContainer.appendChild(tab);
}

function removeTaskbarTab(winId) {
    const tab = document.querySelector(`.taskbar-tab[data-window-id="${winId}"]`);
    if (tab) tab.remove();
}

// 8. Start Menu Controls
const startBtn = document.getElementById('start-btn-trigger');
const startMenu = document.getElementById('start-menu');

function initStartMenu() {
    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startMenu.classList.toggle('hidden');
        });
        
        startMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        document.addEventListener('click', () => {
            closeStartMenu();
        });
    }
    
    // Shutdown links in Start menu
    const logoffBtn = document.getElementById('start-btn-logoff');
    const shutdownBtn = document.getElementById('start-btn-shutdown');
    
    if (logoffBtn) {
        logoffBtn.addEventListener('click', () => {
            closeStartMenu();
            // Show Logon screen again
            document.getElementById('logon-screen').classList.remove('hidden');
            document.getElementById('logon-screen').style.opacity = '1';
        });
    }
    
    if (shutdownBtn) {
        shutdownBtn.addEventListener('click', () => {
            closeStartMenu();
            triggerShutdown();
        });
    }
}

function closeStartMenu() {
    if (startMenu) startMenu.classList.add('hidden');
}

// 9. Shutdown sequence triggers
const shutdownScreen = document.getElementById('shutdown-screen');
const blackScreen = document.getElementById('black-screen');
const btnCancelShutdown = document.getElementById('btn-cancel-shutdown');
const btnTurnOff = document.getElementById('btn-turnoff');
const btnRestart = document.getElementById('btn-restart');
const btnReboot = document.getElementById('btn-reboot');

function triggerShutdown() {
    if (shutdownScreen) {
        shutdownScreen.classList.remove('hidden');
    }
}

if (btnCancelShutdown) {
    btnCancelShutdown.addEventListener('click', () => {
        shutdownScreen.classList.add('hidden');
    });
}

if (btnTurnOff) {
    btnTurnOff.addEventListener('click', () => {
        playSound(sndShutdown);
        shutdownScreen.classList.add('hidden');
        blackScreen.classList.remove('hidden');
    });
}

if (btnRestart) {
    btnRestart.addEventListener('click', () => {
        playSound(sndShutdown);
        shutdownScreen.classList.add('hidden');
        blackScreen.classList.remove('hidden');
        document.querySelector('.off-message p').textContent = "Rebooting system...";
        setTimeout(() => {
            location.reload();
        }, 3000);
    });
}

if (btnReboot) {
    btnReboot.addEventListener('click', () => {
        location.reload();
    });
}

// 10. Desktop Icons Clicks (Double-Click on Desktop, Single tap on mobile)
function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        // Support double click on desktop
        icon.addEventListener('dblclick', () => {
            const winId = icon.getAttribute('data-window');
            openWindow(winId);
        });

        // Mobile touch friendly check (Double-tap registers as single-tap if width is small)
        icon.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const winId = icon.getAttribute('data-window');
                openWindow(winId);
            } else {
                // Emulate single click highlighting
                icon.focus();
            }
        });
    });
    
    // Bind click handlers for projects inside Explorer Folder content grid
    document.querySelectorAll('#projects-grid .folder-item').forEach(item => {
        const projId = item.getAttribute('data-project-id');
        
        item.addEventListener('dblclick', () => {
            openProjectWindow(projId);
        });
        
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                openProjectWindow(projId);
            }
        });
    });
}

// 11. Custom Window Controls Actions
function initWindowControlButtons() {
    document.querySelectorAll('.xp-window').forEach(win => {
        const minimizeBtn = win.querySelector('.xp-btn-minimize');
        const maximizeBtn = win.querySelector('.xp-btn-maximize');
        const closeBtn = win.querySelector('.xp-btn-close');
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => minimizeWindow(win.id));
        }
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => toggleMaximize(win.id));
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeWindow(win.id));
        }
        
        // Window body focusing
        win.addEventListener('mousedown', () => {
            makeActive(win);
        });
        win.addEventListener('touchstart', () => {
            makeActive(win);
        }, {passive: true});
    });
}

// 12. Customizable Taskbar Themes Selector
function initThemeSwitcher() {
    const cards = document.querySelectorAll('.theme-option-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const theme = card.getAttribute('data-theme-val');
            
            // Set data theme on html element
            document.documentElement.setAttribute('data-theme', theme);
            
            // Toggle selection state
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            playSound(sndOpen);
        });
    });
}

// 13. Outlook Express Email Send Mock Action
function initOutlookMail() {
    const outlookSend = document.getElementById('btn-outlook-send');
    if (outlookSend) {
        outlookSend.addEventListener('click', () => {
            const subject = document.getElementById('contact-subject').value;
            const body = document.getElementById('contact-body').value;
            
            if (!body.trim()) {
                alert("Please type a message before sending!");
                return;
            }
            
            const mailtoUri = `mailto:sanjay.27csb@licet.ac.in?subject=${encodeURIComponent(subject || 'Inquiry')}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUri;
            
            closeWindow('win-contact');
            alert("Mock Outlook Express: Message queued! Redirecting to your mail client...");
        });
    }
}

// 14. Run Dialog Commands Parsing
function handleRunSubmit(cmd) {
    if (!cmd) return;
    
    const command = cmd.toLowerCase().trim();
    closeWindow('win-run');
    document.getElementById('run-command-input').value = '';
    
    if (command === 'minesweeper' || command === 'mine' || command === 'winmine') {
        openWindow('win-minesweeper');
    } else if (command === 'zombie' || command === 'zombieinvasion') {
        openWindow('win-zombieinvasion');
    } else if (command === 'notepad' || command === 'wordpad' || command === 'resume') {
        openWindow('win-resume');
    } else if (command === 'projects' || command === 'documents' || command === 'my documents') {
        openWindow('win-projects');
    } else if (command === 'shutdown' || command === 'off') {
        triggerShutdown();
    } else if (command === 'settings' || command === 'control' || command === 'control panel') {
        openWindow('win-settings');
    } else if (command === 'contact' || command === 'outlook' || command === 'mail') {
        openWindow('win-contact');
    } else if (command === 'computer' || command === 'my computer') {
        openWindow('win-my-computer');
    } else if (command === 'wmplayer' || command === 'media' || command === 'music' || command === 'player' || command === 'wmp') {
        openWindow('win-mediaplayer');
    } else if (command === 'photography' || command === 'photos' || command === 'camera') {
        window.open('https://drive.google.com/drive/folders/151144cSArk8go-_5YWoJYFOvVRHCqKzR?usp=sharing', '_blank');
    } else {
        // Show XP error message dialog
        alert(`Windows cannot find '${cmd}'. Make sure you typed the name correctly, and then try again.`);
    }
}

// 15. Calendar Tray Widget Setup
let calendarInitialized = false;

function initCalendarWidget() {
    const trigger = document.getElementById('tray-clock-trigger');
    const winCal = document.getElementById('win-calendar');
    
    if (trigger && winCal) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (winCal.classList.contains('hidden')) {
                openWindow('win-calendar');
                if (!calendarInitialized) {
                    initCalendarCore();
                    calendarInitialized = true;
                }
            } else {
                closeWindow('win-calendar');
            }
        });
        
        // Prevent close calendar clicking inside window body
        winCal.addEventListener('click', (e) => e.stopPropagation());
    }
}

function initCalendarCore() {
    const monthSelect = document.getElementById('cal-month-select');
    const yearInput = document.getElementById('cal-year-input');
    
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    
    monthSelect.value = currentMonth;
    yearInput.value = currentYear;
    
    renderCalendarGrid(currentMonth, currentYear);
    
    monthSelect.addEventListener('change', () => {
        renderCalendarGrid(parseInt(monthSelect.value), parseInt(yearInput.value));
    });
    
    yearInput.addEventListener('input', () => {
        renderCalendarGrid(parseInt(monthSelect.value), parseInt(yearInput.value));
    });
}

function renderCalendarGrid(month, year) {
    const daysBody = document.getElementById('calendar-days-body');
    if (!daysBody) return;
    daysBody.innerHTML = '';
    
    const now = new Date();
    const isCurrentMonthYear = (now.getMonth() === month && now.getFullYear() === year);
    const todayDate = now.getDate();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Monday is index 0 in our layout: M T W T F S S (Sunday is index 6, Saturday is 5)
    // getDay() yields: Sunday=0, Monday=1, ... Saturday=6
    let startingOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let cellCount = 1;
    let row = document.createElement('tr');
    
    // Fill initial empty offset cells
    for (let i = 0; i < startingOffset; i++) {
        const td = document.createElement('td');
        td.className = 'empty-day';
        row.appendChild(td);
        cellCount++;
    }
    
    // Fill dates
    for (let day = 1; day <= daysInMonth; day++) {
        if (cellCount > 7) {
            daysBody.appendChild(row);
            row = document.createElement('tr');
            cellCount = 1;
        }
        
        const td = document.createElement('td');
        td.textContent = day;
        
        if (isCurrentMonthYear && day === todayDate) {
            td.className = 'today';
        }
        
        row.appendChild(td);
        cellCount++;
    }
    
    // Append remaining days offset
    if (cellCount <= 7) {
        for (let i = cellCount; i <= 7; i++) {
            const td = document.createElement('td');
            td.className = 'empty-day';
            row.appendChild(td);
        }
        daysBody.appendChild(row);
    }
}

// 16. Dynamic Sub-Window Project Modals Manager
function openProjectWindow(projId) {
    const data = PROJECTS_DATA[projId];
    if (!data) return;
    
    const customWinId = `win-proj-detail-${projId}`;
    let existingWin = document.getElementById(customWinId);
    
    if (existingWin) {
        openWindow(customWinId);
        return;
    }
    
    // Create new modal window element dynamically
    const win = document.createElement('div');
    win.id = customWinId;
    win.className = 'xp-window active-window';
    win.style.width = '520px';
    win.style.height = '340px';
    win.style.top = `${15 + (Math.random() * 15)}%`;
    win.style.left = `${20 + (Math.random() * 20)}%`;
    
    // Title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'xp-window-title-bar';
    titleBar.innerHTML = `
        <div class="xp-window-title">
            <img src="myprojectsicon.png" alt="" width="16" height="16" class="title-icon">
            <span>Project: ${data.title} Properties</span>
        </div>
        <div class="xp-window-controls">
            <button class="xp-btn-minimize" aria-label="Minimize"></button>
            <button class="xp-btn-maximize" aria-label="Maximize"></button>
            <button class="xp-btn-close" aria-label="Close"></button>
        </div>
    `;
    win.appendChild(titleBar);
    
    // Menu tab headers (Properties look)
    const tabsBar = document.createElement('div');
    tabsBar.className = 'project-details-tabs';
    tabsBar.innerHTML = `
        <button class="project-tab-btn active" data-tab="general">General</button>
        <button class="project-tab-btn" data-tab="links">Target URLs</button>
    `;
    win.appendChild(tabsBar);
    
    // Window Content Frame
    const content = document.createElement('div');
    content.className = 'xp-window-body';
    
    // General Tab Pane
    const paneGeneral = document.createElement('div');
    paneGeneral.className = 'tab-pane active';
    paneGeneral.id = `pane-gen-${projId}`;
    
    // Badges builder
    let badgesHtml = '';
    data.tech.forEach(t => {
        badgesHtml += `<span class="tech-badge">${t}</span>`;
    });
    
    paneGeneral.innerHTML = `
        <div class="project-general-info">
            <div class="project-main-icon">🚀</div>
            <div class="project-meta">
                <h2>${data.title}</h2>
                <div class="project-tech-badges">${badgesHtml}</div>
            </div>
        </div>
        <div class="project-description">${data.desc}</div>
        <div class="project-action-buttons">
            <button class="xp-btn xp-btn-primary btn-tab-to-links">Next &gt;</button>
        </div>
    `;
    content.appendChild(paneGeneral);
    
    // Links Tab Pane
    const paneLinks = document.createElement('div');
    paneLinks.className = 'tab-pane';
    paneLinks.id = `pane-links-${projId}`;
    paneLinks.innerHTML = `
        <div style="padding: 10px 0; margin-bottom: 25px;">
            <p><strong>Deployment URL:</strong></p>
            <p><a href="${data.demo}" target="_blank" style="color: #0054e3; word-break: break-all;">${data.demo}</a></p>
            <br>
            <p><strong>Source Repository:</strong></p>
            <p><a href="${data.github}" target="_blank" style="color: #0054e3; word-break: break-all;">${data.github}</a></p>
        </div>
        <div class="project-action-buttons">
            <button class="xp-btn xp-btn-primary btn-open-demo">Live Demo</button>
            <button class="xp-btn btn-open-github">GitHub Repo</button>
            <button class="xp-btn btn-close-custom">OK</button>
        </div>
    `;
    content.appendChild(paneLinks);
    win.appendChild(content);
    
    // Append to container
    document.getElementById('windows-container').appendChild(win);
    
    // Convert percentage layout to pixels on mount to prevent drag stretching/shifting
    if (win.style.left && win.style.left.includes('%')) {
        const leftPx = win.offsetLeft;
        const topPx = win.offsetTop;
        win.style.left = `${leftPx}px`;
        win.style.top = `${topPx}px`;
    }
    
    // Track in state
    openWindows.add(customWinId);
    createTaskbarTab(customWinId);
    makeActive(win);
    
    // Window control buttons listeners inside generated window
    win.querySelector('.xp-btn-minimize').addEventListener('click', () => minimizeWindow(customWinId));
    win.querySelector('.xp-btn-maximize').addEventListener('click', () => toggleMaximize(customWinId));
    win.querySelector('.xp-btn-close').addEventListener('click', () => {
        closeWindow(customWinId);
        win.remove();
    });
    win.addEventListener('mousedown', () => makeActive(win));
    win.addEventListener('touchstart', () => makeActive(win), {passive: true});
    
    // Tab switching inside project modal
    const tabButtons = tabsBar.querySelectorAll('.project-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const target = btn.getAttribute('data-tab');
            if (target === 'general') {
                paneGeneral.classList.add('active');
                paneLinks.classList.remove('active');
            } else {
                paneGeneral.classList.remove('active');
                paneLinks.classList.add('active');
            }
        });
    });
    
    // Next/Forward action inside General tab
    paneGeneral.querySelector('.btn-tab-to-links').addEventListener('click', () => {
        tabButtons[1].click();
    });
    
    // External buttons trigger
    paneLinks.querySelector('.btn-open-demo').addEventListener('click', () => {
        window.open(data.demo, '_blank');
    });
    paneLinks.querySelector('.btn-open-github').addEventListener('click', () => {
        window.open(data.github, '_blank');
    });
    paneLinks.querySelector('.btn-close-custom').addEventListener('click', () => {
        closeWindow(customWinId);
        win.remove();
    });
    
    playSound(sndOpen);
}

// 17. Minesweeper Easter Egg Implementation
let minesGridSize = 9;
let mineCount = 10;
let minesMatrix = [];
let minesRevealed = [];
let minesFlagged = [];
let minesTimer = null;
let minesTimeElapsed = 0;
let minesStarted = false;
let minesGameOver = false;

function initMinesweeper() {
    const smileBtn = document.getElementById('mines-smiley');
    const restartMines = document.getElementById('btn-restart-mines');
    
    if (smileBtn) {
        smileBtn.addEventListener('click', resetMinesweeperGame);
    }
    if (restartMines) {
        restartMines.addEventListener('click', () => {
            closeStartMenu();
            resetMinesweeperGame();
        });
    }
    
    // Difficulty selector
    const diffBtn = document.getElementById('btn-difficulty-mines');
    if (diffBtn) {
        diffBtn.addEventListener('click', () => {
            closeStartMenu();
            const res = prompt("Enter difficulty level:\n1 - Easy (9x9, 10 mines)\n2 - Medium (12x12, 20 mines)\n3 - Hard (15x15, 35 mines)", "1");
            if (res === "1" || res === null) {
                minesGridSize = 9;
                mineCount = 10;
            } else if (res === "2") {
                minesGridSize = 12;
                mineCount = 20;
            } else if (res === "3") {
                minesGridSize = 15;
                mineCount = 35;
            }
            
            const board = document.getElementById('mines-grid-board');
            if (board) {
                board.style.gridTemplateColumns = `repeat(${minesGridSize}, 18px)`;
                board.style.gridTemplateRows = `repeat(${minesGridSize}, 18px)`;
                
                const winMines = document.getElementById('win-minesweeper');
                if (winMines) {
                    winMines.style.width = `${18 * minesGridSize + 48}px`;
                    winMines.style.height = `${18 * minesGridSize + 140}px`;
                }
            }
            resetMinesweeperGame();
        });
    }
    
    resetMinesweeperGame();
}

function resetMinesweeperGame() {
    // Clear timer
    clearInterval(minesTimer);
    minesTimer = null;
    minesTimeElapsed = 0;
    minesStarted = false;
    minesGameOver = false;
    
    const flagDisplay = document.getElementById('mines-flag-count');
    const timerDisplay = document.getElementById('mines-timer');
    const smiley = document.getElementById('mines-smiley');
    const board = document.getElementById('mines-grid-board');
    
    if (flagDisplay) flagDisplay.textContent = mineCount.toString().padStart(3, '0');
    if (timerDisplay) timerDisplay.textContent = "000";
    if (smiley) smiley.textContent = "😊";
    
    if (!board) return;
    board.innerHTML = '';
    
    // Matrix builders
    minesMatrix = Array(minesGridSize).fill().map(() => Array(minesGridSize).fill(0));
    minesRevealed = Array(minesGridSize).fill().map(() => Array(minesGridSize).fill(false));
    minesFlagged = Array(minesGridSize).fill().map(() => Array(minesGridSize).fill(false));
    
    // Place mines randomly
    let placed = 0;
    while (placed < mineCount) {
        const r = Math.floor(Math.random() * minesGridSize);
        const c = Math.floor(Math.random() * minesGridSize);
        if (minesMatrix[r][c] !== 'M') {
            minesMatrix[r][c] = 'M';
            placed++;
        }
    }
    
    // Calculate numbers
    for (let r = 0; r < minesGridSize; r++) {
        for (let c = 0; c < minesGridSize; c++) {
            if (minesMatrix[r][c] === 'M') continue;
            let adjacentMines = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < minesGridSize && nc >= 0 && nc < minesGridSize) {
                        if (minesMatrix[nr][nc] === 'M') adjacentMines++;
                    }
                }
            }
            minesMatrix[r][c] = adjacentMines;
        }
    }
    
    // Render Grid Cells
    for (let r = 0; r < minesGridSize; r++) {
        for (let c = 0; c < minesGridSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            
            // Events
            cell.addEventListener('mousedown', (e) => handleCellClick(e, r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(r, c);
            });
            
            // Touch flag support on long-press (mobile friendly)
            let touchtimer;
            cell.addEventListener('touchstart', (e) => {
                touchtimer = setTimeout(() => {
                    handleCellRightClick(r, c);
                }, 600); // 600ms hold to flag
            }, {passive: true});
            cell.addEventListener('touchend', () => {
                clearTimeout(touchtimer);
            });
            
            board.appendChild(cell);
        }
    }
}

function startMinesTimer() {
    minesTimer = setInterval(() => {
        minesTimeElapsed++;
        if (minesTimeElapsed > 999) minesTimeElapsed = 999;
        const display = document.getElementById('mines-timer');
        if (display) display.textContent = minesTimeElapsed.toString().padStart(3, '0');
    }, 1000);
}

function handleCellClick(e, r, c) {
    if (minesGameOver) return;
    if (e.button === 2) return; // Right clicks handled separately
    if (minesFlagged[r][c]) return; // Cannot click flagged cells
    
    const smiley = document.getElementById('mines-smiley');
    if (smiley) smiley.textContent = "😮";
    
    setTimeout(() => {
        if (!minesGameOver) {
            if (smiley) smiley.textContent = "😊";
        }
    }, 150);
    
    if (!minesStarted) {
        minesStarted = true;
        // Make sure first click is never a mine
        if (minesMatrix[r][c] === 'M') {
            // Relocate mine
            minesMatrix[r][c] = 0;
            let relocated = false;
            while (!relocated) {
                const nr = Math.floor(Math.random() * minesGridSize);
                const nc = Math.floor(Math.random() * minesGridSize);
                if (minesMatrix[nr][nc] !== 'M' && (nr !== r || nc !== c)) {
                    minesMatrix[nr][nc] = 'M';
                    relocated = true;
                }
            }
            
            // Recalculate grid numbers
            for (let row = 0; row < minesGridSize; row++) {
                for (let col = 0; col < minesGridSize; col++) {
                    if (minesMatrix[row][col] === 'M') continue;
                    let adj = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const adjR = row + dr;
                            const adjC = col + dc;
                            if (adjR >= 0 && adjR < minesGridSize && adjC >= 0 && adjC < minesGridSize) {
                                if (minesMatrix[adjR][adjC] === 'M') adj++;
                            }
                        }
                    }
                    minesMatrix[row][col] = adj;
                }
            }
        }
        startMinesTimer();
    }
    
    revealCell(r, c);
}

function handleCellRightClick(r, c) {
    if (minesGameOver || minesRevealed[r][c]) return;
    
    minesFlagged[r][c] = !minesFlagged[r][c];
    const cell = document.querySelector(`.mine-cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return;
    
    if (minesFlagged[r][c]) {
        cell.classList.add('flagged');
    } else {
        cell.classList.remove('flagged');
    }
    
    // Update flag count display
    const currentFlags = document.querySelectorAll('.mine-cell.flagged').length;
    const remaining = mineCount - currentFlags;
    const flagDisplay = document.getElementById('mines-flag-count');
    if (flagDisplay) flagDisplay.textContent = Math.max(0, remaining).toString().padStart(3, '0');
}

function revealCell(r, c) {
    if (r < 0 || r >= minesGridSize || c < 0 || c >= minesGridSize) return;
    if (minesRevealed[r][c] || minesFlagged[r][c]) return;
    
    minesRevealed[r][c] = true;
    const cell = document.querySelector(`.mine-cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return;
    
    cell.classList.add('revealed');
    
    const val = minesMatrix[r][c];
    
    if (val === 'M') {
        // Exploded! Game over
        gameOver(r, c);
        return;
    } else if (val > 0) {
        cell.textContent = val;
        cell.className = `mine-cell revealed mine-n-${val}`;
    } else {
        // Zero value cell -> cascade reveal neighbors
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                revealCell(r + dr, c + dc);
            }
        }
    }
    
    checkWinCondition();
}

function gameOver(explodedR, explodedC) {
    minesGameOver = true;
    clearInterval(minesTimer);
    
    const smiley = document.getElementById('mines-smiley');
    if (smiley) smiley.textContent = "😵";
    
    // Reveal all mines
    for (let r = 0; r < minesGridSize; r++) {
        for (let c = 0; c < minesGridSize; c++) {
            const cell = document.querySelector(`.mine-cell[data-row="${r}"][data-col="${c}"]`);
            if (!cell) continue;
            
            if (minesMatrix[r][c] === 'M') {
                cell.classList.add('revealed');
                cell.style.backgroundColor = (r === explodedR && c === explodedC) ? '#ff3c00' : '#bdbdbd';
                cell.innerHTML = '💣';
            } else if (minesFlagged[r][c]) {
                // Incorrect flag
                cell.innerHTML = '❌';
            }
        }
    }
}

function checkWinCondition() {
    let revealedCount = 0;
    for (let r = 0; r < minesGridSize; r++) {
        for (let c = 0; c < minesGridSize; c++) {
            if (minesRevealed[r][c]) revealedCount++;
        }
    }
    
    const target = minesGridSize * minesGridSize - mineCount;
    if (revealedCount === target) {
        minesGameOver = true;
        clearInterval(minesTimer);
        const smiley = document.getElementById('mines-smiley');
        if (smiley) smiley.textContent = "😎";
        
        // Flag all remaining mines
        for (let r = 0; r < minesGridSize; r++) {
            for (let c = 0; c < minesGridSize; c++) {
                if (minesMatrix[r][c] === 'M' && !minesFlagged[r][c]) {
                    const cell = document.querySelector(`.mine-cell[data-row="${r}"][data-col="${c}"]`);
                    if (cell) cell.classList.add('flagged');
                }
            }
        }
        
        const flagDisplay = document.getElementById('mines-flag-count');
        if (flagDisplay) flagDisplay.textContent = "000";
        alert("Congratulations! You won Minesweeper!");
    }
}

// 18. Windows Media Player Retro Application
let wmpSongs = [];
let wmpCurrentIndex = 0;
let wmpAudio = new Audio();
let wmpIsPlaying = false;
let wmpIsMuted = false;

async function loadPlaylistFromMusicFolder() {
    const defaultSongs = [
        {
            url: 'music/Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3',
            filename: 'Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3',
            title: 'Sunflower (Spider-Man: Into the Spider-Verse)',
            artist: 'Post Malone, Swae Lee'
        },
        {
            url: 'music/Spider-Man_ Across the Spider-Verse _ _Annihilate_ by Metro Boomin x Swae Lee x Lil Wayne x Offset.mp3',
            filename: 'Spider-Man_ Across the Spider-Verse _ _Annihilate_ by Metro Boomin x Swae Lee x Lil Wayne x Offset.mp3',
            title: 'Annihilate (Spider-Man: Across the Spider-Verse)',
            artist: 'Metro Boomin, Swae Lee, Lil Wayne, Offset'
        },
        {
            url: 'music/Lady Gaga, Bruno Mars - Die With A Smile.mp3',
            filename: 'Lady Gaga, Bruno Mars - Die With A Smile.mp3',
            title: 'Die With A Smile',
            artist: 'Lady Gaga, Bruno Mars'
        },
        {
            url: 'music/Spider-Man_ Across the Spider-Verse _ _Am I Dreaming_ Metro Boomin x A$AP Rocky x Roisee _ .mp3',
            filename: 'Spider-Man_ Across the Spider-Verse _ _Am I Dreaming_ Metro Boomin x A$AP Rocky x Roisee _ .mp3',
            title: 'Am I Dreaming',
            artist: 'Metro Boomin, A$AP Rocky, Roisee'
        },
        {
            url: 'music/The Weeknd - Blinding Lights.mp3',
            filename: 'The Weeknd - Blinding Lights.mp3',
            title: 'Blinding Lights',
            artist: 'The Weeknd'
        }
    ];

    // On static hosting like Vercel, directory indexing is disabled by default.
    // Only attempt dynamic folder scan when running on local dev servers to prevent console 404 warnings.
    const isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]'
    );

    if (!isLocalhost) {
        return defaultSongs;
    }

    try {
        const response = await fetch('music/');
        if (!response.ok) return defaultSongs;
        const htmlText = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const songs = [];
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.toLowerCase().endsWith('.mp3')) {
                const decodedName = decodeURIComponent(href);
                const filename = decodedName.split('/').pop();
                
                // Parse artist and title from filename
                let artist = 'Unknown Artist';
                let title = filename.replace(/\.[^/.]+$/, ""); // remove extension
                if (title.includes(' - ')) {
                    const parts = title.split(' - ');
                    artist = parts[0].trim();
                    title = parts[1].trim();
                }
                
                // Cleanup trailing numbers and brackets from dynamic filename scan
                title = title.replace(/\s+\d+$/, "")
                             .replace(/[\s_]*(?:\(Official\s+Music\s+Video\)|\(Official\s+Video\)|_\s*Lyrics|\s*Lyrics)\s*/gi, "")
                             .replace(/_ _Am I Dreaming_/gi, "Am I Dreaming")
                             .trim();
                artist = artist.replace(/_ _Am I Dreaming_/gi, "Metro Boomin")
                               .replace(/\s+\d+$/, "")
                               .trim();
                
                songs.push({
                    url: 'music/' + href,
                    filename: filename,
                    title: title,
                    artist: artist
                });
            }
        });
        
        return songs.length > 0 ? songs : defaultSongs;
    } catch (e) {
        return defaultSongs;
    }
}

async function initMediaPlayer() {
    const playBtn = document.getElementById('wmp-btn-play');
    const stopBtn = document.getElementById('wmp-btn-stop');
    const prevBtn = document.getElementById('wmp-btn-prev');
    const nextBtn = document.getElementById('wmp-btn-next');
    const progressBar = document.getElementById('wmp-progress-bar');
    const volumeBar = document.getElementById('wmp-volume-bar');
    const muteToggle = document.getElementById('wmp-mute-toggle');
    const songsList = document.getElementById('wmp-songs-list');
    const titleTxt = document.getElementById('wmp-title-txt');
    const artistTxt = document.getElementById('wmp-artist-txt');
    const timeCurrent = document.getElementById('wmp-time-current');
    const timeTotal = document.getElementById('wmp-time-total');
    
    if (!playBtn) return;
    
    // Set default volume
    wmpAudio.volume = volumeBar ? (parseFloat(volumeBar.value) / 100) : 0.8;
    
    // Load playlist
    wmpSongs = await loadPlaylistFromMusicFolder();
    
    // Render list
    renderPlaylist(songsList);
    
    // Select first song by default
    selectSong(0, false);
    
    // Controls binding
    playBtn.addEventListener('click', togglePlay);
    stopBtn.addEventListener('click', stopPlayback);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    
    if (muteToggle) {
        muteToggle.addEventListener('click', toggleMute);
    }
    
    if (volumeBar) {
        volumeBar.addEventListener('input', (e) => {
            wmpAudio.volume = parseFloat(e.target.value) / 100;
            wmpAudio.muted = false;
            wmpIsMuted = false;
            if (muteToggle) muteToggle.textContent = wmpAudio.volume === 0 ? "🔇" : "🔊";
        });
    }
    
    if (progressBar) {
        progressBar.addEventListener('input', (e) => {
            if (wmpAudio.duration) {
                wmpAudio.currentTime = (parseFloat(e.target.value) / 100) * wmpAudio.duration;
            }
        });
    }
    
    // Audio events
    wmpAudio.addEventListener('timeupdate', () => {
        if (wmpAudio.duration) {
            const progress = (wmpAudio.currentTime / wmpAudio.duration) * 100;
            if (progressBar) progressBar.value = progress;
            if (timeCurrent) timeCurrent.textContent = formatTime(wmpAudio.currentTime);
        }
    });
    
    wmpAudio.addEventListener('loadedmetadata', () => {
        if (timeTotal) timeTotal.textContent = formatTime(wmpAudio.duration);
    });
    
    wmpAudio.addEventListener('ended', () => {
        playNext();
    });
}

function formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function renderPlaylist(container) {
    if (!container) return;
    container.innerHTML = '';
    
    wmpSongs.forEach((song, idx) => {
        const li = document.createElement('li');
        li.className = `wmp-playlist-item ${idx === wmpCurrentIndex ? 'selected' : ''}`;
        li.id = `wmp-item-${idx}`;
        li.textContent = `${song.artist} - ${song.title}`;
        li.addEventListener('click', () => {
            selectSong(idx, true);
        });
        container.appendChild(li);
    });
}

function selectSong(idx, autoPlay = true) {
    if (idx < 0 || idx >= wmpSongs.length) return;
    
    const prevLi = document.getElementById(`wmp-item-${wmpCurrentIndex}`);
    if (prevLi) prevLi.classList.remove('selected');
    
    wmpCurrentIndex = idx;
    
    const curLi = document.getElementById(`wmp-item-${wmpCurrentIndex}`);
    if (curLi) curLi.classList.add('selected');
    
    const song = wmpSongs[wmpCurrentIndex];
    wmpAudio.src = song.url;
    
    const titleTxt = document.getElementById('wmp-title-txt');
    const artistTxt = document.getElementById('wmp-artist-txt');
    
    if (titleTxt) titleTxt.textContent = song.title;
    if (artistTxt) artistTxt.textContent = song.artist;
    
    const progressBar = document.getElementById('wmp-progress-bar');
    if (progressBar) progressBar.value = 0;
    const timeCurrent = document.getElementById('wmp-time-current');
    if (timeCurrent) timeCurrent.textContent = '0:00';
    
    if (autoPlay) {
        wmpAudio.play().then(() => {
            wmpIsPlaying = true;
            updatePlayBtnUI();
            const vizScreen = document.getElementById('wmp-viz-screen');
            if (vizScreen) vizScreen.classList.add('wmp-playing');
        }).catch(err => {
            console.warn("Playback failed:", err);
        });
    } else {
        wmpIsPlaying = false;
        updatePlayBtnUI();
        const vizScreen = document.getElementById('wmp-viz-screen');
        if (vizScreen) vizScreen.classList.remove('wmp-playing');
    }
}

function togglePlay() {
    const vizScreen = document.getElementById('wmp-viz-screen');
    if (wmpIsPlaying) {
        wmpAudio.pause();
        wmpIsPlaying = false;
        if (vizScreen) vizScreen.classList.remove('wmp-playing');
    } else {
        wmpAudio.play().then(() => {
            wmpIsPlaying = true;
            if (vizScreen) vizScreen.classList.add('wmp-playing');
        }).catch(err => {
            console.warn("Playback resumed failed:", err);
        });
    }
    updatePlayBtnUI();
}

function updatePlayBtnUI() {
    const playBtn = document.getElementById('wmp-btn-play');
    if (playBtn) {
        playBtn.textContent = wmpIsPlaying ? "⏸" : "▶";
        playBtn.title = wmpIsPlaying ? "Pause" : "Play";
    }
}

function stopPlayback() {
    wmpAudio.pause();
    wmpAudio.currentTime = 0;
    wmpIsPlaying = false;
    updatePlayBtnUI();
    const vizScreen = document.getElementById('wmp-viz-screen');
    if (vizScreen) vizScreen.classList.remove('wmp-playing');
    const progressBar = document.getElementById('wmp-progress-bar');
    if (progressBar) progressBar.value = 0;
    const timeCurrent = document.getElementById('wmp-time-current');
    if (timeCurrent) timeCurrent.textContent = '0:00';
}

function playPrev() {
    let nextIdx = wmpCurrentIndex - 1;
    if (nextIdx < 0) nextIdx = wmpSongs.length - 1;
    selectSong(nextIdx, true);
}

function playNext() {
    let nextIdx = wmpCurrentIndex + 1;
    if (nextIdx >= wmpSongs.length) nextIdx = 0;
    selectSong(nextIdx, true);
}

function toggleMute() {
    wmpIsMuted = !wmpIsMuted;
    wmpAudio.muted = wmpIsMuted;
    const muteToggle = document.getElementById('wmp-mute-toggle');
    const volumeBar = document.getElementById('wmp-volume-bar');
    
    if (muteToggle) {
        muteToggle.textContent = wmpIsMuted ? "🔇" : "🔊";
    }
    if (volumeBar) {
        volumeBar.value = wmpIsMuted ? 0 : Math.round(wmpAudio.volume * 100);
    }
}
