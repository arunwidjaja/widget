export class LLMAgent {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async process(message, options = {}) {
        if (!this.apiKey) {
            return null; // Fall back to other agents if no API key
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: options.systemPrompt || `You are a helpful AI assistant with access to web search capabilities. 
                            You can help users with general questions, provide information, and assist with various tasks.
                            Keep responses concise and helpful. If a user asks about current events, recent information, 
                            or anything that might need up-to-date data, suggest they use web search instead of making up information.`
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: options.maxTokens || 200,
                    temperature: options.temperature || 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('LLM API error:', error);
            return null; // Fall back to other agents
        }
    }

    // Special method for decision-making prompts
    async processDecision(message) {
        return await this.process(message, {
            systemPrompt: 'You are a decision-making AI. Respond with only the requested decision (YES/NO, etc.) without any additional text.',
            maxTokens: 10,
            temperature: 0.1
        });
    }

    isConfigured() {
        return !!this.apiKey;
    }
} 