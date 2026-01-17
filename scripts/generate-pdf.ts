
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../public/pdf');
const BASE_URL = 'http://localhost:4321'; // Assumes dev server is running

async function generatePDFs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const langs = ['en', 'es'];

  for (const lang of langs) {
    const url = `${BASE_URL}/${lang}/resume`;
    const outputPath = path.join(OUTPUT_DIR, `angela-parra-resume-${lang}.pdf`);

    console.log(`Generating PDF for ${lang} from ${url}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      // Inject some print-specific CSS adjustments if needed
      await page.addStyleTag({
        content: `
          @page { size: A4; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; }
          nav, footer, .no-print { display: none !important; }
          a[href]:after { content: none !important; }
        `
      });

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
      });

      console.log(`✅ Saved to ${outputPath}`);
    } catch (error) {
      console.error(`❌ Failed to generate PDF for ${lang}:`, error);
    }
  }

  await browser.close();
}

generatePDFs();
