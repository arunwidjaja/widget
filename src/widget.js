import './styles.css';
import { ChatWidget } from './components/ChatWidget';
import { AgentSystem } from './agents/AgentSystem';
import { WebSearchAgent } from './agents/WebSearchAgent';

class AgenticChatbot {
  constructor(config = {}) {
    this.config = {
      position: 'bottom-right',
      title: 'AI Assistant',
      welcomeMessage: 'Hello! I can help you with questions and web searches. How can I assist you today?',
      primaryColor: '#007bff',
      ...config
    };
    
    this.agentSystem = new AgentSystem();
    this.agentSystem.registerAgent('web-search', new WebSearchAgent());
    
    this.widget = null;
  }

  init() {
    if (this.widget) {
      console.warn('Widget already initialized');
      return;
    }

    this.widget = new ChatWidget(this.config, this.agentSystem);
    this.widget.init();
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
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
  window.AgenticChatbot = AgenticChatbot;
  
  // Auto-init with default config if data attributes are present
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