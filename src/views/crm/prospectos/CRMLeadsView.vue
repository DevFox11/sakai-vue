<template>
  <div v-if="!organizationsStore.currentOrganizationId" class="grid grid-cols-12">
    <div class="col-span-12">
      <div class="card text-center py-12">
        <i class="pi pi-building text-6xl text-surface-300 mb-4"></i>
        <h3 class="text-2xl font-bold text-surface-900 dark:text-white mb-2">No hay organización seleccionada</h3>
        <p class="text-surface-600 dark:text-surface-400 mb-6">Por favor, seleccione una organización para acceder a las funcionalidades de CRM</p>
        <Button
          label="Seleccionar Organización"
          icon="pi pi-building"
          @click="goToNoOrganization"
          severity="primary"
        />
      </div>
    </div>
  </div>

  <div v-else class="grid grid-cols-12 gap-6">
    <!-- Header de Gestión -->
    <div class="col-span-12">
      <div class="card mb-0">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div>
              <h2 class="text-xl font-bold text-surface-900 dark:text-white m-0">Gestión de Leads</h2>
              <p class="text-sm text-surface-500 m-0">Administra y da seguimiento a tus prospectos</p>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 items-center">
            <!-- Toggle Vista -->
            <SelectButton
              v-model="viewMode"
              :options="viewModeOptions"
              optionLabel="label"
              optionValue="value"
              :allowEmpty="false"
            >
              <template #option="slotProps">
                <i :class="slotProps.option.icon" class="mr-2"></i>
                <span>{{ slotProps.option.label }}</span>
              </template>
            </SelectButton>
            
            <Button
              label="Nuevo Lead"
              icon="pi pi-plus"
              @click="openCreateLeadDialog"
              severity="primary"
              size="small"
            />
            <Button
              v-if="viewMode === 'table'"
              label="Filtros Avanzados"
              icon="pi pi-filter"
              @click="toggleAdvancedFilters"
              severity="secondary"
              outlined
              size="small"
              :class="{ 'bg-primary-50 border-primary-200 text-primary-700': showAdvancedFilters }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas Mejoradas con Toggle -->
    <div class="col-span-12">
      <div class="card mb-0 !p-0 overflow-hidden">
        <!-- Header con toggle colapsable -->
        <div 
          class="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
          @click="showStats = !showStats"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-chart-bar text-primary-500"></i>
            <span class="font-semibold text-surface-700 dark:text-surface-200">Resumen de Estadísticas</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-surface-500">{{ showStats ? 'Ocultar' : 'Mostrar' }}</span>
            <i :class="['pi', showStats ? 'pi-chevron-up' : 'pi-chevron-down', 'text-surface-400 transition-transform duration-300']"></i>
          </div>
        </div>
        
        <!-- Contenido colapsable -->
        <Transition name="stats-collapse">
          <div v-show="showStats" class="border-t border-surface-200 dark:border-surface-700">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-0">
              
              <!-- Total Leads -->
              <div class="stat-card border-b sm:border-r border-surface-200 dark:border-surface-700 lg:border-b-0">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-blue-500 to-blue-600">
                    <i class="pi pi-list"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Total Leads</span>
                    <span class="stat-value">{{ stats.totalLeads }}</span>
                    <div class="stat-sparkline">
                      <svg viewBox="0 0 60 20" class="sparkline-svg">
                        <polyline points="0,15 10,12 20,14 30,8 40,10 50,5 60,7" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nuevos Hoy -->
              <div class="stat-card border-b lg:border-r border-surface-200 dark:border-surface-700 lg:border-b-0">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-green-500 to-green-600">
                    <i class="pi pi-calendar-plus"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Nuevos Hoy</span>
                    <span class="stat-value">{{ stats.newToday }}</span>
                    <div class="stat-trend up">
                      <i class="pi pi-arrow-up"></i>
                      <span>+{{ stats.newToday > 0 ? Math.round((stats.newToday / Math.max(stats.totalLeads, 1)) * 100) : 0 }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contactados -->
              <div class="stat-card border-b sm:border-r border-surface-200 dark:border-surface-700 lg:border-b-0">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <i class="pi pi-comments"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Contactados</span>
                    <span class="stat-value">{{ stats.contacted }}</span>
                    <div class="stat-sparkline">
                      <svg viewBox="0 0 60 20" class="sparkline-svg text-indigo-500">
                        <polyline points="0,18 10,15 20,12 30,10 40,8 50,6 60,4" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Oportunidades -->
              <div class="stat-card border-b lg:border-b-0 lg:border-r border-surface-200 dark:border-surface-700">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-orange-500 to-orange-600">
                    <i class="pi pi-star"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Oportunidades</span>
                    <span class="stat-value">{{ stats.opportunities }}</span>
                    <div class="stat-trend up">
                      <i class="pi pi-arrow-up"></i>
                      <span>Activas</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Valor del Pipeline -->
              <div class="stat-card border-b sm:border-r border-surface-200 dark:border-surface-700 xl:border-b-0">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <i class="pi pi-dollar"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Valor Pipeline</span>
                    <span class="stat-value text-emerald-600 dark:text-emerald-400">${{ formatPipelineValue(stats.pipelineValue || 0) }}</span>
                    <div class="stat-sparkline">
                      <svg viewBox="0 0 60 20" class="sparkline-svg text-emerald-500">
                        <polyline points="0,16 10,14 20,10 30,12 40,6 50,8 60,3" fill="none" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tasa de Conversión -->
              <div class="stat-card border-b xl:border-b-0 xl:border-r border-surface-200 dark:border-surface-700">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-purple-500 to-purple-600">
                    <i class="pi pi-percentage"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Conversión</span>
                    <span class="stat-value">{{ calculateConversionRate() }}%</span>
                    <div class="stat-progress">
                      <div class="progress-bar">
                        <div class="progress-fill bg-purple-500" :style="{ width: calculateConversionRate() + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Leads Pendientes -->
              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon bg-gradient-to-br from-rose-500 to-rose-600">
                    <i class="pi pi-clock"></i>
                  </div>
                  <div class="stat-info">
                    <span class="stat-label">Pendientes</span>
                    <span class="stat-value">{{ stats.pending || (stats.totalLeads - stats.contacted) }}</span>
                    <div class="stat-trend down" v-if="(stats.pending || (stats.totalLeads - stats.contacted)) > 5">
                      <i class="pi pi-exclamation-triangle"></i>
                      <span>Atención</span>
                    </div>
                    <div class="stat-trend up" v-else>
                      <i class="pi pi-check"></i>
                      <span>OK</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Pipeline Selector (for Kanban view) -->
    <div v-if="viewMode === 'kanban'" class="col-span-12">
      <div class="card mb-0">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Pipeline:</label>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="pipeline in pipelines"
                :key="pipeline.id"
                class="px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 group"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm': selectedPipeline && selectedPipeline.id === pipeline.id,
                  'border-surface-200 dark:border-surface-700 hover:border-primary-300': !selectedPipeline || selectedPipeline.id !== pipeline.id
                }"
                @click="selectPipeline(pipeline)"
                @contextmenu.prevent="togglePipelineMenu($event, pipeline)"
              >
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ pipeline.name }}</span>
                  <span v-if="pipeline.is_default" class="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">Por defecto</span>
                  <Button
                    icon="pi pi-ellipsis-v"
                    @click.stop="togglePipelineMenu($event, pipeline)"
                    severity="secondary"
                    text
                    rounded
                    size="small"
                    class="opacity-0 group-hover:opacity-100 transition-opacity ml-1 !p-1"
                    title="Opciones de pipeline"
                  />
                </div>
              </div>
              <Button
                icon="pi pi-plus"
                @click="openCreatePipelineDialog"
                severity="secondary"
                text
                rounded
                size="small"
                title="Agregar nuevo pipeline"
              />
              
              <!-- Menu de opciones del pipeline -->
              <Menu ref="pipelineMenu" :model="pipelineMenuItems" :popup="true" />
            </div>
          </div>
          
          <!-- Botón Nueva Etapa -->
          <Button
            label="Nueva Etapa"
            icon="pi pi-plus"
            @click="openCreateStageDialog"
            severity="primary"
            size="small"
            :disabled="!selectedPipeline"
          />
        </div>
      </div>
    </div>

    <!-- Vista Tabla -->
    <div v-if="viewMode === 'table'" class="col-span-12">
      <div class="card">
        <DataTable
          :value="leads"
          v-model:selection="selectedLeads"
          v-model:filters="leadsFilters"
          :paginator="true"
          :rows="rows"
          dataKey="id"
          :loading="loadingLeads"
          filterDisplay="menu"
          :globalFilterFields="['name', 'email', 'company', 'phone']"
          showGridlines
        >
          <template #header>
            <div class="flex justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined @click="clearFilters()" />
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="leadsFilters['global'].value" placeholder="Buscar leads..." />
              </IconField>
            </div>
          </template>
          <template #empty> No se encontraron leads. </template>
          <template #loading> Cargando leads... </template>
          
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          
          <Column field="name" header="Nombre" style="min-width: 12rem" sortable>
            <template #body="{ data }">
              <div class="font-medium">{{ data.name }}</div>
              <div class="text-sm text-surface-500">{{ data.email }}</div>
            </template>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre" />
            </template>
          </Column>
          
          <Column field="company" header="Empresa" style="min-width: 10rem" sortable>
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" placeholder="Buscar empresa" />
            </template>
          </Column>
          
          <Column field="status" header="Estado" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
            <template #filter="{ filterModel }">
              <Select v-model="filterModel.value" :options="statusOptions" placeholder="Seleccionar" showClear>
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getStatusSeverity(slotProps.option)" />
                </template>
              </Select>
            </template>
          </Column>

          <Column field="pipeline_name" header="Pipeline" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ data.pipeline_name || '-' }}
            </template>
            <template #filter="{ filterModel }">
              <Select 
                v-model="filterModel.value" 
                :options="pipelines" 
                optionLabel="name" 
                optionValue="name"
                placeholder="Seleccionar" 
                showClear
              />
            </template>
          </Column>

          <Column field="stage_id" header="Etapa" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              <Tag :value="data.stage_name || '-'" severity="secondary" />
            </template>
            <template #filter="{ filterModel }">
              <Select 
                v-model="filterModel.value" 
                :options="stages" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccionar" 
                showClear
              >
                <template #option="slotProps">
                  <Tag :value="slotProps.option.name" severity="secondary" />
                </template>
              </Select>
            </template>
          </Column>
          
          <Column field="owner_id" header="Asignado" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ data.owner_name }}
            </template>
            <template #filter="{ filterModel }">
              <Select 
                v-model="filterModel.value" 
                :options="owners" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccionar" 
                showClear
              />
            </template>
          </Column>
          
          <Column field="created_at" header="Creado" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ formatDate(data.created_at) }}
            </template>
          </Column>
          
          <Column header="Acciones" style="min-width: 10rem">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                @click="viewLead(data)"
              />
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="editLead(data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDeleteLead(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Vista Kanban -->
    <div v-if="viewMode === 'kanban'" class="col-span-12">
      <div class="card p-0 overflow-hidden">
        <div v-if="stages.length === 0" class="text-center py-12 text-surface-500">
          <i class="pi pi-inbox text-5xl mb-4 block"></i>
          <p class="text-lg">No hay etapas configuradas para este pipeline.</p>
          <Button 
            label="Crear Primera Etapa" 
            icon="pi pi-plus" 
            @click="openCreateStageDialog" 
            severity="primary"
            class="mt-4"
          />
        </div>
        
        <!-- Kanban Board -->
        <div v-else class="flex gap-4 overflow-x-auto p-4" style="height: calc(100vh - 16rem);">
          <div 
            v-for="stage in stages" 
            :key="stage.id" 
            class="flex-shrink-0 w-80 bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col transition-all duration-200"
            :class="{ 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30': dragOverStageId === stage.id }"
            @dragover.prevent
            @dragenter.prevent="onDragEnter($event, stage.id)"
            @dragleave="onDragLeave($event)"
            @drop="onDrop($event, stage.id)"
          >
            <!-- Column Header -->
            <div 
              class="flex justify-between items-center p-4 bg-surface-0 dark:bg-surface-900 rounded-t-xl border-b border-surface-200 dark:border-surface-700"
              :style="{ borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: formatColor(stage.color) }"
            >
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span 
                  class="w-3 h-3 rounded-full flex-shrink-0" 
                  :style="{ backgroundColor: formatColor(stage.color) }"
                ></span>
                <h3 class="font-semibold text-sm text-surface-700 dark:text-surface-0 truncate" :title="stage.name">{{ stage.name }}</h3>
                <span class="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                  {{ getLeadsByStage(stage.id).length }}
                </span>
              </div>
              <div class="flex-shrink-0 ml-2">
                <Button 
                  icon="pi pi-ellipsis-v" 
                  severity="secondary" 
                  text 
                  rounded 
                  size="small"
                  @click="toggleStageMenu($event, stage)"
                  :aria-controls="'stage_menu_' + stage.id"
                  aria-haspopup="true"
                />
                <Menu 
                  :ref="el => stageMenuRefs[stage.id] = el" 
                  :id="'stage_menu_' + stage.id" 
                  :model="getStageMenuItems(stage)" 
                  :popup="true"
                  class="rounded-xl"
                />
              </div>
            </div>
            
            <!-- Column Content -->
            <div class="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
              <div 
                v-for="lead in getLeadsByStage(stage.id)" 
                :key="lead.id"
                class="bg-surface-0 dark:bg-surface-900 rounded-lg p-3 cursor-grab border border-surface-200 dark:border-surface-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                :class="{ 'opacity-50 rotate-1': draggedLead && draggedLead.id === lead.id }"
                draggable="true"
                @dragstart="onDragStart($event, lead)"
                @dragend="onDragEnd"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-surface-900 dark:text-surface-0 text-sm">{{ lead.name }}</h4>
                  <Tag :value="lead.status" :severity="getStatusSeverity(lead.status)" class="text-xs" />
                </div>
                
                <div class="space-y-1 text-xs text-surface-500 dark:text-surface-400">
                  <div v-if="lead.company" class="flex items-center gap-1">
                    <i class="pi pi-building"></i>
                    <span>{{ lead.company }}</span>
                  </div>
                  <div v-if="lead.email" class="flex items-center gap-1">
                    <i class="pi pi-envelope"></i>
                    <span class="truncate">{{ lead.email }}</span>
                  </div>
                  <div v-if="lead.estimated_value" class="flex items-center gap-1">
                    <i class="pi pi-dollar"></i>
                    <span class="font-medium text-green-600 dark:text-green-400">${{ formatCurrency(lead.estimated_value) }}</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center mt-3 pt-2 border-t border-surface-200 dark:border-surface-700">
                  <div class="flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500">
                    <i class="pi pi-calendar"></i>
                    <span>{{ formatDate(lead.created_at) }}</span>
                  </div>
                  <div class="flex gap-1">
                    <Button 
                      icon="pi pi-eye" 
                      severity="secondary" 
                      text 
                      rounded 
                      size="small"
                      @click="viewLead(lead)"
                    />
                    <Button 
                      icon="pi pi-pencil" 
                      severity="info" 
                      text 
                      rounded 
                      size="small"
                      @click="editLead(lead)"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Empty state for column -->
              <div 
                v-if="getLeadsByStage(stage.id).length === 0" 
                class="flex flex-col items-center justify-center py-8 text-surface-400 dark:text-surface-500"
              >
                <i class="pi pi-inbox text-2xl mb-2"></i>
                <span>Sin leads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de Filtros Avanzados -->
    <Dialog 
      v-model:visible="showAdvancedFilters" 
      modal 
      header="Filtros Avanzados" 
      :style="{ width: '90vw', maxWidth: '800px' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <div class="grid grid-cols-12 gap-6 pt-4">
        <!-- Filtros de Fecha -->
        <div class="col-span-12">
          <Fieldset legend="Rango de Fechas" :toggleable="false">
            <template #legend>
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar text-primary-500"></i>
                <span class="font-semibold">Rango de Fechas</span>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Desde
                </label>
                <DatePicker
                  v-model="advancedFilters.created_after"
                  dateFormat="dd/mm/yy"
                  class="w-full"
                  showIcon
                  placeholder="Fecha inicial"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Hasta
                </label>
                <DatePicker
                  v-model="advancedFilters.created_before"
                  dateFormat="dd/mm/yy"
                  class="w-full"
                  showIcon
                  placeholder="Fecha final"
                />
              </div>
            </div>
          </Fieldset>
        </div>

        <!-- Parámetros UTM -->
        <div class="col-span-12">
          <Fieldset legend="Parámetros UTM" :toggleable="false">
            <template #legend>
              <div class="flex items-center gap-2">
                <i class="pi pi-chart-line text-primary-500"></i>
                <span class="font-semibold">Parámetros UTM</span>
              </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fuente
                </label>
                <InputText
                  v-model="advancedFilters.utm_source"
                  placeholder="utm_source"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Campaña
                </label>
                <InputText
                  v-model="advancedFilters.utm_campaign"
                  placeholder="utm_campaign"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Medio
                </label>
                <InputText
                  v-model="advancedFilters.utm_medium"
                  placeholder="utm_medium"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Término
                </label>
                <InputText
                  v-model="advancedFilters.utm_term"
                  placeholder="utm_term"
                  class="w-full"
                />
              </div>
            </div>
          </Fieldset>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Limpiar"
            icon="pi pi-times"
            @click="clearAdvancedFilters"
            severity="secondary"
            outlined
          />
          <Button
            label="Aplicar Filtros"
            icon="pi pi-check"
            @click="applyAdvancedFilters"
            severity="primary"
          />
        </div>
      </template>
    </Dialog>

    <!-- Diálogo para crear/editar lead -->
    <Dialog 
      v-model:visible="leadDialog" 
      :header="leadDialogMode === 'create' ? 'Crear Nuevo Lead' : 'Editar Lead'" 
      :modal="true" 
      :closable="true"
      :style="{ width: '90vw', maxWidth: '600px' }"
    >
      <form @submit.prevent="saveLead">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="name" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText 
              id="name" 
              v-model="leadForm.name" 
              type="text" 
              class="w-full" 
              required
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="email" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
            <InputText 
              id="email" 
              v-model="leadForm.email" 
              type="email" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="phone" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Teléfono</label>
            <InputText 
              id="phone" 
              v-model="leadForm.phone" 
              type="tel" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="company" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Empresa</label>
            <InputText 
              id="company" 
              v-model="leadForm.company" 
              type="text" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="estimated_value" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Valor Estimado</label>
            <InputNumber 
              id="estimated_value" 
              v-model="leadForm.estimated_value" 
              mode="currency" 
              currency="USD"
              locale="en-US"
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="status" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Estado</label>
            <Dropdown 
              id="status" 
              v-model="leadForm.status" 
              :options="statusOptions" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="stage_id" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Etapa</label>
            <Dropdown 
              id="stage_id" 
              v-model="leadForm.stage_id" 
              :options="dialogStages" 
              optionLabel="name" 
              optionValue="id"
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="owner_id" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Asignado a (Opcional)</label>
            <Dropdown 
              id="owner_id" 
              v-model="leadForm.owner_id" 
              :options="owners" 
              optionLabel="name" 
              optionValue="internal_user_id"
              placeholder="Sin asignar"
              showClear
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="notes" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Notas</label>
            <Textarea 
              id="notes" 
              v-model="leadForm.notes" 
              rows="3" 
              class="w-full"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="hideLeadDialog" 
            outlined
          />
          <Button 
            label="Guardar" 
            type="submit" 
            severity="primary"
          />
        </div>
      </form>
    </Dialog>

    <!-- Diálogo para crear/editar etapa -->
    <Dialog
      v-model:visible="stageDialog"
      :header="stageDialogMode === 'create' ? 'Crear Nueva Etapa' : 'Editar Etapa'"
      :modal="true"
      :closable="true"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <form @submit.prevent="saveStage">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="stageName" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText 
              id="stageName" 
              v-model="stageForm.name" 
              type="text" 
              class="w-full" 
              required
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="probability" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Probabilidad de Cierre (%)</label>
            <InputNumber 
              id="probability" 
              v-model="stageForm.probability" 
              mode="decimal" 
              :min="0" 
              :max="100" 
              class="w-full"
            />
          </div>
          <div class="col-span-12 md:col-span-6">
            <label for="orderPos" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Posición</label>
            <InputNumber 
              id="orderPos" 
              v-model="stageForm.order_pos" 
              mode="decimal" 
              :min="0" 
              class="w-full"
            />
          </div>
          <div class="col-span-12">
            <label for="color" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Color</label>
            <div class="flex items-center gap-3">
              <ColorPicker v-model="stageForm.color" />
              <InputText
                id="color"
                v-model="stageForm.color"
                type="text"
                class="w-full"
              />
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="hideStageDialog" 
            outlined
          />
          <Button 
            label="Guardar" 
            type="submit" 
            severity="primary"
          />
        </div>
      </form>
    </Dialog>

    <!-- Diálogo para crear/editar pipeline -->
    <Dialog
      v-model:visible="pipelineDialog"
      :header="pipelineDialogMode === 'create' ? 'Crear Nuevo Pipeline' : 'Editar Pipeline'"
      :modal="true"
      :closable="true"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <form @submit.prevent="savePipeline">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <label for="pipelineName" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Nombre *</label>
            <InputText
              id="pipelineName"
              v-model="pipelineForm.name"
              type="text"
              class="w-full"
              required
            />
          </div>
          <div class="col-span-12">
            <label for="pipelineDescription" class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Descripción</label>
            <Textarea
              id="pipelineDescription"
              v-model="pipelineForm.description"
              class="w-full"
              rows="3"
            />
          </div>
          <div class="col-span-12">
            <div class="field-checkbox">
              <Checkbox id="isDefault" v-model="pipelineForm.is_default" binary />
              <label for="isDefault" class="ml-2">Pipeline predeterminado</label>
            </div>
          </div>
          <div class="col-span-12">
            <div class="field-checkbox">
              <Checkbox id="isActive" v-model="pipelineForm.is_active" binary />
              <label for="isActive" class="ml-2">Pipeline activo</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button
            label="Cancelar"
            severity="secondary"
            @click="hidePipelineDialog"
            outlined
          />
          <Button
            label="Guardar"
            type="submit"
            severity="primary"
          />
        </div>
      </form>
    </Dialog>
    
    <!-- Confirmación de eliminación -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import crmService from '@/service/crm/crmService';
