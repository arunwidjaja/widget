export class AgentSystem {
  constructor() {
    this.agents = new Map();
    this.defaultAgent = null;
  }

  registerAgent(name, agent) {
    this.agents.set(name, agent);
    if (!this.defaultAgent) {
      this.defaultAgent = agent;
    }
  }

  setDefaultAgent(name) {
    const agent = this.agents.get(name);
    if (agent) {
      this.defaultAgent = agent;
    }
  }

  async processMessage(message) {
    // Simple keyword-based routing
    const lowerMessage = message.toLowerCase();
    
    // Check if message requires web search
    const searchKeywords = [
      'search', 'find', 'look up', 'what is', 'who is', 'when', 'where', 'how to',
      'latest', 'news', 'weather', 'price', 'cost', 'definition', 'meaning',
      'current', 'recent', 'today', 'yesterday', 'tomorrow'
    ];

    const needsSearch = searchKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    ) || 
    // Also search for questions that might need current information
    (lowerMessage.includes('?') && (
      lowerMessage.includes('what') || 
      lowerMessage.includes('when') || 
      lowerMessage.includes('where') || 
      lowerMessage.includes('how') || 
      lowerMessage.includes('why') ||
      lowerMessage.includes('current') ||
      lowerMessage.includes('latest')
    ));

    if (needsSearch && this.agents.has('web-search')) {
      const searchAgent = this.agents.get('web-search');
      return await searchAgent.process(message);
    }

    // Default response for general questions
    return this.generateDefaultResponse(message);
  }

  generateDefaultResponse(message) {
    const responses = [
      "I'd be happy to help you with that! For questions that might need current information, I can search the web for you. Just ask me to search for something specific.",
      "That's an interesting question! If you need the latest information, I can search the web. Try asking me something like 'search for current weather' or 'find latest news about...'",
      "I can help you with general questions, and I also have the ability to search the web for current information. What would you like to know?",
      "For questions that require up-to-date information, I can perform web searches. Just let me know what you'd like me to search for!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  listAgents() {
    return Array.from(this.agents.keys());
  }
} 