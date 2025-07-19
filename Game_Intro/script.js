// Get references to the terminal elements
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const sceneImageContainer = document.getElementById('scene-image-container');

// Define the game script/story map
const storyMap = {
    "story-1": {
        "text": "YOU OPEN YOUR EYES.\nYOUR HEAD THROBS. EVERY MUSCLE ACHES.\nYOU ARE ON YOUR BACK, COVERED IN DUST AND LIGHTWEIGHT DEBRIS.",
        "next_scene": "story-2",
        "image": "1.png"
    },
    "story-2": {
        // No image here, as it's a choice container and the image will come from the 'get up' choice
        "choices": {
            "get up": {
                "text": "YOU GET TO YOUR FEET. YOU ARE ON A RUBBLE-STREWN STREET. TO THE EAST, AN ARMORED SECURITY VAN LIES ON ITS SIDE, ITS LIGHTS FLICKERING. TO THE WEST, THE STREET DISAPPEARS INTO A NARROW, SHADOWED ALLEYWAY.",
                "next_scene": "story-3_options",
                "image": "3.png" // Image for this choice outcome
            }
        }
    },
    "story-3_options": {
        // No image here, as it's a choice container and images will come from specific choices
        "choices": {
            "look around": {
                "text": "THE AIR SMELLS OF OZONE AND CONCRETE.\nRUINED SKYSCRAPERS REACH FOR AN ORANGE SKY.\nTATTERED BILLBOARDS CLING TO THEIR SIDES.\nTHEY DISPLAY THE OMNICORP LOGO: AN EYE INSIDE A GEAR.\nA FADED SLOGAN READS: 'YOUR FUTURE, SECURED'.\nDEAD WIRES HANG FROM POLES, SPITTING SPARKS.",
                "next_scene": "story-3_options",
                "image": "4.png" // Image for looking around
            },
            "look at van": {
                "text": "IT'S A HEAVY-DUTY OMNICORP SECURITY VAN. THE ARMOR IS DENTED AND SCORCHED. A SIDE DOOR IS FORCED OPEN, CREATING A NARROW GAP. ITS EMERGENCY LIGHTS PULSE WEAKLY.",
                "next_scene": "story-4_options",
                "image": "5.png" // Image for looking at van
            },
            "enter van": {
                "text": "YOU SLIDE THROUGH THE NARROW GAP. THE VAN'S INTERIOR IS DARK. EMERGENCY POWER IS FAILING. RED LIGHTS FLICKER ON A CONTROL PANEL. A LOW HUM COMES FROM THE BACK.",
                "next_scene": "story-5_van_inside",
                "image": "6.png" // Image for entering van
            }
        }
    },
    "story-4_options": {
        // No image here, as it's a choice container
        "choices": {
            "enter van": {
                "text": "YOU SLIDE THROUGH THE NARROW GAP. THE VAN'S INTERIOR IS DARK. EMERGENCY POWER IS FAILING. RED LIGHTS FLICKER ON A CONTROL PANEL. A LOW HUM COMES FROM THE BACK.",
                "next_scene": "story-5_van_inside",
                "image": "6.png"
            },
            "look around": {
                "text": "THE AIR SMELLS OF OZONE AND CONCRETE.\nRUINED SKYSCRAPERS REACH FOR AN ORANGE SKY.\nTATTERED BILLBOARDS CLING TO THEIR SIDES.\nTHEY DISPLAY THE OMNICORP LOGO: AN EYE INSIDE A GEAR.\nA FADED SLOGAN READS: 'YOUR FUTURE, SECURED'.\nDEAD WIRES HANG FROM POLES, SPITTING SPARKS.",
                "next_scene": "story-3_options",
                "image": "3.png"
            }
        }
    },
    "story-5_van_inside": {
        // No image here
        "choices": {
            "look at monitor": {
                "text": "BOLTED TO THE FLOOR IS A REINFORCED SERVER RACK. ITS MONITOR GLOWS. A FLICKERING MAP SHOWS THREE LOCATIONS. BELOW, A MESSAGE SCROLLS, ALERT:\n ALL PATROLS TO ARREST MEMBERS OF 'THE GLITCH' ON SIGHT.\nLYING ON THE FLOOR IS A HEAVY-DUTY FLASHLIGHT. YOU TAKE IT.\n\nYOU HAVE THE MAP AND A FLASHLIGHT.",
                "next_scene": "story-6_van_with_map",
                "image": "6.png"
            }
        }
    },
    "story-6_van_with_map": {
        // No image here
        "choices": {
            "exit van": {
                "text": "YOU SLIDE BACK THROUGH THE GAP AND ONTO THE STREET. THE VAN'S LIGHTS DIE, PLUNGING IT INTO SILENCE. THE ALLEYWAY TO THE WEST BECKONS.",
                "next_scene": "story-7_street_with_map",
                "image": "5.png"
            }
        }
    },
    "story-7_street_with_map": {
        // No image here
        "choices": {
            "enter alley": {
                "text": "YOU HEAD WEST, STEPPING INTO THE DEEP SHADOWS OF THE NARROW ALLEYWAY. IT'S DARKER HERE, ALMOST PITCH BLACK.",
                "next_scene": "story-8_alleyway",
                "image": "7.png"
            },
            "follow map": {
                "text": "YOU CHECK THE MAP. IT CONFIRMS YOUR FIRST DESTINATION IS DOWN THE ALLEYWAY TO THE WEST. YOU HEAD INTO ITS DEEP SHADOWS.",
                "next_scene": "story-8_alleyway",
                "image": "7.png"
            }
        }
    },
    "story-8_alleyway": {
        // No image here
        "choices": {
            "use flashlight": {
                "text": "YOU SWITCH ON THE FLASHLIGHT. A POWERFUL BEAM CUTS THROUGH THE DARK. IT REVEALS DAMP BRICK WALLS AND A SINGLE, RUSTED METAL DOOR AT THE FAR END. THIS IS THE PLACE.",
                "next_scene": "story-9_shed_approach",
                "image": "8.png"
            }
        }
    },
    "story-9_shed_approach": {
        // No image here
        "choices": {
            "enter shed": {
                "text": "THE RUSTED DOOR GROANS OPEN. INSIDE, YOUR FLASHLIGHT BEAM REVEALS A SURPRISING SIGHT: A COLOSSAL GEAR MECHANISM SET INTO THE FLOOR. ITS COGS ARE FROZEN WITH RUST.",
                "next_scene": "story-11_gear_puzzle",
                "image": "11.png"
            }
        }
    },
};


