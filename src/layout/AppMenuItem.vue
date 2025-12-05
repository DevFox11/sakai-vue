<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    },
    collapsed: {
        type: Boolean,
        default: false
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

function itemClick(event, item) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        toggleMenu();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
    return route.path === item.to;
}
</script>

<template>
    <li :class="{ 'active-menuitem': isActiveMenu }">
        <!-- Link con submenú (expandible) -->
        <a 
            v-if="(!item.to || item.items) && item.visible !== false" 
            :href="item.url" 
            @click="itemClick($event, item, index)" 
            :class="[item.class, { 'collapsed-item': collapsed }]" 
            :target="item.target" 
            tabindex="0"
            :title="collapsed ? item.label : ''"
        >
            <i :class="item.icon" class="menu-icon"></i>
            <span v-show="!collapsed" class="menu-text">{{ item.label }}</span>
            <i v-show="!collapsed" class="pi pi-chevron-down menu-toggle" v-if="item.items" :class="{ 'rotated': isActiveMenu }"></i>
        </a>
        
        <!-- Link directo (sin submenú) -->
        <router-link 
            v-if="item.to && !item.items && item.visible !== false" 
            @click="itemClick($event, item, index)" 
            :class="[item.class, { 'active-route': checkActiveRoute(item), 'collapsed-item': collapsed }]" 
            tabindex="0" 
            :to="item.to"
            :title="collapsed ? item.label : ''"
        >
            <i :class="item.icon" class="menu-icon"></i>
            <span v-show="!collapsed" class="menu-text">{{ item.label }}</span>
        </router-link>
        
        <!-- Submenú (oculto cuando colapsado) -->
        <Transition v-if="item.items && item.visible !== false && !collapsed" name="submenu">
            <ul v-show="isActiveMenu" class="submenu">
                <app-menu-item 
                    v-for="(child, i) in item.items" 
                    :key="child" 
                    :index="i" 
                    :item="child" 
                    :parentItemKey="itemKey" 
                    :root="false"
                    :collapsed="collapsed"
                ></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
li {
    margin-bottom: 2px;
    position: relative;

    > a,
    > .router-link-active {
        display: flex;
        align-items: center;
        padding: 0.7rem 0.75rem;
        color: var(--text-color);
        text-decoration: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 0.75rem;

        .menu-icon {
            font-size: 1rem;
            color: var(--text-color-secondary);
            width: 20px;
            text-align: center;
            flex-shrink: 0;
        }

        .menu-text {
            flex: 1;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .menu-toggle {
            font-size: 0.7rem;
            color: var(--text-color-secondary);
            transition: transform 0.2s ease;
            
            &.rotated {
                transform: rotate(180deg);
            }
        }

        &:hover {
            background: var(--surface-hover);
        }

        &.active-route {
            background: rgba(59, 130, 246, 0.1);
            color: var(--primary-color);

            .menu-icon {
                color: var(--primary-color);
            }
        }

        // Estilo para modo colapsado
        &.collapsed-item {
            justify-content: center;
            padding: 0.7rem 0.5rem;
        }
    }
}

.submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-left: 0.5rem;

    li {
        > a,
        > .router-link-active {
            padding: 0.6rem 0.75rem 0.6rem 2rem;
            font-size: 0.875rem;

            .menu-icon {
                display: none;
            }

            &.active-route {
                background: rgba(59, 130, 246, 0.15);
                color: var(--primary-color);
                font-weight: 600;
            }
        }
    }
}

// Animación del submenú
.submenu-enter-active,
.submenu-leave-active {
    transition: all 0.25s ease;
    overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
    opacity: 0;
    max-height: 0;
}

.submenu-enter-to,
.submenu-leave-from {
    opacity: 1;
    max-height: 500px;
}
</style>
