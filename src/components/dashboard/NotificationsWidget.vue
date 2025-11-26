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
        <div class="flex items-center justify-between mb-6">
            <div>
                <div class="font-semibold text-xl text-surface-900 dark:text-white">Notificaciones</div>
                <p class="text-muted-color text-sm mt-1">Actividad reciente de tu negocio</p>
            </div>
            <div>
                <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)"></Button>
                <Menu ref="menu" popup :model="items" class="!min-w-40"></Menu>
            </div>
        </div>

        <span class="block text-primary font-medium mb-4 text-sm font-bold">HOY</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700">
                <div class="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-dollar !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-900 dark:text-surface-0 leading-tight block text-sm"
                        >Richard Jones
                        <span class="text-surface-700 dark:text-surface-300">ha comprado una camiseta azul por <span class="text-primary font-bold">$79.00</span></span>
                    </span>
                    <span class="text-muted-color text-xs">Hace 2 horas</span>
                </div>
            </li>
            <li class="flex items-start py-3">
                <div class="w-10 h-10 flex items-center justify-center bg-orange-100 dark:bg-orange-400/20 text-orange-600 dark:text-orange-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-download !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-700 dark:text-surface-300 leading-tight block text-sm">Tu solicitud de retiro de <span class="text-primary font-bold">$2,500.00</span> ha sido iniciada.</span>
                    <span class="text-muted-color text-xs">Hace 5 horas</span>
                </div>
            </li>
        </ul>

        <span class="block text-primary font-medium mb-4 text-sm font-bold">AYER</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700">
                <div class="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-dollar !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-900 dark:text-surface-0 leading-tight block text-sm"
                        >Keyser Wick
                        <span class="text-surface-700 dark:text-surface-300">ha comprado una chaqueta negra por <span class="text-primary font-bold">$59.00</span></span>
                    </span>
                    <span class="text-muted-color text-xs">Ayer, 10:30 AM</span>
                </div>
            </li>
            <li class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700">
                <div class="w-10 h-10 flex items-center justify-center bg-pink-100 dark:bg-pink-400/20 text-pink-600 dark:text-pink-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-question !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-900 dark:text-surface-0 leading-tight block text-sm"
                        >Jane Davis
                        <span class="text-surface-700 dark:text-surface-300">ha publicado nuevas preguntas sobre tu producto.</span>
                    </span>
                    <span class="text-muted-color text-xs">Ayer, 3:15 PM</span>
                </div>
            </li>
        </ul>
        <span class="block text-primary font-medium mb-4 text-sm font-bold">ÚLTIMA SEMANA</span>
        <ul class="p-0 m-0 list-none">
            <li class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700">
                <div class="w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-400/20 text-green-600 dark:text-green-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-arrow-up !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-900 dark:text-surface-0 leading-tight block text-sm">Tu ingreso ha aumentado un <span class="text-primary font-bold">25%</span>.</span>
                    <span class="text-muted-color text-xs">Hace 3 días</span>
                </div>
            </li>
            <li class="flex items-start py-3">
                <div class="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-400/20 text-purple-600 dark:text-purple-300 rounded-full mr-4 flex-shrink-0">
                    <i class="pi pi-heart !text-base"></i>
                </div>
                <div>
                    <span class="text-surface-900 dark:text-surface-0 leading-tight block text-sm"><span class="text-primary font-bold">12</span> usuarios han añadido tus productos a su lista de deseos.</span>
                    <span class="text-muted-color text-xs">Hace 4 días</span>
                </div>
            </li>
        </ul>
    </div>
</template>
