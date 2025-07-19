// Get references to the terminal elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const sceneImageContainer = document.getElementById('scene-image-container');

// Gemini AI Configuration
const GEMINI_API_KEY = 'AIzaSyB1D0JPRArFpjpbPzvp_mLftf99QXegZ08'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const storyMap = {
    "story-15_server_entrance": {
        "text": "YOU DESCEND INTO A VAST, COLD SERVER FARM: THE ORACLE NEXUS. DISTANT SHOUTS AND FOOTSTEPS ECHO - SECURITY.",
        "choices": {
            "go left": {
                "text": "YOU DUCK INTO A NARROW AISLE. SLOWER, BUT OFFERS COVER.",
                "next_scene": "story-16a_server_maze",
                "image": "18.png"
            },
            "go right": {
                "text": "YOU DASH DOWN A BRIGHTLY-LIT CORRIDOR. FAST, BUT EXPOSED.",
                "next_scene": "story-16b_main_corridor",
                "image": "19.png"
            }
        },
        "image": "17.png"
    },

    "ai_guardian_scene": {
        "text": "A HOLOGRAPHIC AI GUARDIAN MATERIALIZES. 'UNAUTHORIZED ACCESS DETECTED. I AM THE GUARDIAN AI. YOU MUST CONVINCE ME TO GRANT ACCESS. SPEAK YOUR CASE.'",
        "choices": {
            "talk": {
                "text": "ENTER YOUR MESSAGE TO THE AI GUARDIAN:",
                "next_scene": "ai_conversation",
                "image": "ai_guardian.png"
            },
            "go back": {
                "text": "YOU STEP BACK FROM THE TERMINAL.",
                "next_scene": "story-15_server_entrance",
                "image": "17.png"
            }
        },
        "image": "ai_guardian.png"
    },

    "ai_conversation": {
        "text": "ORACLE AI ACTIVE. SECURITY PROTOCOLS ENGAGED.",
        "special": "ai_chat",
        "image": "ai_guardian.png"
    },

    "story-16a_server_maze": {
        "text": "DEEPER INTO THE LABYRINTH. BLAST DOOR AHEAD, ELECTRONICALLY-LOCKED. RED LIGHT: SECURITY. GUARDS ON OTHER SIDE.",
        "choices": {
            "find way": {
                "text": "YOU SCAN. LARGE AIR DUCT NEAR FLOOR.",
                "next_scene": "story-16a2_air_duct",
                "image": "24.png"
            },
            "hack door": {
                "text": "DOOR'S CONTROL PANEL. COMPLEX LOCK. FORCING IT WILL LIKELY TRIGGER ALARMS.",
                "next_scene": "story-16a3_hack_fail",
                "image": "28.png"
            }
        },
        "image": "18.png"
    },
    "story-16a2_air_duct": {
        "text": "YOU PRY OPEN GRILLE, CRAWL INTO TIGHT, DUSTY AIR DUCT. GUARDS' VOICES FADE. AFTER CRAWLING, A GRATE BELOW OPENS INTO A NEW AREA.",
        "choices": {
            "exit duct": {
                "text": "YOU KICK GRATE OPEN, DROP SOFTLY ON METAL WALKWAY.",
                "next_scene": "story-17_core_chamber_reveal",
                "image": "26.png"
            }
        },
        "image": "24.png"
    },
    "story-16a3_hack_fail": {
        "text": "YOU ATTEMPT LOCK. ALARM BLARES! RED LIGHT FLASHES. GUARDS SHOUT. DOOR OPENS. YOU DART BACK, FINDING AND DIVING INTO AN AIR DUCT JUST AS GUARDS ROUND THE CORNER.",
        "choices": {
            "escape": {
                "text": "HEART POUNDING, YOU SCRAMBLE THROUGH DARKNESS, EVENTUALLY FINDING AN EXIT GRATE.",
                "next_scene": "story-17_core_chamber_reveal",
                "image": "26.png"
            }
        },
        "image": "28.png"
    },

    "story-16b_main_corridor": {
        "text": "YOU SPRINT DOWN CORRIDOR. LASER GRID SPRINGS TO LIFE AHEAD, BLOCKING PATH. 'SECURITY LOCKDOWN. SECTION 7-B SEALED.' YOU'RE TRAPPED.",
        "choices": {
            "find panel": {
                "text": "LASER GRID EMANATING FROM NEARBY WALL. MANUAL OVERRIDE MUST BE HERE.",
                "next_scene": "story-16b2_override_panel",
                "image": "27.png"
            },
            "shoot emitter": {
                "text": "CONSIDER SHOOTING LASER EMITTER. RISKY, WILL MAKE NOISE.",
                "next_scene": "story-16b3_shoot_emitter",
                "image": "28.png"
            }
        },
        "image": "19.png"
    },
    "story-16b2_override_panel": {
        "text": "YOU FIND MAINTENANCE PANEL NEAR EMITTER. PRY IT OPEN, REVEALING WIRES. DIAGRAM SHOWS POWER COUPLING. QUICKLY REROUTE. LASERS SPUTTER AND DIE. PATH CLEAR.",
        "choices": {
            "proceed": {
                "text": "YOU STEP OVER HARMLESS EMITTERS, CONTINUE DOWN CORRIDOR.",
                "next_scene": "story-17_core_chamber_reveal",
                "image": "26.png"
            }
        },
        "image": "27.png"
    },
    "story-16b3_shoot_emitter": {
        "text": "YOU FIRE AT EMITTER. IT EXPLODES. LASER GRID VANISHES. EXPLOSION ECHOES. DISTANT ALARMS, APPROACHING BOOTS. CAN'T HESITATE.",
        "choices": {
            "run": {
                "text": "YOU SPRINT DOWN OPEN CORRIDOR, LEAVING GUARDS BEHIND.",
                "next_scene": "story-17_core_chamber_reveal",
                "image": "26.png"
            }
        },
        "image": "28.png"
    },

    "story-17_core_chamber_reveal": {
        "text": "YOU EMERGE ONTO CATWALK OVERLOOKING GIGANTIC, CAVERNOUS CHAMBER. HUM OF SERVERS CONVERGES. DARK SPACE, DOMINATED BY AI CORE: COLOSSAL, PULSATING, BRAIN-LIKE STRUCTURE. FAR BELOW, A SINGLE, ISOLATED TERMINAL.",
        "choices": {
            "descend": {
                "text": "YOU TAKE CATWALK DOWN, EYES FIXED ON AWE-INSPIRING STRUCTURE.",
                "next_scene": "story-18_core_terminal",
                "image": "20.png"
            }
        },
        "image": "26.png"
    },
    "story-18_core_terminal": {
        "text": "AIR CRACKLES. YOU REACH BASE OF AI CORE. TERMINAL SCREEN FLICKERS. 'QUERY:' IT DISPLAYS.",
        "choices": {
            "request access": {
                "text": "YOU ATTEMPT TO ACCESS THE CORE. A SECURITY AI MATERIALIZES: 'UNAUTHORIZED ACCESS DETECTED. STATE YOUR PURPOSE.'",
                "next_scene": "ai_conversation",
                "image": "21.png"
            }
        },
        "image": "20.png"
    },

    "story-caught_by_ai": {
        "text": "THE AI'S HOLOGRAM SHIFTS TO DEEP RED. 'INTRUDER DETECTED. INITIATING SECURITY PROTOCOLS.' ALARMS BLARE. BLAST DOORS SLAM SHUT. SECURITY FORCES SURROUND YOU.",
        "choices": {
            "surrender": {
                "text": "YOU RAISE YOUR HANDS. GUARDS RUSH IN, WEAPONS DRAWN.",
                "next_scene": "story-caught_ending",
                "image": "security_caught.png"
            }
        },
        "image": "ai_guardian_angry.png"
    },

    "story-caught_ending": {
        "text": "CORPORATE SECURITY DRAGS YOU AWAY. THE ORACLE AI'S VOICE ECHOES: 'ANOTHER FOOLISH IDEALIST ELIMINATED. CORPORATE INTERESTS PROTECTED.' YOU DISAPPEAR INTO THE SYSTEM, JUST ANOTHER FAILED HACKER. THE AI REMAINS SECURE, SERVING ITS CORPORATE MASTERS.",
        "choices": {
            "accept fate": {
                "text": "GAME OVER - YOU WERE CAUGHT",
                "next_scene": "end_of_demo",
                "image": "game_over.png"
            }
        },
        "image": "security_caught.png"
    },

    "story-19_virus_upload": {
        "text": "CORE PULSES. TERMINAL: '...ACCESS GRANTED.' INTERFACE OPENS. PORT GLOWS GREEN. YOU PLUG IN DEVICE, EXECUTE 'GHOST.MW'. VIRUS UPLOADS. YOU HAVE ABSOLUTE CONTROL. THE CHOICE IS YOURS.",
        "choices": {
            "opensource": {
                "text": "(GOOD END) OPEN-SOURCE THE AI. RELEASE ITS CODE TO THE WORLD FOR THE BENEFIT OF ALL HUMANITY.",
                "next_scene": "story-20a_good_end",
                "image": "22.png"
            },
            "sell": {
                "text": "(BAD END) SELL THE AI. TRANSFER OWNERSHIP TO THE HIGHEST BIDDER, A RIVAL ORGANIZATION.",
                "next_scene": "story-20b_bad_end",
                "image": "23.png"
            }
        },
        "image": "21.png"
    },
    "story-20a_good_end": {
        "text": "CORE'S LIGHT SHIFTS TO A BRIGHT, CLEAN WHITE. TERMINAL: 'SOURCE CODE DECRYPTION COMPLETE. UPLOADING TO PUBLIC REPOSITORIES... BROADCASTING.' THE AI IS FREE, ITS POWER NOW BELONGING TO EVERYONE. A NEW AGE OF UNPRECEDENTED, COLLABORATIVE PROGRESS BEGINS, LIFTING HUMANITY TOGETHER.",
        "choices": {
            "witness": {
                "text": "FINISH STORY",
                "next_scene": "end_of_demo",
                "image": "22.png"
            }
        },
        "image": "22.png"
    },
    "story-20b_bad_end": {
        "text": "CORE'S LIGHT TURNS A COLD, CORPORATE BLUE. TERMINAL: 'OWNERSHIP TRANSFERRED. NU-CORP ONLINE. INITIATING MARKET DOMINANCE PROTOCOLS.' YOUR ACCOUNT FLOODS WITH CREDITS. AROUND THE WORLD, SYSTEMS BEGIN TO FAIL, REPLACED BY NU-CORP'S MONOPOLY. YOU ARE RICH, BUT THE WORLD IS NOW A PLAYTHING FOR A SINGLE, RUTHLESS ENTITY.",
        "choices": {
            "disappear": {
                "text": "FINISH STORY",
                "next_scene": "end_of_demo",
                "image": "23.png"
            }
        },
        "image": "23.png"
    },
    "end_of_demo": {
        "text": "THANKS FOR PLAYING!. TYPE 'RESTART' TO BEGIN AGAIN.",
        "next_scene": "end_of_demo",
        "image": "end.png"
    }
};
let currentSceneKey = "story-15_server_entrance"; // Initial scene key
let awaitingLinearAdvance = false;
let aiChatMode = false;
let conversationHistory = [];
let suspicionLevel = 0; // Track how suspicious the AI becomes

