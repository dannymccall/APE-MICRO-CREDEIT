const pages = [
    'http://localhost:3000/dashboard',
    'http://localhost:3000/add-loan',
    // 'http://localhost:3000/payments'
  ];
  
  async function preRender() {
    console.log('Pre-rendering static pages...');
    for (const page of pages) {
      try {
        const response = await fetch(page, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Failed to fetch ${page}: ${response.statusText}`);
        console.log(`✅ Pre-rendered: ${page}`);
      } catch (error:any) {
        console.error(`❌ Error pre-rendering ${page}:`, error.message);
      }
    }
  }
  
  preRender();
  