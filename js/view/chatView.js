import { marked } from 'marked';

export default class ChatView {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.input = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.fileInput = document.getElementById('file-input');
        this.selectedFile = null;
    }

    bindSendMessage(handler) {
        this.sendButton.addEventListener('click', () => {
            if (this.input.value.trim() || this.selectedFile) {
                handler(this.input.value.trim(), this.selectedFile);
                this.input.value = '';
                this.clearSelectedFile();
            }
        });

        this.input.addEventListener('keydown', e => {
            if ((e.key === 'Enter') && (this.input.value.trim() || this.selectedFile)) {
                handler(this.input.value.trim(), this.selectedFile);
                this.input.value = '';
                this.clearSelectedFile();
            }
        });
    }

    bindFileUpload() {
        this.fileInput.addEventListener('change', e => {
            if (e.target.files.length > 0) {
                this.selectedFile = e.target.files[0];
                this.renderFileInlinePreview(this.selectedFile);
            }
        });
    }

    renderFileInlinePreview(file) {
        const existing = document.getElementById('file-preview-inline');
        if (existing) existing.remove();

        const previewDiv = document.createElement('div');
        previewDiv.id = 'file-preview-inline';
        previewDiv.style.marginTop = '8px';

        const fileName = document.createElement('div');
        fileName.textContent = `📎 ${file.name}`;
        fileName.style.fontSize = '0.85rem';
        fileName.style.color = '#ccc';
        previewDiv.appendChild(fileName);

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.style.maxWidth = '200px';
            img.style.marginTop = '0.5rem';
            img.style.borderRadius = '6px';
            previewDiv.appendChild(img);
        }

        this.input.parentNode.insertBefore(previewDiv, this.sendButton);
    }

    clearSelectedFile() {
        this.selectedFile = null;
        this.fileInput.value = '';
        const preview = document.getElementById('file-preview-inline');
        if (preview) preview.remove();
    }

    renderMessages(messages) {
        this.chatContainer.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.sender === 'You' ? 'you' : 'ai'}`;

            // Message text if exists
            if (msg.content) {
                const textDiv = document.createElement('div');
                textDiv.innerHTML = marked.parse(msg.content);
                div.appendChild(textDiv);
            }

            // Attached file if exists
            if (msg.file) {
                if (msg.file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = msg.fileURL;
                    img.alt = msg.file.name;
                    img.style.maxWidth = '200px';
                    img.style.marginTop = '0.5rem';
                    img.style.borderRadius = '6px';
                    div.appendChild(img);
                } else {
                    const link = document.createElement('a');
                    link.href = msg.fileURL;
                    link.download = msg.file.name;
                    link.innerText = `📎 ${msg.file.name}`;
                    link.target = '_blank';
                    div.appendChild(link);
                }
            }

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
