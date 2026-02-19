<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';

/* ── Datos demo ── */
const contacts = ref([
    { id: 1, name: 'Erik Taveras', initials: 'ET', color: '#4caf50', lastMsg: 'Perfecto, con gusto. Primero, ¿puedes deci...', time: 'ahora', isIA: true, channel: 'whatsapp', unread: 0, active: true },
    { id: 2, name: 'Carlos', initials: 'CA', color: '#ff9800', lastMsg: 'Tu: Hola Carlos, te habla Erik, me gustaría sab...', time: '00:24', isIA: false, channel: 'whatsapp', unread: 1, active: false },
    { id: 3, name: 'Jairo', initials: 'JA', color: '#9c27b0', lastMsg: 'Tu: Hola Jairo, gracias por tu interés en TalosFl...', time: 'ayer', isIA: true, channel: 'whatsapp', unread: 0, active: false },
    { id: 4, name: 'Yukata Yokoyama Antonio Durán', initials: 'YU', color: '#ffc107', lastMsg: 'Tu: ¡Genial! Me alegra saber que te agrada la i...', time: 'ayer', isIA: true, channel: 'whatsapp', unread: 0, active: false },
    { id: 5, name: 'Brian Jose Lopez Silva', initials: 'BR', color: '#2196f3', lastMsg: 'Tu: Con gusto. Primero, ¿me puedes contar un p...', time: 'ayer', isIA: true, channel: 'whatsapp', unread: 0, active: false },
    { id: 6, name: 'Raysa Taveras', initials: 'RA', color: '#e91e63', lastMsg: 'Tu: ¡Hola! ¿Cómo estás? Si necesitas informaci...', time: 'ayer', isIA: true, channel: 'whatsapp', unread: 0, active: false }
]);

const messages = ref([
    { id: 1, text: 'Hola', time: '01:35', fromMe: false, isIA: false },
    { id: 2, text: '¡Hola! ¿Cómo puedo ayudarte hoy?', time: '01:35', fromMe: true, isIA: true },
    { id: 3, text: 'Estoy bien, me gustaría agendar', time: '01:35', fromMe: false, isIA: false },
    { id: 4, text: 'Perfecto, con gusto. Primero, ¿puedes decirme tu nombre completo y tu correo electrónico para agendar la cita?', time: '01:35', fromMe: true, isIA: true }
]);

const searchQuery = ref('');
const newMessage = ref('');
const botEnabled = ref(true);
const selectedContact = ref(contacts.value[0]);
const chatBody = ref(null);
const sidebarVisible = ref(true);

/* ── Computed ── */
const filteredContacts = computed(() => {
    if (!searchQuery.value) return contacts.value;
    const q = searchQuery.value.toLowerCase();
    return contacts.value.filter(c => c.name.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q));
});

const totalChats = computed(() => contacts.value.length);

/* ── Métodos ── */
function selectContact(contact) {
    contacts.value.forEach(c => (c.active = false));
    contact.active = true;
    selectedContact.value = contact;
    contact.unread = 0;
    // En mobile, cerrar sidebar
    if (window.innerWidth < 768) sidebarVisible.value = false;
    scrollToBottom();
}

function sendMessage() {
    if (!newMessage.value.trim()) return;
    messages.value.push({
        id: Date.now(),
        text: newMessage.value,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        fromMe: true,
        isIA: false
    });
    newMessage.value = '';
    scrollToBottom();

    // Simular respuesta IA
    if (botEnabled.value) {
        setTimeout(() => {
            messages.value.push({
                id: Date.now() + 1,
                text: '¡Entendido! Déjame procesarlo. ¿Necesitas algo más?',
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                fromMe: true,
                isIA: true
            });
            scrollToBottom();
        }, 1200);
    }
}

function scrollToBottom() {
    nextTick(() => {
        if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight;
    });
}

function toggleSidebar() {
    sidebarVisible.value = !sidebarVisible.value;
}

