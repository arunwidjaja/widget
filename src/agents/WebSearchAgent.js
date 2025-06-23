import axios from 'axios';

export class WebSearchAgent {
  constructor() {
    // Using SerperAPI for web search (free tier available)
    this.apiKey = null;
    this.baseUrl = 'https://google.serper.dev/search';
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async process(message) {
    try {
      // Extract search query from message
      const searchQuery = this.extractSearchQuery(message);
      
      if (!searchQuery) {
        return "I'm not sure what you'd like me to search for. Could you please be more specific?";
      }

      // Perform web search
      const searchResults = await this.performSearch(searchQuery);
      
      if (!searchResults || searchResults.length === 0) {
        return `I couldn't find any results for "${searchQuery}". Please try rephrasing your search or ask me something else.`;
      }

      // Format and return results
      return this.formatSearchResults(searchQuery, searchResults);
      
    } catch (error) {
      console.error('Web search error:', error);
      
      if (error.response?.status === 401) {
        return "I'm having trouble accessing the search service. Please check the API configuration.";
      }
      
      return "I encountered an error while searching the web. Please try again in a moment.";
    }
  }

  extractSearchQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    // Remove common prefixes
    const prefixes = [
      'search for', 'search', 'find', 'look up', 'what is', 'who is',
      'tell me about', 'get information about', 'find out about'
    ];
    
    let query = message;
    for (const prefix of prefixes) {
      if (lowerMessage.startsWith(prefix)) {
        query = message.substring(prefix.length).trim();
        break;
      }
    }
    
    // Clean up the query
    query = query.replace(/^[?.,!]+/, '').trim();
    
    return query || null;
  }

  async performSearch(query) {
    if (!this.apiKey) {
      throw new Error('Serper API key not configured. Please set the API key to enable real web search.');
    }

    try {
      const response = await axios.post(this.baseUrl, {
        q: query,
        num: 5 // Limit to 5 results
      }, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data && response.data.organic) {
        return response.data.organic.slice(0, 5);
      }
      
      return [];
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  }

  formatSearchResults(query, results) {
    let response = `Here's what I found for "${query}":\n\n`;
    
    results.forEach((result, index) => {
      response += `${index + 1}. **${result.title}**\n`;
      response += `${result.snippet}\n`;
      if (result.link) {
        response += `[Read more](${result.link})\n`;
      }
      response += '\n';
    });
    
    response += `*Found ${results.length} result${results.length !== 1 ? 's' : ''} for your search.*`;
    
    return response;
  }

  // Method to check if API is configured
  isConfigured() {
    return !!this.apiKey;
  }

  // Method to get configuration instructions
  getConfigurationInstructions() {
    return `
To enable real web search functionality:

1. Get your API key from https://serper.dev/
2. Set the API key using: chatbot.agentSystem.getAgent('web-search').setApiKey('your-serper-key')

Currently using real Serper API for web search.
    `;
  }
} 