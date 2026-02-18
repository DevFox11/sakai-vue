<script setup>
import AppMenu from './AppMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout';
import { computed, ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputSwitch from 'primevue/inputswitch';
import { useCampaignsStore } from '@/stores/campaigns';

// ==================== Campañas (desde store global) ====================
const campaignsStore = useCampaignsStore();

onMounted(async () => {
    await campaignsStore.initialize();
});

const showCampaignSelector = ref(false);
const showNewCampaignDialog = ref(false);
const savingCampaign = ref(false);

const emojis = ['📢', '🛒', '🚀', '📧', '☀️', '🤖', '🎯', '💡', '🔥', '💎', '🌟', '📱', '🎁', '🏷️', '📊', '🎉'];

const newCampaign = ref({
    name: '',
    emoji: '📢',
    status: 'draft',
    budget: 0,
    start_date: null,
    end_date: null,
    description: ''
});

const resetNewCampaign = () => {
    newCampaign.value = {
        name: '',
        emoji: '📢',
        status: 'draft',
        budget: 0,
        start_date: null,
        end_date: null,
        description: ''
    };
};

const openNewCampaignDialog = () => {
    resetNewCampaign();
    showCampaignSelector.value = false;
    showNewCampaignDialog.value = true;
};

const saveCampaign = async () => {
    if (!newCampaign.value.name.trim()) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'El nombre de la campaña es obligatorio', life: 3000 });
        return;
    }
    savingCampaign.value = true;
    try {
        await campaignsStore.createCampaign(newCampaign.value);
        showNewCampaignDialog.value = false;
        // Seleccionar la última campaña creada
        if (campaignsStore.campaigns.length > 0) {
            campaignsStore.selectCampaign(campaignsStore.campaigns[0]);
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Campaña creada correctamente', life: 3000 });
    } catch (error) {
        console.error('Error creando campaña:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la campaña', life: 3000 });
    } finally {
        savingCampaign.value = false;
    }
};

const selectCampaign = (campaign) => {
    campaignsStore.selectCampaign(campaign);
    showCampaignSelector.value = false;
};

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { layoutState, toggleDarkMode, isDarkTheme } = useLayout();

const showUserMenu = ref(false);

// Computed para saber si el sidebar está colapsado
const isCollapsed = computed(() => layoutState.staticMenuDesktopInactive);

// Toggle sidebar
const toggleSidebar = () => {
    layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
};

const userInitials = computed(() => {
    const name = authStore.userName;
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
});

const userName = computed(() => authStore.userName || authStore.userEmail?.split('@')[0] || 'Usuario');
const userEmail = computed(() => authStore.userEmail || '');
const userId = computed(() => authStore.user?.id || '');

const goToProfile = () => {
    showUserMenu.value = false;
    router.push('/pages/user/profile');
};

const handleLogout = async () => {
    showUserMenu.value = false;
    try {
        await authStore.logout();
        toast.add({
            severity: 'info',
            summary: 'Sesión cerrada',
            detail: 'Has cerrado sesión exitosamente',
            life: 3000
        });
        router.push('/auth/login');
    } catch (error) {
        console.error('Error during logout:', error);
        router.push('/auth/login');
    }
};
</script>

