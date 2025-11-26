<script setup>
import { ref } from 'vue';

const menu = ref(null);

const items = ref([
    { label: 'Agregar Nuevo', icon: 'pi pi-fw pi-plus' },
    { label: 'Eliminar', icon: 'pi pi-fw pi-trash' }
]);
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div>
                <div class="font-semibold text-xl text-surface-900 dark:text-white">Productos Más Vendidos</div>
                <p class="text-muted-color text-sm mt-1">Ranking de productos con más ventas</p>
            </div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="!min-w-40"></Menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 pb-5 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-start">
                    <div class="bg-orange-100 dark:bg-orange-400/20 text-orange-800 dark:text-orange-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-shopping-bag text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Space T-Shirt</span>
                        <div class="mt-1 text-muted-color text-sm">Ropa</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-orange-500 h-full" style="width: 50%"></div>
                    </div>
                    <span class="text-orange-500 ml-3 font-medium text-sm">50%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 pb-5 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-start">
                    <div class="bg-cyan-100 dark:bg-cyan-400/20 text-cyan-800 dark:text-cyan-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-tag text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Portal Sticker</span>
                        <div class="mt-1 text-muted-color text-sm">Accesorios</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 ml-0 md:ml-12 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                    </div>
                    <span class="text-cyan-500 ml-3 font-medium text-sm">16%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 pb-5 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-start">
                    <div class="bg-pink-100 dark:bg-pink-400/20 text-pink-800 dark:text-pink-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-tag text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Supernova Sticker</span>
                        <div class="mt-1 text-muted-color text-sm">Accesorios</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 ml-0 md:ml-12 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-pink-500 h-full" style="width: 67%"></div>
                    </div>
                    <span class="text-pink-500 ml-3 font-medium text-sm">67%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 pb-5 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-start">
                    <div class="bg-green-100 dark:bg-green-400/20 text-green-800 dark:text-green-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-book text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Wonders Notebook</span>
                        <div class="mt-1 text-muted-color text-sm">Oficina</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 ml-0 md:ml-12 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-green-500 h-full" style="width: 35%"></div>
                    </div>
                    <span class="text-green-500 ml-3 font-medium text-sm">35%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-5 pb-5 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-start">
                    <div class="bg-purple-100 dark:bg-purple-400/20 text-purple-800 dark:text-purple-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-mobile text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Mat Black Case</span>
                        <div class="mt-1 text-muted-color text-sm">Accesorios</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 ml-0 md:ml-12 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-purple-500 h-full" style="width: 75%"></div>
                    </div>
                    <span class="text-purple-500 ml-3 font-medium text-sm">75%</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-0">
                <div class="flex items-start">
                    <div class="bg-teal-100 dark:bg-teal-400/20 text-teal-800 dark:text-teal-200 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <i class="pi pi-shopping-bag text-xs"></i>
                    </div>
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block">Robots T-Shirt</span>
                        <div class="mt-1 text-muted-color text-sm">Ropa</div>
                    </div>
                </div>
                <div class="mt-3 md:mt-0 ml-0 md:ml-12 flex items-center">
                    <div class="bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden w-40 lg:w-32" style="height: 6px">
                        <div class="bg-teal-500 h-full" style="width: 40%"></div>
                    </div>
                    <span class="text-teal-500 ml-3 font-medium text-sm">40%</span>
                </div>
            </li>
        </ul>
    </div>
</template>
