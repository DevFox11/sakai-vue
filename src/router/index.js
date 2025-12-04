import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOrganizationsStore } from '@/stores/organizations';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true }, // Todas las rutas hijas requieren autenticación
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    meta: {
                        breadcrumb: [{ label: 'Inicio' }, { label: 'Dashboard' }]
                    },
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/prospectos',
                    name: 'prospectos',
                    meta: {
                        breadcrumb: [{ label: 'Gestión' }, { label: 'CRM - Leads' }]
                    },
                    component: () => import('@/views/crm/prospectos/CRMLeadsView.vue')
                },
                {
                    path: '/pages/prospectos/nuevo',
                    name: 'prospectos-nuevo',
                    meta: {
                        breadcrumb: [{ label: 'Gestión' }, { label: 'CRM - Leads', to: '/pages/prospectos' }, { label: 'Nuevo' }]
                    },
                    component: () => import('@/views/crm/prospectos/CRMLeadsView.vue')
                },
                {
                    path: '/pages/pipeline',
                    name: 'pipeline',
                    meta: {
                        breadcrumb: [{ label: 'Gestión' }, { label: 'CRM - Leads' }]
                    },
                    redirect: '/pages/prospectos' // Redirect to unified view
                },
                {
                    path: '/pages/estadisticasReportes',
                    name: 'estadisticas',
                    meta: {
                        breadcrumb: [{ label: 'Gestión' }, { label: 'Estadísticas' }]
                    },
                    component: () => import('@/views/pages/EstadisticasReportes.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Form Layout' }]
                    },
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Input' }]
                    },
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Button' }]
                    },
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Table' }]
                    },
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'List' }]
                    },
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Tree' }]
                    },
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Panel' }]
                    },
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Overlay' }]
                    },
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Media' }]
                    },
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Message' }]
                    },
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'File' }]
                    },
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Menu' }]
                    },
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Charts' }]
                    },
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Misc' }]
                    },
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    meta: {
                        breadcrumb: [{ label: 'UI Kit' }, { label: 'Timeline' }]
                    },
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    meta: {
                        breadcrumb: [{ label: 'Prime Blocks' }, { label: 'Free Blocks' }]
                    },
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    meta: {
                        breadcrumb: [{ label: 'Pages' }, { label: 'Empty' }]
                    },
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    meta: {
                        breadcrumb: [{ label: 'Pages' }, { label: 'Crud' }]
                    },
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/pages/user/profile',
                    name: 'profile',
                    meta: {
                        breadcrumb: [{ label: 'User' }, { label: 'Profile' }]
                    },
                    component: () => import('@/views/pages/user/Profile.vue')
                },
                {
                    path: '/no-organization',
                    name: 'noOrganization',
                    component: () => import('@/views/NoOrganization.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    meta: {
                        breadcrumb: [{ label: 'Documentation' }]
                    },
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            meta: { requiresAuth: false },
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            meta: { requiresAuth: false },
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            meta: { requiresAuth: false, guestOnly: true },
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            meta: { requiresAuth: false, guestOnly: true },
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            meta: { requiresAuth: false },
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            meta: { requiresAuth: false },
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const organizationsStore = useOrganizationsStore();

    // Verificar si la ruta requiere autenticación
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Verificar si la ruta es solo para invitados (no autenticados)
    const guestOnly = to.matched.some(record => record.meta.guestOnly);

    if (requiresAuth && !authStore.isAuthenticated) {
        // Ruta protegida pero el usuario no está autenticado
        // Redirigir al login
        next({
            name: 'login',
            query: { redirect: to.fullPath } // Guardar la ruta original para redirigir después del login
        });
    } else if (guestOnly && authStore.isAuthenticated) {
        // Ruta solo para invitados pero el usuario ya está autenticado
        // Redirigir al dashboard
        next({ name: 'dashboard' });
    } else {
        // Si el usuario está autenticado y la ruta requiere autenticación,
        // cargar las organizaciones si aún no están cargadas
        if (requiresAuth && authStore.isAuthenticated) {
            try {
                if (organizationsStore.userOrganizations.length === 0) {
                    await organizationsStore.loadUserOrganizations();
                }

                // Intentar restaurar la organización seleccionada desde localStorage
                if (!organizationsStore.currentOrganization) {
                    organizationsStore.restoreCurrentOrganization();
                }
            } catch (error) {
                console.error('Error al cargar organizaciones:', error);
            }
        }

        // Permitir la navegación
        next();
    }
});

export default router;