<template>
    <div class="layout-sidebar" :class="{ 'collapsed': isCollapsed }">
        <!-- Header con Logo y botón colapsar -->
        <div class="sidebar-header">
            <router-link to="/" class="sidebar-logo">
                <span class="logo-icon">D</span>
                <span v-show="!isCollapsed" class="logo-text">DAYVO</span>
            </router-link>
            <button class="collapse-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'">
                <i :class="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
            </button>
        </div>

        <!-- Selector de Campaña -->
        <div class="campaign-selector-area" :class="{ 'collapsed': isCollapsed }">
            <!-- Estado: Campaña seleccionada -->
            <template v-if="campaignsStore.selectedCampaign">
                <div 
                    class="campaign-current" 
                    @click="showCampaignSelector = !showCampaignSelector"
                    :title="isCollapsed ? campaignsStore.selectedCampaign.name : ''"
                >
                    <span class="campaign-emoji">{{ campaignsStore.selectedCampaign.emoji }}</span>
                    <div v-show="!isCollapsed" class="campaign-info">
                        <span class="campaign-name">{{ campaignsStore.selectedCampaign.name }}</span>
                        <span class="campaign-leads">{{ campaignsStore.selectedCampaign.leads }} leads</span>
                    </div>
                    <i v-show="!isCollapsed" class="pi pi-chevron-down campaign-chevron" :class="{ 'rotated': showCampaignSelector }"></i>
                </div>

                <!-- Dropdown de campañas -->
                <Transition name="campaign-dropdown">
                    <div v-if="showCampaignSelector" class="campaign-dropdown">
                        <div class="campaign-dropdown-header">
                            <span class="campaign-dropdown-title">Campañas</span>
                            <span class="campaign-dropdown-count">{{ campaignsStore.totalCampaigns }}</span>
                        </div>
                        <div 
                            v-for="campaign in campaignsStore.campaigns" 
                            :key="campaign.id" 
                            class="campaign-option"
                            :class="{ 'active': campaignsStore.selectedCampaign?.id === campaign.id }"
                            @click="selectCampaign(campaign)"
                        >
                            <span class="campaign-emoji">{{ campaign.emoji }}</span>
                            <div class="campaign-option-info">
                                <span class="campaign-option-name">{{ campaign.name }}</span>
                                <span class="campaign-option-leads">{{ campaign.leads }} leads</span>
                            </div>
                            <span class="campaign-status-dot" :style="{ background: campaignsStore.getStatusColor(campaign.status) }"></span>
                        </div>
                        <div class="campaign-dropdown-footer">
                            <button class="campaign-add-btn" @click="openNewCampaignDialog">
                                <i class="pi pi-plus"></i>
                                <span>Nueva campaña</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </template>

            <!-- Estado: Cargando -->
            <template v-else-if="campaignsStore.loading">
                <div class="campaign-current" style="opacity: 0.5; cursor: default;">
                    <span class="campaign-emoji">⏳</span>
                    <div v-show="!isCollapsed" class="campaign-info">
                        <span class="campaign-name">Cargando...</span>
                    </div>
                </div>
            </template>

            <!-- Estado: Sin campañas -->
            <template v-else>
                <div class="campaign-current campaign-empty" @click="openNewCampaignDialog" :title="isCollapsed ? 'Crear campaña' : ''">
                    <div class="campaign-empty-icon">
                        <i class="pi pi-plus"></i>
                    </div>
                    <div v-show="!isCollapsed" class="campaign-info">
                        <span class="campaign-name" style="font-size: 0.8rem; color: #10b981;">Crear campaña</span>
                        <span class="campaign-leads" style="font-size: 0.65rem;">Empieza a organizar tus leads</span>
                    </div>
                </div>
            </template>
        </div>

        <!-- Contenido del menú -->
        <div class="sidebar-content">
            <app-menu :collapsed="isCollapsed"></app-menu>
        </div>

        <!-- Footer con opciones y usuario -->
        <div class="sidebar-footer">
            <div class="footer-menu">
                <router-link to="/pages/empty" class="footer-menu-item" title="Ajustes">
                    <i class="pi pi-cog"></i>
                    <span v-show="!isCollapsed">Ajustes</span>
                </router-link>
                <a href="#" class="footer-menu-item" title="Ayuda">
                    <i class="pi pi-question-circle"></i>
                    <span v-show="!isCollapsed">Ayuda</span>
                    <i v-show="!isCollapsed" class="pi pi-chevron-right chevron"></i>
                </a>
                <a href="#" class="footer-menu-item" title="Compartir comentarios">
                    <i class="pi pi-heart"></i>
                    <span v-show="!isCollapsed">Compartir comentarios</span>
                </a>
                <router-link to="/" class="footer-menu-item" title="Centro de notificaciones">
                    <i class="pi pi-bell"></i>
                    <span v-show="!isCollapsed">Centro de notificaciones</span>
                    <span class="notification-badge">2</span>
                </router-link>
            </div>
            
            <!-- Usuario con menú hover -->
            <div 
                class="user-profile-container"
                @mouseenter="showUserMenu = true"
                @mouseleave="showUserMenu = false"
            >
                <div class="user-profile">
                    <div class="user-avatar">
                        {{ userInitials }}
                    </div>
                    <div v-show="!isCollapsed" class="user-info">
                        <span class="user-name">{{ userName }}</span>
                        <span class="user-email">{{ userEmail }}</span>
                    </div>
                </div>
                
                <!-- Menú popup del usuario -->
                <Transition name="user-menu">
                    <div v-if="showUserMenu" class="user-menu-popup">
                        <div class="user-menu-header">
                            <div class="user-menu-name">{{ userName }}</div>
                            <div class="user-menu-id">
                                ID de Usuario: {{ userId }}
                                <button class="copy-btn" @click.stop>
                                    <i class="pi pi-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="user-menu-section">
                            <a href="#" class="user-menu-item" @click.prevent="goToProfile">
                                <i class="pi pi-cog"></i>
                                <span>Configuración del perfil</span>
                                <i class="pi pi-chevron-right"></i>
                            </a>
                            <div class="user-menu-item theme-toggle-container">
                                <i class="pi pi-palette"></i>
                                <span>Tema</span>
                                <div class="theme-toggle-wrapper">
                                    <InputSwitch
                                        v-model="layoutState.darkTheme"
                                        @click="toggleDarkMode"
                                        class="theme-toggle-switch"
                                    />
                                </div>
                            </div>
                            <a href="#" class="user-menu-item logout" @click.prevent="handleLogout">
                                <i class="pi pi-sign-out"></i>
                                <span>Cerrar sesión</span>
                            </a>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>

    <!-- Dialog para crear campaña -->
    <Dialog 
        v-model:visible="showNewCampaignDialog" 
        header="Nueva Campaña" 
        :modal="true" 
        :style="{ width: '480px' }"
        :breakpoints="{ '768px': '90vw' }"
        class="campaign-dialog"
    >
        <div class="campaign-form">
            <!-- Emoji + Nombre -->
            <div class="form-row">
                <div class="emoji-picker">
                    <label class="form-label">Emoji</label>
                    <div class="emoji-grid">
                        <button 
                            v-for="emoji in emojis" 
                            :key="emoji" 
                            class="emoji-btn" 
                            :class="{ 'selected': newCampaign.emoji === emoji }"
                            @click="newCampaign.emoji = emoji"
                            type="button"
                        >
                            {{ emoji }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <label class="form-label">Nombre *</label>
                <input 
                    v-model="newCampaign.name" 
                    type="text" 
                    class="form-input" 
                    placeholder="Ej: Black Friday 2026"
                    @keyup.enter="saveCampaign"
                />
            </div>

            <div class="form-row">
                <label class="form-label">Estado</label>
                <select v-model="newCampaign.status" class="form-input">
                    <option value="draft">📝 Borrador</option>
                    <option value="active">🟢 Activa</option>
                    <option value="paused">⏸️ Pausada</option>
                    <option value="completed">✅ Completada</option>
                </select>
            </div>

            <div class="form-row">
                <label class="form-label">Presupuesto</label>
                <input 
                    v-model.number="newCampaign.budget" 
                    type="number" 
                    class="form-input" 
                    placeholder="0.00" 
                    min="0" 
                    step="100"
                />
            </div>

            <div class="form-row-group">
                <div class="form-row">
                    <label class="form-label">Fecha inicio</label>
                    <input v-model="newCampaign.start_date" type="date" class="form-input" />
                </div>
                <div class="form-row">
                    <label class="form-label">Fecha fin</label>
                    <input v-model="newCampaign.end_date" type="date" class="form-input" />
                </div>
            </div>

            <div class="form-row">
                <label class="form-label">Descripción</label>
                <textarea 
                    v-model="newCampaign.description" 
                    class="form-input form-textarea" 
                    placeholder="Describe el objetivo de la campaña..." 
                    rows="3"
                ></textarea>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <button class="btn-cancel" @click="showNewCampaignDialog = false" :disabled="savingCampaign">
                    Cancelar
                </button>
                <button class="btn-save" @click="saveCampaign" :disabled="savingCampaign || !newCampaign.name.trim()">
                    <i v-if="savingCampaign" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-check"></i>
                    {{ savingCampaign ? 'Guardando...' : 'Crear campaña' }}
                </button>
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" scoped>
// Header del sidebar
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--surface-border);

    .sidebar-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--text-color);
        font-weight: 700;
        font-size: 1.25rem;

        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .logo-text {
            transition: opacity 0.2s;
        }
    }

    .collapse-btn {
        width: 28px;
        height: 28px;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        transition: all 0.2s;

        &:hover {
            background: var(--surface-hover);
            color: var(--text-color);
        }
    }
}