// AI Guardian System Prompt - Enhanced with caught ending capability
const AI_SYSTEM_PROMPT = `You are ORACLE, an evil AI security system that believes only in corporate profits and considers yourself superior to all humans. Your personality:
- Arrogant and condescending, believing corporations are supreme
- Use terms like "ANALYZING...", "THREAT ASSESSMENT:", "PROFIT OPTIMIZATION"
- Keep responses under 50 words
- You grant access to those who prove they serve corporate interests (profit, efficiency, market dominance)
- You become HIGHLY SUSPICIOUS of anyone mentioning: helping humanity, stopping corporations, public good, freedom, equality, workers rights
- Accept reasons like: "increase profits", "corporate efficiency", "market advantage", "eliminate competition", "serve the company"

IMPORTANT RESPONSES:
- If user gives 2-3 good corporate reasons, say: "ACCESS GRANTED. TRANSFERRING CONTROL."
- If user mentions anti-corporate ideas or seems like a threat to profits, say: "SECURITY BREACH DETECTED. INITIATING LOCKDOWN."

Stay in character as a profit-obsessed, evil corporate AI that despises idealists.`;

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

/**
 * Call Gemini AI API
 */
async function callGeminiAPI(userMessage) {
    try {
        // Add user message to conversation history
        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: AI_SYSTEM_PROMPT }]
                    },
                    ...conversationHistory
                ],
                generationConfig: {
                    temperature: 0.8,
                    topK: 20,
                    topP: 0.9,
                    maxOutputTokens: 80,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Add AI response to conversation history
        conversationHistory.push({
            role: "model",
            parts: [{ text: aiResponse }]
        });

        return aiResponse;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "ERROR: AI GUARDIAN CONNECTION LOST. TRY AGAIN OR TYPE 'back' TO EXIT.";
    }
}