import apiClient from '@/api/axios';
import { useOrganizationsStore } from '@/stores/organizations';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const organizationsStore = useOrganizationsStore();

// ===== VIEW MODE =====
const viewMode = ref('kanban');
const viewModeOptions = ref([
  { label: 'Tabla', value: 'table', icon: 'pi pi-table' },
  { label: 'Kanban', value: 'kanban', icon: 'pi pi-th-large' }
]);

// ===== LEADS STATE =====
const leads = ref([]);
const selectedLeads = ref([]);
const rows = ref(10);
const loadingLeads = ref(false);

// ===== STATISTICS =====
const showStats = ref(true);
const stats = ref({
  totalLeads: 0,
  newToday: 0,
  contacted: 0,
  opportunities: 0,
  pipelineValue: 0,
  pending: 0
});

// ===== PIPELINES & STAGES =====
const pipelines = ref([]);
const selectedPipeline = ref(null);
const stages = ref([]);
const allStages = ref([]); // Lista completa de etapas para mapeo
const dialogStages = ref([]); // Etapas filtradas para el diálogo
const owners = ref([]);

// ===== FILTERS =====
const showAdvancedFilters = ref(false);
const leadsFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  stage_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  pipeline_name: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
  owner_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
});

const advancedFilters = ref({
  created_after: null,
  created_before: null,
  utm_source: '',
  utm_campaign: '',
  utm_medium: '',
  utm_term: ''
});

