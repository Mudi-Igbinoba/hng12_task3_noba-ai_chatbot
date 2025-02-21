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

  console.log('Checking Language Detector...');

  try {
    const capabilities = await window.ai.languageDetector.capabilities();
    if (!capabilities?.available || capabilities.available === 'no') {
      console.log('Language Detector: Not available');
      return [];
    }

    // Create the detector (only once)
    const detector = await window.ai.languageDetector.create();
    const results = await detector.detect(text);

    return results.map(({ detectedLanguage, confidence }) => ({
      detectedLanguage,
      confidence
    }));
  } catch (error) {
    console.error('Error in language detection:', error);
    return [];
  }
}

// Function to translate text
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
) {
  if (!window?.ai?.translator) {
    console.log('Translator unavailable.');
    return text;
  }

  console.log(`Checking Translator...`);

  try {
    const capabilities = await window.ai.translator.capabilities();
    if (!capabilities?.available || capabilities.available === 'no') {
      console.log('Translator: Not available');
      return text;
    }

    let translator;

    if (capabilities.available === 'readily') {
      console.log('Translator is ready.');
      translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage
      });
    } else {
      console.log('Downloading Translator model...');
      translator = await window.ai.translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener(
            'downloadprogress',
            (e: { loaded: number; total: number }) => {
              console.log(`Translator: ${e.loaded} out of ${e.total}`);
            }
          );
        }
      });

      await translator?.ready;
    }

    console.log(`Translating from ${sourceLanguage} to ${targetLanguage}...`);
    const translatedText = await translator.translate(text);
    console.log(`Translation complete: ${translatedText}`);

    return translatedText;
  } catch (error) {
    console.error('Error in translation:', error);
    return text; // Return original text if translation fails
  }
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

  console.log('Checking Summarizer...');

  try {
    const capabilities = await window.ai.summarizer.capabilities();
    if (!capabilities?.available || capabilities.available === 'no') {
      console.log('Summarizer: Not available');
      return text;
    }

    const summarizer = await window.ai.summarizer.create(options);
    return await summarizer.summarize(text, { context: '' });
  } catch (error) {
    console.error('Error in summarization:', error);
    return text;
  }
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
    (msg: { id: string }) => msg.id === messageId
  );
  if (!message) {
    console.error('Message not found.');
    return;
  }

  // Ensure aiResponses exists
  message.aiResponses ??= [];

  try {
    // Process AI response (translation or summary)
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
    const detectedResults = await detectLanguage(changedText);
    const detectedLanguage =
      detectedResults.length > 0
        ? detectedResults[0].detectedLanguage
        : 'unknown';
    const confidence =
      detectedResults.length > 0
        ? Math.floor(detectedResults[0].confidence * 100)
        : 0;

    const newAiResponse: AIResponseType =
      aiResponse.type === 'translation'
        ? {
            id: uuidv4(),
            role: 'ai',
            type: 'translation',
            content: changedText,
            sourceLanguage: aiResponse.sourceLanguage,
            targetLanguage: aiResponse.targetLanguage, // ✅ Required for translation
            detectedLanguage,
            confidence,
            timestamp
          }
        : {
            id: uuidv4(),
            role: 'ai',
            type: 'summary',
            content: changedText,
            sourceLanguage: aiResponse.sourceLanguage,
            detectedLanguage,
            confidence,
            timestamp
          };

    // Add AI response to the user's message's aiResponses array
    message.aiResponses.push(newAiResponse);

    // Save updated chat history
    saveChatHistory(chatHistory);
  } catch (error) {
    console.error('Error processing AI response:', error);
  }
}
