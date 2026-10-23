const services = {
  compose: { kicker: 'CHAPTER 01 · CONTAINERS', title: 'Repeatable containers beat heroic setup sessions.', body: 'Docker Compose gave each part of the platform a clear home. Monitoring and application services can be started, inspected, stopped, and rebuilt from files instead of from memory.', lesson: 'A service becomes easier to operate when its setup is legible and repeatable.', points: ['Separate Compose project for each service group', 'Named volumes for persistent application data', 'Health checks and restart behavior', 'Local-only bindings for private services', 'Compose configuration validated before startup'], gallery: 'images/services/docker-compose/' },
  prometheus: { kicker: 'CHAPTER 02 · METRICS', title: 'The server needed a way to tell the truth.', body: 'Prometheus collects measurements from the host, UPS, and Flashpoint. Queries turn raw counters and gauges into signals for availability, power, storage, and application behavior.', lesson: 'Metrics are useful when they answer an operating question.', points: ['Node Exporter for host metrics', 'NUT exporter for UPS state and battery data', 'Flashpoint health and application metrics', 'Labels that identify service and job roles', 'Queries used for dashboards and alert conditions'], gallery: 'images/services/prometheus/' },
  grafana: { kicker: 'CHAPTER 03 · DASHBOARDS', title: 'A dashboard is a map of the things worth watching.', body: 'Grafana brings the measurements together in readable panels. The dashboards show whether the service is available, how requests behave, how much inventory remains, and whether the server has enough power and storage headroom.', lesson: 'Observability is a design choice, not decoration added after an incident.', points: ['Host, UPS, and Flashpoint dashboards', 'Availability, request rate, outcomes, and latency panels', 'Battery, runtime, load, and power panels', 'Thresholds for conditions that need attention', 'Discord notifications for actionable alerts'], gallery: 'images/services/grafana/' },
  flashpoint: { kicker: 'CHAPTER 04 · WORKLOAD', title: 'The platform needed something real to carry.', body: 'Flashpoint is a small Java service with inventory, idempotent orders, rate limiting, Prometheus metrics, Docker packaging, and load tests. It gives the infrastructure a measurable workload and gives later scaling experiments a starting point.', lesson: 'A system is easier to understand when it has a real workload and visible failure modes.', points: ['Java 21 HTTP service', 'Thread-safe inventory and idempotent orders', 'Rate limiting and bounded in-flight work', 'Prometheus metrics for requests and latency', 'Load tests for contention and sold-out behavior', 'Private deployment through Docker Compose'], gallery: 'images/services/flashpoint/' },
};

const serviceKeys = Object.keys(services);
const dialog = document.querySelector('#service-dialog');
const copy = document.querySelector('#service-dialog .story-dialog-copy');
const slides = document.querySelector('#service-slides');
const points = document.querySelector('#service-points');
const cue = document.querySelector('#service-scroll-cue');
const track = document.querySelector('#service-scroll-track');
const thumb = document.querySelector('#service-scroll-thumb');
let currentKey = '';
let currentImages = [];
let currentImage = 0;

function updateScrollCue() {
  const overflow = copy.scrollHeight > copy.clientHeight + 4;
  const bottom = copy.scrollTop + copy.clientHeight >= copy.scrollHeight - 8;
  const trackHeight = track.clientHeight;
  const thumbHeight = overflow ? Math.max((copy.clientHeight / copy.scrollHeight) * trackHeight, 24) : trackHeight;
  const travel = Math.max(trackHeight - thumbHeight, 0);
  const progress = overflow ? copy.scrollTop / (copy.scrollHeight - copy.clientHeight) : 0;
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${progress * travel}px)`;
  track.hidden = !overflow;
  cue.hidden = !overflow || bottom;
  copy.classList.toggle('is-at-bottom', !overflow || bottom);
}

function renderImage() {
  slides.querySelectorAll('img').forEach((image, index) => { image.hidden = index !== currentImage; });
  document.querySelector('#service-slide-count').textContent = currentImages.length ? `${currentImage + 1} / ${currentImages.length}` : 'No images';
  document.querySelector('#service-slide-prev').disabled = currentImages.length < 2;
  document.querySelector('#service-slide-next').disabled = currentImages.length < 2;
}

function renderService(key) {
  const service = services[key];
  currentKey = key;
  document.querySelector('#service-kicker').textContent = service.kicker;
  document.querySelector('#service-title').textContent = service.title;
  document.querySelector('#service-body').textContent = service.body;
  points.replaceChildren(...service.points.map(point => { const item = document.createElement('li'); item.textContent = point; return item; }));
  document.querySelector('#service-lesson').textContent = service.lesson;
  const index = serviceKeys.indexOf(key);
  document.querySelector('#service-prev').disabled = index <= 0;
  document.querySelector('#service-next').disabled = index >= serviceKeys.length - 1;
  currentImages = (window.serviceImages && window.serviceImages[key]) || [];
  currentImage = 0;
  slides.innerHTML = currentImages.length ? currentImages.map((src, imageIndex) => `<img src="${src}" alt="" ${imageIndex ? 'hidden' : ''}>`).join('') : '';
  copy.scrollTop = 0;
  renderImage();
  requestAnimationFrame(updateScrollCue);
}

document.querySelectorAll('.story-tile[data-service]').forEach(tile => tile.addEventListener('click', () => { renderService(tile.dataset.service); dialog.showModal(); }));
document.querySelector('.service-dialog .dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#service-slide-prev').addEventListener('click', () => { currentImage = (currentImage - 1 + currentImages.length) % currentImages.length; renderImage(); });
document.querySelector('#service-slide-next').addEventListener('click', () => { currentImage = (currentImage + 1) % currentImages.length; renderImage(); });
document.querySelector('#service-prev').addEventListener('click', () => { const index = serviceKeys.indexOf(currentKey); if (index > 0) renderService(serviceKeys[index - 1]); });
document.querySelector('#service-next').addEventListener('click', () => { const index = serviceKeys.indexOf(currentKey); if (index < serviceKeys.length - 1) renderService(serviceKeys[index + 1]); });
cue.addEventListener('click', () => copy.scrollBy({ top: Math.max(copy.clientHeight * .72, 160), behavior: 'smooth' }));
copy.addEventListener('scroll', updateScrollCue);
window.addEventListener('resize', updateScrollCue);
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