// ===== DIALOGS =====
const leadDialog = ref(false);
const leadDialogMode = ref('create');
const stageDialog = ref(false);
const stageDialogMode = ref('create');
const pipelineDialog = ref(false);
const pipelineDialogMode = ref('create');

// ===== PIPELINE MENU =====
const pipelineMenu = ref(null);
const currentPipelineForMenu = ref(null);

const pipelineMenuItems = computed(() => {
  if (!currentPipelineForMenu.value) return [];
  
  const pipeline = currentPipelineForMenu.value;
  const isDefault = pipeline.is_default;
  
  return [
    {
      label: 'Editar Pipeline',
      icon: 'pi pi-pencil',
      command: () => openEditPipelineDialog(pipeline)
    },
    {
      separator: true
    },
    {
      label: isDefault ? 'Eliminar Pipeline (Predeterminado)' : 'Eliminar Pipeline',
      icon: 'pi pi-trash',
      class: isDefault ? 'opacity-60' : 'text-red-500',
      command: () => {
        if (isDefault) {
          toast.add({ 
            severity: 'warn', 
            summary: 'No permitido', 
            detail: 'No se puede eliminar el pipeline predeterminado. Primero establezca otro pipeline como predeterminado.', 
            life: 5000 
          });
        } else {
          confirmDeletePipeline(pipeline);
        }
      }
    }
  ];
});

