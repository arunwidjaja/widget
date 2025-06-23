# 🤖 Agentic Chatbot Widget

A powerful, customizable chatbot widget with agentic capabilities for websites. This widget can perform web searches and is designed to be easily extensible for additional agentic tasks like booking, shopping, and more.

## ✨ Features

- **🌐 Web Search**: Automatically searches the web for current information
- **🎨 Customizable**: Easy to customize colors, position, title, and messages
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **🔌 Easy Integration**: Simple one-line integration with any website
- **⚡ Fast & Lightweight**: Optimized for performance
- **🔧 Extensible**: Modular architecture for adding new agents

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Widget

```bash
npm run build
```

### 3. Run the Demo

```bash
npm run serve
```

Then open `http://localhost:8080/demo.html` in your browser.

## 📦 Installation

### Option 1: Direct Script Tag

Add this to your HTML:

```html
<script src="dist/widget.js"></script>
<script>
const chatbot = new AgenticChatbot({
    title: 'My AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    primaryColor: '#007bff',
    position: 'bottom-right'
});

chatbot.init();
</script>
```

### Option 2: NPM Package (Future)

```bash
npm install agentic-chatbot-widget
```

```javascript
import AgenticChatbot from 'agentic-chatbot-widget';

const chatbot = new AgenticChatbot(config);
chatbot.init();
```

## ⚙️ Configuration

### Basic Configuration

```javascript
const chatbot = new AgenticChatbot({
    // Basic settings
    title: 'Your Assistant Name',
    welcomeMessage: 'Custom welcome message',
    primaryColor: '#your-brand-color',
    position: 'bottom-right', // or 'bottom-left', 'top-right', 'top-left'
});
```

### Advanced Configuration

```javascript
const chatbot = new AgenticChatbot({
    // Basic settings
    title: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    primaryColor: '#007bff',
    position: 'bottom-right',
    
    // Advanced settings
    apiKey: 'your-search-api-key', // For real web search
    maxResults: 5, // Number of search results to show
    autoOpen: false, // Don't auto-open on page load
    showTimestamp: true // Show message timestamps
});
```

## 🔍 Web Search Setup

The widget currently uses simulated search results for the demo. To enable real web search:

### Option 1: SerpAPI (Recommended for demo)

