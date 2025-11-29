/**
 * Telegram Web Chat Widget - Auto-Init Version
 * This version automatically creates the HTML structure and initializes
 * Perfect for easy integration on any website
 */

(function() {
    // Create widget HTML structure
    function createWidgetHTML() {
        const widgetHTML = `
            <div id="chat-button" class="chat-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
                </svg>
                <span id="unread-badge" class="unread-badge" style="display: none;">0</span>
            </div>

            <div id="chat-window" class="chat-window" style="display: none;">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <h3>Chat with us</h3>
                        <p>We typically reply within minutes</p>
                    </div>
                    <button id="chat-close" class="chat-close-btn">×</button>
                </div>

                <div id="welcome-screen" class="welcome-screen">
                    <div class="welcome-content">
                        <h4>👋 Welcome!</h4>
                        <p>Please enter your details to start chatting</p>
                        <form id="welcome-form">
                            <input type="text" id="visitor-name" placeholder="Your name" required>
                            <input type="email" id="visitor-email" placeholder="Your email" required>
                            <button type="submit" class="chat-btn">Start Chat</button>
                        </form>
                    </div>
                </div>

                <div id="chat-messages" class="chat-messages" style="display: none;"></div>

                <div id="chat-input-container" class="chat-input-container" style="display: none;">
                    <div id="file-preview" class="file-preview" style="display: none;">
                        <div class="file-preview-content">
                            <img id="image-preview" style="display: none;">
                            <div id="file-info" class="file-info" style="display: none;">
                                <span id="file-name"></span>
                            </div>
                            <button id="remove-file" class="remove-file-btn">×</button>
                        </div>
                    </div>
                    <form id="chat-form">
                        <input type="file" id="file-input" accept="image/*,.pdf,.doc,.docx,.txt" style="display: none;">
                        <button type="button" id="attach-btn" class="attach-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 6V17.5C16.5 19.71 14.71 21.5 12.5 21.5C10.29 21.5 8.5 19.71 8.5 17.5V5C8.5 3.62 9.62 2.5 11 2.5C12.38 2.5 13.5 3.62 13.5 5V15.5C13.5 16.05 13.05 16.5 12.5 16.5C11.95 16.5 11.5 16.05 11.5 15.5V6H10V15.5C10 16.88 11.12 18 12.5 18C13.88 18 15 16.88 15 15.5V5C15 2.79 13.21 1 11 1C8.79 1 7 2.79 7 5V17.5C7 20.54 9.46 23 12.5 23C15.54 23 18 20.54 18 17.5V6H16.5Z" fill="currentColor"/>
                            </svg>
                        </button>
                        <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                        <button type="submit" class="chat-send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </form>
                    <div id="connection-status" class="connection-status">○ Connecting...</div>
                </div>
            </div>
        `;

        // Create or get widget container
        let container = document.getElementById('chat-widget');
        if (!container) {
            container = document.createElement('div');
            container.id = 'chat-widget';
            document.body.appendChild(container);
        }

        // Add HTML
        container.innerHTML = widgetHTML;
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidgetHTML);
    } else {
        createWidgetHTML();
    }

    // Expose global init function for manual configuration
    window.TelegramChatWidget = {
        createHTML: createWidgetHTML
    };
})();
