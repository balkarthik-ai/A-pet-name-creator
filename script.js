const form = document.getElementById('pet-form');
const chatWindow = document.getElementById('chat-window');
const typeInput = document.getElementById('pet-type');
const genderInput = document.getElementById('pet-gender');
const personalityInput = document.getElementById('pet-personality');

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

  const friendlyType = petType === 'dog' ? 'dog' : petType === 'cat' ? 'cat' : petType === 'bird' ? 'bird' : 'fish';
  const genderText = petGender === 'boy' ? 'boy' : 'girl';

  appendMessage(`I have a ${genderText} ${friendlyType} who is ${personality || 'a wonderful companion'}!`, 'user');
  appendMessage('Give me one moment while I fetch the best name ideas from the pet store shelf...');

  setTimeout(() => {
    const suggestions = makeNameSuggestions(petType, petGender, personality);
    appendMessage(`Here are some fun name ideas for your ${genderText} ${friendlyType}: \n- ${suggestions.join('\n- ')}\nLet me know if you want more!`);
  }, 700);
});
