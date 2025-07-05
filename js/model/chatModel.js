export default class ChatModel {
    constructor() {
        this.messages = [];
    }

    addMessage(sender, content) {
        this.messages.push({ sender, content });
    }

    getMessages() {
        return this.messages;
    }
}
  