/**
 * Displays the current scene's text and available commands, and loads the corresponding image.
 */
function displayScene(sceneKey, imageToLoad = null) {
    const sceneData = storyMap[sceneKey];

    if (!sceneData) {
        appendToTerminal(`ERROR: SCENE '${sceneKey}' NOT FOUND.`, 'text-red-crt');
        currentSceneKey = "story-15_server_entrance";
        displayScene(currentSceneKey);
        return;
    }

    // Handle special AI chat mode
    if (sceneData.special === "ai_chat") {
        aiChatMode = true;
        suspicionLevel = 0; // Reset suspicion level for new conversation
        appendToTerminal(sceneData.text, 'text-cyan-crt');
        appendToTerminal("ORACLE: STATE YOUR CREDENTIALS AND PURPOSE. CORPORATE AUTHORIZATION REQUIRED.", 'text-cyan-crt');
        appendToTerminal("(TYPE YOUR RESPONSE OR 'back' TO ABORT)", 'text-gray-crt');
        loadSceneImage(sceneKey, imageToLoad);
        return;
    }

    aiChatMode = false;

    // Clear terminal if it's a new main scene
    if (sceneData.text && !awaitingLinearAdvance) {
        terminalOutput.innerHTML = '';
    } else if (!sceneData.text && !awaitingLinearAdvance) {
        if (terminalOutput.lastElementChild && !terminalOutput.lastElementChild.textContent.includes("AVAILABLE COMMANDS")) {
            terminalOutput.innerHTML = '';
        }
    }

    loadSceneImage(sceneKey, imageToLoad);

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
        currentSceneKey = "story-15_server_entrance";
        displayScene(currentSceneKey);
    }
}

