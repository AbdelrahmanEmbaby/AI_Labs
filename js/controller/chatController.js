import ChatModel from '../model/chatModel.js';
import ChatView from '../view/chatView.js';
import { API_URL, API_KEY } from '../config/config.js';

export default class ChatController {
    constructor() {
        this.model = new ChatModel();
        this.view = new ChatView();
        this.view.bindSendMessage(this.handleUserMessage.bind(this));
    }

    async handleUserMessage(text) {
        this.model.addMessage('You', text);
        this.view.renderMessages(this.model.getMessages());
        this.view.renderLoading();

        const response = await this.fetchGeminiResponse(text);

        this.view.removeLoading();
        this.model.addMessage('Gemini', response);
        this.view.renderMessages(this.model.getMessages());
    }

    async fetchGeminiResponse(text) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    message: text
                })
            });
            const data = await res.json();
            return data.text || 'No response.';
        } catch (error) {
            console.error(error);
            return 'Error connecting to AI.';
        }
    }
}
