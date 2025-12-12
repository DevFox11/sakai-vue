<template>
  <Drawer 
    v-model:visible="isVisible" 
    :header="lead?.name || 'Detalle del Lead'"
    position="right"
    :style="{ width: '80vw', maxWidth: '1200px' }"
    class="lead-detail-modal"
  >
    <!-- Header personalizado -->
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <!-- Estado del lead -->
          <Dropdown
            v-model="lead.status"
            :options="statusOptions"
            @change="onStatusChange"
            class="status-dropdown"
          >
            <template #value="slotProps">
              <Tag :value="slotProps.value" :severity="getStatusSeverity(slotProps.value)" />
            </template>
            <template #option="slotProps">
              <Tag :value="slotProps.option" :severity="getStatusSeverity(slotProps.option)" />
            </template>
          </Dropdown>
          <h2 class="text-xl font-bold text-surface-900 dark:text-white m-0">{{ lead?.name }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <Button 
            icon="pi pi-pencil" 
            severity="info" 
            text 
            rounded 
            @click="emit('edit-lead', lead)"
            v-tooltip.bottom="'Editar Lead'"
          />
          <Button 
            icon="pi pi-trash" 
            severity="danger" 
            text 
            rounded 
            @click="confirmDeleteLead"
            v-tooltip.bottom="'Eliminar Lead'"
          />
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <ProgressSpinner />
    </div>

    <div v-else-if="lead" class="grid grid-cols-12 gap-10">
      <!-- Columna Izquierda - Información del Lead -->
      <div class="col-span-12 lg:col-span-7 space-y-8">
        <!-- Acciones rápidas -->
        <div class="flex flex-wrap gap-3 pb-6 border-b border-surface-200 dark:border-surface-700">
          <Button 
            label="Añadir Nota" 
            icon="pi pi-plus" 
            severity="secondary" 
            outlined 
            @click="openAddNoteDialog"
          />
          <Button 
            label="Agendar" 
            icon="pi pi-calendar" 
            severity="secondary" 
            outlined 
            disabled
            v-tooltip.top="'Próximamente'"
          />
          <Button 
            label="Checklist" 
            icon="pi pi-check-square" 
            severity="secondary" 
            outlined 
            disabled
            v-tooltip.top="'Próximamente'"
          />
          <Button 
            label="Adjuntar" 
            icon="pi pi-paperclip" 
            severity="secondary" 
            outlined 
            disabled
            v-tooltip.top="'Próximamente'"
          />
        </div>

        <!-- Miembros y Etiquetas -->
        <div class="grid grid-cols-2 gap-8 pb-6 border-b border-surface-200 dark:border-surface-700">
          <div>
            <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-3">Asignado a</span>
            <div class="flex items-center gap-3 group cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 p-2 -ml-2 rounded-lg transition-colors" @click="openAssignDialog">
              <Avatar 
                :label="getOwnerInitials()" 
                shape="circle" 
                size="large"
                class="bg-primary-500 text-white shadow-sm"
              />
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-surface-900 dark:text-white">
                  {{ getOwnerName() }}
                </span>
                <span class="text-xs text-primary-600 dark:text-primary-400 group-hover:underline">Cambiar asignación</span>
              </div>
            </div>
          </div>
          <div>
            <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-3">Etapa Actual</span>
            <div class="flex items-center gap-2 flex-wrap">
              <Tag 
                v-if="currentStage" 
                :value="currentStage.name" 
                :style="{ backgroundColor: currentStage.color, color: '#fff' }"
                class="px-3 py-1 text-sm shadow-sm"
                rounded
              />
              <Button 
                icon="pi pi-arrow-right" 
                text 
                rounded 
                size="small"
                v-tooltip.top="'Mover de etapa en Acciones Rápidas'"
                class="text-surface-400 hover:text-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="pb-6 border-b border-surface-200 dark:border-surface-700">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
                <i class="pi pi-user text-blue-600 dark:text-blue-400 text-sm"></i>
              </div>
              Información de Contacto
            </h3>
          </div>
          <div class="grid grid-cols-2 gap-x-12 gap-y-6">
            <div class="group relative">
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Email</span>
              <div class="flex items-center gap-2">
                <a :href="`mailto:${lead.email}`" class="text-base font-medium text-surface-900 dark:text-white hover:text-primary-500 transition-colors truncate block">
                  {{ lead.email || 'No proporcionado' }}
                </a>
                <Button 
                  v-if="lead.email"
                  icon="pi pi-copy" 
                  text 
                  rounded 
                  size="small" 
                  class="!w-6 !h-6 opacity-0 group-hover:opacity-100 transition-opacity text-surface-400 hover:text-primary-500"
                  @click.stop="copyToClipboard(lead.email)"
                  v-tooltip.top="'Copiar email'"
                />
              </div>
            </div>
            <div class="group relative">
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Teléfono</span>
              <div class="flex items-center gap-2">
                <a :href="`tel:${lead.phone}`" class="text-base font-medium text-surface-900 dark:text-white hover:text-primary-500 transition-colors">
                  {{ lead.phone || 'No proporcionado' }}
                </a>
                <Button 
                  v-if="lead.phone"
                  icon="pi pi-copy" 
                  text 
                  rounded 
                  size="small" 
                  class="!w-6 !h-6 opacity-0 group-hover:opacity-100 transition-opacity text-surface-400 hover:text-primary-500"
                  @click.stop="copyToClipboard(lead.phone)"
                  v-tooltip.top="'Copiar teléfono'"
                />
                <Button 
                  v-if="lead.phone"
                  icon="pi pi-whatsapp" 
                  text 
                  rounded 
                  size="small" 
                  class="!w-6 !h-6 opacity-0 group-hover:opacity-100 transition-opacity text-green-500 hover:bg-green-50"
                  @click.stop="openWhatsApp(lead.phone)"
                  v-tooltip.top="'Abrir WhatsApp'"
                />
              </div>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Empresa</span>
              <span class="text-base font-medium text-surface-900 dark:text-white">{{ lead.company || 'No proporcionado' }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Valor Estimado</span>
              <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">${{ formatCurrency(lead.estimated_value) }}</span>
            </div>
          </div>
        </div>

        <!-- Descripción/Notas -->
        <div class="pb-6 border-b border-surface-200 dark:border-surface-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2 m-0">
               <div class="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-md">
                <i class="pi pi-align-left text-purple-600 dark:text-purple-400 text-sm"></i>
              </div>
              Descripción
            </h3>
            <Button 
              label="Editar" 
              icon="pi pi-pencil"
              severity="secondary" 
              text 
              size="small"
              @click="editingNotes = !editingNotes"
            />
          </div>
          <div v-if="editingNotes" class="space-y-3">
            <Textarea 
              v-model="lead.notes" 
              rows="6" 
              class="w-full text-base"
              autoResize
            />
            <div class="flex justify-end gap-2">
              <Button 
                label="Cancelar" 
                severity="secondary" 
                outlined 
                @click="editingNotes = false"
              />
              <Button 
                label="Guardar Descripción" 
                severity="primary" 
                @click="saveNotes"
              />
            </div>
          </div>
          <p v-else class="text-base text-surface-600 dark:text-surface-300 leading-relaxed m-0 bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl border border-surface-100 dark:border-surface-800">
            {{ lead.notes || 'No hay descripción disponible para este lead.' }}
          </p>
        </div>

        <!-- Información UTM (si existe) -->
        <div v-if="hasUtmData" class="pb-6 border-b border-surface-200 dark:border-surface-700">
          <h3 class="text-lg font-bold text-surface-800 dark:text-surface-100 mb-5 flex items-center gap-2">
             <div class="bg-cyan-100 dark:bg-cyan-900/30 p-1.5 rounded-md">
                <i class="pi pi-chart-line text-cyan-600 dark:text-cyan-400 text-sm"></i>
              </div>
            Información de Campaña (UTM)
          </h3>
          <div class="grid grid-cols-4 gap-6 bg-surface-50 dark:bg-surface-800/30 p-4 rounded-xl">
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Fuente</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ lead.utm_source || '-' }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Medio</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ lead.utm_medium || '-' }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Campaña</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ lead.utm_campaign || '-' }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Término</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ lead.utm_term || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Detalles Adicionales -->
        <div>
          <h3 class="text-lg font-bold text-surface-800 dark:text-surface-100 mb-5 flex items-center gap-2">
             <div class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-md">
                <i class="pi pi-clock text-gray-600 dark:text-gray-400 text-sm"></i>
              </div>
            Metadatos
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Creado</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ formatDate(lead.created_at) }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Actualización</span>
              <span class="text-sm font-medium text-surface-900 dark:text-white">{{ formatDate(lead.updated_at) }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Puntuación</span>
              <span class="text-sm font-bold text-primary-600">{{ lead.score || 0 }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-surface-500 uppercase tracking-widest block mb-1">Visitas Web</span>
              <span class="text-sm font-bold text-surface-900 dark:text-white">{{ lead.visits_count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha - Comentarios y Actividad -->
      <div class="col-span-12 lg:col-span-5 space-y-6">
        <!-- Sección de Comentarios -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-5">
          <h3 class="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <i class="pi pi-comments text-primary-500"></i>
            Comentarios
          </h3>

          <!-- Input para nuevo comentario -->
          <div class="mb-4 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
            <InputText 
              v-model="newComment" 
              placeholder="Escribe un comentario..." 
              class="w-full border-0 bg-transparent focus:ring-0 text-sm"
              @keyup.enter="addComment"
            />
            <div class="flex justify-end mt-2">
              <Button 
                icon="pi pi-send" 
                label="Enviar"
                severity="primary"
                size="small"
                @click="addComment"
                :disabled="!newComment.trim()"
              />
            </div>
          </div>

          <!-- Lista de comentarios -->
          <div class="comments-list space-y-3" style="max-height: 250px; overflow-y: auto;">
            <div v-if="loadingActivities" class="flex justify-center py-4">
              <ProgressSpinner style="width: 30px; height: 30px;" />
            </div>

            <div v-else-if="comments.length === 0" class="text-center py-8 text-surface-400">
              <i class="pi pi-comment text-3xl mb-2 block opacity-50"></i>
              <p class="text-sm m-0">No hay comentarios aún</p>
            </div>

            <div 
              v-else
              v-for="comment in comments" 
              :key="comment.id" 
              class="flex items-start gap-3"
            >
              <Avatar 
                :label="getCommentAuthorInitials(comment)" 
                shape="circle" 
                size="small"
                class="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium text-sm text-surface-900 dark:text-white">
                    {{ comment.created_by_name || 'Usuario' }}
                  </span>
                  <span class="text-xs text-surface-400">
                    {{ formatRelativeTime(comment.created_at) }}
                  </span>
                </div>
                <p class="text-sm text-surface-600 dark:text-surface-400 m-0 leading-relaxed">
                  {{ comment.detail?.note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Historial de Actividad -->
        <div class="bg-surface-0 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 p-5">
          <h3 class="text-base font-semibold text-surface-800 dark:text-surface-200 mb-4 flex items-center gap-2">
            <i class="pi pi-history text-orange-500"></i>
            Historial de Actividad
          </h3>

          <div class="activity-history space-y-3" style="max-height: 300px; overflow-y: auto;">
            <div v-if="loadingActivities" class="flex justify-center py-4">
              <ProgressSpinner style="width: 30px; height: 30px;" />
            </div>

            <div v-else-if="activityHistory.length === 0" class="text-center py-8 text-surface-400">
              <i class="pi pi-inbox text-3xl mb-2 block opacity-50"></i>
              <p class="text-sm m-0">No hay movimientos registrados</p>
            </div>

            <div 
              v-else
              v-for="activity in activityHistory" 
              :key="activity.id" 
              class="flex gap-3 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors -mx-2"
            >
              <!-- Icono de actividad -->
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="getActivityBgClass(activity.type)"
                >
                  <i :class="[getActivityIconClass(activity.type), 'text-sm']"></i>
                </div>
              </div>
              
              <!-- Contenido -->
              <div class="flex-1 min-w-0">
                <span class="font-medium text-surface-900 dark:text-white text-sm">
                  {{ getActivityTypeLabel(activity.type) }}
                </span>
                
                <div class="text-sm text-surface-600 dark:text-surface-400 mt-0.5">
                  <template v-if="activity.type === 'stage_change'">
                    Cambió de "<span class="font-medium">{{ getStageName(activity.detail?.previous_stage_id) }}</span>" 
                    a "<span class="font-medium">{{ getStageName(activity.detail?.new_stage_id) }}</span>"
                  </template>
                  <template v-else-if="activity.type === 'owner_change'">
                    Asignado de "<span class="font-medium">{{ getOwnerNameById(activity.detail?.previous_owner_id) }}</span>" 
                    a "<span class="font-medium">{{ getOwnerNameById(activity.detail?.new_owner_id) }}</span>"
                  </template>
                  <template v-else-if="activity.type === 'status_change'">
                    Estado cambiado a "<span class="font-medium">{{ activity.detail?.new_status }}</span>"
                  </template>
                </div>
                
                <div class="text-xs text-surface-400 mt-1">
                  por <span class="font-medium">{{ activity.created_by_name || 'Sistema' }}</span>
                  <span class="mx-1">•</span>
                  {{ formatRelativeTime(activity.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para agregar nota -->
    <Dialog 
      v-model:visible="addNoteDialogVisible" 
      header="Agregar Nota" 
      :modal="true" 
      :style="{ width: '500px' }"
    >
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Título</label>
          <InputText v-model="noteForm.title" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Contenido</label>
          <Textarea v-model="noteForm.note" rows="4" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" severity="secondary" outlined @click="addNoteDialogVisible = false" />
        <Button label="Guardar" severity="primary" @click="saveNote" />
      </template>
    </Dialog>

    <!-- Confirmación de eliminación -->
    <ConfirmDialog></ConfirmDialog>
  </Drawer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import crmService from '@/service/crm/crmService';
import apiClient from '@/api/axios';
import { useOrganizationsStore } from '@/stores/organizations';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  leadId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['update:visible', 'lead-updated', 'lead-deleted', 'edit-lead']);

const toast = useToast();
const confirm = useConfirm();
const organizationsStore = useOrganizationsStore();

// Estado
const lead = ref({});
const activities = ref([]);
const stages = ref([]);
const owners = ref([]);
const currentStage = ref(null);

const loading = ref(false);
const loadingActivities = ref(false);
const editingNotes = ref(false);
const showDetails = ref(false);
const showQuickActions = ref(true);

// Formularios
const newComment = ref('');
const newStageId = ref(null);
const newOwnerId = ref(null);
const addNoteDialogVisible = ref(false);
const noteForm = ref({ title: '', note: '' });

// Opciones
const statusOptions = ['nuevo', 'contactado', 'oportunidad', 'ganado', 'perdido'];

// Computed
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const hasUtmData = computed(() => {
  return lead.value?.utm_source || 
         lead.value?.utm_medium || 
         lead.value?.utm_campaign || 
         lead.value?.utm_term;
});

// Separar comentarios (type = 'note') del historial de actividad
const comments = computed(() => {
  return activities.value.filter(a => a.type === 'note');
});

const activityHistory = computed(() => {
  return activities.value.filter(a => a.type !== 'note');
});

// Helper para obtener iniciales del autor del comentario
const getCommentAuthorInitials = (comment) => {
  const name = comment.created_by_name || 'Usuario';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Watchers
watch(() => props.leadId, async (newId) => {
  if (newId && props.visible) {
    await loadLeadData();
  }
}, { immediate: true });

watch(() => props.visible, async (visible) => {
  if (visible && props.leadId) {
    await loadLeadData();
  }
});

// Métodos de carga
const loadLeadData = async () => {
  if (!props.leadId || !organizationsStore.currentOrganizationId) return;
  
  loading.value = true;
  try {
    // Cargar lead
    const leadData = await crmService.getLead(props.leadId, organizationsStore.currentOrganizationId);
    lead.value = leadData;
    
    // Cargar datos adicionales en paralelo
    await Promise.all([
      loadActivities(),
      loadStages(),
      loadOwners()
    ]);
    
    // Encontrar etapa actual
    if (lead.value.stage_id && stages.value.length > 0) {
      currentStage.value = stages.value.find(s => s.id === lead.value.stage_id);
    }
  } catch (error) {
    console.error('Error cargando lead:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el lead', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const loadActivities = async () => {
  loadingActivities.value = true;
  try {
    const data = await crmService.getLeadActivities(props.leadId, organizationsStore.currentOrganizationId);
    activities.value = data;
  } catch (error) {
    console.error('Error cargando actividades:', error);
  } finally {
    loadingActivities.value = false;
  }
};

const loadStages = async () => {
  try {
    const data = await crmService.getStages(organizationsStore.currentOrganizationId);
    stages.value = data;
  } catch (error) {
    console.error('Error cargando etapas:', error);
  }
};

const loadOwners = async () => {
  try {
    const response = await apiClient.get(`/organizations/${organizationsStore.currentOrganizationId}/members`, {
      headers: { 'X-Organization-ID': organizationsStore.currentOrganizationId }
    });
    owners.value = response.data;
  } catch (error) {
    console.error('Error cargando propietarios:', error);
  }
};

// Acciones
const onStatusChange = async () => {
  try {
    await crmService.updateLead(lead.value.id, { status: lead.value.status }, organizationsStore.currentOrganizationId);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado actualizado', life: 3000 });
    emit('lead-updated');
    await loadActivities();
  } catch (error) {
    console.error('Error actualizando estado:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el estado', life: 3000 });
  }
};

const saveNotes = async () => {
  try {
    await crmService.updateLead(lead.value.id, { notes: lead.value.notes }, organizationsStore.currentOrganizationId);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Notas guardadas', life: 3000 });
    editingNotes.value = false;
    emit('lead-updated');
  } catch (error) {
    console.error('Error guardando notas:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar las notas', life: 3000 });
  }
};

const addComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    await crmService.addLeadNote(lead.value.id, newComment.value, 'Comentario', organizationsStore.currentOrganizationId);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Comentario agregado', life: 3000 });
    newComment.value = '';
    await loadActivities();
    emit('lead-updated');
  } catch (error) {
    console.error('Error agregando comentario:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el comentario', life: 3000 });
  }
};

const moveToStage = async () => {
  if (!newStageId.value) return;
  
  try {
    await crmService.moveLead(lead.value.id, newStageId.value, organizationsStore.currentOrganizationId);
    lead.value.stage_id = newStageId.value;
    currentStage.value = stages.value.find(s => s.id === newStageId.value);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead movido de etapa', life: 3000 });
    newStageId.value = null;
    await loadActivities();
    emit('lead-updated');
  } catch (error) {
    console.error('Error moviendo lead:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo mover el lead', life: 3000 });
  }
};

const assignToOwner = async () => {
  if (!newOwnerId.value) return;
  
  try {
    await crmService.assignLead(lead.value.id, newOwnerId.value, organizationsStore.currentOrganizationId);
    lead.value.owner_id = newOwnerId.value;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead asignado', life: 3000 });
    newOwnerId.value = null;
    await loadActivities();
    emit('lead-updated');
  } catch (error) {
    console.error('Error asignando lead:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el lead', life: 3000 });
  }
};

const openAddNoteDialog = () => {
  noteForm.value = { title: '', note: '' };
  addNoteDialogVisible.value = true;
};

const openAssignDialog = () => {
  // El dropdown de asignación está en la sidebar
};

const saveNote = async () => {
  try {
    await crmService.addLeadNote(
      lead.value.id, 
      noteForm.value.note, 
      noteForm.value.title, 
      organizationsStore.currentOrganizationId
    );
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Nota agregada', life: 3000 });
    addNoteDialogVisible.value = false;
    await loadActivities();
    emit('lead-updated');
  } catch (error) {
    console.error('Error guardando nota:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la nota', life: 3000 });
  }
};

const confirmDeleteLead = () => {
  confirm.require({
    message: `¿Está seguro que desea eliminar el lead "${lead.value.name}"?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await crmService.deleteLead(lead.value.id, organizationsStore.currentOrganizationId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead eliminado', life: 3000 });
        emit('lead-deleted');
      } catch (error) {
        console.error('Error eliminando lead:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el lead', life: 3000 });
      }
    }
  });
};

// Helpers
const getStatusSeverity = (status) => {
  const severities = {
    'nuevo': 'info',
    'contactado': 'warn',
    'oportunidad': 'secondary',
    'ganado': 'success',
    'perdido': 'danger'
  };
  return severities[status] || 'secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getOwnerInitials = () => {
  const owner = owners.value.find(o => o.internal_user_id === lead.value?.owner_id);
  if (!owner?.name) return '?';
  return owner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getOwnerName = () => {
  const owner = owners.value.find(o => o.internal_user_id === lead.value?.owner_id);
  return owner?.name || 'Sin asignar';
};

const getOwnerNameById = (ownerId) => {
  if (!ownerId) return 'Nadie';
  const owner = owners.value.find(o => o.internal_user_id === ownerId || o.id === ownerId);
  return owner?.name || 'Desconocido';
};

const getStageName = (stageId) => {
  if (!stageId) return 'Ninguna';
  const stage = stages.value.find(s => s.id === stageId);
  return stage?.name || 'Desconocida';
};

const getActivityIcon = (type) => {
  const icons = {
    'note': 'pi pi-sticky-note',
    'message': 'pi pi-comment',
    'call': 'pi pi-phone',
    'stage_change': 'pi pi-arrow-right-arrow-left',
    'owner_change': 'pi pi-user-plus',
    'status_change': 'pi pi-flag',
    'system': 'pi pi-cog'
  };
  return icons[type] || 'pi pi-info-circle';
};

const getActivityIconBg = (type) => {
  const bgs = {
    'note': 'bg-blue-500',
    'message': 'bg-green-500',
    'call': 'bg-purple-500',
    'stage_change': 'bg-orange-500',
    'owner_change': 'bg-cyan-500',
    'status_change': 'bg-yellow-500',
    'system': 'bg-gray-500'
  };
  return bgs[type] || 'bg-gray-500';
};

// Nuevos helpers para formato chat
const getActivityBgClass = (type) => {
  const classes = {
    'note': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'message': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    'call': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    'stage_change': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'owner_change': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    'status_change': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    'system': 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
};

const getActivityIconClass = (type) => {
  const icons = {
    'note': 'pi pi-file-edit',
    'message': 'pi pi-comment',
    'call': 'pi pi-phone',
    'stage_change': 'pi pi-flag-fill',
    'owner_change': 'pi pi-user',
    'status_change': 'pi pi-tag',
    'system': 'pi pi-cog'
  };
  return icons[type] || 'pi pi-info-circle';
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
};

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ severity: 'success', summary: 'Copiado', detail: 'Texto copiado al portapapeles', life: 2000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo copiar el texto', life: 2000 });
  }
};

const openWhatsApp = (phone) => {
  if (!phone) return;
  // Eliminar caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanPhone}`, '_blank');
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getActivityTypeLabel = (type) => {
  const labels = {
    'note': 'Nota',
    'message': 'Mensaje',
    'call': 'Llamada',
    'stage_change': 'Cambio de Etapa',
    'owner_change': 'Cambio de Asignación',
    'status_change': 'Cambio de Estado',
    'system': 'Sistema'
  };
  return labels[type] || type;
};
</script>

<style scoped>
.lead-detail-modal :deep(.p-drawer-content) {
  padding: 1.5rem;
}

.lead-detail-modal :deep(.p-drawer-header) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.dark .lead-detail-modal :deep(.p-drawer-header) {
  border-bottom-color: var(--p-surface-700);
}

.status-dropdown :deep(.p-dropdown-label) {
  padding: 0;
}

.activity-timeline {
  scrollbar-width: thin;
}

.activity-timeline::-webkit-scrollbar {
  width: 6px;
}

.activity-timeline::-webkit-scrollbar-track {
  background: transparent;
}

.activity-timeline::-webkit-scrollbar-thumb {
  background-color: var(--p-surface-300);
  border-radius: 3px;
}

.dark .activity-timeline::-webkit-scrollbar-thumb {
  background-color: var(--p-surface-600);
}

/* Activity Feed styles */
.activity-feed {
  scrollbar-width: thin;
}

.activity-feed::-webkit-scrollbar {
  width: 6px;
}

.activity-feed::-webkit-scrollbar-track {
  background: transparent;
}

.activity-feed::-webkit-scrollbar-thumb {
  background-color: var(--p-surface-300);
  border-radius: 3px;
}

.dark .activity-feed::-webkit-scrollbar-thumb {
  background-color: var(--p-surface-600);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