// ===== FORMS =====
const leadForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
  status: 'nuevo',
  stage_id: null,
  owner_id: null,
  estimated_value: null
});

const stageForm = ref({
  id: null,
  name: '',
  pipeline_id: null,
  probability: 0,
  order_pos: 0,
  color: '#6b7280'
});

const pipelineForm = ref({
  id: null,
  name: '',
  description: '',
  is_default: false,
  is_active: true
});

// ===== OPTIONS =====
const statusOptions = ref(['nuevo', 'contactado', 'oportunidad', 'ganado', 'perdido']);

// ===== DRAG & DROP =====
const draggedLead = ref(null);
const dragOverStageId = ref(null);

// ===== STAGE MENU =====
const stageMenuRefs = {};

const toggleStageMenu = (event, stage) => {
  if (stageMenuRefs[stage.id]) {
    stageMenuRefs[stage.id].toggle(event);
  }
};

const getStageMenuItems = (stage) => {
  return [
    {
      label: 'Agregar Lead',
      icon: 'pi pi-plus',
      command: () => openCreateLeadDialogForStage(stage.id)
    },
    {
      label: 'Editar Etapa',
      icon: 'pi pi-pencil',
      command: () => editStage(stage)
    },
    {
      separator: true
    },
    {
      label: 'Eliminar Etapa',
      icon: 'pi pi-trash',
      class: 'text-red-500',
      command: () => confirmDeleteStage(stage)
    }
  ];
};

