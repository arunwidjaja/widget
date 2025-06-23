import { SearchDecisionAgent } from './SearchDecisionAgent';

export class AgentSystem {
  constructor() {
    this.agents = new Map();
    this.defaultAgent = null;
    this.searchDecisionAgent = null;
  }

  registerAgent(name, agent) {
    this.agents.set(name, agent);
    if (!this.defaultAgent) {
      this.defaultAgent = agent;
    }
    
    // Initialize search decision agent when LLM is registered
    if (name === 'llm' && !this.searchDecisionAgent) {
      this.searchDecisionAgent = new SearchDecisionAgent(agent);
    }
  }

  setDefaultAgent(name) {
    const agent = this.agents.get(name);
    if (agent) {
      this.defaultAgent = agent;
    }
  }

  async processMessage(message) {
    // Use intelligent decision to determine if web search is needed
    const needsWebSearch = await this.shouldUseWebSearch(message);

    if (needsWebSearch && this.agents.has('web-search')) {
      const searchAgent = this.agents.get('web-search');
      return await searchAgent.process(message);
    }

    // Use LLM for general responses if available
    if (this.agents.has('llm')) {
      const llmAgent = this.agents.get('llm');
      const llmResponse = await llmAgent.process(message);
      if (llmResponse) {
        return llmResponse;
      }
    }

    // Fallback response if no LLM is configured
    return this.generateFallbackResponse(message);
  }

  async shouldUseWebSearch(message) {
    if (this.searchDecisionAgent) {
      return await this.searchDecisionAgent.shouldUseWebSearch(message);
    }
    
    // Fallback to simple keyword detection if no decision agent
    return this.simpleKeywordDetection(message);
  }

  simpleKeywordDetection(message) {
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

  generateFallbackResponse(message) {
    return "I'd be happy to help you with that! For questions that might need current information, I can search the web for you. Just ask me to search for something specific.";
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  listAgents() {
    return Array.from(this.agents.keys());
  }
} 