from pathlib import Path
import json

root = Path(__file__).resolve().parents[1] / 'public/home-server/images/story'
output = root.parent.parent / 'story-images.js'
entries = {}

for topic in sorted(path for path in root.iterdir() if path.is_dir()):
    images = sorted(
        path.name for path in topic.iterdir()
        if path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}
    )
    (topic / 'manifest.json').write_text(json.dumps(images, indent=2) + '\n')
    entries[topic.name] = [f'images/story/{topic.name}/{image}' for image in images]

output.write_text('window.storyImages = ' + json.dumps(entries, indent=2) + ';\n')
for topic, images in entries.items():
    print(f'{topic}: {len(images)} image(s)')