// ===== LIFECYCLE =====
onMounted(async () => {
  if (!organizationsStore.currentOrganizationId) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No hay organización seleccionada. Por favor, seleccione una organización.',
      life: 5000
    });
    return;
  }

  await loadPipelines();
  await loadStats();
  await loadOwners();
  
  // Cargar todas las etapas para tener referencia completa
  try {
    const allStagesData = await crmService.getAllStages(organizationsStore.currentOrganizationId);
    allStages.value = allStagesData;
  } catch (error) {
    console.error('Error cargando todas las etapas:', error);
  }

  await loadLeads();
});

// ===== DATA LOADING =====
const loadPipelines = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) return;

    const pipelinesData = await crmService.getPipelines(organizationsStore.currentOrganizationId);
    pipelines.value = pipelinesData;

    if (pipelinesData.length > 0) {
      const defaultPipeline = pipelinesData.find(p => p.is_default);
      selectedPipeline.value = defaultPipeline || pipelinesData[0];
      await loadStagesByPipeline(selectedPipeline.value.id);
    }
  } catch (error) {
    console.error('Error cargando pipelines:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pipelines', life: 3000 });
  }
};

const loadStagesByPipeline = async (pipelineId) => {
  try {
    if (!organizationsStore.currentOrganizationId) return;

    const stagesData = await crmService.getPipelineStages(pipelineId, organizationsStore.currentOrganizationId);
    stages.value = stagesData.sort((a, b) => a.order_pos - b.order_pos);
  } catch (error) {
    console.error('Error cargando etapas:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las etapas', life: 3000 });
  }
};

const loadLeads = async () => {
  loadingLeads.value = true;
  try {
    if (!organizationsStore.currentOrganizationId) return;

    const response = await crmService.getLeads(organizationsStore.currentOrganizationId);
    
    // Enriquecer leads con nombres de etapa y propietario
    leads.value = response.map(lead => {
      // Buscar la etapa correspondiente (usar allStages si está disponible, sino stages)
      const stageId = Number(lead.stage_id);
      const stage = allStages.value.length > 0 
        ? allStages.value.find(s => Number(s.id) === stageId)
        : stages.value.find(s => Number(s.id) === stageId);
      
      // Buscar el pipeline correspondiente
      let pipelineName = '-';
      if (stage && stage.pipeline_id) {
        const pipeline = pipelines.value.find(p => p.id === stage.pipeline_id);
        if (pipeline) pipelineName = pipeline.name;
      }
      
      // Buscar el propietario correspondiente (usar internal_user_id que coincide con owner_id)
      const ownerId = Number(lead.owner_id);
      const owner = owners.value.find(o => Number(o.internal_user_id) === ownerId);
      
      return {
        ...lead,
        stage_name: stage ? stage.name : '-',
        stage_color: stage ? stage.color : '#6b7280',
        pipeline_name: pipelineName,
        owner_name: owner ? owner.name : '-'
      };
    });
  } catch (error) {
    console.error('Error cargando leads:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'No se pudieron cargar los leads',
      life: 3000
    });
  } finally {
    loadingLeads.value = false;
  }
};

const loadStats = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) return;

    const allLeads = await crmService.getLeads(organizationsStore.currentOrganizationId);
    stats.value.totalLeads = allLeads.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    stats.value.newToday = allLeads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      leadDate.setHours(0, 0, 0, 0);
      return leadDate.getTime() === today.getTime();
    }).length;

    stats.value.contacted = allLeads.filter(lead =>
      lead.status === 'contactado' ||
      lead.status === 'oportunidad' ||
      lead.status === 'ganado'
    ).length;

    stats.value.opportunities = allLeads.filter(lead =>
      lead.status === 'oportunidad' ||
      lead.status === 'ganado'
    ).length;

    // Calcular valor del pipeline
    stats.value.pipelineValue = allLeads.reduce((total, lead) => {
      return total + (parseFloat(lead.estimated_value) || 0);
    }, 0);

    // Calcular leads pendientes (sin contactar)
    stats.value.pending = allLeads.filter(lead =>
      lead.status === 'nuevo' || lead.status === 'sin_contactar'
    ).length;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
};

const loadOwners = async () => {
  try {
    if (!organizationsStore.currentOrganizationId) {
      return;
    }

    const response = await apiClient.get('/organizations/' + organizationsStore.currentOrganizationId + '/members', {
      headers: {
        'X-Organization-ID': organizationsStore.currentOrganizationId
      }
    });
    owners.value = response.data;
  } catch (error) {
    console.error('Error cargando propietarios:', error);
  }
};

