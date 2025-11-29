/**
 * Telegram Web Chat Widget with WebSocket Support
 * Real-time chat widget for FastAPI backend
 */

const ChatWidget = (function() {
    let config = {
        apiUrl: '',
        websocketUrl: '',
        reconnectDelay: 3000,
        maxReconnectAttempts: 5,
        autoOpen: false,  // Auto-open on page load
        openOnNewMessage: false  // Auto-open when receiving new message
    };

    let state = {
        sessionToken: null,
        websocket: null,
        isOpen: false,
        isConnected: false,
        reconnectAttempts: 0,
        messages: new Map(),  // message_id -> message
        selectedFile: null
    };

    let elements = {};

    function init(userConfig) {
        config = { ...config, ...userConfig };

        // Build WebSocket URL if not provided
        if (!config.websocketUrl) {
            const protocol = config.apiUrl.startsWith('https') ? 'wss' : 'ws';
            const url = new URL(config.apiUrl);
            config.websocketUrl = `${protocol}://${url.host}/ws`;
        }

        cacheElements();
        bindEvents();
        restoreSession();
    }

    function cacheElements() {
        elements.chatButton = document.getElementById('chat-button');
        elements.chatWindow = document.getElementById('chat-window');
        elements.chatClose = document.getElementById('chat-close');
        elements.welcomeScreen = document.getElementById('welcome-screen');
        elements.welcomeForm = document.getElementById('welcome-form');
        elements.chatMessages = document.getElementById('chat-messages');
        elements.chatInputContainer = document.getElementById('chat-input-container');
        elements.chatForm = document.getElementById('chat-form');
        elements.chatInput = document.getElementById('chat-input');
        elements.unreadBadge = document.getElementById('unread-badge');
        elements.fileInput = document.getElementById('file-input');
        elements.attachBtn = document.getElementById('attach-btn');
        elements.filePreview = document.getElementById('file-preview');
        elements.imagePreview = document.getElementById('image-preview');
        elements.fileInfo = document.getElementById('file-info');
        elements.fileName = document.getElementById('file-name');
        elements.removeFileBtn = document.getElementById('remove-file');
        elements.connectionStatus = document.getElementById('connection-status');
    }

    function bindEvents() {
        elements.chatButton.addEventListener('click', toggleChat);
        elements.chatClose.addEventListener('click', closeChat);
        elements.welcomeForm.addEventListener('submit', handleWelcomeSubmit);
        elements.chatForm.addEventListener('submit', handleMessageSubmit);

        if (elements.attachBtn) {
            elements.attachBtn.addEventListener('click', () => elements.fileInput.click());
        }

        if (elements.fileInput) {
            elements.fileInput.addEventListener('change', handleFileSelect);
        }

        if (elements.removeFileBtn) {
            elements.removeFileBtn.addEventListener('click', clearFileSelection);
        }

        // Paste event for images
        elements.chatInput.addEventListener('paste', handlePaste);
        document.addEventListener('paste', handlePasteGlobal);

        // Typing indicator
        elements.chatInput.addEventListener('input', handleTyping);
    }

    function toggleChat() {
        if (state.isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    function openChat() {
        elements.chatWindow.style.display = 'flex';
        elements.chatButton.style.display = 'none';
        state.isOpen = true;

        if (state.sessionToken) {
            elements.chatInput.focus();
        }
    }

    function closeChat() {
        elements.chatWindow.style.display = 'none';
        elements.chatButton.style.display = 'flex';
        state.isOpen = false;
    }

    function restoreSession() {
        const sessionToken = localStorage.getItem('chat_session_token');
        if (sessionToken) {
            state.sessionToken = sessionToken;
            showChatScreen();
            connectWebSocket(sessionToken);
            loadInitialMessages();

            // Auto-open if configured
            if (config.autoOpen) {
                openChat();
            }
        } else if (config.autoOpen) {
            // Auto-open even without session
            openChat();
        }
    }

    async function handleWelcomeSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('visitor-name').value.trim();
        const email = document.getElementById('visitor-email').value.trim();

        if (!name || !email) return;

        try {
            const response = await fetch(`${config.apiUrl}/api/sessions/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            const data = await response.json();

            if (data.success && data.data.session_token) {
                state.sessionToken = data.data.session_token;
                localStorage.setItem('chat_session_token', state.sessionToken);

                showChatScreen();
                connectWebSocket(state.sessionToken);
                await loadInitialMessages();
            } else {
                alert('Failed to start chat. Please try again.');
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
            alert('Failed to connect. Please check your connection.');
        }
    }

    function showChatScreen() {
        elements.welcomeScreen.style.display = 'none';
        elements.chatMessages.style.display = 'block';
        elements.chatInputContainer.style.display = 'block';
    }

    function connectWebSocket(sessionToken) {
        if (state.websocket) {
            state.websocket.close();
        }

        const wsUrl = `${config.websocketUrl}/${sessionToken}`;
        console.log('Connecting to WebSocket:', wsUrl);

        state.websocket = new WebSocket(wsUrl);

        state.websocket.onopen = () => {
            console.log('WebSocket connected');
            state.isConnected = true;
            state.reconnectAttempts = 0;
            updateConnectionStatus(true);
        };

        state.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        state.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus(false);
        };

        state.websocket.onclose = () => {
            console.log('WebSocket disconnected');
            state.isConnected = false;
            updateConnectionStatus(false);

            // Attempt reconnection
            if (state.reconnectAttempts < config.maxReconnectAttempts) {
                state.reconnectAttempts++;
                console.log(`Reconnecting... Attempt ${state.reconnectAttempts}`);
                setTimeout(() => connectWebSocket(sessionToken), config.reconnectDelay);
            }
        };
    }

    function handleWebSocketMessage(data) {
        console.log('WebSocket message received:', data);

        switch (data.type) {
            case 'connected':
                console.log('Connection confirmed:', data.message);
                break;

            case 'message':
                // New message from operator or visitor
                if (data.message_id && !state.messages.has(data.message_id)) {
                    state.messages.set(data.message_id, data);
                    // Only add to UI if it's from operator (visitor messages are already added optimistically)
                    if (data.sender_type === 'operator' || data.sender_type === 'system') {
                        addMessageToUI(
                            data.message,
                            data.sender_type,
                            data.timestamp,
                            true,
                            data.attachments
                        );

                        // Auto-open chat on new message if configured
                        if (config.openOnNewMessage && !state.isOpen) {
                            openChat();
                        }

                        // Show notification if window is not focused
                        if (!document.hasFocus()) {
                            showNewMessageNotification();
                        }
                    }
                }
                break;

            case 'operator_typing':
                showTypingIndicator();
                break;

            case 'session_closed':
                alert('Chat session has been closed.');
                break;

            case 'error':
                console.error('WebSocket error:', data.error);
                break;
        }
    }

    async function handleMessageSubmit(e) {
        e.preventDefault();

        const message = elements.chatInput.value.trim();
        const hasFile = state.selectedFile !== null;

        if (!message && !hasFile) return;

        // Optimistic UI update
        if (message) {
            addMessageToUI(message, 'visitor', null, true, null);
        }

        elements.chatInput.value = '';

        try {
            if (state.isConnected && !hasFile) {
                // Send via WebSocket (faster)
                state.websocket.send(JSON.stringify({
                    type: 'message',
                    session_token: state.sessionToken,
                    message: message
                }));
            } else {
                // Send via HTTP (for file uploads or if WebSocket disconnected)
                const formData = new FormData();
                formData.append('session_token', state.sessionToken);

                // Only append message if not empty
                if (message) {
                    formData.append('message', message);
                }

                if (hasFile) {
                    formData.append('file', state.selectedFile);
                    const displayMessage = message || `📎 ${state.selectedFile.name}`;
                    addMessageToUI(displayMessage, 'visitor', null, true, null);
                }

                clearFileSelection();

                const response = await fetch(`${config.apiUrl}/api/messages/send`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (!data.success) {
                    console.error('Failed to send message:', data);
                    alert('Failed to send message: ' + (data.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    }

    async function loadInitialMessages() {
        try {
            const response = await fetch(
                `${config.apiUrl}/api/messages/${state.sessionToken}`
            );

            const data = await response.json();

            if (data.success && data.data) {
                data.data.forEach(msg => {
                    if (!state.messages.has(msg.id)) {
                        state.messages.set(msg.id, msg);
                        addMessageToUI(
                            msg.message,
                            msg.sender_type,
                            msg.created_at,
                            false,
                            msg.attachments
                        );
                    }
                });

                scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    function addMessageToUI(message, senderType, timestamp = null, scroll = true, attachments = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${senderType}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message;

        messageDiv.appendChild(bubble);

        // Add attachments
        if (attachments && attachments.length > 0) {
            attachments.forEach(att => {
                const attachDiv = document.createElement('div');
                attachDiv.className = 'message-attachment';

                if (att.file_type === 'image') {
                    const img = document.createElement('img');
                    img.src = `${config.apiUrl}${att.url}`;
                    img.alt = att.file_name;
                    img.onclick = () => window.open(`${config.apiUrl}${att.url}`, '_blank');
                    attachDiv.appendChild(img);
                } else {
                    const link = document.createElement('a');
                    link.href = `${config.apiUrl}${att.url}`;
                    link.target = '_blank';
                    link.download = att.file_name;
                    link.textContent = `📄 ${att.file_name}`;
                    attachDiv.appendChild(link);
                }

                bubble.appendChild(attachDiv);
            });
        }

        if (timestamp) {
            const time = document.createElement('div');
            time.className = 'message-time';
            time.textContent = formatTime(timestamp);
            messageDiv.appendChild(time);
        }

        elements.chatMessages.appendChild(messageDiv);

        if (scroll) {
            scrollToBottom();
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        state.selectedFile = file;

        elements.filePreview.style.display = 'block';

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.imagePreview.src = e.target.result;
                elements.imagePreview.style.display = 'block';
                elements.fileInfo.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            elements.imagePreview.style.display = 'none';
            elements.fileInfo.style.display = 'flex';
            elements.fileName.textContent = file.name;
        }
    }

    function clearFileSelection() {
        state.selectedFile = null;
        elements.fileInput.value = '';
        elements.filePreview.style.display = 'none';
        elements.imagePreview.src = '';
    }

    function handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.startsWith('image/')) {
                e.preventDefault();

                const blob = item.getAsFile();
                if (blob) {
                    const fileName = `pasted-image-${Date.now()}.png`;
                    const file = new File([blob], fileName, { type: blob.type });

                    state.selectedFile = file;
                    elements.filePreview.style.display = 'block';

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        elements.imagePreview.src = e.target.result;
                        elements.imagePreview.style.display = 'block';
                        elements.fileInfo.style.display = 'none';
                    };
                    reader.readAsDataURL(file);

                    elements.chatInput.focus();
                }
                break;
            }
        }
    }

    function handlePasteGlobal(e) {
        if (!state.isOpen || !state.sessionToken) return;

        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        handlePaste(e);
    }

    let typingTimeout;
    function handleTyping() {
        if (!state.isConnected) return;

        clearTimeout(typingTimeout);

        // Send typing notification
        state.websocket.send(JSON.stringify({
            type: 'typing',
            session_token: state.sessionToken
        }));

        typingTimeout = setTimeout(() => {
            // Stop typing after 3 seconds
        }, 3000);
    }

    function showTypingIndicator() {
        // You can implement a typing indicator UI here
        console.log('Operator is typing...');
    }

    function updateConnectionStatus(connected) {
        if (elements.connectionStatus) {
            if (connected) {
                elements.connectionStatus.textContent = '● Connected';
                elements.connectionStatus.style.color = '#4CAF50';
            } else {
                elements.connectionStatus.textContent = '○ Reconnecting...';
                elements.connectionStatus.style.color = '#FF9800';
            }
        }
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function scrollToBottom() {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    // Public API
    return {
        init,
        openChat,
        closeChat
    };
})();

// Make it available globally
window.ChatWidget = ChatWidget;
