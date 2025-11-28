<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { ref, onMounted } from 'vue';
import apiClient from '@/api/axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const userRole = ref('Cargando...');
const userOrganizations = ref([]);
const editing = ref(false);
const userData = ref({
    name: '',
    email: '',
    phone: '',
    bio: ''
});

// Variables para la seguridad
const twoFactorEnabled = ref(false);
const notificationsEnabled = ref(true);

// Funciones auxiliares
const toggleEdit = () => {
    editing.value = !editing.value;
    if (!editing.value) {
        // Si cancelamos la edición, restauramos los valores originales
        userData.value = {
            name: authStore.userName,
            email: authStore.userEmail,
            phone: authStore.user?.phone || '',
            bio: authStore.user?.bio || ''
        };
    }
};

const saveProfile = () => {
    // Aquí deberíamos hacer la llamada al backend para actualizar la información del usuario
    // Por ahora, solo mostramos un mensaje de éxito
    toast.add({
        severity: 'success',
        summary: 'Perfil actualizado',
        detail: 'Tu perfil ha sido actualizado exitosamente',
        life: 3000
    });
    editing.value = false;
};

const toggleTwoFactorAuth = (event) => {
    toast.add({
        severity: event.value ? 'success' : 'warn',
        summary: event.value ? '2FA activado' : '2FA desactivado',
        detail: event.value ? 'Autenticación de dos factores activada' : 'Autenticación de dos factores desactivada',
        life: 3000
    });
};

const toggleNotifications = (event) => {
    toast.add({
        severity: event.value ? 'success' : 'warn',
        summary: event.value ? 'Notificaciones activadas' : 'Notificaciones desactivadas',
        detail: event.value ? 'Notificaciones activadas exitosamente' : 'Notificaciones desactivadas',
        life: 3000
    });
};

const viewActiveSessions = () => {
    toast.add({
        severity: 'info',
        summary: 'Sesiones Activas',
        detail: 'Redirigiendo a la página de sesiones activas...',
        life: 3000
    });
    // router.push('/pages/user/sessions'); // Descomentar cuando se cree la ruta
};

const changePassword = () => {
    toast.add({
        severity: 'info',
        summary: 'Cambiar Contraseña',
        detail: 'Redirigiendo a la página de cambio de contraseña...',
        life: 3000
    });
    // router.push('/auth/change-password'); // Descomentar cuando se cree la ruta
};

const handleLogout = async () => {
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
        router.push('/auth/login');
    }
};

// Función para obtener las organizaciones y el rol del usuario
const loadUserOrganizations = async () => {
    try {
        const response = await apiClient.get('/organizations');
        userOrganizations.value = response.data;

        if (response.data && response.data.length > 0) {
            // Si el usuario es owner de alguna organización, mostrar "Propietario"
            // Si es admin de alguna, mostrar "Administrador", etc.
            const ownerOrg = response.data.find(org => org.role === 'owner');
            if (ownerOrg) {
                userRole.value = 'Propietario';
            } else {
                // Tomar el rol más alto del primer organizacion
                const firstOrg = response.data[0];
                userRole.value = mapRoleToDisplay(firstOrg.role);
            }
        } else {
            userRole.value = 'Sin organización';
        }
    } catch (error) {
        console.error('Error obteniendo organizaciones del usuario:', error);
        userRole.value = 'Rol no disponible';
    }
};

// Función para mapear roles técnicos a nombres amigables
const mapRoleToDisplay = (role) => {
    const roleMap = {
        'owner': 'Propietario',
        'admin': 'Administrador',
        'member': 'Miembro',
        'viewer': 'Lector'
    };
    return roleMap[role] || role;
};