onMounted(scrollToBottom);
</script>

<template>
    <!-- ═══ TOPBAR CONTENT (via Teleport) ═══ -->
    <Teleport to="#topbar-content">
        <div class="topbar-chat-header">
            <button class="topbar-icon-btn mobile-menu-btn" @click="toggleSidebar">
                <i class="pi pi-bars"></i>
            </button>
            <div class="topbar-chat-avatar" :style="{ background: selectedContact.color }">
                {{ selectedContact.initials }}
            </div>
            <div class="topbar-chat-info">
                <span class="topbar-chat-name">{{ selectedContact.name }}</span>
                <span class="topbar-chat-step">Paso: inicio <span class="topbar-step-badge">nuevo</span></span>
            </div>
            <div class="topbar-chat-actions">
                <button class="topbar-action-btn">
                    <i class="pi pi-comments"></i>
                    <span>0</span>
                </button>
                <button class="topbar-action-btn">
                    <i class="pi pi-user"></i>
                </button>
                <button class="topbar-action-btn topbar-intervene-btn">Intervenir</button>
                <button class="topbar-action-btn topbar-bot-toggle" :class="{ 'bot-on': botEnabled, 'bot-off': !botEnabled }" @click="botEnabled = !botEnabled">
                    Bot IA {{ botEnabled ? 'ON' : 'OFF' }}
                </button>
            </div>
        </div>
    </Teleport>

    <div class="chat-container">
        <!-- ═══ SIDEBAR ═══ -->
        <aside class="chat-sidebar" :class="{ open: sidebarVisible }">
            <!-- Sidebar Header -->
            <div class="sidebar-header">
                <h2 class="sidebar-title">Chats</h2>
                <div class="sidebar-actions">
                    <button class="icon-btn" title="Archivar"><i class="pi pi-inbox"></i></button>
                    <button class="icon-btn" title="Filtrar"><i class="pi pi-filter"></i></button>
                    <span class="chat-count">{{ totalChats }}</span>
                </div>
            </div>

            <!-- Search -->
            <div class="sidebar-search">
                <i class="pi pi-search"></i>
                <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o mensaje..." />
            </div>

            <!-- Contact List -->
            <ul class="contact-list">
                <li v-for="contact in filteredContacts" :key="contact.id" class="contact-item" :class="{ active: contact.active }" @click="selectContact(contact)">
                    <div class="contact-avatar" :style="{ background: contact.color }">
                        {{ contact.initials }}
                    </div>
                    <div class="contact-info">
                        <div class="contact-top">
                            <span class="contact-name">{{ contact.name }}</span>
                            <span class="contact-time">{{ contact.time }}</span>
                        </div>
                        <div class="contact-bottom">
                            <span class="contact-msg">{{ contact.lastMsg }}</span>
                            <div class="contact-badges">
                                <span v-if="contact.isIA" class="badge-ia-small">IA</span>
                                <span v-if="contact.unread" class="badge-unread">{{ contact.unread }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </aside>

        <!-- ═══ MAIN CHAT ═══ -->
        <main class="chat-main">

            <!-- Chat Body -->
            <div ref="chatBody" class="chat-body">
                <div class="date-separator"><span>Hoy</span></div>

                <div v-for="msg in messages" :key="msg.id" class="message-row" :class="{ 'msg-right': msg.fromMe && !msg.isIA, 'msg-right-ia': msg.fromMe && msg.isIA, 'msg-left': !msg.fromMe }">
                    <!-- Date separator between some messages -->
                    <div v-if="msg.id === 3" class="date-separator"><span>Hoy</span></div>

                    <div class="message-bubble" :class="{ 'bubble-left': !msg.fromMe, 'bubble-right': msg.fromMe && !msg.isIA, 'bubble-ia': msg.fromMe && msg.isIA }">
                        <div v-if="msg.isIA" class="ia-badge">
                            <i class="pi pi-bolt"></i> IA
                        </div>
                        <p class="message-text">{{ msg.text }}</p>
                        <span class="message-time">
                            {{ msg.time }}
                            <i v-if="msg.fromMe" class="pi pi-check"></i>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Chat Footer -->
            <div class="chat-footer">
                <div class="window-status">
                    <i class="pi pi-check-circle"></i>
                    Ventana abierta (23h 59m)
                </div>
                <div class="message-input-bar">
                    <button class="icon-btn spark-btn"><i class="pi pi-bolt"></i></button>
                    <input v-model="newMessage" type="text" placeholder="Escribe un mensaje..." @keyup.enter="sendMessage" />
                    <button class="send-btn" @click="sendMessage">
                        <i class="pi pi-send"></i>
                    </button>
                </div>
            </div>
        </main>

        <!-- Overlay mobile -->
        <div v-if="sidebarVisible" class="sidebar-overlay" @click="sidebarVisible = false"></div>
    </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════ */
.chat-container {
    display: flex;
    height: calc(100vh - 7rem);
    background: var(--surface-ground);
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--surface-border);
}

