import "dotenv/config";
import express from 'express';
import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialize LangChain chat model
const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
});

// Create a prompt template
const template = "Human: {input}\nAssistant:";
const prompt = PromptTemplate.fromTemplate(template);

// Initialize LLM chain
const chain = new LLMChain({ llm: model, prompt });

// Socket.IO connection handler
const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected');

        socket.on('chat-query', async ({message,history}) => {
            let _prompted_inp = `
            You're a professional agriculture and farming consultant. You're chatting with a user who needs help with their farming business or similar.
            The following is the past chat history: ${JSON.stringify(history)} 
            Based on that, respond the following user query: ${message}
            
            `
            try {
                let response = '';
                const callback = (token) => {
                    response += token;
                    // Stream each token to the client
                    socket.emit('chat-response-stream', { token });
                };

                // Process the query using LangChain
                await chain.call(
                    {
                        input: _prompted_inp,
                    },
                    [
                        {
                            handleLLMNewToken: callback,
                        },
                    ]
                );

                // Send completion signal
                socket.emit('chat-complete', { fullResponse: response });
            } catch (error) {
                console.error('Chat processing error:', error);
                socket.emit('chat-error', { error: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

// REST endpoint for non-streaming responses
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await chain.call({ input: message });
        res.json({ response: response.response });
    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export both router and socket initializer
export { router, initializeSocket };