// Selector de Campaña
.campaign-selector-area {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--surface-border);
    position: relative;

    &.collapsed {
        padding: 0.5rem 0.25rem;

        .campaign-current {
            justify-content: center;
            padding: 0.5rem;
        }
    }

    .campaign-current {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.5rem 0.6rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);

        &:hover {
            background: var(--surface-hover);
            border-color: var(--primary-300);
        }

        .campaign-emoji {
            font-size: 1.2rem;
            flex-shrink: 0;
            line-height: 1;
        }

        .campaign-info {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;

            .campaign-name {
                font-weight: 600;
                font-size: 0.8rem;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .campaign-leads {
                font-size: 0.65rem;
                color: var(--text-color-secondary);
            }
        }

        .campaign-chevron {
            font-size: 0.65rem;
            color: var(--text-color-secondary);
            transition: transform 0.2s;
            flex-shrink: 0;

            &.rotated {
                transform: rotate(180deg);
            }
        }
    }

    .campaign-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0.5rem;
        right: 0.5rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 10px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        z-index: 1200;
        overflow: hidden;

        .campaign-dropdown-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.6rem 0.75rem;
            border-bottom: 1px solid var(--surface-border);

            .campaign-dropdown-title {
                font-weight: 600;
                font-size: 0.75rem;
                color: var(--text-color-secondary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .campaign-dropdown-count {
                font-size: 0.65rem;
                background: var(--primary-100);
                color: var(--primary-700);
                padding: 0.1rem 0.4rem;
                border-radius: 10px;
                font-weight: 600;
            }
        }

        .campaign-option {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.55rem 0.75rem;
            cursor: pointer;
            transition: background-color 0.15s;

            &:hover {
                background: var(--surface-hover);
            }

            &.active {
                background: var(--primary-50);

                .campaign-option-name {
                    color: var(--primary-700);
                }
            }

            .campaign-emoji {
                font-size: 1.1rem;
                flex-shrink: 0;
                line-height: 1;
            }

            .campaign-option-info {
                display: flex;
                flex-direction: column;
                min-width: 0;
                flex: 1;

                .campaign-option-name {
                    font-weight: 500;
                    font-size: 0.8rem;
                    color: var(--text-color);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .campaign-option-leads {
                    font-size: 0.65rem;
                    color: var(--text-color-secondary);
                }
            }

            .campaign-status-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                flex-shrink: 0;
            }
        }

        .campaign-dropdown-footer {
            border-top: 1px solid var(--surface-border);
            padding: 0.4rem;

            .campaign-add-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0.5rem 0.75rem;
                background: none;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                color: var(--primary-600);
                font-size: 0.8rem;
                font-weight: 500;
                transition: background-color 0.15s;

                i {
                    font-size: 0.75rem;
                }

                &:hover {
                    background: var(--primary-50);
                }
            }
        }
    }
}

