// greetingResponses.js

const greetingKeywords = [
  "hello",
  "hi",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "greetings",
  "what's up",
  "yo",
  "sup"
];

const politeGreetingReplies = [
  "Hello there! 😊 How can I assist you with your health today?",
  "Hi! 👋 I'm here to help with any medical concerns or questions you have.",
  "Hey! How can I make your day healthier today?",
  "Greetings! Do you want to check symptoms, get medicine info, or something else?",
  "Good to see you! What health question can I help you with today?"
];

export const isGreeting = (input) => {
  const normalized = input.toLowerCase().trim();
  const words = normalized.split(/\s+/); // split into separate words

  return words.some((word) => greetingKeywords.includes(word));
};


export const getGreetingResponse = () => {
  const randomIndex = Math.floor(Math.random() * politeGreetingReplies.length);
  const mainReply = politeGreetingReplies[randomIndex];
  return `${mainReply} If you want to know more about me, check instructions please!`;
};
