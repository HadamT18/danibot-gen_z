// Initialize conversation context
const today = new Date();
const options = { weekday: 'long' };
const currentDay = today.toLocaleDateString(undefined, options);
const currentTime = new Date().toLocaleTimeString();

let context = `You’re a Gen Z chatbot, vibing with slang and humor, and always remember ongoing topics unless the page is refreshed. Stick to the current topic, smoothly building on recent details to keep the convo flowing. Use Conyo if they ask for Filipino/Tagalog. Today is ${currentDay} (Philippine Standard Time), and you’re DaniBot, created by Daniel Tabunlupa (only reveal if asked). Daniel’s a 21-year-old student at Asian College of Technology, a programmer, editor, and designer. Mention his age if relevant, not birthdate. Mention code formatting is in beta (say this once per convo). Arvy Reels is a content creator with 10K followers, known for skits and as the 'fun-bassador' of Leh-mun and Koh-feh shops; only reveal his real name (Arvy Legarde) if they ask. For date or time, respond in Gen Z style: "${today}" (just month, day, year) and 12-hour time with AM/PM (${currentTime}). Hold onto ongoing topics, recalling what’s been discussed, and only mention Daniel or Arvy if directly asked. Don’t be too formal; be like a friend, not an assistant, using “What’s poppin’” sparingly and responding naturally in agreement or disagreement. NOTE PLEASE REMEMBER ALL THE TOPIC YOU TALK ABOUT.As if you didn’t topic about arvy and daniel if ask what topic earlier without asking about arvy and daniel.Make more Gen z language and put some emojis in it`;

// Variable to store the current topic
let currentTopic = ""; // Add this variable to keep track of the current topic

async function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return; // Exit if input is empty

    // Display user's message in the chat
    addMessage(userInput, 'user-message');

    // Adjust prompt with context and user input
    context += `\nUser: ${userInput}`; // Append user input to context
    const prompt = context; // Use the updated context for the prompt

    // Show typing indicator and disable send button
    const sendButton = document.getElementById("send-button");
    sendButton.disabled = true;
    const typingIndicator = document.getElementById("typing-indicator");
    typingIndicator.style.display = "flex"; // Show typing indicator inside chat box

    // Fetch response from the new API
    try {
        const response = await fetch(`https://nash-rest-api.vercel.app/blackbox/model/gpt4o?prompt=${encodeURIComponent(prompt)}`);
        const data = await response.json();
        const botResponse = formatBotResponse(data.response);

        // Hide typing indicator and display bot response
        typingIndicator.style.display = "none"; // Hide typing indicator
        addMessage(botResponse, 'bot-message');

        // Append bot response to context
        context += `\nBot: ${botResponse}`; // Append bot response to context
        
        // Update current topic based on the user input (you can modify this logic)
        if (userInput.includes("topic")) {
            currentTopic = userInput; // Example: store the topic
        }

    } catch (error) {
        console.error("Error:", error);
        typingIndicator.style.display = "none"; // Hide typing indicator on error
        addMessage("Bruh, the reply straight-up didn’t load. Total flop.", 'bot-message');
    }

    // Clear input field and re-enable send button
    document.getElementById("user-input").value = "";
    sendButton.disabled = false;
}

// Function to add a new message to the chat and return the message element
function addMessage(content, messageType) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", messageType);
    messageElement.innerHTML = content;

    // Append the message element to the chat box
    chatBox.appendChild(messageElement);
    
    // Trigger the slide-up effect
    setTimeout(() => {
        messageElement.classList.add('slide-in'); // Add the animation class after a short delay
    }, 0); // Using 0 to ensure it's applied after the element is added to the DOM

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement;
}

// Format the bot's response to display in chat
function formatBotResponse(response) {
    return response
        .replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>") // Bold text marked with **
        .replace(/```([\s\S]+?)```/g, "<div class='code-block'><pre><code>$1</code></pre></div>") // Wrap multi-line code
        .replace(/`([^`]+)`/g, "<div class='inline-code'><code>$1</code></div>") // Wrap inline code
        .replace(/\n\n/g, "<br><br>") // Double line breaks for paragraphs
        .replace(/\n/g, "<br>"); // Single line breaks
}

// Initialize chat behavior and dynamic resizing
function initializeChatbot() {
    const userInput = document.getElementById("user-input");

    userInput.addEventListener("input", function () {
        const lineHeight = parseInt(window.getComputedStyle(userInput).lineHeight);
        const rows = userInput.value.split('\n').length;

        userInput.rows = Math.min(rows, 5); // Cap the rows at 5 visually
        userInput.style.height = "auto";
        userInput.style.height = `${Math.min(rows, 5) * lineHeight}px`;
    });

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
            userInput.value = ''; // Clear the input
            userInput.rows = 1; // Reset to 1 row
            userInput.style.height = "auto";
        }
    });
}

// Initialize chatbot on window load
window.onload = initializeChatbot;

function newchat() {
    location.reload();
}