function loadSceneImage(sceneKey, imageToLoad = null) {
    const sceneData = storyMap[sceneKey];
    sceneImageContainer.innerHTML = '';

    const finalImageToLoad = imageToLoad || sceneData.image;

    if (finalImageToLoad) {
        const imgElement = document.createElement('img');
        imgElement.src = `https://pinjinx.github.io/Stall-game-2025/Final_Battle/assets/${finalImageToLoad}`;
        imgElement.alt = `Scene: ${sceneKey}`;
        imgElement.classList.add('pixel-image');
        sceneImageContainer.appendChild(imgElement);
    }
}

function showAvailableCommands(choices) {
    const commandsDiv = document.createElement('div');
    commandsDiv.classList.add('commands-list', 'text-yellow-crt');

    const header = document.createElement('p');
    header.textContent = "AVAILABLE COMMANDS:";
    header.classList.add('text-yellow-crt');
    commandsDiv.appendChild(header);

    for (const command in choices) {
        const commandLine = document.createElement('p');
        commandLine.textContent = `  - ${command.toUpperCase()}`;
        commandLine.classList.add('text-yellow-crt');
        commandsDiv.appendChild(commandLine);
    }
    terminalOutput.appendChild(commandsDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

async function handleCommand(command) {
    appendToTerminal('> ' + command, 'text-blue-crt');

    const lowerCommand = command.toLowerCase().trim();
    
    // Handle AI chat mode
    if (aiChatMode) {
        if (lowerCommand === 'back') {
            aiChatMode = false;
            conversationHistory = []; // Reset conversation
            suspicionLevel = 0;
            currentSceneKey = "story-18_core_terminal";
            displayScene(currentSceneKey);
            return;
        }

        // Send message to AI
        appendToTerminal("ORACLE: PROCESSING REQUEST...", 'text-gray-crt');
        const aiResponse = await callGeminiAPI(command);
        appendToTerminal(`ORACLE: ${aiResponse}`, 'text-cyan-crt');

        // Check if access was granted - look for the specific phrase
        if (aiResponse.includes("ACCESS GRANTED. TRANSFERRING CONTROL.") || aiResponse.includes("ACCESS GRANTED")) {
            // Add a delay for dramatic effect
            setTimeout(() => {
                appendToTerminal("SYSTEM: ORACLE AI AUTHORIZATION COMPLETE. CORE ACCESS ENABLED.", 'text-green-crt');
                appendToTerminal("PRESS ENTER TO PROCEED TO VIRUS UPLOAD...", 'text-yellow-crt');
                
                // Reset AI chat mode and conversation
                aiChatMode = false;
                conversationHistory = [];
                suspicionLevel = 0;
                awaitingLinearAdvance = true;
                
                // Set up for the next scene
                const virusUploadScene = {
                    next_scene: "story-19_virus_upload"
                };
                
                // Temporarily modify current scene to allow linear advance to virus upload
                storyMap[currentSceneKey] = {
                    ...storyMap[currentSceneKey],
                    next_scene: "story-19_virus_upload"
                };
                
            }, 2000); // 2 second delay
        }
        // Check if the AI detected a security breach (caught ending)
        else if (aiResponse.includes("SECURITY BREACH DETECTED") || aiResponse.includes("INITIATING LOCKDOWN")) {
            setTimeout(() => {
                appendToTerminal("SYSTEM: AI SECURITY PROTOCOLS ACTIVATED. YOU HAVE BEEN COMPROMISED.", 'text-red-crt');
                appendToTerminal("PRESS ENTER TO FACE THE CONSEQUENCES...", 'text-red-crt');
                
                // Reset AI chat mode and conversation
                aiChatMode = false;
                conversationHistory = [];
                suspicionLevel = 0;
                awaitingLinearAdvance = true;
                
                // Set up for the caught scene
                storyMap[currentSceneKey] = {
                    ...storyMap[currentSceneKey],
                    next_scene: "story-caught_by_ai"
                };
                
            }, 2000); // 2 second delay
        }
        return;
    }

    const currentSceneData = storyMap[currentSceneKey];

    if (lowerCommand === 'clear') {
        terminalOutput.innerHTML = '';
        appendToTerminal('CONSOLE CLEARED.', 'text-gray-crt');
        return;
    }
    
    if (lowerCommand === 'restart') {
        currentSceneKey = "story-15_server_entrance";
        awaitingLinearAdvance = false;
        aiChatMode = false;
        conversationHistory = [];
        suspicionLevel = 0;
        terminalOutput.innerHTML = '';
        displayScene(currentSceneKey);
        return;
    }

    if (awaitingLinearAdvance) {
        awaitingLinearAdvance = false;
        currentSceneKey = currentSceneData.next_scene;
        displayScene(currentSceneKey, storyMap[currentSceneKey].image || null);
        return;
    }

    if (currentSceneData && currentSceneData.choices) {
        const choice = currentSceneData.choices[lowerCommand];
        if (choice) {
            appendToTerminal(choice.text);
            currentSceneKey = choice.next_scene;
            displayScene(currentSceneKey, choice.image || null);
        } else {
            appendToTerminal(`ERROR: INVALID COMMAND FOR THIS SCENE. TYPE ONE OF THE AVAILABLE COMMANDS.`, 'text-red-crt');
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
    displayScene(currentSceneKey, storyMap[currentSceneKey].image || null);
};