/* ═══════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════ */
.chat-sidebar {
    width: 340px;
    min-width: 340px;
    background: var(--surface-card);
    border-right: 1px solid var(--surface-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1rem 0.75rem;
}

.sidebar-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
}

.sidebar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.icon-btn {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}
.icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-color);
}

.chat-count {
    background: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    min-width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
}

/* Search */
.sidebar-search {
    padding: 0.5rem 1rem;
    position: relative;
}
.sidebar-search i {
    position: absolute;
    left: 1.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
    font-size: 0.85rem;
}
.sidebar-search input {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.25rem;
    border: 1px solid var(--surface-border);
    border-radius: 10px;
    background: var(--surface-ground);
    color: var(--text-color);
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.2s;
}
.sidebar-search input:focus {
    border-color: var(--primary-color);
}
.sidebar-search input::placeholder {
    color: var(--text-color-secondary);
}

/* Contacts */
.contact-list {
    list-style: none;
    margin: 0;
    padding: 0.25rem 0.5rem;
    overflow-y: auto;
    flex: 1;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
}
.contact-item:hover {
    background: var(--surface-hover);
}
.contact-item.active {
    background: var(--primary-50, rgba(76, 175, 80, 0.08));
    border: 1px solid var(--primary-200, rgba(76, 175, 80, 0.25));
}

.contact-avatar {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    color: white;
}

.contact-info {
    flex: 1;
    min-width: 0;
}

.contact-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 2px;
}

.contact-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.contact-time {
    font-size: 0.72rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
}

.contact-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.contact-msg {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
}

.contact-badges {
    display: flex;
    align-items: center;
    gap: 4px;
}

.badge-ia-small {
    background: linear-gradient(135deg, #2196f3, #00bcd4);
    color: white;
    font-size: 0.6rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    line-height: 1.4;
}

.badge-unread {
    background: #f44336;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ═══════════════════════════════════════
   CHAT MAIN
   ═══════════════════════════════════════ */
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(--surface-ground);
}

/* Chat Header styles removed — now in topbar */

/* Chat Body */
.chat-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.date-separator {
    text-align: center;
    margin: 0.75rem 0;
}
.date-separator span {
    background: var(--surface-200, rgba(0,0,0,0.06));
    color: var(--text-color-secondary);
    font-size: 0.72rem;
    padding: 3px 12px;
    border-radius: 6px;
    font-weight: 500;
}

/* Message rows */
.message-row {
    display: flex;
    flex-direction: column;
}
.msg-left {
    align-items: flex-start;
}
.msg-right,
.msg-right-ia {
    align-items: flex-end;
}

/* Bubbles */
.message-bubble {
    max-width: 55%;
    padding: 0.65rem 0.85rem 0.35rem;
    border-radius: 12px;
    position: relative;
}

.bubble-left {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-top-left-radius: 4px;
}

.bubble-right {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-top-right-radius: 4px;
}

.bubble-ia {
    background: linear-gradient(135deg, #c8f7c5 0%, #a8e6a1 100%);
    border: none;
    border-top-right-radius: 4px;
}

:root[class*='dark'] .bubble-ia,
.p-dark .bubble-ia {
    background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
}

.ia-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 2px;
}
.ia-badge i {
    font-size: 0.6rem;
}

.message-text {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.45;
    color: var(--text-color);
}

.message-time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    font-size: 0.65rem;
    color: var(--text-color-secondary);
    margin-top: 2px;
}
.message-time i {
    font-size: 0.6rem;
}

