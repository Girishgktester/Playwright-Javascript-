const STORAGE_KEY = 'ai-learning-dashboard-v1';
const DEFAULT_GOAL_MINUTES = 90;
const DEFAULT_TARGET_HOURS = 300;
const DEFAULT_MILESTONES = [10, 25, 50, 100, 250, 500, 1000];
const TOPIC_LIBRARY = [
  'Prompt Engineering',
  'RAG',
  'MCP',
  'AI Agents',
  'LLM Evaluation',
  'AI Testing',
  'Python',
  'Playwright',
  'API Testing',
  'Automation',
  'GenAI Development',
  'Data Science',
  'Vector Databases',
  'AI Safety',
  'Ethics',
  'Productivity'
];
const LEARNING_TYPES = [
  'Theory',
  'Coding',
  'Hands-on',
  'Project',
  'Reading',
  'Video/Course',
  'Experiment',
  'Testing/Evaluation',
  'Revision'
];

const state = {
  theme: localStorage.getItem('ai-theme') || 'dark',
  settings: {
    dailyGoalMinutes: DEFAULT_GOAL_MINUTES,
    overallGoalHours: DEFAULT_TARGET_HOURS,
    thresholds: { achieved: 100, partial: 75 }
  },
  filters: {
    range: 'all',
    topic: 'all',
    type: 'all'
  },
  records: [],
  editId: null
};

const els = {
  kpiGrid: document.getElementById('kpiGrid'),
  todayFocusContent: document.getElementById('todayFocusContent'),
  dailyGoalInput: document.getElementById('dailyGoalInput'),
  overallGoalInput: document.getElementById('overallGoalInput'),
  achievedThresholdInput: document.getElementById('achievedThresholdInput'),
  partialThresholdInput: document.getElementById('partialThresholdInput'),
  dateRangeFilter: document.getElementById('dateRangeFilter'),
  topicFilter: document.getElementById('topicFilter'),
  typeFilter: document.getElementById('typeFilter'),
  themeToggle: document.getElementById('themeToggle'),
  newEntryButton: document.getElementById('newEntryButton'),
  todayDateLabel: document.getElementById('todayDateLabel'),
  ringPercent: document.getElementById('ringPercent'),
  ringValue: document.getElementById('ringValue'),
  completedHoursValue: document.getElementById('completedHoursValue'),
  remainingHoursValue: document.getElementById('remainingHoursValue'),
  projectedDateValue: document.getElementById('projectedDateValue'),
  requiredPaceValue: document.getElementById('requiredPaceValue'),
  headerCurrentStreak: document.getElementById('headerCurrentStreak'),
  headerOverallProgress: document.getElementById('headerOverallProgress'),
  overallGoalMeta: document.getElementById('overallGoalMeta'),
  dailyTrendChart: document.getElementById('dailyTrendChart'),
  heatmapContainer: document.getElementById('heatmapContainer'),
  topicChart: document.getElementById('topicChart'),
  typeChart: document.getElementById('typeChart'),
  weeklyTrendChart: document.getElementById('weeklyTrendChart'),
  weekdayChart: document.getElementById('weekdayChart'),
  qualityScoreCard: document.getElementById('qualityScoreCard'),
  scatterChart: document.getElementById('scatterChart'),
  insightsCard: document.getElementById('insightsCard'),
  weeklyReviewGrid: document.getElementById('weeklyReviewGrid'),
  monthlyReviewGrid: document.getElementById('monthlyReviewGrid'),
  milestonesContainer: document.getElementById('milestonesContainer'),
  recentActivityTable: document.getElementById('recentActivityTable'),
  modal: document.getElementById('entryModal'),
  entryForm: document.getElementById('entryForm'),
  modalTitle: document.getElementById('modalTitle'),
  learningTypeGroup: document.getElementById('learningTypeGroup'),
  importButton: document.getElementById('importButton'),
  exportButton: document.getElementById('exportButton'),
  backupButton: document.getElementById('backupButton'),
  resetButton: document.getElementById('resetButton'),
  importFileInput: document.getElementById('importFileInput')
};

init();

function init() {
  loadState();
  applyTheme();
  populateLearningTypePills();
  bindEvents();
  render();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.records = Array.isArray(parsed.records) ? parsed.records : [];
      state.settings = { ...state.settings, ...(parsed.settings || {}) };
      state.theme = parsed.theme || state.theme;
    } catch (error) {
      console.warn('Unable to parse saved dashboard state:', error);
      state.records = [];
    }
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      theme: state.theme,
      settings: state.settings,
      records: state.records
    })
  );
}

function bindEvents() {
  els.dailyGoalInput.addEventListener('input', () => {
    state.settings.dailyGoalMinutes = Number(els.dailyGoalInput.value) || DEFAULT_GOAL_MINUTES;
    saveState();
    render();
  });

  els.overallGoalInput.addEventListener('input', () => {
    state.settings.overallGoalHours = Number(els.overallGoalInput.value) || DEFAULT_TARGET_HOURS;
    saveState();
    render();
  });

  els.achievedThresholdInput.addEventListener('input', () => {
    state.settings.thresholds.achieved = clampNumber(Number(els.achievedThresholdInput.value) || 100, 50, 200);
    saveState();
    render();
  });

  els.partialThresholdInput.addEventListener('input', () => {
    state.settings.thresholds.partial = clampNumber(Number(els.partialThresholdInput.value) || 75, 10, 100);
    saveState();
    render();
  });

  els.dateRangeFilter.addEventListener('change', (event) => {
    state.filters.range = event.target.value;
    render();
  });

  els.topicFilter.addEventListener('change', (event) => {
    state.filters.topic = event.target.value;
    render();
  });

  els.typeFilter.addEventListener('change', (event) => {
    state.filters.type = event.target.value;
    render();
  });

  els.themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
  });

  els.newEntryButton.addEventListener('click', () => openModal());

  document.querySelectorAll('[data-close="true"]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  els.entryForm.addEventListener('submit', handleFormSubmit);

  document.querySelectorAll('.segmented').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.segmented').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const range = button.dataset.range;
      state.filters.range = range;
      els.dateRangeFilter.value = range;
      render();
    });
  });

  els.importButton.addEventListener('click', () => els.importFileInput.click());
  els.importFileInput.addEventListener('change', importDataFile);
  els.exportButton.addEventListener('click', exportDataJson);
  els.backupButton.addEventListener('click', exportDataCsv);
  els.resetButton.addEventListener('click', resetData);
}

