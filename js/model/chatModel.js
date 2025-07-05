export default class ChatModel {
    constructor() {
        this.messages = [];
    }

    addMessage(sender, content = null, file = null, fileURL = null) {
        this.messages.push({ sender, content, file, fileURL });
    }

    getMessages() {
        return this.messages;
    }
}