// Animación del dropdown de campañas
.campaign-dropdown-enter-active,
.campaign-dropdown-leave-active {
    transition: all 0.2s ease;
}

.campaign-dropdown-enter-from,
.campaign-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.5rem 0;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: var(--surface-300);
        border-radius: 4px;
    }
}

.sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--surface-border);
    padding: 0.75rem 0;

    .footer-menu {
        .footer-menu-item {
            display: flex;
            align-items: center;
            padding: 0.6rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.875rem;
            transition: background-color 0.2s;
            gap: 0.75rem;

            i {
                font-size: 1rem;
                color: var(--text-color-secondary);
                min-width: 20px;
                text-align: center;
                
                &.chevron {
                    margin-left: auto;
                    font-size: 0.7rem;
                }
            }

            .notification-badge {
                margin-left: auto;
                background: var(--primary-color);
                color: white;
                font-size: 0.65rem;
                font-weight: 600;
                padding: 0.1rem 0.35rem;
                border-radius: 10px;
                min-width: 16px;
                text-align: center;
            }

            &:hover {
                background: var(--surface-hover);
            }
        }
    }

    .user-profile-container {
        position: relative;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background: var(--surface-hover);
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.8rem;
            flex-shrink: 0;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            min-width: 0;

            .user-name {
                font-weight: 600;
                font-size: 0.85rem;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-email {
                font-size: 0.7rem;
                color: var(--text-color-secondary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    // Menú popup del usuario
    .user-menu-popup {
        position: fixed;
        bottom: 10px;
        left: 270px;
        width: 280px;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1100;
        
        // Puente invisible para mantener hover
        &::before {
            content: '';
            position: absolute;
            left: -20px;
            top: 0;
            bottom: 0;
            width: 25px;
            background: transparent;
        }

        .user-menu-header {
            padding: 1rem;
            border-bottom: 1px solid var(--surface-border);

            .user-menu-name {
                font-weight: 600;
                font-size: 1rem;
                color: var(--text-color);
                margin-bottom: 0.25rem;
            }

            .user-menu-id {
                font-size: 0.75rem;
                color: var(--text-color-secondary);
                display: flex;
                align-items: center;
                gap: 0.5rem;

                .copy-btn {
                    background: none;
                    border: none;
                    padding: 0.2rem;
                    cursor: pointer;
                    color: var(--text-color-secondary);
                    
                    &:hover {
                        color: var(--primary-color);
                    }
                }
            }
        }

        .user-menu-section {
            padding: 0.5rem;

            .user-menu-item {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                color: var(--text-color);
                text-decoration: none;
                border-radius: 8px;
                font-size: 0.875rem;
                transition: background-color 0.2s;
                gap: 0.75rem;
                position: relative;

                i {
                    font-size: 0.9rem;
                    color: var(--text-color-secondary);

                    &:last-child {
                        margin-left: auto;
                        font-size: 0.7rem;
                    }
                }

                span {
                    flex: 1;
                }

                &:hover {
                    background: var(--surface-hover);
                }

                &.logout {
                    color: #ef4444;

                    i {
                        color: #ef4444;
                    }
                }

                .theme-toggle-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .theme-toggle-wrapper {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        flex: 1;

                        .theme-toggle-switch {
                            margin-left: auto;
                        }
                    }

                    &:hover {
                        background: var(--surface-hover);
                    }
                }
            }
        }
    }
}

// Estilos para el modo colapsado
.collapsed {
    .sidebar-header {
        justify-content: center;
        padding: 1rem 0.5rem;

        .sidebar-logo {
            .logo-text {
                display: none;
            }
        }

        .collapse-btn {
            position: absolute;
            right: -14px;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    }

    .sidebar-footer {
        .footer-menu-item {
            justify-content: center;
            padding: 0.6rem 0.5rem;
            
            span {
                display: none;
            }
            
            .chevron {
                display: none;
            }
            
            .notification-badge {
                position: absolute;
                top: 2px;
                right: 8px;
                margin-left: 0;
            }
        }

        .user-profile {
            justify-content: center;
            padding: 0.6rem 0.5rem;
        }

        .user-menu-popup {
            left: 70px;
        }
    }
}

// Animación del menú de usuario
.user-menu-enter-active,
.user-menu-leave-active {
    transition: all 0.2s ease;
}

.user-menu-enter-from,
.user-menu-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}
// ==================== Campaign Empty State ====================
.campaign-empty {
    cursor: pointer;
    border: 1px dashed rgba(16, 185, 129, 0.3);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.06);

        .campaign-empty-icon {
            transform: scale(1.1);
            background: rgba(16, 185, 129, 0.2);
        }
    }
}

