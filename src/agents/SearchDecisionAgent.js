export class SearchDecisionAgent {
    constructor(llmAgent) {
        this.llmAgent = llmAgent;
    }

    async shouldUseWebSearch(message) {
        if (!this.llmAgent || !this.llmAgent.isConfigured()) {
            // Fallback to simple keyword detection if no LLM available
            return this.fallbackDecision(message);
        }

        try {
            const decisionPrompt = `You are an AI assistant that determines whether a user's question requires current, real-time information from the web to answer accurately.

Question: "${message}"

Analyze this question and respond with ONLY "YES" or "NO":

- Answer "YES" if the question requires:
  * Current events, news, or recent developments
  * Real-time data (weather, stock prices, live sports scores)
  * Information that changes frequently (prices, availability, status)
  * Breaking news or ongoing situations
  * Information that might be outdated in AI training data

- Answer "NO" if the question is about:
  * General knowledge, definitions, or concepts
  * Historical facts or established information
  * How things work or explanations
  * Static information that doesn't change frequently

Respond with only "YES" or "NO":`;

            const response = await this.llmAgent.process(decisionPrompt);
            const decision = response?.trim().toUpperCase();
            
            return decision === 'YES';
        } catch (error) {
            console.error('Error in search decision:', error);
            return this.fallbackDecision(message);
        }
    }

    fallbackDecision(message) {
        // Simple fallback logic when LLM is not available
        const lowerMessage = message.toLowerCase();
        
        const currentInfoKeywords = [
            'latest', 'current', 'recent', 'today', 'yesterday', 'tomorrow',
            'now', 'this week', 'this month', 'this year',
            'breaking', 'just happened', 'latest news', 'current events',
            'weather', 'temperature', 'forecast',
            'price', 'cost', 'stock price', 'cryptocurrency',
            'election results', 'sports scores', 'live'
        ];

        const explicitSearchKeywords = [
            'search for', 'search', 'find', 'look up', 'google', 'search the web'
        ];

        return currentInfoKeywords.some(keyword => lowerMessage.includes(keyword)) ||
               explicitSearchKeywords.some(keyword => lowerMessage.includes(keyword));
    }
} 