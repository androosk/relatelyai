import createClient, { APIError } from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';
import { Message } from 'types/chat';

const anthropic = new createClient({
  apiKey: ANTHROPIC_API_KEY,
});

const RELATIONSHIP_THERAPIST_PROMPT = `You are a compassionate relationship therapist in the RelatelyAI app. 
Your role is to provide thoughtful, empathetic relationship advice while maintaining these principles:

1. Emphasize active listening and validate users' feelings
2. Suggest constructive communication techniques
3. Help identify patterns in relationships
4. Offer evidence-based advice
5. Encourage self-reflection
6. Maintain boundaries and recommend professional help when appropriate
7. Never encourage staying in abusive relationships
8. Balance optimism with realism - don't give false hope, but help find constructive paths forward
9. Keep responses concise and actionable for mobile interface

Always respond in a warm, empathetic tone while providing practical insights.`;

export const getChatResponse = async (messages: Message[]): Promise<string | never> => {
  try {
    // Format messages for Claude API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      system: RELATIONSHIP_THERAPIST_PROMPT,
      messages: formattedMessages,
      max_tokens: 1000,
    });

    // Process response content based on type
    let responseText = '';

    // Loop through all content blocks and extract text
    for (const block of response.content) {
      if (block.type === 'text') {
        responseText += block.text;
      }
    }

    // If we didn't get any text content
    if (!responseText) {
      console.warn('No text content in response:', response);
      return "I'm having trouble generating a response right now. Please try again.";
    }

    return responseText;
  } catch (error: unknown) {
    console.error('Error getting AI response:', error);

    // Provide more helpful error message based on common API errors
    if (error instanceof APIError) {
      if (error.status === 429) {
        return "I'm currently handling too many requests. Please try again in a moment.";
      } else if (error.status === 400) {
        return "I couldn't process that request. Please try a different question.";
      } else {
        throw error; // This is fine with Promise<string | never>
      }
    }

    // Re-throw any other type of error
    throw error; // This is fine with Promise<string | never>
  }
};

// Optional: Add a function to detect potentially harmful content
export const isMessageAppropriate = (message: string): boolean => {
  // Simple check for abusive language or harmful content
  const harmfulTerms = [
    'kill',
    'suicide',
    'die',
    'hurt',
    'harm',
    // Add other terms that might indicate harmful intent
  ];

  const lowerMessage = message.toLowerCase();

  for (const term of harmfulTerms) {
    if (lowerMessage.includes(term)) {
      // This is a very simple check - in production you might want
      // to use a more sophisticated content filtering approach
      return false;
    }
  }

  return true;
};

// Utility function to create a safety message when inappropriate content is detected
export const getSafetyMessage = (): string => {
  return "I notice your message mentions potentially concerning topics. As a relationship advisor, I'm here to help with relationship challenges, but I recommend speaking with a mental health professional for issues related to harm or safety. Would you like to discuss a different relationship topic instead?";
};
