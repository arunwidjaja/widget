export class ChatWidget {
  constructor(config, agentSystem) {
    this.config = config;
    this.agentSystem = agentSystem;
    this.isOpen = false;
    this.isMinimized = false;
    this.messages = [];
    this.element = null;
    this.messageContainer = null;
    this.inputElement = null;
  }

  init() {
    this.createWidget();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createWidget() {
    // Create main container
    this.element = document.createElement('div');
    this.element.id = 'agentic-chatbot-widget';
    this.element.className = 'agentic-chatbot-widget';
    this.element.style.cssText = `
      position: fixed;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ${this.getPositionStyles()}
    `;

    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.className = 'chatbot-button';
    chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    chatButton.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${this.config.primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    `;

    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chatbot-window';
    chatWindow.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></div>
        <span style="font-weight: 600; color: #374151;">${this.config.title}</span>
      </div>
      <button class="minimize-btn" style="background: none; border: none; cursor: pointer; padding: 4px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    `;
    header.style.cssText = `
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9fafb;
    `;

    // Create message container
    this.messageContainer = document.createElement('div');
    this.messageContainer.className = 'chatbot-messages';
    this.messageContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    // Create input area
    const inputArea = document.createElement('div');
    inputArea.className = 'chatbot-input-area';
    inputArea.style.cssText = `
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background: white;
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: flex-end;
    `;

    this.inputElement = document.createElement('textarea');
    this.inputElement.className = 'chatbot-input';
    this.inputElement.placeholder = 'Type your message...';
    this.inputElement.style.cssText = `
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 12px;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      max-height: 100px;
      outline: none;
    `;

    const sendButton = document.createElement('button');
    sendButton.className = 'chatbot-send-btn';
    sendButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22,2 15,22 11,13 2,9"></polygon>
      </svg>
    `;
    sendButton.style.cssText = `
      background: ${this.config.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    `;

    // Assemble the widget
    inputContainer.appendChild(this.inputElement);
    inputContainer.appendChild(sendButton);
    inputArea.appendChild(inputContainer);
    
    chatWindow.appendChild(header);
    chatWindow.appendChild(this.messageContainer);
    chatWindow.appendChild(inputArea);
    
    this.element.appendChild(chatWindow);
    this.element.appendChild(chatButton);

    document.body.appendChild(this.element);
  }

  getPositionStyles() {
    switch (this.config.position) {
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }

  bindEvents() {
    const chatButton = this.element.querySelector('.chatbot-button');
    const minimizeBtn = this.element.querySelector('.minimize-btn');
    const sendButton = this.element.querySelector('.chatbot-send-btn');
    const chatWindow = this.element.querySelector('.chatbot-window');

    chatButton.addEventListener('click', () => this.toggleChat());
    minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    sendButton.addEventListener('click', () => this.sendMessage());
    
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.inputElement.addEventListener('input', () => {
      this.inputElement.style.height = 'auto';
      this.inputElement.style.height = Math.min(this.inputElement.scrollHeight, 100) + 'px';
    });
  }

  toggleChat() {
    const chatWindow = this.element.querySelector('.chatbot-window');
    if (this.isOpen) {
      chatWindow.style.display = 'none';
      this.isOpen = false;
    } else {
      chatWindow.style.display = 'flex';
      this.isOpen = true;
      this.inputElement.focus();
    }
  }

  toggleMinimize() {
    const chatWindow = this.element.querySelector('.chatbot-window');
    if (this.isMinimized) {
      chatWindow.style.height = '500px';
      this.isMinimized = false;
    } else {
      chatWindow.style.height = '60px';
      this.isMinimized = true;
    }
  }

  addWelcomeMessage() {
    this.addMessage({
      type: 'bot',
      content: this.config.welcomeMessage,
      timestamp: new Date()
    });
  }

  addMessage(message) {
    this.messages.push(message);
    this.renderMessage(message);
  }

  renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}-message`;
    
    const isBot = message.type === 'bot';
    const isSearch = message.type === 'search';
    
    messageElement.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 80%;
      ${isBot ? 'align-self: flex-start;' : 'align-self: flex-end;'}
    `;

    const contentElement = document.createElement('div');
    contentElement.style.cssText = `
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      ${isBot ? `
        background: #f3f4f6;
        color: #374151;
        border-bottom-left-radius: 4px;
      ` : `
        background: ${this.config.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      `}
      ${isSearch ? `
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #f59e0b;
      ` : ''}
    `;

    if (isSearch) {
      contentElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span style="font-weight: 600;">Searching the web...</span>
        </div>
        <div>${this.convertMarkdownLinks(message.content)}</div>
      `;
    } else {
      contentElement.innerHTML = this.convertMarkdownLinks(message.content);
    }

    const timeElement = document.createElement('div');
    timeElement.textContent = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeElement.style.cssText = `
      font-size: 11px;
      color: #9ca3af;
      align-self: ${isBot ? 'flex-start' : 'flex-end'};
    `;

    messageElement.appendChild(contentElement);
    messageElement.appendChild(timeElement);
    
    this.messageContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  convertMarkdownLinks(text) {
    // Convert markdown-style links [text](url) to HTML links
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">$1</a>');
  }

  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  async sendMessage(userMessage = null) {
    const message = userMessage || this.inputElement.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage({
      type: 'user',
      content: message,
      timestamp: new Date()
    });

    // Clear input
    this.inputElement.value = '';
    this.inputElement.style.height = 'auto';

    // Show typing indicator
    const typingElement = this.showTypingIndicator();

    try {
      // Process message through agent system
      const response = await this.agentSystem.processMessage(message);
      
      // Remove typing indicator
      this.hideTypingIndicator(typingElement);
      
      // Add bot response
      this.addMessage({
        type: 'bot',
        content: response,
        timestamp: new Date()
      });
    } catch (error) {
      this.hideTypingIndicator(typingElement);
      this.addMessage({
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      });
      console.error('Error processing message:', error);
    }
  }

  showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="display: flex; gap: 2px;">
          <div class="dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
          <div class="dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
          <div class="dot" style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
        </div>
        <span style="font-size: 12px; color: #9ca3af;">AI is thinking...</span>
      </div>
    `;
    typingElement.style.cssText = `
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      max-width: 80%;
    `;
    
    this.messageContainer.appendChild(typingElement);
    this.scrollToBottom();
    return typingElement;
  }

  hideTypingIndicator(typingElement) {
    if (typingElement && typingElement.parentNode) {
      typingElement.parentNode.removeChild(typingElement);
    }
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
} 