function applyTheme() {
  document.body.classList.toggle('light-mode', state.theme === 'light');
  els.themeToggle.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function populateLearningTypePills() {
  els.learningTypeGroup.innerHTML = '';
  LEARNING_TYPES.forEach((type) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'type-pill';
    button.dataset.type = type;
    button.textContent = type;
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
    });
    els.learningTypeGroup.appendChild(button);
  });
}

function openModal(entry = null) {
  state.editId = entry ? entry.id : null;
  els.entryForm.reset();
  els.modalTitle.textContent = entry ? 'Edit learning record' : 'Add learning record';
  els.modal.classList.remove('hidden');
  els.modal.setAttribute('aria-hidden', 'false');

  const today = new Date().toISOString().slice(0, 10);
  const form = new FormData(els.entryForm);
  const defaultGoal = Number(els.dailyGoalInput.value) || DEFAULT_GOAL_MINUTES;
  els.entryForm.elements.date.value = entry ? entry.date : today;
  els.entryForm.elements.goalMinutes.value = entry ? entry.goalMinutes : defaultGoal;
  els.entryForm.elements.actualMinutes.value = entry ? entry.actualMinutes : 0;
  els.entryForm.elements.practicalMinutes.value = entry ? entry.practicalMinutes || '' : '';
  els.entryForm.elements.sessions.value = entry ? entry.sessions || 1 : 1;
  els.entryForm.elements.difficulty.value = entry ? entry.difficulty || 5 : 5;
  els.entryForm.elements.confidence.value = entry ? entry.confidence || 5 : 5;
  els.entryForm.elements.mainTopic.value = entry ? entry.mainTopic || '' : '';
  els.entryForm.elements.topics.value = entry ? entry.topics.join(', ') : '';
  els.entryForm.elements.whatLearned.value = entry ? entry.whatLearned || '' : '';
  els.entryForm.elements.practicalWork.value = entry ? entry.practicalWork || '' : '';
  els.entryForm.elements.notes.value = entry ? entry.notes || '' : '';
  els.entryForm.elements.plannedStartTime.value = entry ? entry.plannedStartTime || '' : '';
  els.entryForm.elements.actualStartTime.value = entry ? entry.actualStartTime || '' : '';

  document.querySelectorAll('.type-pill').forEach((button) => {
    const isSelected = entry && Array.isArray(entry.learningTypes) && entry.learningTypes.includes(button.dataset.type);
    button.classList.toggle('selected', !!isSelected);
  });
}