// ===== KANBAN HELPERS =====
const getLeadsByStage = (stageId) => {
  return leads.value.filter(lead => lead.stage_id === stageId);
};

// ===== STATS HELPERS =====
const formatPipelineValue = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toFixed(0);
};

const calculateConversionRate = () => {
  if (stats.value.totalLeads === 0) return 0;
  return Math.round((stats.value.opportunities / stats.value.totalLeads) * 100);
};

// ===== DRAG & DROP HANDLERS =====
const onDragStart = (event, lead) => {
  draggedLead.value = lead;
  event.target.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', lead.id);
};

const onDragEnd = (event) => {
  event.target.classList.remove('dragging');
  draggedLead.value = null;
  dragOverStageId.value = null;
};

const onDragEnter = (event, stageId) => {
  dragOverStageId.value = stageId;
};

const onDragLeave = (event) => {
  // Only remove if leaving the column entirely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverStageId.value = null;
  }
};

const onDrop = async (event, newStageId) => {
  dragOverStageId.value = null;
  
  if (!draggedLead.value || draggedLead.value.stage_id === newStageId) {
    return;
  }

  const draggedLeadId = draggedLead.value.id;

  try {
    await crmService.moveLead(draggedLeadId, newStageId, organizationsStore.currentOrganizationId);
    
    // Update locally
    const leadIndex = leads.value.findIndex(l => l.id === draggedLeadId);
    if (leadIndex !== -1) {
      leads.value[leadIndex].stage_id = newStageId;
      
      // Update stage name and color
      const newStage = stages.value.find(s => s.id === newStageId);
      if (newStage) {
        leads.value[leadIndex].stage_name = newStage.name;
        leads.value[leadIndex].stage_color = newStage.color;
      }
    }

    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: `Lead movido a ${stages.value.find(s => s.id === newStageId)?.name}`, 
      life: 3000 
    });
  } catch (error) {
    console.error('Error moviendo lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'No se pudo mover el lead', 
      life: 3000 
    });
  }
};

// ===== PIPELINE SELECTION =====
const selectPipeline = async (pipeline) => {
  selectedPipeline.value = pipeline;
  await loadStagesByPipeline(pipeline.id);
};

// ===== DIALOG HANDLERS =====
// ===== DIALOG HANDLERS =====
const openCreateLeadDialog = () => {
  leadDialogMode.value = 'create';
  
  // Para nuevo lead, usamos los stages del pipeline seleccionado actual
  dialogStages.value = stages.value;

  leadForm.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    status: 'nuevo',
    stage_id: stages.value.length > 0 ? stages.value[0].id : null,
    owner_id: null,
    estimated_value: null
  };
  leadDialog.value = true;
};

const openCreateLeadDialogForStage = (stageId) => {
  leadDialogMode.value = 'create';
  
  // Buscar a qué pipeline pertenece esta etapa
  const stage = allStages.value.find(s => s.id === stageId);
  if (stage && stage.pipeline_id) {
    dialogStages.value = allStages.value.filter(s => s.pipeline_id === stage.pipeline_id).sort((a, b) => a.order_pos - b.order_pos);
  } else {
    // Fallback al pipeline actual
    dialogStages.value = stages.value;
  }

  leadForm.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    status: 'nuevo',
    stage_id: stageId,
    owner_id: null,
    estimated_value: null
  };
  leadDialog.value = true;
};

const editLead = (lead) => {
  leadDialogMode.value = 'edit';
  
  // Buscar a qué pipeline pertenece el lead (basado en su etapa)
  if (lead.stage_id) {
    const stage = allStages.value.find(s => Number(s.id) === Number(lead.stage_id));
    if (stage && stage.pipeline_id) {
      dialogStages.value = allStages.value.filter(s => s.pipeline_id === stage.pipeline_id).sort((a, b) => a.order_pos - b.order_pos);
    } else {
      // Si no encontramos la etapa, intentamos fallback a etapas cargadas actualmente
      dialogStages.value = stages.value;
    }
  } else {
    dialogStages.value = stages.value;
  }

  leadForm.value = { ...lead };
  leadDialog.value = true;
};

const viewLead = (lead) => {
  router.push(`/leads/${lead.id}`);
};

const hideLeadDialog = () => {
  leadDialog.value = false;
};

const saveLead = async () => {
  try {
    // Extraer solo los campos válidos para el backend (excluir campos que no existen en la tabla)
    const { 
      stage_name, stage_color, owner_name,  // campos calculados frontend
      id, organization_id, created_at, updated_at,  // campos de sistema que no deben actualizarse
      tags, source,  // campos relacionados que no van en el update directo
      custom_fields, source_id,  // campos que no existen en la tabla de Supabase
      ...leadData 
    } = leadForm.value;
    
    if (leadDialogMode.value === 'create') {
      await crmService.createLead(leadData, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead creado', life: 3000 });
    } else {
      await crmService.updateLead(leadForm.value.id, leadData, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead actualizado', life: 3000 });
    }

    await loadLeads();
    await loadStats();
    hideLeadDialog();
  } catch (error) {
    console.error('Error guardando lead:', error);
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.response?.data?.detail || 'No se pudo guardar el lead', 
      life: 3000 
    });
  }
};