let currentSceneKey = "story-1"; // Initial scene key
let awaitingLinearAdvance = false; // Flag for linear story progression

// Function to append text to the terminal output
function appendToTerminal(text, colorClass = 'text-green-crt') {
    // Split text by newline and append each line as a separate paragraph
    const lines = text.split('\n');
    lines.forEach(line => {
        const p = document.createElement('p');
        p.textContent = line.trim();
        p.classList.add(colorClass); // Apply the specified color class
        terminalOutput.appendChild(p);
    });
    // Scroll to the bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/**
 * Displays the current scene's text and available commands, and loads the corresponding image.
 * @param {string} sceneKey - The key of the scene to display.
 * @param {string|null} [imageToLoad=null] - Optional: an image path to use. If null, no image will be loaded unless the scene itself defines one.
 */
function displayScene(sceneKey, imageToLoad = null) {
    const sceneData = storyMap[sceneKey];

    if (!sceneData) {
        appendToTerminal(`ERROR: SCENE '${sceneKey}' NOT FOUND.`, 'text-red-crt');
        currentSceneKey = "story-1"; // Reset to start on error
        displayScene(currentSceneKey);
        return;
    }

    // Clear terminal if it's a new main scene, not just a choice outcome
    if (sceneKey === "story-1" || (sceneData.text && !awaitingLinearAdvance)) {
            terminalOutput.innerHTML = ''; // Clear all content for new scene
    }

    // --- Image Loading Logic ---
    sceneImageContainer.innerHTML = ''; // Clear previous image

    // Use the provided imageToLoad argument, or the sceneData.image if it's a linear scene
    const finalImageToLoad = imageToLoad || (sceneData.text && sceneData.image ? sceneData.image : null);

    if (finalImageToLoad) {
        const imgElement = document.createElement('img');
        imgElement.src = `./assets/${finalImageToLoad}`;
        imgElement.alt = `Scene: ${sceneKey}`;
        imgElement.classList.add('pixel-image');
        imgElement.onerror = () => { // Fallback for missing images
            imgElement.src = `https://placehold.co/600x200/000000/00ff00?text=IMAGE+MISSING`;
            appendToTerminal(`WARNING: IMAGE 'assets/${finalImageToLoad}' NOT FOUND.`, 'text-yellow-crt');
        };
        sceneImageContainer.appendChild(imgElement);
    } else {
        // If no image is specified for the current state, show a default placeholder
        sceneImageContainer.innerHTML = `<img src="https://placehold.co/600x200/000000/00ff00?text=NO+IMAGE" alt="No image available" class="pixel-image">`;
    }
    // --- End Image Loading Logic ---


    if (sceneData.text) {
        appendToTerminal(sceneData.text);
        if (sceneData.next_scene) {
            awaitingLinearAdvance = true; // Set flag for linear progression
            appendToTerminal("PRESS ENTER TO CONTINUE...", 'text-gray-crt');
        } else if (sceneData.choices) {
            showAvailableCommands(sceneData.choices);
            awaitingLinearAdvance = false; // Ensure not in linear mode if choices are present
        }
    } else if (sceneData.choices) {
        // If a scene is purely choices, we just show commands
        showAvailableCommands(sceneData.choices);
        awaitingLinearAdvance = false;
    } else {
        appendToTerminal(`ERROR: SCENE '${sceneKey}' HAS NO CONTENT OR CHOICES.`, 'text-red-crt');
        currentSceneKey = "story-1";
        displayScene(currentSceneKey);
    }
}

/**
 * Displays the available commands for the current scene.
 * @param {object} choices - An object where keys are commands and values are their data.
 */
function showAvailableCommands(choices) {
    appendToTerminal("AVAILABLE COMMANDS:", 'text-yellow-crt');
    for (const command in choices) {
        appendToTerminal(`  - ${command.toUpperCase()}`, 'text-yellow-crt');
    }
}

// Function to handle commands
function handleCommand(command) {
    appendToTerminal('> ' + command, 'text-blue-crt'); // Echo the command

    const lowerCommand = command.toLowerCase().trim();
    const currentSceneData = storyMap[currentSceneKey];

    if (lowerCommand === 'clear') {
        terminalOutput.innerHTML = '';
        appendToTerminal('CONSOLE CLEARED.', 'text-gray-crt');
        return; // Do not process further for clear
    }
    if (lowerCommand === "enter shed") {
        window.location.href = "/Stall-game-2025/ClockWorks/index.html"
        return;
    }

    if (awaitingLinearAdvance) {
        // If we are in a linear text progression, any command advances
        awaitingLinearAdvance = false;
        currentSceneKey = currentSceneData.next_scene;
        // For linear advance, the image is tied to the next scene's definition
        // We pass the next scene's image to displayScene
        displayScene(currentSceneKey, storyMap[currentSceneKey].image || null);
        return;
    }

    if (currentSceneData && currentSceneData.choices) {
        const choice = currentSceneData.choices[lowerCommand];
        if (choice) {
            appendToTerminal(choice.text);
            currentSceneKey = choice.next_scene;
            // When a choice is made, pass its specific image to displayScene
            displayScene(currentSceneKey, choice.image || null);
        } else {
            appendToTerminal(`ERROR: INVALID COMMAND FOR THIS SCENE. TYPE ONE OF THE AVAILABLE COMMANDS.`, 'text-red-crt');
            showAvailableCommands(currentSceneData.choices); // Remind user of available commands
        }
    } else {
        // This case should ideally not be hit if logic is sound, but for safety
        appendToTerminal(`ERROR: UNEXPECTED STATE. TYPE 'RESTART' TO BEGIN AGAIN.`, 'text-red-crt');
    }
}

// Event listener for the input field
terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const command = terminalInput.value;
        handleCommand(command);
        terminalInput.value = ''; // Clear the input field
    }
});

// Focus the input on page load and start the game
window.onload = () => {
    terminalInput.focus();
    displayScene(currentSceneKey, storyMap[currentSceneKey].image || null); // Start the game by displaying the first scene's image
};