function closeModal() {
  els.modal.classList.add('hidden');
  els.modal.setAttribute('aria-hidden', 'true');
  state.editId = null;
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(els.entryForm);
  const selectedTypes = Array.from(document.querySelectorAll('.type-pill.selected')).map((item) => item.dataset.type);

  const record = {
    id: state.editId || crypto.randomUUID(),
    date: String(formData.get('date')),
    goalMinutes: Number(formData.get('goalMinutes')) || 0,
    actualMinutes: Number(formData.get('actualMinutes')) || 0,
    practicalMinutes: Number(formData.get('practicalMinutes')) || 0,
    topics: parseCSVList(String(formData.get('topics'))),
    mainTopic: String(formData.get('mainTopic') || '').trim(),
    learningTypes: selectedTypes.length ? selectedTypes : ['Theory'],
    whatLearned: String(formData.get('whatLearned') || '').trim(),
    practicalWork: String(formData.get('practicalWork') || '').trim(),
    difficulty: clampNumber(Number(formData.get('difficulty')) || 5, 1, 10),
    confidence: clampNumber(Number(formData.get('confidence')) || 5, 1, 10),
    sessions: Math.max(1, Number(formData.get('sessions')) || 1),
    notes: String(formData.get('notes') || '').trim(),
    plannedStartTime: String(formData.get('plannedStartTime') || '').trim(),
    actualStartTime: String(formData.get('actualStartTime') || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!record.date) {
    alert('Please choose a date.');
    return;
  }

  const existingIndex = state.records.findIndex((item) => item.date === record.date);
  if (existingIndex >= 0 && !state.editId) {
    if (!window.confirm('A record for this date already exists. Replace it?')) return;
    state.records.splice(existingIndex, 1, record);
  } else if (state.editId) {
    state.records = state.records.map((item) => (item.id === state.editId ? record : item));
  } else {
    state.records.push(record);
  }

  state.records.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveState();
  closeModal();
  render();
}

function render() {
  const current = getFilteredRecords();
  updateSettingsInputs();
  updateFilterOptions();
  renderKpis(current);
  renderTodaySection();
  renderOverallGoal();
  renderDailyTrend(current);
  renderHeatmap(current);
  renderTopicChart(current);
  renderTypeChart(current);
  renderWeeklyTrend(current);
  renderWeekdayChart(current);
  renderQualityScore(current);
  renderScatterChart(current);
  renderInsights(current);
  renderWeeklyReview(current);
  renderMonthlyReview(current);
  renderMilestones(current);
  renderRecentActivity(current);
}

function updateSettingsInputs() {
  els.dailyGoalInput.value = state.settings.dailyGoalMinutes;
  els.overallGoalInput.value = state.settings.overallGoalHours;
  els.achievedThresholdInput.value = state.settings.thresholds.achieved;
  els.partialThresholdInput.value = state.settings.thresholds.partial;
  els.dateRangeFilter.value = state.filters.range;
}

function updateFilterOptions() {
  const topics = getUniqueTopics();
  const types = LEARNING_TYPES;

  renderSelectOptions(els.topicFilter, topics, 'all', 'All topics');
  renderSelectOptions(els.typeFilter, types, 'all', 'All learning types');

  if (!topics.includes(state.filters.topic)) {
    state.filters.topic = 'all';
  }
  if (!types.includes(state.filters.type)) {
    state.filters.type = 'all';
  }

  els.topicFilter.value = state.filters.topic;
  els.typeFilter.value = state.filters.type;
}

function renderSelectOptions(select, items, defaultValue, defaultLabel) {
  const selected = select.value;
  const options = [
    `<option value="${defaultValue}">${defaultLabel}</option>`,
    ...items.map((value) => `<option value="${value}">${value}</option>`)
  ];
  select.innerHTML = options.join('');
  if (items.includes(selected)) {
    select.value = selected;
  } else {
    select.value = defaultValue;
  }
}

function getFilteredRecords() {
  const records = [...state.records];
  const now = new Date();
  const today = toDateKey(now);
  let filtered = [...records];

  switch (state.filters.range) {
    case '7d':
      filtered = filtered.filter((item) => daysBetween(item.date, today) <= 7);
      break;
    case '30d':
      filtered = filtered.filter((item) => daysBetween(item.date, today) <= 30);
      break;
    case '90d':
      filtered = filtered.filter((item) => daysBetween(item.date, today) <= 90);
      break;
    case '365d':
      filtered = filtered.filter((item) => daysBetween(item.date, today) <= 365);
      break;
    default:
      break;
  }

  if (state.filters.topic !== 'all') {
    filtered = filtered.filter((item) => {
      const topicSet = [item.mainTopic, ...(item.topics || [])].filter(Boolean).map((value) => value.trim().toLowerCase());
      return topicSet.includes(state.filters.topic.trim().toLowerCase());
    });
  }

  if (state.filters.type !== 'all') {
    filtered = filtered.filter((item) => (item.learningTypes || []).includes(state.filters.type));
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderKpis(records) {
  const totalMinutes = sum(records, 'actualMinutes');
  const totalGoalMinutes = sum(records, 'goalMinutes');
  const trackedDays = records.length;
  const activeDays = records.filter((item) => item.actualMinutes > 0).length;
  const avgDaily = trackedDays ? totalMinutes / trackedDays : 0;
  const avgActive = activeDays ? totalMinutes / activeDays : 0;
  const dailyGoalAchievement = totalGoalMinutes ? (totalMinutes / totalGoalMinutes) * 100 : 0;
  const consistency = trackedDays ? (activeDays / trackedDays) * 100 : 0;
  const achievedThreshold = state.settings.thresholds.achieved / 100;
  const partialThreshold = state.settings.thresholds.partial / 100;
  const currentStreak = getCurrentStreak(records);
  const longestStreak = getLongestStreak(records);
  const goalsCompleted = records.filter((item) => item.actualMinutes >= item.goalMinutes * achievedThreshold).length;
  const goalsMissed = records.filter((item) => item.actualMinutes > 0 && item.actualMinutes < item.goalMinutes * partialThreshold).length;
  const remainingHours = Math.max(0, state.settings.overallGoalHours * 60 - totalMinutes) / 60;

  const kpis = [
    { label: 'Total learning hours', value: formatHours(totalMinutes), detail: `${formatMinutes(totalMinutes)} total`, trend: '' },
    { label: 'Total learning minutes', value: `${Math.round(totalMinutes)}`, detail: 'Minutes logged', trend: '' },
    { label: 'Total days tracked', value: trackedDays, detail: 'Tracked entries', trend: '' },
    { label: 'Active learning days', value: activeDays, detail: 'Days with activity', trend: '' },
    { label: 'Average learning time/day', value: formatMinutes(avgDaily), detail: 'Across tracked days', trend: '' },
    { label: 'Average learning time on active days', value: formatMinutes(avgActive), detail: 'Active-day average', trend: '' },
    { label: 'Learning consistency %', value: `${formatPercent(consistency)}%`, detail: 'Active / tracked', trend: '' },
    { label: 'Daily goal achievement %', value: `${formatPercent(dailyGoalAchievement)}%`, detail: `Across ${trackedDays || 0} entries`, trend: '' },
    { label: 'Overall goal completion %', value: `${formatPercent(getOverallGoalPercent())}%`, detail: `${formatHours(sum(state.records, 'actualMinutes'))} / ${state.settings.overallGoalHours}h`, trend: '' },
    { label: 'Current streak', value: `${currentStreak} days`, detail: 'Consecutive active days', trend: '' },
    { label: 'Longest streak', value: `${longestStreak} days`, detail: 'Best streak', trend: '' },
    { label: 'Goals completed', value: goalsCompleted, detail: `${state.settings.thresholds.achieved}%+ target`, trend: '' },
    { label: 'Goals missed', value: goalsMissed, detail: `Below ${state.settings.thresholds.partial}% target`, trend: '' },
    { label: 'Remaining hours toward target', value: `${formatHours(remainingHours * 60)}`, detail: `${formatNumber(remainingHours, 1)} hours left`, trend: '' }
  ];

  els.kpiGrid.innerHTML = kpis.map((card) => `
    <article class="kpi-card">
      <div class="kpi-label">
        <span>${card.label}</span>
        <span class="filter-pill">${card.detail}</span>
      </div>
      <strong>${card.value}</strong>
      <div class="kpi-trend ${card.trend ? '' : 'muted'}">${card.trend || 'Live'}</div>
    </article>
  `).join('');

  els.headerCurrentStreak.textContent = `${currentStreak} days`;
  els.headerOverallProgress.textContent = `${formatPercent(getOverallGoalPercent())}%`;
}

function renderTodaySection() {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRecord = state.records.find((item) => item.date === todayKey) || null;
  const targetMinutes = state.settings.dailyGoalMinutes;
  const actualMinutes = todayRecord ? todayRecord.actualMinutes : 0;
  const remaining = Math.max(0, targetMinutes - actualMinutes);
  const completion = targetMinutes ? (actualMinutes / targetMinutes) * 100 : 0;
  const status = !todayRecord
    ? 'No record'
    : actualMinutes > targetMinutes
      ? 'Exceeded'
      : completion >= state.settings.thresholds.achieved
        ? 'Achieved'
        : completion >= state.settings.thresholds.partial
          ? 'Partially achieved'
          : actualMinutes > 0
            ? 'Missed'
            : 'No progress';
  const topics = todayRecord ? [...new Set([...(todayRecord.topics || []), todayRecord.mainTopic].filter(Boolean))] : [];

  els.todayDateLabel.textContent = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  els.todayFocusContent.innerHTML = !todayRecord && !state.records.length
    ? `<div class="empty-state"><h3>Start your first learning session.</h3><p>Add your first daily learning record to begin tracking AI learning progress, goals, and consistency.</p><button class="primary-button" type="button" data-open-entry="true">Add first entry</button></div>`
    : `
      <div class="today-focus">
        <div class="focus-stat"><span>Today's goal</span><strong>${formatMinutes(targetMinutes)}</strong></div>
        <div class="focus-stat"><span>Completed</span><strong>${formatMinutes(actualMinutes)}</strong></div>
        <div class="focus-stat"><span>Remaining</span><strong>${formatMinutes(remaining)}</strong></div>
        <div class="focus-stat"><span>Achievement</span><strong>${formatPercent(completion)}%</strong></div>
        <div class="focus-stat"><span>Goal status</span><strong>${status}</strong></div>
        <div class="focus-stat"><span>Topics</span><strong>${topics.length ? topics.slice(0, 2).join(', ') : 'No topics yet'}</strong></div>
        <div class="focus-stat"><span>Sessions</span><strong>${todayRecord ? todayRecord.sessions || 1 : 0}</strong></div>
      </div>
    `;

  const addButton = document.querySelector('[data-open-entry="true"]');
  if (addButton) {
    addButton.addEventListener('click', () => openModal());
  }
}

function renderOverallGoal() {
  const totalMinutes = sum(state.records, 'actualMinutes');
  const targetMinutes = state.settings.overallGoalHours * 60;
  let progress = targetMinutes ? (totalMinutes / targetMinutes) * 100 : 0;
  progress = Math.min(100, progress);

  const ringCircumference = 2 * Math.PI * 46;
  const offset = ringCircumference - (progress / 100) * ringCircumference;
  els.ringValue.style.strokeDasharray = `${ringCircumference}`;
  els.ringValue.style.strokeDashoffset = `${offset}`;
  els.ringValue.style.stroke = 'url(#strokeGradient)';
  els.ringPercent.textContent = `${formatPercent(progress)}%`;
  els.completedHoursValue.textContent = `${formatHours(totalMinutes)}h`;
  els.remainingHoursValue.textContent = `${Math.max(0, (targetMinutes - totalMinutes) / 60).toFixed(1)}h`;

  const projectedDate = estimateCompletionDate(totalMinutes, targetMinutes);
  els.projectedDateValue.textContent = projectedDate || 'Not enough data';
  const requiredPace = estimateRequiredPace();
  els.requiredPaceValue.textContent = requiredPace || '0h/day';
  els.overallGoalMeta.textContent = `${formatHours(totalMinutes)} / ${state.settings.overallGoalHours}h`;

  let gradient = document.getElementById('strokeGradient');
  if (!gradient) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linear = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linear.setAttribute('id', 'strokeGradient');
    linear.setAttribute('x1', '0%');
    linear.setAttribute('x2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#7c9cff');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#67e8f9');

    linear.appendChild(stop1);
    linear.appendChild(stop2);
    defs.appendChild(linear);
    document.querySelector('#progressRing svg').appendChild(defs);
    gradient = linear;
  }
}

function renderDailyTrend(records) {
  if (!records.length) {
    els.dailyTrendChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3><p>Daily learning trends will appear once you start recording sessions.</p></div>';
    return;
  }

  const days = buildDateSeries(records, 30);
  const maxValue = Math.max(
    ...days.map((item) => Math.max(item.actualMinutes || 0, item.goalMinutes || 0)),
    state.settings.dailyGoalMinutes
  );

  const width = 820;
  const height = 220;
  const padding = 36;
  const points = days.map((item, index) => {
    const x = padding + (index / Math.max(days.length - 1, 1)) * (width - padding * 2);
    const actualY = height - padding - ((item.actualMinutes || 0) / Math.max(maxValue, 1)) * (height - padding * 2);
    const goalY = height - padding - ((item.goalMinutes || 0) / Math.max(maxValue, 1)) * (height - padding * 2);
    return { ...item, x, actualY, goalY };
  });

  const actualPath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.actualY}`).join(' ');
  const goalPath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.goalY}`).join(' ');

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = padding + ((height - padding * 2) / 4) * i;
    const value = Math.round(maxValue - (maxValue / 4) * i);
    return `
      <line x1="${padding}" x2="${width - padding}" y1="${y}" y2="${y}" class="grid-line" />
      <text x="8" y="${y + 4}" class="axis-label">${value}m</text>
    `;
  }).join('');

  const xLabels = points.filter((_, index) => index % Math.max(Math.ceil(points.length / 6), 1) === 0 || index === points.length - 1)
    .map((point) => `<text x="${point.x}" y="${height - 10}" class="axis-label" text-anchor="middle">${formatShortDate(point.date)}</text>`)
    .join('');

  els.dailyTrendChart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Daily learning trend chart">
      ${gridLines}
      <path d="${goalPath}" stroke="rgba(251,191,36,0.8)" fill="none" stroke-width="2" stroke-dasharray="6 6" />
      <path d="${actualPath}" stroke="#7c9cff" fill="none" stroke-width="3" />
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.actualY}" r="4" class="data-point" />`).join('')}
      ${points.map((point) => `<circle cx="${point.x}" cy="${point.goalY}" r="3.5" class="goal-point" />`).join('')}
      ${xLabels}
    </svg>
  `;
}

function renderHeatmap(records) {
  if (!records.length) {
    els.heatmapContainer.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3><p>Heatmap activity will appear after the first few learning records are entered.</p></div>';
    return;
  }

  const startDate = new Date(Math.min(...records.map((item) => new Date(item.date).getTime())));
  const endDate = new Date(Math.max(...records.map((item) => new Date(item.date).getTime())));
  const cells = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const key = toDateKey(current);
    const entry = records.find((item) => item.date === key);
    const minutes = entry ? entry.actualMinutes : 0;
    const level = getHeatLevel(minutes);
    cells.push({ date: key, level, minutes });
    current.setDate(current.getDate() + 1);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const weekBlocks = weeks.map((week) => `
    <div class="heatmap-grid">
      ${week.map((cell) => `<div class="heatmap-cell level-${cell.level}" title="${cell.date}: ${cell.minutes} min, goal ${getGoalForDate(cell.date)} min" aria-label="${cell.date} ${cell.minutes} minutes"></div>`).join('')}
    </div>
  `).join('');

  const legend = ['0', '1–30', '31–60', '61–90', '90+']
    .map((label, index) => `<span><span class="legend-swatch level-${index}"></span> ${label}</span>`)
    .join('');

  els.heatmapContainer.innerHTML = `
    <div class="heatmap-grid" style="grid-template-columns: repeat(${Math.max(weeks[0]?.length || 7, 7)}, minmax(12px, 1fr));">
      ${weeks.map((week) => week.map((cell) => `<div class="heatmap-cell level-${cell.level}" title="${cell.date}: ${cell.minutes} min, goal ${getGoalForDate(cell.date)} min"></div>`).join('')).join('')}
    </div>
    <div class="heatmap-legend">${legend}</div>
  `;
}

function renderTopicChart(records) {
  if (!records.length) {
    els.topicChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3><p>Topic breakdown will appear once your learning data is available.</p></div>';
    return;
  }

  const totals = {};
  records.forEach((record) => {
    const topics = [record.mainTopic, ...(record.topics || [])].filter(Boolean);
    topics.forEach((topic) => {
      const normalized = topic.trim();
      totals[normalized] = (totals[normalized] || 0) + (record.actualMinutes || 0);
    });
  });

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalMinutes = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  let start = 0;
  const palette = ['#7c9cff', '#a78bfa', '#67e8f9', '#4ade80', '#fbbf24', '#f87171'];
  const fragments = entries.map(([label, value], index) => {
    const end = start + (value / totalMinutes) * 100;
    const color = palette[index % palette.length];
    const chunk = `${color} ${start}% ${end}%`;
    start = end;
    return { label, value, color, percent: (value / totalMinutes) * 100, chunk };
  });

  const donutStyle = `background: conic-gradient(${fragments.map((item) => item.chunk).join(', ')})`;

  els.topicChart.innerHTML = `
    <div class="donut-shell">
      <div class="donut-ring" style="${donutStyle}">
        <div class="donut-center">
          <strong>${entries.length}</strong>
          <span>Topics</span>
        </div>
      </div>
      <div class="topic-legend">
        ${fragments.map((item) => `
          <div class="legend-item">
            <div class="legend-item-left"><span class="swatch" style="background:${item.color}"></span><span>${item.label}</span></div>
            <strong>${formatPercent(item.percent)}%</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderTypeChart(records) {
  if (!records.length) {
    els.typeChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3><p>Learning type distribution will appear after entries are added.</p></div>';
    return;
  }

  const totals = {};
  records.forEach((record) => {
    (record.learningTypes || []).forEach((type) => {
      totals[type] = (totals[type] || 0) + (record.actualMinutes || 0);
    });
  });

  const max = Math.max(...Object.values(totals), 1);
  const rows = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => `
      <div class="type-bar">
        <span class="type-bar-label">${label}</span>
        <div class="type-bar-track"><span class="type-bar-fill" style="width:${(value / max) * 100}%"></span></div>
        <strong>${formatPercent((value / sum(records, 'actualMinutes')) * 100)}%</strong>
      </div>
    `)
    .join('');

  els.typeChart.innerHTML = rows || '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
}

function renderWeeklyTrend(records) {
  if (!records.length) {
    els.weeklyTrendChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
    return;
  }

  const weeklyData = buildWeeklySeries(records);
  const maxValue = Math.max(...weeklyData.flatMap((item) => [item.actualMinutes, item.goalMinutes]), 1);
  const width = 420;
  const height = 220;
  const padding = 28;

  const bars = weeklyData.map((item, index) => {
    const x = padding + index * 44;
    const barHeight = (item.actualMinutes / maxValue) * (height - padding * 2);
    const goalHeight = (item.goalMinutes / maxValue) * (height - padding * 2);
    const y = height - padding - barHeight;
    const goalY = height - padding - goalHeight;
    return `
      <rect x="${x}" y="${goalY}" width="14" height="${goalHeight}" fill="rgba(251,191,36,0.35)" rx="5"></rect>
      <rect x="${x + 16}" y="${y}" width="14" height="${barHeight}" fill="#7c9cff" rx="5"></rect>
    `;
  }).join('');

  const grid = Array.from({ length: 5 }, (_, i) => {
    const y = padding + ((height - padding * 2) / 4) * i;
    return `<line x1="${padding}" x2="${width - padding}" y1="${y}" y2="${y}" class="grid-line" />`;
  }).join('');

  els.weeklyTrendChart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
      ${grid}
      ${bars}
    </svg>
  `;
}

function renderWeekdayChart(records) {
  if (!records.length) {
    els.weekdayChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
    return;
  }

  const counts = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };

  records.forEach((record) => {
    const day = new Date(`${record.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' });
    counts[day] = (counts[day] || 0) + record.actualMinutes;
  });

  const max = Math.max(...Object.values(counts), 1);
  const width = 420;
  const height = 220;
  const padding = 28;

  const bars = Object.entries(counts).map(([label, value], index) => {
    const x = padding + index * 52;
    const barHeight = (value / max) * (height - padding * 2);
    const y = height - padding - barHeight;
    return `
      <rect x="${x}" y="${y}" width="22" height="${barHeight}" fill="#7c9cff" rx="5"></rect>
      <text x="${x + 11}" y="${height - 8}" text-anchor="middle" class="axis-label">${label.slice(0, 2)}</text>
    `;
  }).join('');

  els.weekdayChart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
      ${Array.from({ length: 5 }, (_, i) => `<line x1="${padding}" x2="${width - padding}" y1="${padding + i * 40}" y2="${padding + i * 40}" class="grid-line" />`).join('')}
      ${bars}
    </svg>
  `;
}

function renderQualityScore(records) {
  if (!records.length) {
    els.qualityScoreCard.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3><p>Learning quality metrics will appear once you log a few sessions.</p></div>';
    return;
  }

  const totalMinutes = sum(records, 'actualMinutes');
  const totalGoalMinutes = sum(records, 'goalMinutes');
  const activeDays = records.filter((item) => item.actualMinutes > 0).length;
  const trackedDays = records.length || 1;
  const consistency = trackedDays ? (activeDays / trackedDays) * 100 : 0;
  const goalAchievement = totalGoalMinutes ? (totalMinutes / totalGoalMinutes) * 100 : 0;
  const practicalRatio = totalMinutes ? (sum(records, 'practicalMinutes') / totalMinutes) * 100 : 0;
  const uniqueTopicCount = new Set(records.flatMap((record) => [record.mainTopic, ...(record.topics || [])].filter(Boolean))).size;
  const topicCoverage = uniqueTopicCount ? Math.min(100, (uniqueTopicCount / 10) * 100) : 0;
  const confidence = records.length ? average(records, 'confidence') * 10 : 0;
  const goalScore = Math.min(100, goalAchievement);
  const consistencyScore = Math.min(100, consistency);
  const practicalScore = Math.min(100, practicalRatio);
  const topicScore = Math.min(100, topicCoverage);
  const confidenceScore = Math.min(100, confidence);

  const overall = Math.round(
    (goalScore * 0.3) +
    (consistencyScore * 0.2) +
    (practicalScore * 0.15) +
    (topicScore * 0.15) +
    (confidenceScore * 0.2)
  );

  const circumference = 2 * Math.PI * 45;
  const dash = (overall / 100) * circumference;

  els.qualityScoreCard.innerHTML = `
    <div class="score-ring-large">
      <svg viewBox="0 0 120 120">
        <circle class="score-ring-background" cx="60" cy="60" r="45"></circle>
        <circle class="score-ring-value" cx="60" cy="60" r="45" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference - dash}"></circle>
      </svg>
      <div class="score-ring-center">
        <strong>${overall}</strong>
        <span>/100</span>
      </div>
    </div>
    <div class="score-meta">
      <div class="score-line"><span>Goal Achievement</span><strong>${Math.round(goalScore)}</strong></div>
      <div class="score-line"><span>Consistency</span><strong>${Math.round(consistencyScore)}</strong></div>
      <div class="score-line"><span>Hands-on</span><strong>${Math.round(practicalScore)}</strong></div>
      <div class="score-line"><span>Topic Coverage</span><strong>${Math.round(topicScore)}</strong></div>
      <div class="score-line"><span>Confidence</span><strong>${Math.round(confidenceScore)}</strong></div>
    </div>
  `;
}

function renderScatterChart(records) {
  if (!records.length) {
    els.scatterChart.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
    return;
  }

  const width = 420;
  const height = 220;
  const padding = 32;
  const points = records
    .filter((item) => Number.isFinite(item.difficulty) && Number.isFinite(item.confidence))
    .map((item) => {
      const x = padding + ((item.difficulty - 1) / 9) * (width - padding * 2);
      const y = height - padding - ((item.confidence - 1) / 9) * (height - padding * 2);
      return { ...item, x, y };
    });

  const axes = `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(148,163,184,0.25)"/>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="rgba(148,163,184,0.25)"/>
    <text x="${width / 2}" y="${height - 8}" text-anchor="middle" class="axis-label">Difficulty</text>
    <text x="12" y="${padding}" class="axis-label">Confidence</text>
  `;

  const circles = points.map((point) => `
    <circle cx="${point.x}" cy="${point.y}" r="5" fill="#7c9cff" opacity="0.8"></circle>
  `).join('');

  els.scatterChart.innerHTML = `
    <svg class="scatter-svg" viewBox="0 0 ${width} ${height}">${axes}${circles}</svg>
  `;
}

function renderInsights(records) {
  if (!records.length) {
    els.insightsCard.innerHTML = '<div class="insight-item"><span class="insight-icon">!</span><div><strong>Not enough data yet.</strong></div></div>';
    return;
  }

  const totalMinutes = sum(records, 'actualMinutes');
  const targetMinutes = state.settings.overallGoalHours * 60;
  const completedRatio = targetMinutes ? (totalMinutes / targetMinutes) * 100 : 0;
  const topicTotals = summarizeTopics(records);
  const strongestTopic = Object.entries(topicTotals).sort((a, b) => b[1] - a[1])[0];
  const practicalRatio = totalMinutes ? (sum(records, 'practicalMinutes') / totalMinutes) * 100 : 0;
  const currentStreak = getCurrentStreak(records);
  const strongestDay = getStrongestDay(records);
  const monthlyDelta = getMonthOverMonthDelta(records);

  const insights = [];
  insights.push({ text: `You have completed ${formatPercent(completedRatio)}% of your target across ${records.length} tracked days.` });
  if (currentStreak > 0) insights.push({ text: `You have maintained a ${currentStreak}-day learning streak.` });
  if (strongestDay) insights.push({ text: `Your strongest learning day is ${strongestDay.label}, with ${formatMinutes(strongestDay.minutes)} logged.` });
  if (strongestTopic) insights.push({ text: `You spend most of your time on ${strongestTopic[0]}.` });
  if (practicalRatio > 0 && practicalRatio < 40) insights.push({ text: `Your practical learning ratio is only ${formatPercent(practicalRatio)}%. Consider increasing hands-on work.` });
  if (monthlyDelta !== null) insights.push({ text: `Your average learning time changed ${monthlyDelta >= 0 ? 'up' : 'down'} ${Math.abs(monthlyDelta).toFixed(1)}% compared with the previous month.` });

  els.insightsCard.innerHTML = insights.map((item) => `
    <div class="insight-item">
      <span class="insight-icon">✓</span>
      <div>${item.text}</div>
    </div>
  `).join('');
}

function renderWeeklyReview(records) {
  const weekly = buildWeeklySeries(records).slice(-8);
  if (!weekly.length) {
    els.weeklyReviewGrid.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
    return;
  }

  const lastWeek = weekly.at(-1);
  const prevWeek = weekly.at(-2) || lastWeek;
  const compare = (current, previous) => {
    if (!previous || previous === 0) return 'flat';
    const delta = ((current - previous) / previous) * 100;
    return delta > 0 ? 'good' : delta < 0 ? 'bad' : 'flat';
  };

  els.weeklyReviewGrid.innerHTML = weekly.map((week, index) => `
    <div class="week-card">
      <div class="week-card-header">
        <strong>Week ${index + 1}</strong>
        <span class="filter-pill">${week.label}</span>
      </div>
      <div class="metric-pair">
        <div><span>Total time</span><strong>${formatHours(week.actualMinutes)}</strong></div>
        <div><span>Target</span><strong>${formatHours(week.goalMinutes)}</strong></div>
        <div><span>Achievement</span><strong>${formatPercent(week.achievement)}%</strong></div>
        <div><span>Active days</span><strong>${week.activeDays}</strong></div>
      </div>
    </div>
  `).join('');

  const comparison = `
    <div class="week-card">
      <div class="week-card-header"><strong>Previous vs Current</strong><span class="filter-pill">Live</span></div>
      <div class="metric-pair">
        <div><span>Learning time</span><strong class="${compare(lastWeek.actualMinutes, prevWeek.actualMinutes) === 'good' ? 'change-good' : compare(lastWeek.actualMinutes, prevWeek.actualMinutes) === 'bad' ? 'change-bad' : 'change-flat'}">${formatMinutes(lastWeek.actualMinutes - prevWeek.actualMinutes)}</strong></div>
        <div><span>Goal achievement</span><strong>${formatPercent(lastWeek.achievement)}%</strong></div>
        <div><span>Consistency</span><strong>${formatPercent((lastWeek.activeDays / Math.max(7, lastWeek.days)) * 100)}%</strong></div>
        <div><span>Confidence</span><strong>${formatNumber(averageByWeek(records, 'confidence'), 1)}</strong></div>
      </div>
    </div>
  `;

  els.weeklyReviewGrid.insertAdjacentHTML('beforeend', comparison);
}

function renderMonthlyReview(records) {
  const monthly = buildMonthlySeries(records).slice(-6);
  if (!monthly.length) {
    els.monthlyReviewGrid.innerHTML = '<div class="empty-state"><h3>Not enough data yet.</h3></div>';
    return;
  }

  els.monthlyReviewGrid.innerHTML = monthly.map((month) => `
    <div class="month-card">
      <div class="month-card-header"><strong>${month.label}</strong></div>
      <div class="metric-pair">
        <div><span>Hours</span><strong>${formatHours(month.actualMinutes)}</strong></div>
        <div><span>Goal</span><strong>${formatHours(month.goalMinutes)}</strong></div>
        <div><span>Completion</span><strong>${formatPercent(month.achievement)}%</strong></div>
        <div><span>Active days</span><strong>${month.activeDays}</strong></div>
      </div>
    </div>
  `).join('');
}

function renderMilestones(records) {
  const totalMinutes = sum(records, 'actualMinutes');
  const allMilestones = [...DEFAULT_MILESTONES, ...getCustomMilestones()];
  const uniqueMilestones = [...new Set(allMilestones)].sort((a, b) => a - b);

  els.milestonesContainer.innerHTML = uniqueMilestones.map((value) => {
    const unlocked = totalMinutes >= value * 60;
    const badge = unlocked ? 'Unlocked' : 'Locked';
    return `
      <div class="milestone-card ${unlocked ? 'unlocked' : ''}">
        <div class="kpi-label"><span>${badge}</span><span>${value}h</span></div>
        <h4>${unlocked ? `🏆 ${value} Hours Completed` : `${value} Hours Goal`}</h4>
        <div class="progress-bar">
          <div class="type-bar-track"><span class="type-bar-fill" style="width:${Math.min(100, (totalMinutes / (value * 60)) * 100)}%"></span></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRecentActivity(records) {
  if (!records.length) {
    els.recentActivityTable.innerHTML = '<div class="empty-state"><h3>Start your first learning session.</h3><p>Recent activity will appear here as soon as you log your first sessions.</p></div>';
    return;
  }

  const rows = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).map((record) => `
    <tr class="clickable-row" data-record-id="${record.id}">
      <td>${formatDisplayDate(record.date)}</td>
      <td>${formatMinutes(record.actualMinutes)}</td>
      <td>${formatMinutes(record.goalMinutes)}</td>
      <td>${record.mainTopic || 'General'}</td>
      <td>${(record.learningTypes || []).join(', ') || '—'}</td>
      <td>${record.confidence || '—'}</td>
      <td>${record.difficulty || '—'}</td>
    </tr>
  `).join('');

  els.recentActivityTable.innerHTML = `
    <table class="activity-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Actual</th>
          <th>Goal</th>
          <th>Topic</th>
          <th>Type</th>
          <th>Confidence</th>
          <th>Difficulty</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  document.querySelectorAll('.clickable-row').forEach((row) => {
    row.addEventListener('click', () => {
      const found = state.records.find((record) => record.id === row.dataset.recordId);
      if (found) openModal(found);
    });
  });
}

function getOverallGoalPercent() {
  const totalMinutes = sum(state.records, 'actualMinutes');
  const targetMinutes = state.settings.overallGoalHours * 60;
  return targetMinutes ? (totalMinutes / targetMinutes) * 100 : 0;
}

function getCurrentStreak(records) {
  if (!records.length) return 0;
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const key = toDateKey(cursor);
    const record = records.find((item) => item.date === key);
    const threshold = Math.max(30, (record ? record.goalMinutes : state.settings.dailyGoalMinutes) * (state.settings.thresholds.partial / 100));
    if (!record || record.actualMinutes < threshold) {
      if (streak === 0) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getLongestStreak(records) {
  if (!records.length) return 0;
  const dates = [...new Set(records.map((item) => item.date))].sort();
  let best = 0;
  let current = 0;
  const sorted = dates.map((date) => ({ date, record: records.find((item) => item.date === date) }));

  for (const item of sorted) {
    const threshold = Math.max(30, (item.record.goalMinutes || state.settings.dailyGoalMinutes) * (state.settings.thresholds.partial / 100));
    if (item.record && item.record.actualMinutes >= threshold) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }

  return best;
}

function buildDateSeries(records, days = 30) {
  const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
  const earliest = sorted[0] ? new Date(sorted[0].date) : new Date();
  const dates = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(earliest);
    date.setDate(date.getDate() + i);
    dates.push(toDateKey(date));
  }

  const allDates = new Set(dates);
  const map = new Map(records.map((item) => [item.date, item]));

  return dates.map((date) => {
    const item = map.get(date) || { date, actualMinutes: 0, goalMinutes: state.settings.dailyGoalMinutes };
    return {
      date,
      actualMinutes: Number(item.actualMinutes || 0),
      goalMinutes: Number(item.goalMinutes || state.settings.dailyGoalMinutes)
    };
  });
}

function buildWeeklySeries(records) {
  const map = new Map();
  records.forEach((record) => {
    const date = new Date(`${record.date}T00:00:00`);
    const start = new Date(date);
    const dayIndex = (date.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayIndex);
    const key = toDateKey(start);
    if (!map.has(key)) {
      map.set(key, { actualMinutes: 0, goalMinutes: 0, activeDays: 0, days: 0 });
    }
    map.get(key).actualMinutes += Number(record.actualMinutes || 0);
    map.get(key).goalMinutes += Number(record.goalMinutes || state.settings.dailyGoalMinutes);
    map.get(key).activeDays += record.actualMinutes > 0 ? 1 : 0;
    map.get(key).days += 1;
  });

  return [...map.entries()].map(([label, value]) => ({
    label: formatWeekLabel(label),
    actualMinutes: value.actualMinutes,
    goalMinutes: value.goalMinutes,
    achievement: value.goalMinutes ? (value.actualMinutes / value.goalMinutes) * 100 : 0,
    activeDays: value.activeDays,
    days: value.days
  })).sort((a, b) => new Date(a.label) - new Date(b.label));
}

function buildMonthlySeries(records) {
  const map = new Map();
  records.forEach((record) => {
    const date = new Date(`${record.date}T00:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) {
      map.set(key, { actualMinutes: 0, goalMinutes: 0, activeDays: 0, label: date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) });
    }
    const bucket = map.get(key);
    bucket.actualMinutes += Number(record.actualMinutes || 0);
    bucket.goalMinutes += Number(record.goalMinutes || state.settings.dailyGoalMinutes);
    bucket.activeDays += record.actualMinutes > 0 ? 1 : 0;
  });

  return [...map.entries()].map(([key, value]) => ({
    key,
    label: value.label,
    actualMinutes: value.actualMinutes,
    goalMinutes: value.goalMinutes,
    achievement: value.goalMinutes ? (value.actualMinutes / value.goalMinutes) * 100 : 0,
    activeDays: value.activeDays
  })).sort((a, b) => new Date(a.key + '-01') - new Date(b.key + '-01'));
}

function summarizeTopics(records) {
  const totals = {};
  records.forEach((record) => {
    const topics = [record.mainTopic, ...(record.topics || [])].filter(Boolean);
    topics.forEach((topic) => {
      totals[topic] = (totals[topic] || 0) + (record.actualMinutes || 0);
    });
  });
  return totals;
}

function getUniqueTopics() {
  const all = state.records.flatMap((record) => [record.mainTopic, ...(record.topics || [])].filter(Boolean));
  return [...new Set(all)].sort();
}

function parseCSVList(value) {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function toDateKey(date) {
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function daysBetween(dateA, dateB) {
  const a = new Date(`${dateA}T00:00:00`);
  const b = new Date(`${dateB}T00:00:00`);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function sum(records, key) {
  return records.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function average(records, key) {
  if (!records.length) return 0;
  return sum(records, key) / records.length;
}

function averageByWeek(records, key) {
  const groups = {};
  records.forEach((record) => {
    const date = new Date(`${record.date}T00:00:00`);
    const start = new Date(date);
    const dayIndex = (date.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayIndex);
    const keyValue = toDateKey(start);
    if (!groups[keyValue]) groups[keyValue] = [];
    groups[keyValue].push(Number(record[key]) || 0);
  });

  const values = Object.values(groups).map((arr) => arr.reduce((total, item) => total + item, 0) / arr.length);
  return values.length ? values.reduce((total, item) => total + item, 0) / values.length : 0;
}

function formatMinutes(value) {
  const total = Math.round(Number(value) || 0);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}m`;
  return '0m';
}

function formatHours(value) {
  const totalMinutes = Number(value) || 0;
  return (totalMinutes / 60).toFixed(1).replace(/\.0$/, '') + 'h';
}

function formatPercent(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function formatNumber(value, digits = 1) {
  return Number.isFinite(value) ? Number(value).toFixed(digits) : '0.0';
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getHeatLevel(minutes) {
  if (!minutes) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 90) return 3;
  return 4;
}

function getGoalForDate(dateKey) {
  const record = state.records.find((item) => item.date === dateKey);
  return record ? record.goalMinutes : state.settings.dailyGoalMinutes;
}

function estimateCompletionDate(currentMinutes, targetMinutes) {
  if (!state.records.length || !targetMinutes) return null;
  if (currentMinutes >= targetMinutes) return 'Goal reached';
  const sorted = [...state.records].sort((a, b) => new Date(a.date) - new Date(b.date));
  const totalDays = sorted.length;
  if (totalDays < 3) return null;
  const avgMinutesPerDay = totalMinutesAverage(sorted);
  const remaining = targetMinutes - currentMinutes;
  if (!avgMinutesPerDay) return null;
  const daysToFinish = remaining / avgMinutesPerDay;
  const projected = new Date(sorted[sorted.length - 1].date);
  projected.setDate(projected.getDate() + Math.ceil(daysToFinish));
  return projected.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function estimateRequiredPace() {
  const totalMinutes = sum(state.records, 'actualMinutes');
  const targetMinutes = state.settings.overallGoalHours * 60;
  const remaining = Math.max(0, targetMinutes - totalMinutes);
  if (!state.records.length || remaining <= 0) return 'On track';
  const earliest = [...state.records].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  if (!earliest) return null;
  const days = Math.max(1, Math.ceil((new Date() - new Date(earliest.date)) / (1000 * 60 * 60 * 24)));
  const pace = remaining / days;
  return `${(pace / 60).toFixed(1)}h/day`;
}

function totalMinutesAverage(records) {
  const actual = records.reduce((sum, record) => sum + (Number(record.actualMinutes) || 0), 0);
  return actual / Math.max(records.length, 1);
}

function getStrongestDay(records) {
  if (!records.length) return null;
  const sorted = [...records].sort((a, b) => b.actualMinutes - a.actualMinutes);
  return { label: formatDisplayDate(sorted[0].date), minutes: sorted[0].actualMinutes };
}

function getMonthOverMonthDelta(records) {
  const monthly = buildMonthlySeries(records);
  if (monthly.length < 2) return null;
  const previous = monthly[monthly.length - 2].actualMinutes;
  const current = monthly[monthly.length - 1].actualMinutes;
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function getCustomMilestones() {
  const stored = localStorage.getItem('ai-learning-custom-milestones');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
}

function formatDisplayDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatShortDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatWeekLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function exportDataJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    records: state.records
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  triggerDownload(blob, 'ai-learning-dashboard.json');
}

function exportDataCsv() {
  const headers = ['date', 'goalMinutes', 'actualMinutes', 'practicalMinutes', 'topics', 'mainTopic', 'learningTypes', 'whatLearned', 'practicalWork', 'difficulty', 'confidence', 'sessions', 'notes', 'plannedStartTime', 'actualStartTime'];
  const csvRows = [headers.join(',')];

  state.records.forEach((record) => {
    const row = headers.map((header) => {
      const value = record[header];
      const normalized = Array.isArray(value) ? value.join('; ') : value ?? '';
      return `"${String(normalized).replace(/"/g, '""')}"`;
    });
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, 'ai-learning-dashboard.csv');
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importDataFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || '');
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (!parsed.records) throw new Error('Import file does not contain records.');
        state.records = parsed.records;
        if (parsed.settings) state.settings = { ...state.settings, ...parsed.settings };
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        state.records = parseCsvRecords(text);
      }
      saveState();
      render();
    } catch (error) {
      alert('Import failed. Please choose a valid JSON or CSV export.');
      console.error(error);
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function parseCsvRecords(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines.shift().split(',').map((item) => item.replace(/"/g, '').trim());

  return lines.map((line) => {
    const values = line.match(/(?:"[^"]*"|[^,]*)/g) || [];
    const row = values.map((value) => value.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index] ?? '';
    });
    return {
      id: crypto.randomUUID(),
      date: item.date || new Date().toISOString().slice(0, 10),
      goalMinutes: Number(item.goalMinutes) || 0,
      actualMinutes: Number(item.actualMinutes) || 0,
      practicalMinutes: Number(item.practicalMinutes) || 0,
      topics: String(item.topics || '').split(';').map((entry) => entry.trim()).filter(Boolean),
      mainTopic: String(item.mainTopic || '').trim(),
      learningTypes: String(item.learningTypes || '').split(';').map((entry) => entry.trim()).filter(Boolean),
      whatLearned: String(item.whatLearned || '').trim(),
      practicalWork: String(item.practicalWork || '').trim(),
      difficulty: Number(item.difficulty) || 5,
      confidence: Number(item.confidence) || 5,
      sessions: Number(item.sessions) || 1,
      notes: String(item.notes || '').trim(),
      plannedStartTime: String(item.plannedStartTime || '').trim(),
      actualStartTime: String(item.actualStartTime || '').trim(),
      createdAt: new Date().toISOString()
    };
  });
}

function resetData() {
  if (!window.confirm('Clear all learning data from local storage? This cannot be undone.')) return;
  state.records = [];
  state.settings = { dailyGoalMinutes: DEFAULT_GOAL_MINUTES, overallGoalHours: DEFAULT_TARGET_HOURS, thresholds: { achieved: 100, partial: 75 } };
  saveState();
  render();
}

window.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') closeModal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !els.modal.classList.contains('hidden')) {
    closeModal();
  }
});

window.addEventListener('beforeunload', saveState);