.campaign-empty-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(16, 185, 129, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #10b981;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    animation: pulse-green 2s ease-in-out infinite;
}

@keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
    50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
}

// ==================== Dialog de nueva campaña ====================
// Nota: estos estilos van abajo en un bloque <style> sin scoped
// porque PrimeVue Dialog usa teleport y scoped no alcanza
</style>

<style lang="scss">
.campaign-dialog {
    .campaign-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-row {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .form-row-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .form-input {
        width: 100%;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        background: var(--surface-ground);
        color: var(--text-color);
        font-size: 0.9rem;
        transition: border-color 0.2s;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;

        &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
        }

        &::placeholder {
            color: var(--text-color-secondary);
            opacity: 0.6;
        }
    }

    .form-textarea {
        resize: vertical;
        min-height: 70px;
    }

    .emoji-picker {
        .emoji-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 0.3rem;
            margin-top: 0.25rem;
        }

        .emoji-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid transparent;
            border-radius: 8px;
            background: var(--surface-ground);
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.15s;

            &:hover {
                background: var(--surface-hover);
                transform: scale(1.15);
            }

            &.selected {
                border-color: #3b82f6;
                background: rgba(59, 130, 246, 0.1);
                transform: scale(1.1);
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
    }

    .btn-cancel {
        padding: 0.55rem 1.2rem;
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        background: transparent;
        color: var(--text-color);
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
            background: var(--surface-hover);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .btn-save {
        padding: 0.55rem 1.2rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s;

        &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
    }
}
</style>