/* Chat Footer */
.chat-footer {
    padding: 0 1.25rem 1rem;
}

.window-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.4rem 0.85rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #2e7d32;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
}
.window-status i {
    font-size: 0.85rem;
}

:root[class*='dark'] .window-status,
.p-dark .window-status {
    background: linear-gradient(135deg, #1b5e20, #2e7d32);
    color: #a5d6a7;
}

.message-input-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 28px;
    padding: 0.35rem 0.5rem;
}

.spark-btn {
    color: var(--text-color-secondary);
}

.message-input-bar input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-color);
    font-size: 0.88rem;
    outline: none;
    padding: 0.4rem 0;
}
.message-input-bar input::placeholder {
    color: var(--text-color-secondary);
}

.send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s, background 0.15s;
}
.send-btn:hover {
    background: var(--primary-600, #388e3c);
    transform: scale(1.05);
}
.send-btn i {
    font-size: 0.9rem;
}

/* Overlay */
.sidebar-overlay {
    display: none;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */
@media (max-width: 768px) {
    .chat-sidebar {
        position: absolute;
        left: -340px;
        top: 0;
        bottom: 0;
        z-index: 100;
        transition: left 0.25s ease;
        box-shadow: none;
    }
    .chat-sidebar.open {
        left: 0;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
    }
    .sidebar-overlay {
        display: block;
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 99;
    }
    .mobile-menu-btn {
        display: flex;
    }
    .message-bubble {
        max-width: 80%;
    }

}
</style>

<!-- Unscoped styles for Teleport content (rendered outside this component's scope) -->
<style>
.topbar-chat-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.topbar-icon-btn {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: none;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}
.topbar-icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-color);
}

.topbar-chat-avatar {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    color: white;
}

.topbar-chat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.topbar-chat-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.topbar-chat-step {
    font-size: 0.72rem;
    color: var(--text-color-secondary);
}

.topbar-step-badge {
    background: var(--primary-color);
    color: white;
    font-size: 0.58rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 4px;
    margin-left: 5px;
    text-transform: uppercase;
}

.topbar-chat-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
}

.topbar-action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--surface-ground);
    border: 1px solid var(--surface-border);
    color: var(--text-color);
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.topbar-action-btn:hover {
    background: var(--surface-hover);
}

.topbar-intervene-btn {
    font-weight: 600;
}

.topbar-bot-toggle {
    font-weight: 700;
    font-size: 0.76rem;
    padding: 0.35rem 0.8rem;
}
.topbar-bot-toggle.bot-on {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}
.topbar-bot-toggle.bot-on:hover {
    background: var(--primary-600, #388e3c);
    border-color: var(--primary-600, #388e3c);
}
.topbar-bot-toggle.bot-off {
    background: var(--surface-200, #e0e0e0);
    color: var(--text-color-secondary);
    border-color: var(--surface-300, #ccc);
}

@media (max-width: 768px) {
    .topbar-icon-btn.mobile-menu-btn {
        display: flex;
    }
    .topbar-chat-actions .topbar-action-btn:not(.topbar-bot-toggle) {
        display: none;
    }
}
</style>