onMounted(() => {
    loadUserOrganizations();
    // Inicializar los datos del usuario
    userData.value = {
        name: authStore.userName,
        email: authStore.userEmail,
        phone: authStore.user?.phone || '',
        bio: authStore.user?.bio || ''
    };
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <!-- Card de Perfil -->
        <div class="col-span-12 md:col-span-6">
            <div class="card h-full">
                <div class="flex justify-between items-center mb-4">
                    <div class="font-semibold text-xl">Mi Perfil</div>
                    <Button
                        :icon="editing ? 'pi pi-times' : 'pi pi-user-edit'"
                        :label="editing ? 'Cancelar' : 'Editar'"
                        :severity="editing ? 'danger' : 'secondary'"
                        size="small"
                        @click="toggleEdit"
                        :outlined="!editing"
                    />
                </div>

                <div class="flex flex-col items-center p-6">
                    <div class="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 text-4xl font-bold">
                        {{ authStore.userName.charAt(0).toUpperCase() }}
                    </div>

                    <div v-if="!editing" class="text-center w-full">
                        <div class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ authStore.userName }}</div>
                        <div class="text-surface-600 dark:text-surface-400 mb-6">{{ authStore.userEmail }}</div>
                    </div>

                    <div v-else class="w-full space-y-4 mb-6">
                        <div class="field">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Nombre</label>
                            <InputText
                                v-model="userData.name"
                                class="w-full"
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        <div class="field">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Email</label>
                            <InputText
                                v-model="userData.email"
                                type="email"
                                class="w-full"
                                placeholder="tu@email.com"
                                disabled
                            />
                        </div>
                        <div class="field">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Teléfono</label>
                            <InputText
                                v-model="userData.phone"
                                class="w-full"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div class="field">
                            <label class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">Biografía</label>
                            <Textarea
                                v-model="userData.bio"
                                class="w-full"
                                rows="3"
                                placeholder="Cuéntanos sobre ti..."
                            />
                        </div>
                    </div>

                    <div class="w-full border-t border-surface-200 dark:border-surface-700 my-4"></div>

                    <div class="w-full">
                        <div class="flex items-center justify-between py-3">
                            <span class="font-medium text-surface-600 dark:text-surface-400">ID de Usuario</span>
                            <span class="text-surface-900 dark:text-surface-0">{{ authStore.user?.id || 'N/A' }}</span>
                        </div>
                        <div class="flex items-center justify-between py-3">
                            <span class="font-medium text-surface-600 dark:text-surface-400">Rol</span>
                            <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-sm font-medium">{{ userRole }}</span>
                        </div>
                    </div>

                    <div v-if="editing" class="w-full flex gap-2 mt-4">
                        <Button label="Guardar" icon="pi pi-check" class="flex-1" @click="saveProfile" />
                        <Button label="Cancelar" severity="secondary" outlined class="flex-1" @click="toggleEdit" />
                    </div>

                    <Button
                        v-if="!editing"
                        label="Cerrar Sesión"
                        icon="pi pi-sign-out"
                        severity="secondary"
                        outlined
                        class="w-full mt-4"
                        @click="handleLogout"
                    />
                </div>
            </div>
        </div>

        <!-- Card de Seguridad y Preferencias -->
        <div class="col-span-12 md:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Seguridad</div>
                <p class="text-surface-600 dark:text-surface-400 mb-6">Gestiona la seguridad de tu cuenta.</p>

                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="flex items-center">
                            <i class="pi pi-lock text-surface-500 dark:text-surface-400 text-xl mr-3"></i>
                            <div>
                                <div class="font-medium">Contraseña</div>
                                <div class="text-sm text-surface-500 dark:text-surface-400">Último cambio: hace 2 meses</div>
                            </div>
                        </div>
                        <Button
                            label="Cambiar"
                            icon="pi pi-pencil"
                            size="small"
                            severity="help"
                            text
                            @click="changePassword"
                        />
                    </div>

                    <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="flex items-center">
                            <i class="pi pi-shield text-surface-500 dark:text-surface-400 text-xl mr-3"></i>
                            <div>
                                <div class="font-medium">Autenticación de Dos Factores</div>
                                <div class="text-sm text-surface-500 dark:text-surface-400">Agrega una capa adicional de seguridad</div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm text-surface-500 dark:text-surface-400 mr-2" :class="twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                {{ twoFactorEnabled ? 'Activado' : 'Desactivado' }}
                            </span>
                            <InputSwitch
                                v-model="twoFactorEnabled"
                                @change="toggleTwoFactorAuth"
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="flex items-center">
                            <i class="pi pi-bell text-surface-500 dark:text-surface-400 text-xl mr-3"></i>
                            <div>
                                <div class="font-medium">Notificaciones</div>
                                <div class="text-sm text-surface-500 dark:text-surface-400">Administra las notificaciones de la cuenta</div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm text-surface-500 dark:text-surface-400 mr-2" :class="notificationsEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                                {{ notificationsEnabled ? 'Activado' : 'Desactivado' }}
                            </span>
                            <InputSwitch
                                v-model="notificationsEnabled"
                                @change="toggleNotifications"
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                        <div class="flex items-center">
                            <i class="pi pi-history text-surface-500 dark:text-surface-400 text-xl mr-3"></i>
                            <div>
                                <div class="font-medium">Sesiones Activas</div>
                                <div class="text-sm text-surface-500 dark:text-surface-400">Gestiona tus dispositivos conectados</div>
                            </div>
                        </div>
                        <Button
                            label="Ver Sesiones"
                            icon="pi pi-external-link"
                            size="small"
                            severity="info"
                            text
                            @click="viewActiveSessions"
                        />
                    </div>
                </div>
            </div>

            <!-- Actividad Reciente -->
            <div class="card mt-8">
                <div class="font-semibold text-xl mb-4">Actividad Reciente</div>

                <div class="flex flex-col gap-3">
                    <div class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700 last:border-0 last:pb-0">
                        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                            <i class="pi pi-sign-in text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div class="flex-1">
                            <div class="font-medium">Inicio de sesión</div>
                            <div class="text-sm text-surface-500 dark:text-surface-400">Hoy a las 09:30 AM</div>
                        </div>
                    </div>
                    <div class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700 last:border-0 last:pb-0">
                        <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                            <i class="pi pi-mobile text-green-600 dark:text-green-400"></i>
                        </div>
                        <div class="flex-1">
                            <div class="font-medium">Dispositivo móvil conectado</div>
                            <div class="text-sm text-surface-500 dark:text-surface-400">Ayer a las 3:45 PM</div>
                        </div>
                    </div>
                    <div class="flex items-start py-3 border-b border-surface-200 dark:border-surface-700 last:border-0 last:pb-0">
                        <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                            <i class="pi pi-globe text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <div class="flex-1">
                            <div class="font-medium">Cambio de ubicación</div>
                            <div class="text-sm text-surface-500 dark:text-surface-400">Hace 2 días</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
