const form = document.getElementById('pet-form');
const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const chatMessageInput = document.getElementById('chat-message');
const typeInput = document.getElementById('pet-type');
const genderInput = document.getElementById('pet-gender');
const personalityInput = document.getElementById('pet-personality');

let currentSession = {
  active: false,
  type: null,
  gender: null,
  personality: null
};

const names = {
  dog: {
    boy: ['Buddy', 'Max', 'Charlie', 'Milo', 'Leo', 'Finn', 'Jasper', 'Cooper'],
    girl: ['Bella', 'Luna', 'Daisy', 'Ruby', 'Penny', 'Nala', 'Willow', 'Zoe']
  },
  cat: {
    boy: ['Oliver', 'Simba', 'Leo', 'Mittens', 'Gizmo', 'Oscar', 'Felix', 'Tiger'],
    girl: ['Luna', 'Cleo', 'Mia', 'Shadow', 'Lily', 'Willow', 'Muffin', 'Poppy']
  },
  bird: {
    boy: ['Sunny', 'Buddy', 'Coco', 'Rio', 'Pippin', 'Spike', 'Ozzy', 'Zephyr'],
    girl: ['Peaches', 'Kiwi', 'Ruby', 'Lola', 'Poppy', 'Skye', 'Bella', 'Mimi']
  },
  fish: {
    boy: ['Bubbles', 'Finn', 'Splash', 'Neptune', 'Turbo', 'Coral', 'Jelly', 'Marlin'],
    girl: ['Pearl', 'Bubbles', 'Coral', 'Daisy', 'Glitter', 'Marina', 'Nemo', 'Twinkle']
  }
};

const personalityExtras = {
  playful: ['Ziggy', 'Bounce', 'Skipper'],
  brave: ['Hero', 'Captain', 'Scout'],
  sleepy: ['Dreamer', 'Muffin', 'Cloud'],
  shy: ['Misty', 'Whisper', 'Pebble'],
  sporty: ['Rocket', 'Dash', 'Blaze']
};

function getRandomItems(array, count) {
  const copy = [...array];
  const result = [];
  while (result.length < count && copy.length) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function appendMessage(text, sender = 'bot') {
  const messageEl = document.createElement('div');
  messageEl.classList.add('chat-message', sender);

  const label = document.createElement('span');
  label.className = 'message-label';
  label.textContent = sender === 'bot' ? 'Shopkeeper:' : 'You:';
  messageEl.appendChild(label);

  const textEl = document.createElement('p');
  textEl.textContent = text;
  messageEl.appendChild(textEl);
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function startSession(type, gender, personality) {
  currentSession = {
    active: true,
    type,
    gender,
    personality
  };
}

function getSuggestionPrompt(type, gender, personality) {
  const friendlyType = type === 'dog' ? 'dog' : type === 'cat' ? 'cat' : type === 'bird' ? 'bird' : 'fish';
  const genderText = gender === 'boy' ? 'boy' : 'girl';
  const personalityText = personality ? ` with a ${personality} personality` : '';
  return `Here are some fun name ideas for your ${genderText} ${friendlyType}${personalityText}:`;
}

function makeNameSuggestions(type, gender, personality) {
  const base = names[type]?.[gender] ?? [];
  const extras = personality ? personality.toLowerCase().split(/\W+/) : [];
  const personalityNames = extras.flatMap(word => personalityExtras[word] || []);
  const cleanExtras = [...new Set(personalityNames)];
  const suggestions = [...getRandomItems(base, 4), ...getRandomItems(cleanExtras, 2)];
  return suggestions.length ? suggestions.slice(0, 5) : base.slice(0, 5);
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const petType = typeInput.value;
  const petGender = genderInput.value;
  const personality = personalityInput.value.trim();

  startSession(petType, petGender, personality);
  appendMessage(`I have a ${petGender} ${petType} who is ${personality || 'a wonderful companion'}!`, 'user');
  appendMessage('Give me one moment while I fetch the best name ideas from the pet store shelf...');

  setTimeout(() => {
    const suggestions = makeNameSuggestions(petType, petGender, personality);
    appendMessage(`${getSuggestionPrompt(petType, petGender, personality)}\n- ${suggestions.join('\n- ')}\nIf you want a different set, just say "more names" or "try again".`);
  }, 700);
});

chatForm.addEventListener('submit', event => {
  event.preventDefault();

  const message = chatMessageInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  chatMessageInput.value = '';

  if (!currentSession.active) {
    appendMessage('First, tell me about your pet in the form above so I can suggest names that fit.');
    return;
  }

  const normalized = message.toLowerCase();
  const wantsMore = /more|again|different|another|not (those|these|them)|new/i.test(normalized);
  const askForHelp = /help|sure|name|suggest|idea/i.test(normalized);

  setTimeout(() => {
    if (wantsMore) {
      const suggestions = makeNameSuggestions(currentSession.type, currentSession.gender, currentSession.personality);
      appendMessage(`${getSuggestionPrompt(currentSession.type, currentSession.gender, currentSession.personality)}\n- ${suggestions.join('\n- ')}\nIf you want another set, type "more names" again or tell me what mood you want.`);
      return;
    }

    if (askForHelp) {
      appendMessage('I can suggest names based on what you like! Tell me if you want something cute, brave, silly, or sparkly, or just ask for more names.');
      return;
    }

    appendMessage('I love your idea! If the names above are not quite right, just say "more names" or describe the kind of name you want.');
  }, 500);
});
