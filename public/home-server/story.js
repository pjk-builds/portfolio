const stories = {
  origin: { kicker: 'CHAPTER 01 · THE PREMISE', title: 'Cloud hosting promised convenience. My wallet filed an objection.', body: 'I wanted a place to run experiments without turning every experiment into another monthly subscription. Building locally made the cost visible once, and made the learning unavoidable: hardware, Linux, networking, security, observability, and recovery all became part of the project.', lesson: 'A constraint can be a better curriculum than a tutorial.', gallery: 'images/story/origin/manifest.json' },
  hardware: { kicker: 'CHAPTER 02 · THE PARTS', title: 'The shopping list had to survive reality.', body: 'The parts were chosen to give the server enough headroom for services and experiments while keeping the machine understandable and serviceable.', lesson: 'Choose for the work you want to learn, not for an imaginary data center.', points: ['AMD Ryzen 9 9900X processor', '32 GB DDR5 memory: the original 64 GB plan was outside the budget after RAM prices increased', '2 TB NVMe SSD', 'ASUS ROG Strix X870-I platform', 'Compact case', 'CyberPower UPS', 'Enough headroom for services and experiments while keeping the machine understandable and serviceable'], gallery: 'images/story/hardware/manifest.json' },
  boot: { kicker: 'CHAPTER 03 · PLATFORM SETUP', title: 'The first boot was a negotiation.', body: 'A motherboard replacement, BIOS updates, TPM prompts, and Secure Boot made the first startup feel less like a welcome screen and more like an interview. I kept the platform security controls enabled and learned the recovery path before making changes.', lesson: 'Understand the escape hatch before pressing the tempting button.', points: ['Motherboard replacement after hardware issues', 'BIOS update and firmware recovery', 'Secure Boot retained', 'MOK enrollment for the custom kernel module'], gallery: 'images/story/boot/manifest.json' },
  linux: { kicker: 'CHAPTER 04 · OPERATING SYSTEM', title: 'Ubuntu made the machine useful.', body: 'I installed Ubuntu Server headlessly and adopted a CLI-first workflow. CPU, memory, disks, and the LVM layout were validated from the shell. The machine stopped being a collection of parts and became an operating system I could administer remotely.', lesson: 'A server is a habit of verification, not a monitor with a blinking cursor.', points: ['Headless Ubuntu Server', 'CLI-first administration over SSH', 'CPU and memory validation', 'EFI, boot, and LVM-backed root storage'], gallery: 'images/story/linux/manifest.json' },
  access: { kicker: 'CHAPTER 05 · PRIVATE ACCESS', title: 'Remote access should not mean public access.', body: 'SSH uses keys, root login is disabled, and password authentication is not the normal path. UFW limits administrative traffic, while Tailscale provides a private remote route without opening router ports. Public visitors can see the story; they cannot see the server address or its management surface.', lesson: 'Reduce the attack surface before adding convenience.', points: ['SSH key authentication', 'Root SSH login disabled', 'UFW administrative boundaries', 'Tailscale for private remote access', 'No router port forwarding'], gallery: 'images/story/access/manifest.json' },
  debugging: { kicker: 'CHAPTER 06 · DEBUGGING', title: 'The symptom was not the cause.', body: 'Bluetooth failures led to kernel and DKMS investigation. A “no route to host” message led through routes, ARP, firewall behavior, and independent devices before the actual cause turned out to be a local application permission on macOS. Logs and comparison beat guessing.', lesson: 'Test the boundary where the failure changes, not just the component you first suspect.', points: ['Bluetooth controller and DKMS investigation', 'Kernel and device logs before configuration changes', 'Route, ARP, firewall, and SSH comparisons', 'Independent devices and terminal applications'], gallery: 'images/story/debugging/manifest.json' },
  power: { kicker: 'CHAPTER 07 · POWER', title: 'A UPS is only useful if the shutdown path works.', body: 'Network UPS Tools reads the CyberPower unit over USB, exposes battery and power state, and schedules a controlled shutdown after a sustained outage. The test was deliberately boring: remove power, observe the state change, restore power, and verify the timer cancels.', lesson: 'A recovery plan is a feature only after it has been exercised.', points: ['CyberPower UPS connected over USB', 'Network UPS Tools server and monitor', 'Battery, runtime, load, and power-state metrics', 'Graceful shutdown timer tested by removing and restoring power'], gallery: 'images/story/power/manifest.json' },
  observability: { kicker: 'CHAPTER 08 · OBSERVABILITY', title: 'If I cannot see it, I cannot operate it.', body: 'Docker Compose runs Grafana, Prometheus, node-exporter, and a NUT exporter as a small monitoring stack. Dashboards show host and UPS health. Alerts cover service availability, UPS battery state, and low disk space, with Discord used as the notification channel.', lesson: 'Monitoring belongs beside the service, not on a future checklist.', points: ['Docker Compose service isolation', 'Prometheus host, UPS, and application metrics', 'Grafana dashboards', 'Discord notifications for actionable conditions'], gallery: 'images/story/observability/manifest.json' },
  storage: { kicker: 'CHAPTER 09 · RECOVERY', title: 'Backups are a restore test, not an archive file.', body: 'NVMe health checks cover temperature, wear, spare capacity, and error counters. The operating system uses LVM for future allocation. Configuration and monitoring data are bundled into encrypted archives on the private workstation, and the archive is tested by decrypting and extracting it.', lesson: 'The only backup that matters is one I can restore.', points: ['nvme-cli and smartmontools health checks', 'Temperature, wear, spare capacity, and error counters', 'LVM for future allocation', 'Encrypted archives with age', 'Decrypt-and-extract restore test'], gallery: 'images/story/storage/manifest.json' },
  flashpoint: { kicker: 'CHAPTER 10 · APPLICATION', title: 'The server needed a real workload.', body: 'Flashpoint is a small Java service built incrementally: health checks, inventory, idempotent orders, rate limiting, Prometheus metrics, Docker packaging, and load tests. It runs privately on the server and gives the monitoring stack something meaningful to observe.', lesson: 'Infrastructure becomes clearer when an application can fail in measurable ways.', points: ['Java 21 HTTP service', 'Health, inventory, and order APIs', 'Idempotency and thread-safe inventory', 'Rate limiting and in-flight request limits', 'Prometheus metrics and load testing', 'Docker packaging and private deployment'], gallery: 'images/story/flashpoint/manifest.json' },
  public: { kicker: 'CHAPTER 11 · PUBLIC STORY', title: 'Show the engineering, keep the keys private.', body: 'The portfolio separates the public narrative from the private operating details. Photos are full-size copies with opaque masks over unique identifiers and re-encoded without camera metadata. Public pages describe architecture and decisions without publishing addresses, usernames, serials, tokens, or internal URLs.', lesson: 'A useful demo explains how a system works without explaining how to enter it.', points: ['Model-level hardware details retained', 'Serials, PSIDs, barcodes, and device identifiers masked', 'Camera metadata removed from public image copies', 'No addresses, credentials, keys, tokens, or internal URLs'], gallery: 'images/story/public/manifest.json' },
  lessons: { kicker: 'CHAPTER 12 · LESSONS', title: 'The failures were the curriculum.', body: 'The most durable habits were simple: verify effective state instead of trusting a config file, read logs before changing settings, change one variable at a time, compare independent clients, and preserve security controls where possible. The platform grew one tested layer at a time.', lesson: 'Infrastructure is a series of small claims, each backed by a check.', points: ['Verify effective runtime state', 'Read logs before changing configuration', 'Change one variable at a time', 'Test from independent devices and applications', 'Preserve security controls where possible'], gallery: 'images/story/lessons/manifest.json' },
};

