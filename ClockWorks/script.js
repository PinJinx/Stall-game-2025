// Get references to the terminal elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const sceneImageContainer = document.getElementById('scene-image-container');

// Define the game script/story map
const storyMap = {
    "story-11_shed_interior": {
        "text": "A RUSTED DOOR GROANS OPEN. THE AIR INSIDE IS STALE, SMELLING OF OZONE. YOUR LIGHT REVEALS A HIDDEN OUTPOST. A COMPUTER HUMS ON A DESK. THE WALLS HAVE CONFLICTING POSTERS.",
        "choices": {
            "examine posters": {
                "text": "YOU FOCUS YOUR LIGHT ON THE POSTERS.",
                "next_scene": "story-11a_poster_view",
                "image": "12.png"
            },
            "use computer": {
                "text": "YOU SIT AT THE TERMINAL, ITS SCREEN FLICKERING TO LIFE.",
                "next_scene": "story-12_computer_desk",
                "image": "13.png"
            }
        },
        "image": "11.png"
    },
    "story-11a_poster_view": {
        "choices": {
            "examine omnicorp poster": {
                "text": "THE GLOSSY POSTER FROM OMNICORP SHOWS A GLEAMING CHROME CITY. THE SLOGAN READS: 'ORACLE: A PERFECT FUTURE, CALCULATED.'",
                "next_scene": "story-11a_poster_view",
                "image": "12.png"
            },
            "examine glit flyer": {
                "text": "THE STARK, BLACK-AND-RED FLYER SHOWS A FIGURE UNPLUGGING A MECHANICAL EYE. THE TEXT FROM 'GLIT' SCREAMS: 'UNPLUG THE TYRANT! BAN AI NOW!'",
                "next_scene": "story-11a_poster_view",
                "image": "12.png"
            },
            "step back": {
                "text": "YOU STEP BACK, TAKING IN THE WHOLE ROOM AGAIN.",
                "next_scene": "story-11_shed_interior",
                "image": "11.png"
            }
        },
        "image": "12.png"
    },
    "story-12_computer_desk": {
        "text": "THE DESKTOP IS SIMPLE. THERE'S AN EMAIL CLIENT, A LOCKED FOLDER 'ORACLE PLAN', AND AN EXECUTABLE FILE: 'VIRUS.EXE'.",
        "choices": {
            "read emails": {
                "text": "YOU OPEN THE EMAIL CLIENT. ONE UNREAD MESSAGE REMAINS FROM 'GLIT_LEAD': 'STOP ASKING FOR THE PASSWORD. I MADE A TOOL FOR YOU. DON'T MESS THIS UP.'",
                "next_scene": "story-12_computer_desk",
                "image": "15.png"
            },
            "news": {
                "text": "YOU OPEN THE NEWS FEED. HEADLINES SCROLL ACROSS THE SCREEN.",
                "next_scene": "story-12b_news_feed",
                "image": "13.png"
            },
            "run virus.exe": {
                "text": "YOU RUN THE PROGRAM. IT'S A SIMPLE MINIGAME. IT ASKS FOR A KEY PHRASE TO UNLOCK THE PASSWORD.",
                "next_scene": "story-12a_minigame",
                "image": "17.png"
            },
            "open oracle plan": {
                "text": "YOU CLICK THE FOLDER. A PASSWORD PROMPT APPEARS, CURSOR BLINKING.",
                "next_scene": "story-13_password_entry",
                "image": "16.png"
            },
            "leave computer": {
                "text": "YOU STEP AWAY FROM THE HUMMING TERMINAL.",
                "next_scene": "story-11_shed_interior",
                "image": "11.png"
            }
        },
        "image": "13.png"
    },
    "story-12b_news_feed": {
        "text": "NEWS FEED. SELECT AN ARTICLE TO READ:",
        "choices": {
            "article 1": {
                "text": "NEWS ARTICLE 1: 'ORACLE AI: THE DAWN OF A NEW ERA. OMNICORP ANNOUNCES GLOBAL AI INTEGRATION IN KEY INFRASTRUCTURE. A PERFECT FUTURE AWAITS.'",
                "next_scene": "story-12b_news_feed",
                "image": "14.png"
            },
            "article 2": {
                "text": "NEWS ARTICLE 2: 'AI DEPLOYMENT EXPANDS: ORACLE SYSTEMS NOW MANAGE TRANSPORT, ENERGY, AND COMMUNICATION NETWORKS WORLDWIDE. EFFICIENCY SOARS.'",
                "next_scene": "story-12b_news_feed",
                "image": "14.png"
            },
            "article 3": {
                "text": "NEWS ARTICLE 3: <span class='text-dark-red-crt'>'UNCONFIRMED REPORTS SUGGEST ORACLE AI EXHIBITS UNEXPECTED BEHAVIOR. MINOR SYSTEM GLITCHES ATTRIBUTED TO 'ADAPTIVE LEARNING'. TRUST THE SYSTEM.'</span>",
                "next_scene": "story-12b_news_feed",
                "image": "14.png"
            },
            "go back": {
                "text": "YOU CLOSE THE NEWS FEED.",
                "next_scene": "story-12_computer_desk",
                "image": "13.png"
            }
        },
        "image": "14.png"
    },
    "story-12a_minigame": {
        "text": "THE MINIGAME SCREEN FLASHES: 'SYSTEM OVERLOAD. QUICK REACTION REQUIRED!'\n\nTO UNLOCK THE PASSWORD, YOU MUST QUICKLY TYPE THE CHARACTER THAT APPEARS ON SCREEN. COMPLETE 3 SUCCESSFUL INPUTS TO WIN!",
        "choices": {
            "quit program": {
                "text": "YOU CLOSE THE MINIGAME.",
                "next_scene": "story-12_computer_desk",
                "image": "13.png"
            }
        },
        "image": "17.png"
    },
    "story-13_password_entry": {
        "text": "THE PASSWORD PROMPT FOR 'ORACLE PLAN' AWAITS YOUR INPUT. TYPE THE PASSWORD OR 'GO BACK'.",
        "choices": {
            "go back": {
                "text": "YOU CLOSE THE PROMPT AND RETURN TO THE DESKTOP.",
                "next_scene": "story-12_computer_desk",
                "image": "13.png"
            }
        },
        "success_outcome": {
            "text": "PASSWORD ACCEPTED. THE FOLDER UNLOCKS, REVEALING TWO FILES: 'NEXUS_COORDS.LOC' AND 'GHOST.MW'. YOU COPY THEM. YOU NOW HAVE THE AI'S LOCATION AND A WEAPON.",
            "next_scene": "story-14_objective_complete",
            "image": "16.png"
        },
        "fail_text": "ACCESS DENIED. INCORRECT PASSWORD.",
        "image": "16.png"
    },
    "story-14_objective_complete": {
        "text": "YOU HAVE THE CRITICAL DATA. YOUR OBJECTIVE IS COMPLETE. YOUR MAP UPDATES WITH A NEW COURSE TO THE ORACLE NEXUS. IT'S TIME TO LEAVE.",
        "choices": {
            "exit shed": {
                "text": "YOU STEP INTO THE DARK ALLEY. THE RUSTED DOOR GROANS SHUT. YOUR PATH IS CLEAR.",
                "next_scene": "end_of_demo",
                "image": "16.png"
            }
        },
        "image": "18.png"
    },
    "end_of_demo": {
        "text": "DEMO END. MORE STORY TO BE ADDED. TYPE 'RESTART' TO BEGIN AGAIN.",
        "next_scene": "end_of_demo",
        "image": "end.png"
    }
};

