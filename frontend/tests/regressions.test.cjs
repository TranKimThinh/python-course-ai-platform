const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

function load(relative, overrides = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '../src', relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = fs.readFileSync(filename, 'utf8').replace(/import\.meta\.env/g, '({})');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const module = { exports: {} };
  cache.set(filename, module);
  const localRequire = id => {
    if (id in overrides) return overrides[id];
    if (!id.startsWith('.')) return require(id);
    let target = path.resolve(path.dirname(filename), id);
    target += fs.existsSync(target + '.ts') ? '.ts' : '.tsx';
    return load(path.relative(path.resolve(__dirname, '../src'), target), overrides, cache);
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports);
  return module.exports;
}

test('API preserves explicit credentials over a stale stored token and accepts 204', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  localStorage.setItem('accessToken', 'old-token');
  const { apiFetch } = load('config/api.ts');
  global.fetch = async (_url, options) => {
    assert.equal(options.headers.get('Authorization'), 'Bearer new-token');
    return new Response(null, { status: 204 });
  };
  assert.equal(await apiFetch('/users/me', { headers: { Authorization: 'Bearer new-token' } }), undefined);
});

test('API and chat use the current tab session when remember me is off', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  localStorage.setItem('accessToken', 'old-token');
  sessionStorage.setItem('accessToken', 'tab-token');
  const { getStoredToken } = load('config/api.ts');
  assert.equal(getStoredToken(), 'tab-token');
  global.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer tab-token');
    return Response.json({ data: [] });
  };
  assert.deepEqual(await load('services/chat.service.ts').getChatSessions(), []);
});

test('admin course mapping preserves description, paid price, and unknown values', () => {
  const { mapAdminCourseListItem } = load('services/course.service.ts');
  const paid = mapAdminCourseListItem({ id: 7, description: 'Original', price: 250000 });
  assert.equal(paid.description, 'Original');
  assert.equal(paid.price, '250000');
  assert.equal(mapAdminCourseListItem({ id: 8 }).price, undefined);
  assert.equal(mapAdminCourseListItem({ id: 8 }).description, undefined);
  assert.equal(mapAdminCourseListItem({ id: 9, price: 0 }).price, '0');
});

test('dashboard surfaces failures instead of fabricating zero stats', async () => {
  const dashboard = load('services/dashboard.service.ts', { '../config/api': { apiFetch: async () => { throw new Error('Offline'); } } });
  await assert.rejects(dashboard.getAdminDashboard(), /Offline/);
  const invalid = load('services/dashboard.service.ts', { '../config/api': { apiFetch: async () => ({ data: null }) } });
  await assert.rejects(invalid.getAdminDashboard(), /dashboard/);
});

test('chat forwards cancellation and accumulates UTF-8 stream chunks', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  const controller = new AbortController();
  const encoded = new TextEncoder().encode('Tiếng Việt');
  global.fetch = async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.signal.aborted, false);
    assert.deepEqual(JSON.parse(options.body), { message: 'Question', lesson_id: 3, session_id: 4 });
    return new Response(new ReadableStream({ start(c) { c.enqueue(encoded.slice(0, 3)); c.enqueue(encoded.slice(3)); c.close(); } }), { headers: { 'X-Session-Id': '4' } });
  };
  const chunks = [];
  let session;
  await load('services/chat.service.ts').askAI({ question: 'Question', lessonId: 3, sessionId: 4, signal: controller.signal, onChunk: value => chunks.push(value), onSessionIdReceived: value => { session = value; } });
  assert.equal(chunks.at(-1), 'Tiếng Việt');
  assert.equal(session, 4);
});

test('protected routes show loading instead of redirecting during session restore', () => {
  const mocks = { '../context/AuthContext': { useAuth: () => ({ isLoading: true, isAuthenticated: false }) }, 'react-router-dom': { useLocation: () => ({ pathname: '/profile' }) } };
  assert.equal(load('routes/ProtectedRoute.tsx', mocks).default().props.role, 'status');
  assert.equal(load('routes/AdminProtectedRoute.tsx', mocks).default().props.role, 'status');
});

test('chat timeout aborts a stalled connection and reports a useful error', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  let cancelled = false;
  global.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => { cancelled = true; reject(new DOMException('Aborted', 'AbortError')); });
  });
  await assert.rejects(load('services/chat.service.ts').askAI({ question: 'Test', sessionId: null, timeoutMs: 5, onChunk() {}, onSessionIdReceived() {} }), /phản hồi quá lâu/);
  assert.equal(cancelled, true);
});

test('chat preserves caller cancellation without treating it as a timeout', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  const controller = new AbortController();
  global.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  });
  const pending = load('services/chat.service.ts').askAI({ question: 'Test', sessionId: null, signal: controller.signal, onChunk() {}, onSessionIdReceived() {} });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
});

test('lesson summary uses the resources API supported by the backend', async () => {
  const resources = { data: { summary: { summaryText: 'Summary', keyPoints: ['Key point'] } } };
  const service = load('services/lesson.service.ts', { '../config/api': { apiFetch: async path => {
    assert.equal(path, '/lessons/12/resources');
    return resources;
  } } });
  assert.deepEqual(await service.getLessonSummary('12'), resources);
});