const dialog = document.querySelector('#story-dialog');
const slides = document.querySelector('#story-slides');
const storyPoints = document.querySelector('#story-points');
const storyCopy = document.querySelector('.story-dialog-copy');
const storyScrollCue = document.querySelector('#story-scroll-cue');
const storyScrollTrack = document.querySelector('#story-scroll-track');
const storyScrollThumb = document.querySelector('#story-scroll-thumb');
const storyKeys = Object.keys(stories);
let currentSlides = [];
let currentIndex = 0;
let currentStoryKey = '';
function updateScrollHint() {
  const hasOverflow = storyCopy.scrollHeight > storyCopy.clientHeight + 4;
  const atBottom = storyCopy.scrollTop + storyCopy.clientHeight >= storyCopy.scrollHeight - 8;
  const trackHeight = storyScrollTrack.clientHeight;
  const thumbHeight = hasOverflow ? Math.max((storyCopy.clientHeight / storyCopy.scrollHeight) * trackHeight, 24) : trackHeight;
  const travel = Math.max(trackHeight - thumbHeight, 0);
  const progress = hasOverflow ? storyCopy.scrollTop / (storyCopy.scrollHeight - storyCopy.clientHeight) : 0;
  storyScrollThumb.style.height = `${thumbHeight}px`;
  storyScrollThumb.style.transform = `translateY(${progress * travel}px)`;
  storyScrollTrack.hidden = !hasOverflow;
  storyScrollCue.hidden = !hasOverflow || atBottom;
  storyCopy.classList.toggle('is-at-bottom', !hasOverflow || atBottom);
}
function renderSlide() {
  slides.querySelectorAll('img').forEach((img, index) => img.hidden = index !== currentIndex);
  document.querySelector('#slide-count').textContent = currentSlides.length ? `${currentIndex + 1} / ${currentSlides.length}` : 'No images';
  document.querySelector('#slide-prev').disabled = currentSlides.length < 2;
  document.querySelector('#slide-next').disabled = currentSlides.length < 2;
}
async function openStory(key) {
  const story = stories[key];
  if (!story) return;
  currentStoryKey = key;
  document.querySelector('#story-kicker').textContent = story.kicker;
  document.querySelector('#story-title').textContent = story.title;
  document.querySelector('#story-body').textContent = story.body;
  storyPoints.replaceChildren(...(story.points || []).map(point => { const item = document.createElement('li'); item.textContent = point; return item; }));
  storyPoints.hidden = !(story.points && story.points.length);
  document.querySelector('#story-lesson').textContent = story.lesson;
  const chapterIndex = storyKeys.indexOf(key);
  const previousChapter = document.querySelector('#chapter-prev');
  const nextChapter = document.querySelector('#chapter-next');
  previousChapter.disabled = chapterIndex <= 0;
  nextChapter.disabled = chapterIndex === -1 || chapterIndex >= storyKeys.length - 1;
  previousChapter.setAttribute('aria-label', chapterIndex > 0 ? `Previous chapter: ${stories[storyKeys[chapterIndex - 1]].title}` : 'Previous chapter');
  nextChapter.setAttribute('aria-label', chapterIndex < storyKeys.length - 1 ? `Next chapter: ${stories[storyKeys[chapterIndex + 1]].title}` : 'Next chapter');
  currentIndex = 0;
  const localManifest = window.storyImages && window.storyImages[key];
  if (Array.isArray(localManifest) && localManifest.length) {
    currentSlides = localManifest.map(file => new URL(file, document.baseURI).href);
  } else if (window.location.protocol !== 'file:') {
    try {
      const manifestResponse = await fetch(story.gallery);
      const manifest = await manifestResponse.json();
      const galleryUrl = new URL(story.gallery, document.baseURI);
      currentSlides = manifest.map(file => new URL(file, galleryUrl).href);
    } catch (error) {
      currentSlides = [];
    }
  }
  if (!currentSlides.length) {
    const fallback = story.gallery.replace('manifest.json', '01.jpg');
    currentSlides = [new URL(fallback, document.baseURI).href];
  }
  if (!currentSlides.length) {
    slides.innerHTML = '<p class="slide-empty">Add a sanitized image to this topic manifest.</p>';
  } else {
    slides.innerHTML = currentSlides.map((src, index) => `<img src="${src}" alt="" ${index ? 'hidden' : ''}>`).join('');
  }
  renderSlide();
  storyCopy.scrollTop = 0;
  requestAnimationFrame(updateScrollHint);
  if (!dialog.open) dialog.showModal();
}
document.querySelectorAll('.story-tile').forEach(tile => tile.addEventListener('click', () => openStory(tile.dataset.story)));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('#slide-prev').addEventListener('click', () => { currentIndex = (currentIndex - 1 + currentSlides.length) % currentSlides.length; renderSlide(); });
document.querySelector('#slide-next').addEventListener('click', () => { currentIndex = (currentIndex + 1) % currentSlides.length; renderSlide(); });
document.querySelector('#chapter-prev').addEventListener('click', () => {
  const index = storyKeys.indexOf(currentStoryKey);
  if (index > 0) openStory(storyKeys[index - 1]);
});
document.querySelector('#chapter-next').addEventListener('click', () => {
  const index = storyKeys.indexOf(currentStoryKey);
  if (index >= 0 && index < storyKeys.length - 1) openStory(storyKeys[index + 1]);
});
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
storyCopy.addEventListener('scroll', updateScrollHint);
window.addEventListener('resize', updateScrollHint);
storyScrollCue.addEventListener('click', () => {
  storyCopy.scrollBy({ top: Math.max(storyCopy.clientHeight * .72, 160), behavior: 'smooth' });
});
