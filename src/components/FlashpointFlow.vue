<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { VueFlow, MarkerType, useVueFlow } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const scenarios = {
  accepted: {
    label: 'Normal order',
    description: 'A valid request passes the guardrails, reserves one unit, and emits measurements.',
    path: ['client', 'api', 'limiter', 'idempotency', 'order', 'inventory', 'metrics'],
  },
  retry: {
    label: 'Duplicate retry',
    description: 'The same idempotency key returns the original result instead of creating a second order.',
    path: ['client', 'api', 'limiter', 'idempotency', 'order'],
  },
  soldOut: {
    label: 'Sold out',
    description: 'The inventory check rejects the order without allowing the available count to go negative.',
    path: ['client', 'api', 'limiter', 'idempotency', 'order', 'inventory'],
  },
  metrics: {
    label: 'Observe it',
    description: 'The application publishes counters and latency measurements for Prometheus to scrape.',
    path: ['order', 'metrics', 'prometheus', 'grafana'],
  },
  storm: {
    label: 'Request storm',
    description: 'A burst of callers reaches the API together. The rate limiter admits only the configured budget and turns the excess into a controlled rejection.',
    path: ['client', 'api', 'limiter'],
    repeat: 4,
    delay: 220,
  },
};

const nodes = ref([
  { id: 'client', position: { x: 25, y: 170 }, data: { label: 'Client', kind: 'request' } },
  { id: 'api', position: { x: 220, y: 170 }, data: { label: 'HTTP API', kind: 'service' } },
  { id: 'limiter', position: { x: 420, y: 70 }, data: { label: 'Rate limiter', kind: 'guardrail' } },
  { id: 'idempotency', position: { x: 420, y: 270 }, data: { label: 'Idempotency', kind: 'guardrail' } },
  { id: 'order', position: { x: 645, y: 170 }, data: { label: 'Order service', kind: 'service' } },
  { id: 'inventory', position: { x: 870, y: 70 }, data: { label: 'Inventory', kind: 'state' } },
  { id: 'metrics', position: { x: 870, y: 270 }, data: { label: 'Metrics', kind: 'observe' } },
  { id: 'prometheus', position: { x: 1080, y: 270 }, data: { label: 'Prometheus', kind: 'observe' } },
  { id: 'grafana', position: { x: 1265, y: 270 }, data: { label: 'Grafana', kind: 'observe' } },
]);

const baseEdges = [
  ['client', 'api'], ['api', 'limiter'], ['api', 'idempotency'], ['limiter', 'order'],
  ['idempotency', 'order'], ['order', 'inventory'], ['order', 'metrics'],
  ['metrics', 'prometheus'], ['prometheus', 'grafana'],
];

const selectedScenario = ref('accepted');
const activeNode = ref('');
const running = ref(false);
const showDiagram = ref(false);
let runToken = 0;
const { fitView } = useVueFlow();

watch(showDiagram, async (visible) => {
  if (!visible) return;
  await nextTick();
  requestAnimationFrame(() => fitView({ padding: 0.18, duration: 250 }));
});

