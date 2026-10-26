import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
const svg = await readFile('src/assets/architecture.svg');
await sharp(svg).png().toFile('src/assets/architecture.png');
await sharp(svg).resize(1200, 630, { fit: 'cover' }).png().toFile('public/images/social-card.png');