1. Sign up for free at [serpapi.com](https://serpapi.com/)
2. Get your API key from the dashboard
3. Add this code after initialization:

```javascript
// Enable real web search
chatbot.agentSystem.getAgent('web-search').setApiKey('your-serpapi-key');
```

### Option 2: Google Custom Search API

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Custom Search API
3. Create API credentials
4. Set up Custom Search Engine
5. Configure the WebSearchAgent to use Google's API

### Option 3: Other Search APIs

You can easily modify the `WebSearchAgent` class to use other search APIs like:
- Bing Search API
- DuckDuckGo API (free)
- Custom search endpoints

## 🔧 Extending the System

The modular architecture makes it easy to add new capabilities:

### Adding a New Agent

```javascript
// Example: Booking Agent
class BookingAgent {
    async process(message) {
        // Handle booking requests
        if (message.toLowerCase().includes('book')) {
            return 'I can help you book tickets, appointments, etc.';
        }
        return null; // Let other agents handle it
    }
}

// Register the new agent
chatbot.agentSystem.registerAgent('booking', new BookingAgent());
```

### Custom Agent Example

```javascript
class WeatherAgent {
    async process(message) {
        if (message.toLowerCase().includes('weather')) {
            // Call weather API
            const weather = await this.getWeatherData();
            return `Current weather: ${weather.description}, ${weather.temperature}°C`;
        }
        return null;
    }
    
    async getWeatherData() {
        // Implement weather API call
        return { description: 'Sunny', temperature: 22 };
    }
}

chatbot.agentSystem.registerAgent('weather', new WeatherAgent());
```

## 📁 Project Structure

```
widget/
├── src/
│   ├── components/
│   │   └── ChatWidget.js      # Main UI component
│   ├── agents/
│   │   ├── AgentSystem.js     # Agent management system
│   │   └── WebSearchAgent.js  # Web search functionality
│   ├── styles.css             # Widget styles
│   └── widget.js              # Main entry point
├── dist/
│   └── widget.js              # Built widget (generated)
├── demo.html                  # Demo page
├── package.json               # Dependencies and scripts
├── webpack.config.js          # Build configuration
└── README.md                  # This file
```

## 🧠 Core Logic Files

The main core logic of the widget is distributed across several key files:

### **Primary Entry Point**
**`src/widget.js`** - Main entry point that:
- Imports all components and agents
- Defines the `AgenticChatbot` class
- Handles configuration and initialization
- Exports the widget for use

### **Core Logic Files**

#### **1. `src/components/ChatWidget.js`** (Most Important)
Contains the **main UI and interaction logic**:
- Creates the floating chat interface
- Handles user input and message display
- Manages chat state and conversation flow
- Controls show/hide/minimize functionality
- Renders messages and typing indicators
- Handles all user interactions

#### **2. `src/agents/AgentSystem.js`**
Contains the **intelligence and routing logic**:
- Determines which agent should handle each message
- Routes messages to appropriate agents (web search vs general chat)
- Manages the agent registry
- Provides fallback responses

#### **3. `src/agents/WebSearchAgent.js`**
Contains the **web search functionality**:
- Extracts search queries from user messages
- Performs web searches (real or simulated)
- Formats search results
- Handles search API integration

### **File Hierarchy by Importance**
```
src/
├── widget.js              # 🎯 Entry point & main class
├── components/
│   └── ChatWidget.js      # 🔥 CORE UI LOGIC (Most important)
└── agents/
    ├── AgentSystem.js     # 🧠 Intelligence & routing
    └── WebSearchAgent.js  # 🌐 Search functionality
```

### **Modification Guide**
- **UI/Interface changes**: Edit `ChatWidget.js`
- **Behavior/Intelligence changes**: Edit `AgentSystem.js` 
- **Search functionality**: Edit `WebSearchAgent.js`
- **Configuration/Setup**: Edit `widget.js`

## 🛠️ Development

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### Building for Production

```bash
npm run build
```

### Local Development Server

```bash
npm run serve
```

## 🎯 Usage Examples

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to my website</h1>
    
    <!-- Chatbot Widget -->
    <script src="dist/widget.js"></script>
    <script>
        const chatbot = new AgenticChatbot({
            title: 'Customer Support',
            welcomeMessage: 'Hi! I\'m here to help. What can I assist you with today?',
            primaryColor: '#28a745'
        });
        chatbot.init();
    </script>
</body>
</html>
```

### Advanced Integration with Real Search

```html
<script src="dist/widget.js"></script>
<script>
    const chatbot = new AgenticChatbot({
        title: 'AI Assistant',
        welcomeMessage: 'Hello! I can search the web for current information.',
        primaryColor: '#007bff'
    });
    
    chatbot.init();
    
    // Enable real web search
    chatbot.agentSystem.getAgent('web-search').setApiKey('your-api-key');
    
    // Add custom agent
    class CustomAgent {
        async process(message) {
            if (message.includes('help')) {
                return 'I can help you with various tasks. Try asking me to search for something!';
            }
            return null;
        }
    }
    
    chatbot.agentSystem.registerAgent('custom', new CustomAgent());
</script>
```

## 🧪 Testing

The demo page includes test buttons for different scenarios:

- Weather searches
- News searches
- Price inquiries
- General information
- Basic chat

Try asking questions like:
- "What is the current weather in New York?"
- "Search for latest news about AI"
- "What is the current price of Bitcoin?"
- "Find information about renewable energy"
- "Hello, how are you?"

## 🔒 Security Considerations

- API keys should be stored securely
- Consider rate limiting for search requests
- Validate user input before processing
- Use HTTPS in production
- Consider implementing user authentication for sensitive operations

## 🌟 Future Enhancements

- [ ] Voice input/output
- [ ] File upload capabilities
- [ ] Multi-language support
- [ ] Analytics and reporting
- [ ] User authentication
- [ ] Conversation history
- [ ] Integration with CRM systems
- [ ] Advanced NLP processing
- [ ] Custom training for specific domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the demo page for examples
- Review the configuration options
- Test with the provided examples
- Check the browser console for error messages

## 🎉 Demo

Visit the demo page to see the widget in action:
- Open `demo.html` in your browser
- Try the test buttons
- Ask questions in the chat
- Explore the configuration options

The demo showcases all the widget's features and provides examples for integration.