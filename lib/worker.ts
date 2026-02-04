export interface GeneratedFile {
    name: string;
    type: 'file' | 'folder';
    path: string;
    content?: string;
    children?: GeneratedFile[];
}

export async function generateShopifyTheme(prompt: string): Promise<GeneratedFile[]> {
    // In a real implementation, this would call OpenAI/Gemini
    // For now, we return a structured mock based on the prompt keywords

    const isDark = prompt.toLowerCase().includes('siyah') || prompt.toLowerCase().includes('dark') || prompt.toLowerCase().includes('karanlık');

    const themeLiquid = `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="canonical" href="{{ canonical_url }}">
    <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
    <title>{{ page_title }}</title>
    {{ content_for_header }}
    {{ 'theme.css' | asset_url | stylesheet_tag }}
  </head>
  <body>
    {% section "header" %}
    <main role="main" id="MainContent">
      {{ content_for_layout }}
    </main>
    {% section "footer" %}
    {{ 'theme.js' | asset_url | script_tag }}
  </body>
</html>`;

    const headerLiquid = `<header class="site-header" style="background: ${isDark ? '#000' : '#fff'}; color: ${isDark ? '#fff' : '#000'}">
  <div class="page-width">
    <div class="header-wrapper">
      <h1 class="site-header__logo">{{ shop.name }}</h1>
      <nav class="site-navigation">
        {% for link in linklists.main-menu.links %}
          <a href="{{ link.url }}">{{ link.title }}</a>
        {% endfor %}
      </nav>
    </div>
  </div>
</header>

{% schema %}
  {
    "name": "Header",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "Logo"
      }
    ]
  }
{% endschema %}`;

    const themeCss = `:root {
  --font-body: 'Helvetica Neue', sans-serif;
  --font-heading: 'Helvetica Neue', sans-serif;
  --color-bg: ${isDark ? '#000000' : '#ffffff'};
  --color-text: ${isDark ? '#ffffff' : '#000000'};
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
}`;

    return [
        {
            name: 'layout',
            type: 'folder',
            path: '/layout',
            children: [
                { name: 'theme.liquid', type: 'file', path: '/layout/theme.liquid', content: themeLiquid }
            ]
        },
        {
            name: 'sections',
            type: 'folder',
            path: '/sections',
            children: [
                { name: 'header.liquid', type: 'file', path: '/sections/header.liquid', content: headerLiquid },
                { name: 'footer.liquid', type: 'file', path: '/sections/footer.liquid', content: '<footer class="site-footer">\n  <p>&copy; {{ "now" | date: "%Y" }} {{ shop.name }}</p>\n</footer>' },
                { name: 'hero.liquid', type: 'file', path: '/sections/hero.liquid', content: '<div class="hero-section">\n  <h2>{{ section.settings.heading }}</h2>\n</div>' }
            ]
        },
        {
            name: 'templates',
            type: 'folder',
            path: '/templates',
            children: [
                { name: 'index.json', type: 'file', path: '/templates/index.json', content: '{\n  "sections": {\n    "main": {\n      "type": "hero"\n    }\n  },\n  "order": ["main"]\n}' },
                { name: 'product.json', type: 'file', path: '/templates/product.json', content: '{}' },
                { name: 'collection.json', type: 'file', path: '/templates/collection.json', content: '{}' }
            ]
        },
        {
            name: 'assets',
            type: 'folder',
            path: '/assets',
            children: [
                { name: 'theme.css', type: 'file', path: '/assets/theme.css', content: themeCss },
                { name: 'theme.js', type: 'file', path: '/assets/theme.js', content: 'console.log("Theme loaded");' }
            ]
        },
        {
            name: 'config',
            type: 'folder',
            path: '/config',
            children: [
                { name: 'settings_schema.json', type: 'file', path: '/config/settings_schema.json', content: '[]' }
            ]
        }
    ];
}
