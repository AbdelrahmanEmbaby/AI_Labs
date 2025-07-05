import { marked } from 'marked';

export default class ChatView {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.input = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
    }

    bindSendMessage(handler) {
        this.sendButton.addEventListener('click', () => {
            if (this.input.value.trim()) {
                handler(this.input.value.trim());
                this.input.value = '';
            }
        });

        this.input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                handler(this.input.value.trim());
                this.input.value = '';
            }
        });
    }

    renderMessages(messages) {
        this.chatContainer.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.sender === 'You' ? 'you' : 'ai'}`;
            div.innerHTML = marked.parse(msg.content);
            if (msg.sender !== 'You') this.addCopyButtons(div);
            this.chatContainer.appendChild(div);
        });
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    renderLoading() {
        const div = document.createElement('div');
        div.className = 'message ai typing';
        div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        this.chatContainer.appendChild(div);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    removeLoading() {
        const typing = this.chatContainer.querySelector('.typing');
        if (typing) typing.remove();
    }

    addCopyButtons(parent) {
        parent.querySelectorAll('pre').forEach(pre => {
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.innerText = 'Copy';
            btn.onclick = () => {
                navigator.clipboard.writeText(pre.innerText);
                btn.innerText = 'Copied!';
                setTimeout(() => (btn.innerText = 'Copy'), 2000);
            };
            pre.appendChild(btn);
        });
    }
}
