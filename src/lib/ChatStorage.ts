import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

export type AIResponseType =
  | {
      id: string;
      role: 'ai';
      detectedLanguage: string;
      confidence: number;
      timestamp: string;
      type: 'summary';
      content: string;
      sourceLanguage: string;
    }
  | {
      id: string;
      role: 'ai';
      detectedLanguage: string;
      confidence: number;
      timestamp: string;
      type: 'translation';
      content: string;
      sourceLanguage: string;
      targetLanguage: string;
    };

// Function to save chat messages to local storage
export function saveChatHistory(
  chatHistory: { role: string; content: string; timestamp: string }[]
) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }
}

// Function to retrieve chat messages from local storage
export function getChatHistory() {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem('chatHistory');
    return history ? JSON.parse(history) : [];
  }
  return [];
}

// Function to detect language of the latest message
export async function detectLanguage(text: string) {
  if (!window?.ai?.languageDetector) return [];

  const detector = await window.ai.languageDetector.create();
  const results = await detector.detect(text);

  // Return an array of detected languages with confidence scores
  return results.map(
    (result: { detectedLanguage: string; confidence: number }) => ({
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence
    })
  );
}

// Function to translate text
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
) {
  if (!window?.ai?.translator || !sourceLanguage) return text;
  const translator = await window.ai.translator.create({
    sourceLanguage,
    targetLanguage
  });
  return await translator.translate(text);
}

// Function to translate text
export async function summarizeText(text: string) {
  const options = {
    sharedContext: '',
    type: 'key-points',
    format: 'plain-text',
    length: 'medium'
  };
  if (!window?.ai?.summarizer) return text;

  const translator = await window.ai.summarizer.create(options);
  return await translator.summarize(text, {
    context: ''
  });
}

// Function to add a new message to chat history with processing

export async function addMessageToStorage(role: string, content: string) {
  const chatHistory = getChatHistory();
  const timestamp = new Date().toISOString();

  const detectedResult = await detectLanguage(content);

  const detectedLanguage =
    detectedResult.length > 0 ? detectedResult[0].detectedLanguage : 'unknown';
  const confidence =
    detectedResult.length > 0
      ? Math.floor(detectedResult[0].confidence * 100)
      : 0;

  const newMessage = {
    id: uuidv4(),
    role,
    content,
    sourceLanguage: detectedLanguage,
    timestamp,
    confidence,
    aiResponses: []
  };

  chatHistory.push(newMessage);
  saveChatHistory(chatHistory);
}

export async function addAiResponseToMessage(
  messageId: string,
  aiResponse: AIResponseType
) {
  const chatHistory = getChatHistory();
  const timestamp = new Date().toISOString();

  const message = chatHistory.find(
    (msg: {
      id: string;
      role: string;
      content: string;
      sourceLanguage: string;
      timestamp: string;
      confidence: number;
      aiResponses?: AIResponseType[];
    }) => msg.id === messageId
  );

  if (!message) {
    console.error('Message not found.');
    return;
  }

  // Initialize aiResponses if missing
  message.aiResponses ??= [];

  // Process AI response
  let changedText;
  if (aiResponse.type === 'translation') {
    changedText = await translateText(
      aiResponse.content,
      aiResponse.sourceLanguage,
      aiResponse.targetLanguage
    );
  } else {
    changedText = await summarizeText(aiResponse.content);
  }

  // Detect language of AI response
  const detectedResult = await detectLanguage(changedText);

  const detectedLanguage =
    detectedResult.length > 0 ? detectedResult[0].detectedLanguage : 'unknown';
  const confidence =
    detectedResult.length > 0
      ? Math.floor(detectedResult[0].confidence * 100)
      : 0;

  // Create AI response object
  const newAiResponse = {
    id: uuidv4(),
    type: aiResponse.type,
    content: changedText,
    sourceLanguage: aiResponse.sourceLanguage,
    targetLanguage:
      aiResponse.type === 'translation' ? aiResponse.targetLanguage : null,
    detectedLanguage,
    role: 'ai',
    confidence,
    timestamp
  };

  message.aiResponses.push(newAiResponse);
  saveChatHistory(chatHistory);
}