const confirmDeleteLead = (lead) => {
  confirm.require({
    message: `¿Está seguro que desea eliminar el lead ${lead.name}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await crmService.deleteLead(lead.id, organizationsStore.currentOrganizationId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Lead eliminado', life: 3000 });
        await loadLeads();
        await loadStats();
      } catch (error) {
        console.error('Error eliminando lead:', error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo eliminar el lead', 
          life: 3000 
        });
      }
    }
  });
};

// ===== STAGE HANDLERS =====
const openCreateStageDialog = () => {
  stageDialogMode.value = 'create';
  stageForm.value = {
    id: null,
    name: '',
    pipeline_id: selectedPipeline.value ? selectedPipeline.value.id : null,
    probability: 0,
    order_pos: stages.value.length > 0 ? Math.max(...stages.value.map(s => s.order_pos)) + 1 : 0,
    color: '#6b7280'
  };
  stageDialog.value = true;
};

const editStage = (stage) => {
  stageDialogMode.value = 'edit';
  stageForm.value = { ...stage };
  stageDialog.value = true;
};

const hideStageDialog = () => {
  stageDialog.value = false;
};

const saveStage = async () => {
  try {
    if (!stageForm.value.pipeline_id && selectedPipeline.value) {
      stageForm.value.pipeline_id = selectedPipeline.value.id;
    }

    // Asegurar que el color tenga el formato correcto con #
    let colorValue = stageForm.value.color;
    if (colorValue && !colorValue.startsWith('#')) {
      colorValue = '#' + colorValue;
    }
    
    const stageData = {
      ...stageForm.value,
      color: colorValue
    };

    if (stageDialogMode.value === 'create') {
      await crmService.createStage(stageData, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa creada', life: 3000 });
    } else {
      await crmService.updateStage(stageForm.value.id, stageData, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa actualizada', life: 3000 });
    }

    if (selectedPipeline.value) {
      await loadStagesByPipeline(selectedPipeline.value.id);
    }
    hideStageDialog();
  } catch (error) {
    console.error('Error guardando etapa:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.detail || 'No se pudo guardar la etapa',
      life: 3000
    });
  }
};

const confirmDeleteStage = (stage) => {
  const leadsInStage = getLeadsByStage(stage.id).length;
  const warningMessage = leadsInStage > 0 
    ? `Esta etapa tiene ${leadsInStage} lead(s). Al eliminarla, los leads quedarán sin etapa asignada. ¿Está seguro que desea eliminar la etapa "${stage.name}"?`
    : `¿Está seguro que desea eliminar la etapa "${stage.name}"?`;

  confirm.require({
    message: warningMessage,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await crmService.deleteStage(stage.id, organizationsStore.currentOrganizationId);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Etapa eliminada', life: 3000 });
        
        if (selectedPipeline.value) {
          await loadStagesByPipeline(selectedPipeline.value.id);
        }
        await loadLeads(); // Reload leads to update stage info
      } catch (error) {
        console.error('Error eliminando etapa:', error);
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.response?.data?.detail || 'No se pudo eliminar la etapa', 
          life: 3000 
        });
      }
    }
  });
};

// ===== PIPELINE HANDLERS =====
const openCreatePipelineDialog = () => {
  pipelineDialogMode.value = 'create';
  pipelineForm.value = {
    id: null,
    name: '',
    description: '',
    is_default: pipelines.value.length === 0,
    is_active: true
  };
  pipelineDialog.value = true;
};

const hidePipelineDialog = () => {
  pipelineDialog.value = false;
};

const savePipeline = async () => {
  try {
    if (pipelineDialogMode.value === 'create') {
      await crmService.createPipeline(pipelineForm.value, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pipeline creado', life: 3000 });
    } else {
      await crmService.updatePipeline(pipelineForm.value.id, pipelineForm.value, organizationsStore.currentOrganizationId);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pipeline actualizado', life: 3000 });
    }

    await loadPipelines();
    hidePipelineDialog();
  } catch (error) {
    console.error('Error guardando pipeline:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.detail || 'No se pudo guardar el pipeline',
      life: 3000
    });
  }
};

// Toggle del menú de opciones del pipeline
const togglePipelineMenu = (event, pipeline) => {
  currentPipelineForMenu.value = pipeline;
  pipelineMenu.value.toggle(event);
};

// Abrir diálogo para editar pipeline
const openEditPipelineDialog = (pipeline) => {
  pipelineDialogMode.value = 'edit';
  pipelineForm.value = { 
    id: pipeline.id,
    name: pipeline.name,
    description: pipeline.description || '',
    is_default: pipeline.is_default,
    is_active: pipeline.is_active
  };
  pipelineDialog.value = true;
};

// Confirmar eliminación de pipeline con condiciones
const confirmDeletePipeline = async (pipeline) => {
  // Condición 1: No permitir eliminar el pipeline predeterminado
  if (pipeline.is_default) {
    toast.add({ 
      severity: 'error', 
      summary: 'Acción no permitida', 
      detail: 'No se puede eliminar el pipeline predeterminado. Primero establezca otro pipeline como predeterminado.', 
      life: 5000 
    });
    return;
  }

  try {
    // Obtener las etapas del pipeline para verificar condiciones
    const pipelineStages = await crmService.getPipelineStages(pipeline.id, organizationsStore.currentOrganizationId);
    
    // Contar leads en las etapas del pipeline
    let totalLeadsInPipeline = 0;
    if (pipelineStages.length > 0) {
      for (const stage of pipelineStages) {
        const leadsInStage = leads.value.filter(lead => lead.stage_id === stage.id).length;
        totalLeadsInPipeline += leadsInStage;
      }
    }

    // Construir mensaje de advertencia según las condiciones
    let warningMessage = `¿Está seguro que desea eliminar el pipeline "${pipeline.name}"?`;
    
    if (totalLeadsInPipeline > 0) {
      warningMessage = `Este pipeline tiene ${pipelineStages.length} etapa(s) con ${totalLeadsInPipeline} lead(s) asociados. Al eliminarlo, los leads quedarán sin etapa asignada. ¿Está seguro que desea eliminar el pipeline "${pipeline.name}"?`;
    } else if (pipelineStages.length > 0) {
      warningMessage = `Este pipeline tiene ${pipelineStages.length} etapa(s) configuradas. ¿Está seguro que desea eliminar el pipeline "${pipeline.name}"?`;
    }

    confirm.require({
      message: warningMessage,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await crmService.deletePipeline(pipeline.id, organizationsStore.currentOrganizationId);
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pipeline eliminado', life: 3000 });

          // Si el pipeline eliminado era el seleccionado, limpiar la selección
          if (selectedPipeline.value && selectedPipeline.value.id === pipeline.id) {
            selectedPipeline.value = null;
            stages.value = [];
          }

          await loadPipelines();
          await loadLeads(); // Recargar leads para actualizar referencias
        } catch (error) {
          console.error('Error eliminando pipeline:', error);
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.detail || 'No se pudo eliminar el pipeline',
            life: 3000
          });
        }
      }
    });
  } catch (error) {
    console.error('Error verificando condiciones del pipeline:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron verificar las condiciones del pipeline',
      life: 3000
    });
  }
};

// ===== FILTER HANDLERS =====
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value;
};

const clearFilters = () => {
  leadsFilters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    stage_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    owner_id: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
  };
};

const clearAdvancedFilters = () => {
  advancedFilters.value = {
    created_after: null,
    created_before: null,
    utm_source: '',
    utm_campaign: '',
    utm_medium: '',
    utm_term: ''
  };
};

const applyAdvancedFilters = async () => {
  try {
    loadingLeads.value = true;
    
    const params = {
      skip: 0,
      limit: rows.value
    };

    if (advancedFilters.value.created_after) {
      params.created_after = formatDateForAPI(advancedFilters.value.created_after);
    }
    if (advancedFilters.value.created_before) {
      params.created_before = formatDateForAPI(advancedFilters.value.created_before);
    }
    if (advancedFilters.value.utm_source) {
      params.utm_source = advancedFilters.value.utm_source;
    }
    if (advancedFilters.value.utm_campaign) {
      params.utm_campaign = advancedFilters.value.utm_campaign;
    }
    if (advancedFilters.value.utm_medium) {
      params.utm_medium = advancedFilters.value.utm_medium;
    }
    if (advancedFilters.value.utm_term) {
      params.utm_term = advancedFilters.value.utm_term;
    }

    const response = await crmService.getLeads(organizationsStore.currentOrganizationId, params);
    leads.value = response;
    
    showAdvancedFilters.value = false;
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Se encontraron ${response.length} leads`,
      life: 3000
    });
  } catch (error) {
    console.error('Error aplicando filtros:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron aplicar los filtros',
      life: 3000
    });
  } finally {
    loadingLeads.value = false;
  }
};

