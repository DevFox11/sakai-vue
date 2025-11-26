import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/pages/prospectos',
                    name: 'prospectos',
                    component: () => import('@/views/pages/Prospectos.vue')
                },
                {
                    path: '/pages/estadisticasReportes',
                    name: 'estadisticas',
                    component: () => import('@/views/pages/EstadisticasReportes.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    meta: {
                        breadcrumb: ['Prime Blocks', 'Free Blocks']
                    },
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/pages/user/profile',
                    name: 'profile',
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
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

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
        // Permitir la navegación
        next();
    }
});

export default router;
