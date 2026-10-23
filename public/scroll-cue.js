document.querySelectorAll('.intro-scroll-cue').forEach(cue => {
  cue.addEventListener('click', () => {
    const intro = cue.closest('.intro');
    const nextSection = intro && intro.nextElementSibling;
    nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