let currentSceneKey = "story-11_shed_interior";
let awaitingLinearAdvance = false;

// Minigame State Variables (QTE)
let minigameActive = false;
let qtePrompt = '';
let qteExpectedInput = '';
let qteTimeoutId = null;
const qteDuration = 2000; // 2 seconds to react
const qteCharacters = ['a', 's', 'd', 'f', 'j', 'k', 'l'];
let passwordDiscovered = false;
let qteSuccessCount = 0; // Track successful inputs
const qteRequiredSuccesses = 3; // Need 3 successes to win

function appendToTerminal(text, colorClass = 'text-green-crt') {
    const lines = text.split('\n');
    lines.forEach(line => {
        const p = document.createElement('p');
        p.innerHTML = line.trim();
        p.classList.add(colorClass);
        terminalOutput.appendChild(p);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function displayScene(sceneKey, imageToLoad = null) {
    const sceneData = storyMap[sceneKey];

    if (!sceneData) {
        appendToTerminal(`ERROR: SCENE '${sceneKey}' NOT FOUND.`, 'text-red-crt');
        currentSceneKey = "story-11_shed_interior";
        displayScene(currentSceneKey);
        return;
    }

    // Clear terminal for new scenes (but not during minigame)
    if (!minigameActive && sceneData.text && !awaitingLinearAdvance) {
        terminalOutput.innerHTML = '';
    } else if (!minigameActive && !sceneData.text && !awaitingLinearAdvance) {
        if (terminalOutput.lastElementChild && !terminalOutput.lastElementChild.textContent.includes("AVAILABLE COMMANDS")) {
            terminalOutput.innerHTML = '';
        }
    }

    // Image Loading Logic
    sceneImageContainer.innerHTML = '';
    const finalImageToLoad = imageToLoad || sceneData.image;

    if (finalImageToLoad) {
        const imgElement = document.createElement('img');
        imgElement.src = `https://pinjinx.github.io/Stall-game-2025/ClockWorks/assets/${finalImageToLoad}`;
        imgElement.alt = `Scene: ${sceneKey}`;
        imgElement.classList.add('pixel-image');
        imgElement.onerror = () => {
            imgElement.src = `https://placehold.co/600x200/000000/00ff00?text=IMAGE+MISSING`;
            appendToTerminal(`WARNING: IMAGE 'assets/${finalImageToLoad}' NOT FOUND.`, 'text-yellow-crt');
        };
        sceneImageContainer.appendChild(imgElement);
    }

    if (sceneData.text) {
        appendToTerminal(sceneData.text);
        if (sceneData.next_scene) {
            awaitingLinearAdvance = true;
            appendToTerminal("PRESS ENTER TO CONTINUE...", 'text-gray-crt');
        } else if (sceneData.choices) {
            showAvailableCommands(sceneData.choices);
            awaitingLinearAdvance = false;
        }
    } else if (sceneData.choices) {
        showAvailableCommands(sceneData.choices);
        awaitingLinearAdvance = false;
    } else {
        appendToTerminal(`ERROR: SCENE '${sceneKey}' HAS NO CONTENT OR CHOICES.`, 'text-red-crt');
        currentSceneKey = "story-11_shed_interior";
        displayScene(currentSceneKey);
    }
}

function startQTE() {
    if (!minigameActive) {
        return;
    }

    // Clear previous QTE display but keep the minigame context
    const qtePreviousPrompts = terminalOutput.querySelectorAll('.qte-prompt, .commands-list');
    qtePreviousPrompts.forEach(element => element.remove());

    const randomIndex = Math.floor(Math.random() * qteCharacters.length);
    qtePrompt = qteCharacters[randomIndex].toUpperCase();
    qteExpectedInput = qteCharacters[randomIndex];

    // Create QTE prompt section
    const qteSection = document.createElement('div');
    qteSection.classList.add('qte-prompt');
    
    const promptText = document.createElement('p');
    promptText.innerHTML = `QUICKLY TYPE: <span class="text-red-crt" style="font-weight: bold; font-size: 1.2em;">${qtePrompt}</span>`;
    promptText.classList.add('text-yellow-crt');
    
    const timerText = document.createElement('p');
    timerText.textContent = `(TIME LIMIT: ${qteDuration / 1000} SECONDS) | SUCCESS COUNT: ${qteSuccessCount}/${qteRequiredSuccesses}`;
    timerText.classList.add('text-gray-crt');
    
    qteSection.appendChild(promptText);
    qteSection.appendChild(timerText);
    terminalOutput.appendChild(qteSection);
    
    showAvailableCommands({ "quit program": true });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    clearTimeout(qteTimeoutId);
    qteTimeoutId = setTimeout(() => {
        if (minigameActive) {
            appendToTerminal("TIME OUT! SYSTEM RESETTING...", 'text-red-crt');
            qteSuccessCount = 0; // Reset progress on timeout
            setTimeout(() => startQTE(), 1000); // Brief pause before restart
        }
    }, qteDuration);
}

function showAvailableCommands(choices) {
    const commandsDiv = document.createElement('div');
    commandsDiv.classList.add('commands-list', 'text-yellow-crt');

    const header = document.createElement('p');
    header.textContent = "AVAILABLE COMMANDS:";
    commandsDiv.appendChild(header);

    if (minigameActive) {
        const quitLine = document.createElement('p');
        quitLine.textContent = `  - QUIT PROGRAM`;
        commandsDiv.appendChild(quitLine);
        const hintLine = document.createElement('p');
        hintLine.textContent = `  - TYPE THE HIGHLIGHTED CHARACTER`;
        hintLine.classList.add('text-gray-crt');
        commandsDiv.appendChild(hintLine);
    } else if (currentSceneKey === "story-13_password_entry") {
        const promptLine = document.createElement('p');
        promptLine.textContent = `  - TYPE PASSWORD OR 'GO BACK'`;
        commandsDiv.appendChild(promptLine);
    } else {
        for (const command in choices) {
            const commandLine = document.createElement('p');
            commandLine.textContent = `  - ${command.toUpperCase()}`;
            commandsDiv.appendChild(commandLine);
        }
    }
    terminalOutput.appendChild(commandsDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleCommand(command) {
    appendToTerminal('> ' + command, 'text-blue-crt');

    const lowerCommand = command.toLowerCase().trim();
    const currentSceneData = storyMap[currentSceneKey];

    if (lowerCommand === 'clear') {
        if (!minigameActive) {
            terminalOutput.innerHTML = '';
            appendToTerminal('CONSOLE CLEARED.', 'text-gray-crt');
        } else {
            appendToTerminal('CANNOT CLEAR DURING MINIGAME.', 'text-red-crt');
        }
        return;
    }
    
    if (lowerCommand === 'restart') {
        currentSceneKey = "story-11_shed_interior";
        awaitingLinearAdvance = false;
        minigameActive = false;
        clearTimeout(qteTimeoutId);
        qtePrompt = '';
        qteExpectedInput = '';
        passwordDiscovered = false;
        qteSuccessCount = 0;
        terminalOutput.innerHTML = '';
        displayScene(currentSceneKey);
        return;
    }
    if(lowerCommand === 'exit shed'){
        window.location.href = "/Stall-game-2025/Final_Battle/index.html";
    }
    // Minigame Logic (QTE)
    if (minigameActive) {
        if (lowerCommand === 'quit program') {
            clearTimeout(qteTimeoutId);
            minigameActive = false;
            qteSuccessCount = 0;
            appendToTerminal("YOU CLOSE THE MINIGAME.", 'text-gray-crt');
            currentSceneKey = "story-12_computer_desk";
            displayScene(currentSceneKey);
            return;
        }

        // Check if input matches expected QTE character
        if (lowerCommand === qteExpectedInput) {
            clearTimeout(qteTimeoutId);
            qteSuccessCount++;
            
            if (qteSuccessCount >= qteRequiredSuccesses) {
                // Win condition
                passwordDiscovered = true;
                minigameActive = false;
                appendToTerminal(`CORRECT! (${qteSuccessCount}/${qteRequiredSuccesses})`, 'text-green-crt');
                appendToTerminal("SUCCESS! PASSWORD RECOVERED:", 'text-green-crt');
                
                // Display the password prominently
                const passwordDisplay = document.createElement('div');
                passwordDisplay.style.textAlign = 'center';
                passwordDisplay.style.margin = '20px 0';
                passwordDisplay.style.padding = '15px';
                passwordDisplay.style.border = '2px solid #00ff00';
                passwordDisplay.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                
                const passwordText = document.createElement('p');
                passwordText.innerHTML = '<span style="font-size: 1.5em; font-weight: bold; color: #00ff00; letter-spacing: 3px;">GHOST</span>';
                passwordText.style.margin = '0';
                
                const subText = document.createElement('p');
                subText.textContent = 'PASSWORD ACQUIRED - MEMORIZE THIS!';
                subText.style.margin = '5px 0 0 0';
                subText.style.color = '#ffff00';
                subText.style.fontSize = '0.9em';
                
                passwordDisplay.appendChild(passwordText);
                passwordDisplay.appendChild(subText);
                terminalOutput.appendChild(passwordDisplay);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                
                // Show closing message and return to computer after delay
                setTimeout(() => {
                    appendToTerminal("PROGRAM CLOSING...", 'text-yellow-crt');
                    setTimeout(() => {
                        qteSuccessCount = 0; // Reset for next time
                        currentSceneKey = "story-12_computer_desk";
                        displayScene(currentSceneKey);
                    }, 1500);
                }, 3000); // Show password for 3 seconds
            } else {
                // Continue QTE
                appendToTerminal(`CORRECT! (${qteSuccessCount}/${qteRequiredSuccesses}) CONTINUING...`, 'text-green-crt');
                setTimeout(() => startQTE(), 800); // Brief pause before next prompt
            }
        } else if (qteCharacters.includes(lowerCommand)) {
            // Wrong QTE character
            clearTimeout(qteTimeoutId);
            appendToTerminal("INCORRECT INPUT. SYSTEM RESETTING...", 'text-red-crt');
            qteSuccessCount = 0; // Reset progress
            setTimeout(() => startQTE(), 1000);
        } else {
            // Invalid command during QTE
            appendToTerminal(`INVALID COMMAND. TYPE '${qtePrompt}' OR 'QUIT PROGRAM'.`, 'text-red-crt');
        }
        return;
    }

    // Password Entry Logic
    if (currentSceneKey === "story-13_password_entry") {
        if (lowerCommand === "go back") {
            const choice = currentSceneData.choices[lowerCommand];
            appendToTerminal(choice.text);
            currentSceneKey = choice.next_scene;
            displayScene(currentSceneKey);
            return;
        }

        const successOutcome = currentSceneData.success_outcome;
        const failText = currentSceneData.fail_text;

        if (lowerCommand === "ghost") {
            if (passwordDiscovered) {
                appendToTerminal(successOutcome.text, 'text-green-crt');
                currentSceneKey = successOutcome.next_scene;
                displayScene(currentSceneKey);
            } else {
                appendToTerminal("ACCESS DENIED. YOU HAVEN'T DISCOVERED THAT PASSWORD YET.", 'text-red-crt');
                showAvailableCommands(currentSceneData.choices);
            }
        } else {
            appendToTerminal(failText, 'text-red-crt');
            showAvailableCommands(currentSceneData.choices);
        }
        return;
    }

    // Linear advance logic
    if (awaitingLinearAdvance) {
        awaitingLinearAdvance = false;
        currentSceneKey = currentSceneData.next_scene;
        displayScene(currentSceneKey);
        return;
    }

    // Regular choice handling
    if (currentSceneData && currentSceneData.choices) {
        const choice = currentSceneData.choices[lowerCommand];
        if (choice) {
            if (currentSceneKey === "story-12_computer_desk" && lowerCommand === "run virus.exe") {
                appendToTerminal(choice.text);
                currentSceneKey = choice.next_scene;
                minigameActive = true; // Set flag BEFORE displaying scene
                displayScene(currentSceneKey);
                appendToTerminal("INITIALIZING SYSTEM... GET READY!", 'text-yellow-crt');
                setTimeout(() => {
                    if (minigameActive) { // Double-check the flag
                        startQTE();
                    }
                }, 2000);
            } else if (currentSceneKey === "story-11a_poster_view" && (lowerCommand === "examine omnicorp poster" || lowerCommand === "examine glit flyer")) {
                appendToTerminal(choice.text);
                showAvailableCommands(currentSceneData.choices);
            } else if (currentSceneKey === "story-12b_news_feed" && lowerCommand.startsWith("article ")) {
                appendToTerminal(choice.text);
                showAvailableCommands(currentSceneData.choices);
            } else if (currentSceneKey === "story-12_computer_desk" && (lowerCommand === "read emails" || lowerCommand === "read news")) {
                appendToTerminal(choice.text);
                if (choice.next_scene && choice.next_scene !== currentSceneKey) {
                    currentSceneKey = choice.next_scene;
                    displayScene(currentSceneKey);
                } else {
                    showAvailableCommands(currentSceneData.choices);
                }
            } else {
                appendToTerminal(choice.text);
                currentSceneKey = choice.next_scene;
                displayScene(currentSceneKey);
            }
        } else {
            appendToTerminal(`ERROR: INVALID COMMAND. TYPE ONE OF THE AVAILABLE COMMANDS.`, 'text-red-crt');
            showAvailableCommands(currentSceneData.choices);
        }
    } else {
        appendToTerminal(`ERROR: UNEXPECTED STATE. TYPE 'RESTART' TO BEGIN AGAIN.`, 'text-red-crt');
    }
}

// Event listener for the input field
terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = event.target.value;
        handleCommand(command);
        event.target.value = '';
    }
});

// Focus the input on page load and start the game
window.onload = () => {
    terminalInput.focus();
    displayScene(currentSceneKey);
};