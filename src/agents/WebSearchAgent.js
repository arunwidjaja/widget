import axios from 'axios';

export class WebSearchAgent {
  constructor() {
    // Using SerpAPI for web search (free tier available)
    // You can also use Google Custom Search API or other search APIs
    this.apiKey = null;
    this.baseUrl = 'https://serpapi.com/search';
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
      // Fallback to a simple web search simulation
      return this.simulateSearch(query);
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: query,
          api_key: this.apiKey,
          engine: 'google',
          num: 5 // Limit to 5 results
        },
        timeout: 10000
      });

      if (response.data && response.data.organic_results) {
        return response.data.organic_results.slice(0, 5);
      }
      
      return [];
    } catch (error) {
      console.error('Search API error:', error);
      // Fallback to simulation
      return this.simulateSearch(query);
    }
  }

  simulateSearch(query) {
    // This is a fallback that simulates search results
    // In a real implementation, you would use an actual search API
    const mockResults = [
      {
        title: `Search results for: ${query}`,
        snippet: `Here are some relevant results for "${query}". This is a demonstration of the search functionality. In a production environment, this would show real search results from the web.`,
        link: '#'
      },
      {
        title: `Information about ${query}`,
        snippet: `This would contain actual search results about ${query}. The search agent is designed to find current and relevant information from the web.`,
        link: '#'
      },
      {
        title: `Latest updates on ${query}`,
        snippet: `Recent information and updates related to ${query}. The web search capability allows the chatbot to provide up-to-date information.`,
        link: '#'
      }
    ];
    
    return mockResults;
  }

  formatSearchResults(query, results) {
    let response = `Here's what I found for "${query}":\n\n`;
    
    results.forEach((result, index) => {
      response += `${index + 1}. **${result.title}**\n`;
      response += `${result.snippet}\n`;
      if (result.link && result.link !== '#') {
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

1. Sign up for a free API key at https://serpapi.com/
2. Set the API key using: chatbot.agentSystem.getAgent('web-search').setApiKey('your-api-key')

Alternative search APIs you can use:
- Google Custom Search API
- Bing Search API
- DuckDuckGo API (free)

Currently using simulated search results for demonstration.
    `;
  }
} 