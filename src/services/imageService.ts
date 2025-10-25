import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import path from "path";

interface ImageData {
  totalCountries: number;
  topCountries: Array<{ name: string; estimated_gdp: number }>;
  timestamp: string;
}

export class ImageService {
  private cacheDir = path.join(__dirname, "../../cache");
  private imagePath = path.join(this.cacheDir, "summary.png");
  
  constructor() {
    const fontsDir = path.join(process.cwd(), "/assets/fonts");
    
    try {
      registerFont(path.join(fontsDir, "DejaVuSans.ttf"), { 
        family: "DejaVu Sans" 
      });
      registerFont(path.join(fontsDir, "DejaVuSans-Bold.ttf"), { 
        family: "DejaVu Sans", 
        weight: "bold" 
      });
      console.log("Fonts registered successfully");
    } catch (error) {
      console.error("Font registration failed:", error);
    }
  }

  async generateSummaryImage(data: ImageData): Promise<void> {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#eee";
    ctx.font = "bold 32px 'DejaVu Sans'";
    ctx.fillText("Country Data Summary", 50, 60);

    // Total countries
    ctx.font = "24px 'DejaVu Sans'";
    ctx.fillText(`Total Countries: ${data.totalCountries}`, 50, 120);

    // Top 5 countries
    ctx.font = "bold 28px 'DejaVu Sans'";
    ctx.fillStyle = "#16c784";
    ctx.fillText("Top 5 Countries by GDP", 50, 180);

    ctx.font = "20px 'DejaVu Sans'";
    ctx.fillStyle = "#eee";
    data.topCountries.forEach((country, index) => {
      const gdp = country.estimated_gdp.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      ctx.fillText(
        `${index + 1}. ${country.name}: ${gdp}`,
        50,
        230 + index * 40
      );
    });

    // Timestamp
    ctx.font = "18px 'DejaVu Sans'";
    ctx.fillStyle = "#888";
    ctx.fillText(`Last Updated: ${data.timestamp}`, 50, 520);

    // Save image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(this.imagePath, buffer);
  }

  getImagePath(): string {
    return this.imagePath;
  }

  imageExists(): boolean {
    return fs.existsSync(this.imagePath);
  }
}