<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Inicio',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }
        ]
    },
    {
        label: 'Gestión',
        items: [
            {
                label: 'Prospectos',
                icon: 'pi pi-fw pi-users',
                items: [
                    { label: 'Lista', icon: 'pi pi-fw pi-list', to: '/pages/prospectos' },
                    { label: 'Nuevo', icon: 'pi pi-fw pi-plus', to: '/pages/prospectos/nuevo' },
                    { label: 'Pipeline', icon: 'pi pi-fw pi-sitemap', to: '/pages/pipeline' }
                ]
            },
            { label: 'Estadísticas', icon: 'pi pi-fw pi-chart-line', to: '/pages/estadisticasReportes' }
        ]
    },
    {
        label: 'Configuración',
        items: [
            { label: 'Mi Organización', icon: 'pi pi-fw pi-building', to: '/pages/empty' },
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/pages/crud' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
    padding: 0;
    margin: 0;
    list-style-type: none;

    > li {
        padding: 0;
        margin: 4px 0;

        > .layout-root-menuitem {
            > .layout-menuitem-root-text {
                padding: 1rem 1.5rem;
                display: block;
                color: var(--text-color-secondary);
                font-weight: 700;
                font-size: .857rem;
                text-transform: uppercase;
                letter-spacing: .5px;
            }
        }

        > a {
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            color: var(--text-color);
            transition: color .2s;
            text-decoration: none;
            border-radius: 6px;
            margin: 0 10px;
            position: relative;
            cursor: pointer;
            overflow: hidden;

            .layout-menuitem-icon {
                margin-right: 0.75rem;
                font-size: 1rem;
                flex-shrink: 0;
            }

            .layout-menuitem-text {
                flex-grow: 1;
            }

            .layout-submenu-toggler {
                transition: transform .2s;
                margin-left: 0.5rem;
            }

            &:hover {
                color: var(--primary-color);
                background-color: var(--surface-hover);
            }

            &.active-route {
                color: var(--primary-color);
                background-color: var(--primary-color-lighter);
            }
        }

        > .layout-submenu {
            list-style-type: none;
            margin: 0;
            padding: 0;

            > li {
                > a {
                    padding: 0.75rem 1.5rem;
                    display: flex;
                    align-items: center;
                    color: var(--text-color);
                    transition: color .2s;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 0 10px 0 24px;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;

                    .layout-menuitem-icon {
                        margin-right: 0.75rem;
                        font-size: 0.9rem;
                        flex-shrink: 0;
                    }

                    .layout-menuitem-text {
                        flex-grow: 1;
                    }

                    .layout-submenu-toggler {
                        transition: transform .2s;
                        margin-left: 0.5rem;
                    }

                    &:hover {
                        color: var(--primary-color);
                        background-color: var(--surface-hover);
                    }

                    &.active-route {
                        color: var(--primary-color);
                        background-color: var(--primary-color-lighter);
                    }
                }

                > .layout-submenu {
                    > li {
                        > a {
                            margin-left: 34px;
                        }
                    }
                }
            }
        }
    }
}
</style>