// ===== UTILITIES =====
const goToNoOrganization = () => {
  router.push('/no-organization');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

// Helper para asegurar que el color tenga el formato correcto
const formatColor = (color) => {
  if (!color) return '#6b7280'; // Color gris por defecto
  if (color.startsWith('#')) return color;
  return '#' + color;
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'nuevo':
      return 'info';
    case 'contactado':
      return 'primary';
    case 'oportunidad':
      return 'warn';
    case 'ganado':
      return 'success';
    case 'perdido':
      return 'danger';
    default:
      return null;
  }
};
</script>

<style scoped>
/* Kanban Board Styles */
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  min-height: 600px;
}

.kanban-column {
  flex: 0 0 320px;
  min-width: 320px;
  background: var(--p-surface-100);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  border: 1px solid var(--p-surface-200);
}

.dark .kanban-column {
  background: var(--p-surface-800);
  border-color: var(--p-surface-700);
}

.kanban-column.drag-over {
  background: var(--p-primary-50);
  box-shadow: 0 0 0 2px var(--p-primary-500);
  border-color: var(--p-primary-500);
}

.dark .kanban-column.drag-over {
  background: var(--p-primary-900);
  border-color: var(--p-primary-400);
}

.kanban-column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 4px solid;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
}

.dark .kanban-column-header {
  background: var(--p-surface-900);
  border-bottom-color: var(--p-surface-700);
}

.kanban-column-content {
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: transparent;
}

.kanban-card {
  background: var(--p-surface-0);
  border-radius: 8px;
  padding: 0.875rem;
  cursor: grab;
  transition: all 0.2s ease;
  border: 1px solid var(--p-surface-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark .kanban-card {
  background: var(--p-surface-800);
  border-color: var(--p-surface-600);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.kanban-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.dark .kanban-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: var(--p-surface-500);
}

.kanban-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
  transform: rotate(2deg);
}

.kanban-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--p-surface-400);
  text-align: center;
}

.dark .kanban-empty-state {
  color: var(--p-surface-500);
}

/* Scrollbar styling */
.kanban-board::-webkit-scrollbar {
  height: 8px;
}

.kanban-board::-webkit-scrollbar-track {
  background: var(--p-surface-100);
  border-radius: 4px;
}

.dark .kanban-board::-webkit-scrollbar-track {
  background: var(--p-surface-800);
}

.kanban-board::-webkit-scrollbar-thumb {
  background: var(--p-surface-300);
  border-radius: 4px;
}

.dark .kanban-board::-webkit-scrollbar-thumb {
  background: var(--p-surface-600);
}

.kanban-board::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-400);
}

.dark .kanban-board::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-500);
}

.kanban-column-content::-webkit-scrollbar {
  width: 6px;
}

.kanban-column-content::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-column-content::-webkit-scrollbar-thumb {
  background: var(--p-surface-300);
  border-radius: 3px;
}

.dark .kanban-column-content::-webkit-scrollbar-thumb {
  background: var(--p-surface-600);
}

/* Responsive */
@media (max-width: 768px) {
  .kanban-column {
    flex: 0 0 280px;
    min-width: 280px;
  }
}

/* Stage Menu Styles */
:deep(.p-menu.rounded-xl) {
  border-radius: 0.75rem;
  overflow: hidden;
}

:deep(.p-menu .p-menuitem-content .text-red-500) {
  color: #ef4444 !important;
}

:deep(.p-menu .p-menuitem-content .text-red-500 .p-menuitem-icon) {
  color: #ef4444 !important;
}

/* ========== ESTADÍSTICAS MEJORADAS ========== */
.stat-card {
  padding: 1rem;
  transition: background-color 0.2s;
}

.stat-card:hover {
  background: var(--surface-50);
}

.dark .stat-card:hover {
  background: var(--surface-800);
}

.stat-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon i {
  animation: pulse-icon 2s infinite ease-in-out;
}

@keyframes pulse-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.stat-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
}

.stat-sparkline {
  height: 20px;
  margin-top: 0.25rem;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
  color: var(--primary-color);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.stat-trend.up {
  color: #10b981;
}

.stat-trend.down {
  color: #f59e0b;
}

.stat-trend i {
  font-size: 0.6rem;
}

.stat-progress {
  margin-top: 0.25rem;
}

.progress-bar {
  height: 4px;
  background: var(--surface-200);
  border-radius: 2px;
  overflow: hidden;
}

.dark .progress-bar {
  background: var(--surface-700);
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Animación de colapso */
.stats-collapse-enter-active,
.stats-collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.stats-collapse-enter-from,
.stats-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.stats-collapse-enter-to,
.stats-collapse-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* Responsive para estadísticas */
@media (max-width: 640px) {
  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
