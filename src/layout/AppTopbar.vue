<script setup>
// Topbar con soporte para contenido dinámico via Vue Teleport
</script>

<template>
    <div class="layout-topbar">
        <!-- Contenido dinámico insertado via Teleport desde las vistas -->
        <div id="topbar-content" class="flex items-center gap-4 flex-1"></div>
        
        <div class="layout-topbar-actions">
            <!-- Acciones globales del topbar -->
        </div>
    </div>
</template>
