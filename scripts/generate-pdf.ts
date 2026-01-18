import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, '../public/pdf');
const BASE_URL = 'http://localhost:4321';

async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Server responded with error');
    return true;
  } catch (error) {
    return false;
  }
}

async function generatePDFs() {
  const isServerRunning = await checkServer();
  
  if (!isServerRunning) {
    console.error(`
❌ Error: Development server is not running at ${BASE_URL}
👉 Please run 'npm run preview' or 'npm run dev' in a separate terminal before generating PDFs.
    `);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🚀 Starting PDF generation...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  // Expanded language list
  const langs = ['en', 'es', 'fr', 'pt'];

  for (const lang of langs) {
    const url = `${BASE_URL}/${lang}/resume`;
    const outputPath = path.join(OUTPUT_DIR, `angela-parra-resume-${lang}.pdf`);

    console.log(`📄 Generating PDF for [${lang.toUpperCase()}] from ${url}...`);

    try {
      const response = await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 60000 // 60 seconds timeout
      });
      
      if (!response || !response.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
      }

      // Styles are now handled via CSS @media print in global.css
      // We only strictly ensure print background is enabled

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        // Margins are handled by CSS @page, but we set small defaults here just in case
        margin: { top: '0', right: '0', bottom: '0', left: '0' }, 
        preferCSSPageSize: true // Respect @page CSS rules
      });

      const stats = fs.statSync(outputPath);
      const sizeInKb = (stats.size / 1024).toFixed(2);

      if (stats.size < 1000) {
        console.warn(`⚠️ Warning: Generated PDF for [${lang.toUpperCase()}] is suspiciously small (${sizeInKb} KB). Check for errors.`);
      } else {
        console.log(`✅ Saved: ${path.relative(process.cwd(), outputPath)} (${sizeInKb} KB)`);
      }
    } catch (error) {
      console.error(`❌ Failed to generate PDF for [${lang.toUpperCase()}]:`, error);
    }
  }

  await browser.close();
  console.log('✨ PDF generation complete!');
}

generatePDFs();