test('quiz service reads per-lesson metadata and sends choices for server grading', async () => {
  const calls = [];
  const service = load('services/quiz.service.ts', { '../config/api': { apiFetch: async (path, options) => {
    calls.push({ path, options });
    return { data: path.includes('/lessons/') ? null : { id: 12 } };
  } } });
  assert.equal(await service.getLessonQuiz('4'), null);
  await service.startQuiz(7);
  await service.submitQuiz(7, 'signed-attempt', { 42: 99 });
  assert.deepEqual(calls.map(c => c.path), ['/lessons/4/quiz', '/quizzes/7/start', '/quizzes/7/submit']);
  assert.equal(calls[1].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[2].options.body), { attemptToken: 'signed-attempt', answers: [{ questionId: 42, optionId: 99 }] });
});

test('quiz draft save and publish are distinct admin actions', async () => {
  const calls = [];
  const service = load('services/quiz.service.ts', { '../config/api': { apiFetch: async (path, options) => { calls.push({ path, options }); return { data: { id: 7 } }; } } });
  const draft = { title: 'Quiz', durationSeconds: 600, questions: [] };
  await service.saveQuizDraft('4', draft);
  await service.saveQuizDraft('4', draft, 7);
  await service.publishQuiz(7);
  assert.deepEqual(calls.map(c => [c.path, c.options.method]), [
    ['/admin/lessons/4/quiz', 'POST'], ['/admin/quizzes/7', 'PUT'], ['/admin/quizzes/7/publish', 'POST'],
  ]);
});

test('published quiz is clearly read-only rather than presented as pending', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { QuizSaveStatus } = load('pages/admin/QuizManagementPage.tsx', {
    '../../components/admin/AdminLayout': { default: () => null },
    '../../services/adminLesson.service': {},
    '../../services/quiz.service': {},
    'react-router-dom': { Link: 'a' },
  });
  const render = props => renderToStaticMarkup(React.createElement(QuizSaveStatus, { published: false, busy: false, message: '', error: '', ...props }));
  const published = render({ published: true });
  assert.match(published, /Đã công khai/);
  assert.match(published, /chế độ chỉ xem/);
  assert.doesNotMatch(published, /vui lòng chờ/);
  assert.match(render({ busy: true }), /vui lòng chờ/);
  assert.match(render({ message: 'Đã lưu bản nháp.' }), /Đã lưu bản nháp/);
  assert.match(render({ error: 'Không thể lưu' }), /role="alert"/);
});

test('validation failures display field details for quiz editors', async () => {
  global.localStorage = storage(); global.sessionStorage = storage();
  global.fetch = async () => Response.json({ detail: [{ loc: ['body', 'questions', 0, 'explanation'], msg: 'Field required' }] }, { status: 422 });
  await assert.rejects(load('config/api.ts').apiFetch('/admin/quizzes/1'), /questions.0.explanation: Field required/);
});

test('video rerenders do not flush progress repeatedly; unmount still saves once', async () => {
  const slots = [];
  let cursor = 0;
  let pending = [];
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const hooks = {
    useRef(value) { const i = cursor++; return slots[i] ??= { current: value }; },
    useMemo(factory, deps) {
      const i = cursor++;
      if (!same(slots[i]?.deps, deps)) slots[i] = { deps, value: factory() };
      return slots[i].value;
    },
    useCallback(callback, deps) { return hooks.useMemo(() => callback, deps); },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!same(slots[i]?.deps, deps)) {
        const previous = slots[i];
        slots[i] = { deps, cleanup: previous?.cleanup };
        pending.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
      }
    },
  };
  global.window = { addEventListener() {}, removeEventListener() {} };
  global.document = { addEventListener() {}, removeEventListener() {} };
  let saves = 0;
  const progress = { lessonId: 1, lastPositionSeconds: 10, durationSeconds: 60, isCompleted: false };
  const Component = load('components/learning/VideoPlayerSection.tsx', {
    react: hooks,
    '../../services/progress.service': { updateLessonProgress: async () => { saves++; return progress; } },
    '../../stores/progressSyncStore': { registerProgressFlush: () => () => {} },
    '../../utils/video': { isYouTubeUrl: () => false, isDirectVideoUrl: () => true },
  }).default;
  const props = { videoUrl: '/video.mp4', embedUrl: null, provider: 'media', title: 'Lesson', courseId: 'course', lessonId: '1', durationSeconds: 60, lessonProgress: progress, onEnded() {} };
  const render = () => {
    cursor = 0; pending = [];
    Component({ ...props, onProgressChange() {} });
    pending.forEach(effect => effect());
  };
  render();
  slots[0].current = { currentTime: 10, duration: 60, load() {} };
  render();
  await new Promise(resolve => setImmediate(resolve));
  render();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(saves, 0, 'a new parent callback must not trigger effect cleanup and a PUT');
  slots.forEach(slot => slot?.cleanup?.());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(saves, 1, 'leaving the page must still flush the current position');
});
