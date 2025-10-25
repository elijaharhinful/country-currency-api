import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

export class ImageService {
  private cacheDir = path.join(__dirname, '../../cache');
  private imagePath = path.join(this.cacheDir, 'summary.png');

  constructor() {
    try {
      const fontPaths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/nix/store/*/share/fonts/truetype/DejaVuSans.ttf',
        '/usr/share/fonts/TTF/DejaVuSans.ttf'
      ];
      
      // Try each path
      for (const fontPath of fontPaths) {
        if (fs.existsSync(fontPath)) {
          registerFont(fontPath, { family: 'DejaVu Sans' });
          break;
        }
      }
    } catch (error) {
      console.warn('Could not register fonts, using defaults');
    }
  }

  async generateSummaryImage(data: ImageData): Promise<void> {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Use fallback font
    ctx.fillStyle = '#eee';
    ctx.font = 'bold 32px "DejaVu Sans", Arial, sans-serif';
    ctx.fillText('Country Data Summary', 50, 60);

    ctx.font = '24px "DejaVu Sans", Arial, sans-serif';
    ctx.fillText(`Total Countries: ${data.totalCountries}`, 50, 120);

    ctx.font = 'bold 28px "DejaVu Sans", Arial, sans-serif';
    ctx.fillStyle = '#16c784';
    ctx.fillText('Top 5 Countries by GDP', 50, 180);

    ctx.font = '20px "DejaVu Sans", Arial, sans-serif';
    ctx.fillStyle = '#eee';
    data.topCountries.forEach((country, index) => {
      const gdp = country.estimated_gdp.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      ctx.fillText(
        `${index + 1}. ${country.name}: ${gdp}`,
        50,
        230 + index * 40
      );
    });

    ctx.font = '18px "DejaVu Sans", Arial, sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(`Last Updated: ${data.timestamp}`, 50, 520);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(this.imagePath, buffer);
  }

  getImagePath(): string {
    return this.imagePath;
  }

  imageExists(): boolean {
    return fs.existsSync(this.imagePath);
  }
}

interface ImageData {
  totalCountries: number;
  topCountries: Array<{ name: string; estimated_gdp: number }>;
  timestamp: string;
}