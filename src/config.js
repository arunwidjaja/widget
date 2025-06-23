// Environment variables are loaded by dotenv-webpack plugin
export const config = {
    // API Keys
    openaiKey: process.env.OPENAI_API_KEY || null,
    serperKey: process.env.SERPER_API_KEY || null,
    
    // Widget Configuration
    defaultConfig: {
        position: 'bottom-right',
        title: 'AI Assistant',
        welcomeMessage: 'Hello! I can help you with questions and web searches. How can I assist you today?',
        primaryColor: '#007bff'
    }
};

// Helper function to check if APIs are configured
export const isConfigured = () => {
    return {
        openai: !!config.openaiKey,
        serper: !!config.serperKey,
        any: !!(config.openaiKey || config.serperKey)
    };
};

// Helper function to get configuration status
export const getConfigStatus = () => {
    const status = isConfigured();
    return {
        openai: status.openai ? '✅ Configured' : '❌ Not configured',
        serper: status.serper ? '✅ Configured' : '❌ Not configured',
        message: status.any 
            ? 'Some APIs are configured and ready to use!'
            : 'No APIs configured. Please add your API keys to the .env file.'
    };
}; 