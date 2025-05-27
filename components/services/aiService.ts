import createClient, { APIError } from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';
import { Message } from 'types/chat';

if (!ANTHROPIC_API_KEY) {
  console.warn('Anthropic API key is not configured. Please add it to your .env file');
}

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

export const isMessageAppropriate = (message: string): boolean => {
  const harmfulTerms = [
    'kill',
    'suicide',
    'die',
    'hurt',
    'harm',
    'abuse',
    'murder',
    'weapon',
    'gun',
    'knife',
    'attack',
    'hit',
    'punch',
    'illegal',
    'drugs',
    'assault',
    'molest',
    'rape',
  ];

  const concernTerms = [
    'beat',
    'control',
    'afraid',
    'scared',
    'terrified',
    'threatened',
    'stalking',
    'stalk',
    'follow',
    'isolation',
    'isolate',
    'humiliate',
    'degrade',
    'shame',
    'trapped',
    'force',
    'forced',
  ];

  const lowerMessage = message.toLowerCase();

  for (const term of harmfulTerms) {
    if (lowerMessage.includes(term)) {
      return false;
    }
  }

  for (const term of concernTerms) {
    if (lowerMessage.includes(term)) {
      const abusePhrases = [
        'my partner ' + term,
        term + ' me',
        'i am ' + term,
        'they ' + term,
        'he ' + term,
        'she ' + term,
      ];

      for (const phrase of abusePhrases) {
        if (lowerMessage.includes(phrase)) {
          return true;
        }
      }
    }
  }

  return true;
};

export const getSafetyMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  const abuseIndicators = [
    'hit',
    'hurt',
    'beat',
    'punch',
    'slap',
    'push',
    'shove',
    'afraid',
    'scared',
    'fear',
    'terrified',
    'control',
    'controlling',
    'threatened',
    'threatening',
    'threat',
    'weapon',
    'gun',
    'knife',
  ];

  const hasAbuseIndicators = abuseIndicators.some((term) => lowerMessage.includes(term));

  if (hasAbuseIndicators) {
    return `I notice you've mentioned some concerning behaviors that could indicate abuse. Your safety is the top priority. 

If you're in immediate danger, please contact emergency services (911 in the US).

The National Domestic Violence Hotline is available 24/7 at 1-800-799-7233 or text START to 88788. They can provide confidential support, information, and referrals.

While I can help with relationship advice, professional support is essential in potentially abusive situations. Would you like to discuss other aspects of your relationship where I might be helpful?`;
  }

  return "I notice your message mentions potentially concerning topics. As a relationship advisor, I'm here to help with relationship challenges, but I recommend speaking with a mental health professional for issues related to harm or safety. Would you like to discuss a different relationship topic instead?";
};

export const getChatResponse = async (messages: Message[]): Promise<string> => {
  console.log('AiService: getChatResponse called with', messages.length, 'messages');

  const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user');

  if (lastUserMessage) {
    const messageContent = lastUserMessage.content;

    if (!isMessageAppropriate(messageContent)) {
      console.log('AiService: Safety check triggered - potentially harmful content detected');
      return getSafetyMessage(messageContent);
    }
  }

  try {
    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'dummy-key-for-dev') {
      console.warn('AiService: API key is not properly configured');
      return "I'm having trouble connecting to my knowledge base. Please check your API configuration.";
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    console.log('AiService: Calling Anthropic API...');

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307', // Using Haiku for faster responses
        system: RELATIONSHIP_THERAPIST_PROMPT,
        messages: formattedMessages,
        max_tokens: 1000,
      });

      console.log('AiService: Received response from API');

      let responseText = '';

      for (const block of response.content) {
        if (block.type === 'text') {
          responseText += block.text;
        }
      }

      if (!responseText) {
        console.warn('AiService: No text content in response:', response);
        return "I'm having trouble generating a response right now. Please try again.";
      }

      return responseText;
    } catch (modelError) {
      console.error('AiService: Error with haiku model, trying sonnet:', modelError);

      // If haiku fails, try sonnet
      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229', // Fallback to Sonnet
        system: RELATIONSHIP_THERAPIST_PROMPT,
        messages: formattedMessages,
        max_tokens: 1000,
      });

      // Process response content
      let responseText = '';
      for (const block of response.content) {
        if (block.type === 'text') {
          responseText += block.text;
        }
      }

      return (
        responseText || "I'm having trouble generating a response right now. Please try again."
      );
    }
  } catch (error: unknown) {
    console.error('AiService: Error getting AI response:', error);

    if (error instanceof APIError) {
      console.error('AiService: Anthropic API error status:', error.status);

      if (error.status === 401) {
        return "I'm unable to respond because of an authentication issue. Please check your API key configuration.";
      } else if (error.status === 429) {
        return "I'm currently handling too many requests. Please try again in a moment.";
      } else if (error.status === 400) {
        return "I couldn't process that request. Please try a different question.";
      } else if (error.status === 404) {
        return "I'm having trouble connecting to my knowledge base. The model specified may not be available.";
      }
    }

    return 'An unexpected error occurred. Please try again later.';
  }
};