const edges = computed(() => baseEdges.map(([source, target], index) => ({
  id: `${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  animated: running.value && activeNode.value === source
    && !(selectedScenario.value === 'storm' && source === 'limiter'),
  markerEnd: MarkerType.ArrowClosed,
  style: {
    stroke: selectedScenario.value === 'storm' && (source === 'api' || target === 'limiter')
      ? '#f1c866'
      : activeNode.value === source || activeNode.value === target ? '#71dec0' : '#43536a',
    strokeWidth: 2,
  },
  label: index === 0 ? 'request' : undefined,
})));

const activeDescription = computed(() => scenarios[selectedScenario.value].description);

function selectScenario(name) {
  selectedScenario.value = name;
  activeNode.value = '';
  runToken += 1;
  running.value = false;
}

async function runScenario() {
  const token = ++runToken;
  running.value = true;
  activeNode.value = '';
  const scenario = scenarios[selectedScenario.value];
  const passes = scenario.repeat ?? 1;
  const delay = scenario.delay ?? 550;
  for (let pass = 0; pass < passes; pass += 1) {
    for (const node of scenario.path) {
      if (token !== runToken) return;
      activeNode.value = node;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  if (token === runToken) running.value = false;
}
</script>

<template>
  <button class="text-link diagram-open" type="button" @click="showDiagram = true">Open architecture map <span aria-hidden="true">↗</span></button>
  <div v-if="showDiagram" class="diagram-overlay" role="presentation" @click.self="showDiagram = false" @keydown.esc="showDiagram = false">
    <section class="flashpoint-diagram diagram-modal" role="dialog" aria-modal="true" aria-labelledby="flashpoint-map-title">
      <button class="diagram-close" type="button" aria-label="Close architecture map" @click="showDiagram = false">×</button>
      <div class="diagram-toolbar">
        <div>
          <p class="diagram-kicker">INTERACTIVE SYSTEM MAP</p>
          <h3 id="flashpoint-map-title">Follow one request through Flashpoint.</h3>
          <p class="diagram-copy">Drag, pan, zoom, or run a scenario. This is a teaching model, not a connection to the private deployment.</p>
        </div>
        <div class="scenario-controls" role="group" aria-label="Flashpoint scenarios">
          <button v-for="(scenario, name) in scenarios" :key="name" type="button" :class="{ selected: selectedScenario === name }" @click="selectScenario(name)">{{ scenario.label }}</button>
          <button class="run-button" type="button" :disabled="running" @click="runScenario">{{ running ? 'Running…' : 'Run scenario' }}</button>
        </div>
      </div>
      <div class="diagram-canvas">
        <VueFlow v-model:nodes="nodes" :edges="edges" :fit-view-on-init="true" :min-zoom="0.45" :max-zoom="1.5" :nodes-draggable="true" :nodes-connectable="false" :pan-on-drag="true" :zoom-on-scroll="true" aria-label="Interactive Flashpoint architecture diagram" />
      </div>
      <div class="diagram-caption"><strong>{{ scenarios[selectedScenario].label }}:</strong> {{ activeDescription }} <span v-if="activeNode">Currently moving through <b>{{ nodes.find((node) => node.id === activeNode)?.data.label }}</b>.</span></div>
    </section>
  </div>
</template>

<style>
.diagram-open { margin: 0; border: 0; padding: 0; background: transparent; cursor: pointer; font: inherit; }
.diagram-overlay { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; padding: 1.5rem; background: #02060bcc; backdrop-filter: blur(10px); }
.flashpoint-diagram { width: min(88rem, 100%); border: 1px solid var(--line); border-radius: 1.25rem; overflow: hidden; background: #0b121b; box-shadow: 0 2rem 7rem #000b; }
.diagram-modal { position: relative; display: flex; max-height: calc(100vh - 3rem); flex-direction: column; }
.diagram-close { position: absolute; z-index: 2; top: .8rem; right: .8rem; width: 2.2rem; height: 2.2rem; border: 1px solid var(--line); border-radius: 50%; background: #101b27; color: var(--muted); cursor: pointer; font-size: 1.4rem; line-height: 1; }
.diagram-toolbar { display: flex; justify-content: space-between; gap: 1.5rem; padding: 1.5rem; border-bottom: 1px solid var(--line); }
.diagram-kicker { margin: 0 0 .4rem; color: var(--accent); font-size: .72rem; letter-spacing: .16em; font-weight: 700; }
.diagram-toolbar h3 { margin: 0; font-size: clamp(1.2rem, 2vw, 1.7rem); }
.diagram-copy { max-width: 36rem; margin: .5rem 0 0; color: var(--muted); }
.scenario-controls { display: flex; flex-wrap: wrap; justify-content: flex-end; align-content: center; gap: .5rem; max-width: 31rem; }
.scenario-controls button { border: 1px solid var(--line); border-radius: 999px; padding: .55rem .8rem; background: #101b27; color: var(--muted); cursor: pointer; font: inherit; font-size: .78rem; }
.scenario-controls button.selected { border-color: var(--accent); color: #06110f; background: var(--accent); }
.scenario-controls .run-button { border-color: #e8c86e; color: #ffe4a0; animation: scenario-pulse 1.8s ease-in-out infinite; }
.scenario-controls .run-button:disabled { cursor: wait; opacity: .65; animation: none; }
@keyframes scenario-pulse { 0%, 100% { box-shadow: 0 0 0 0 #e8c86e00; transform: translateY(0); } 50% { box-shadow: 0 0 0 .45rem #e8c86e2e, 0 0 1.6rem #e8c86e88; transform: translateY(-1px); } }
.diagram-canvas { height: 27rem; min-width: 0; background: radial-gradient(circle at 45% 45%, #122336, #080e15 72%); }
.diagram-canvas .vue-flow { width: 100%; height: 100%; }
.diagram-canvas .vue-flow { font-family: inherit; }
.diagram-canvas .vue-flow__node { border: 1px solid #38516a; border-radius: .8rem; background: #111d2a; color: #e8f0f6; padding: .85rem 1rem; box-shadow: 0 12px 30px #0005; font-size: .82rem; font-weight: 700; transition: border-color .2s, box-shadow .2s, transform .2s; }
.diagram-canvas .vue-flow__node:hover { border-color: var(--accent); box-shadow: 0 0 0 3px #71dec022, 0 12px 30px #0006; }
.diagram-canvas .vue-flow__edge-text { fill: var(--muted); font-size: .7rem; }
.diagram-canvas .vue-flow__controls { border: 1px solid var(--line); box-shadow: none; }
.diagram-canvas .vue-flow__controls-button { background: #101b27; color: var(--muted); border-color: var(--line); }
.diagram-caption { min-height: 3.5rem; padding: 1rem 1.5rem; color: var(--muted); border-top: 1px solid var(--line); font-size: .9rem; }
.diagram-caption strong, .diagram-caption b { color: var(--accent); }
@media (max-width: 800px) { .diagram-overlay { padding: .5rem; } .diagram-open { margin-top: 1rem; } .diagram-modal { max-height: calc(100vh - 1rem); } .diagram-toolbar { display: block; padding: 1rem 3.5rem 1rem 1rem; } .diagram-copy { display: none; } .scenario-controls { justify-content: flex-start; margin-top: 1rem; overflow-x: auto; flex-wrap: nowrap; max-width: none; padding-bottom: .2rem; } .scenario-controls button { flex: none; white-space: nowrap; font-size: .72rem; padding: .5rem .7rem; } .diagram-canvas { height: 29rem; min-height: 23rem; } .diagram-caption { padding: .8rem 1rem; font-size: .8rem; } }
@media (prefers-reduced-motion: reduce) { .scenario-controls .run-button { animation: none; } }
</style>
