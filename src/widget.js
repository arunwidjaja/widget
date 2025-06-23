import './styles.css';
import { ChatWidget } from './components/ChatWidget';
import { AgentSystem } from './agents/AgentSystem';
import { WebSearchAgent } from './agents/WebSearchAgent';
import { LLMAgent } from './agents/LLMAgent';
import { config, isConfigured } from './config';

class AgenticChatbot {
  constructor(userConfig = {}) {
    this.config = {
      ...config.defaultConfig,
      ...userConfig
    };
    
    this.agentSystem = new AgentSystem();
    
    // Register web search agent
    const webSearchAgent = new WebSearchAgent();
    if (config.serperKey) {
      webSearchAgent.setApiKey(config.serperKey);
    }
    this.agentSystem.registerAgent('web-search', webSearchAgent);
    
    // Register LLM agent
    const llmAgent = new LLMAgent(config.openaiKey);
    this.agentSystem.registerAgent('llm', llmAgent);
    
    this.widget = null;
  }

  init() {
    if (this.widget) {
      console.warn('Widget already initialized');
      return;
    }

    this.widget = new ChatWidget(this.config, this.agentSystem);
    this.widget.init();
    
    // Log configuration status
    const status = isConfigured();
    console.log('🤖 Agentic Chatbot Widget Initialized');
    console.log(`OpenAI API: ${status.openai ? '✅' : '❌'}`);
    console.log(`Serper API: ${status.serper ? '✅' : '❌'}`);
    
    if (!status.any) {
      console.warn('⚠️ No API keys configured. Add your keys to .env file for full functionality.');
    }
  }

  destroy() {
    if (this.widget) {
      this.widget.destroy();
      this.widget = null;
    }
  }

  // Public API methods
  show() {
    if (this.widget) {
      this.widget.show();
    }
  }

  hide() {
    if (this.widget) {
      this.widget.hide();
    }
  }

  sendMessage(message) {
    if (this.widget) {
      return this.widget.sendMessage(message);
    }
  }

  // Configuration status methods
  getConfigStatus() {
    return isConfigured();
  }
}

// Auto-initialize if script is loaded directly and has data attributes
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
    if (script) {
      const config = {};
      for (const attr of script.attributes) {
        if (attr.name.startsWith('data-')) {
          const key = attr.name.replace('data-', '');
          config[key] = attr.value;
        }
      }
      
      if (Object.keys(config).length > 0) {
        const chatbot = new AgenticChatbot(config);
        chatbot.init();
      }
    }
  });
}

export default AgenticChatbot; 