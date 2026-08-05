const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

const directories = [
  'assets',
  'components',
  'components/Common',
  'pages',
  'layouts',
  'routes',
  'hooks',
  'context',
  'services',
  'utils',
  'constants',
  'data',
];

const commonComponents = [
  'Button', 'Input', 'Loader', 'Modal', 'Container', 'Accordion', 
  'Tabs', 'Pagination', 'Tooltip', 'Card', 'Drawer', 'Dialog', 
  'Table', 'Avatar', 'Badge', 'Chip', 'Toast', 'Spinner', 
  'Skeleton', 'EmptyState', 'Error', 'SearchBar'
];

const pages = [
  'Home', 'About', 'Services', 'Tracking', 'Quote', 
  'Contact', 'Dashboard', 'Login', 'Register', 'NotFound'
];

const pageSubFolders = [
  'components', 'hooks', 'services', 'utils', 'styles', 'data'
];

const homeSections = [
  'Navbar', 'Hero', 'Statistics', 'About', 'Services', 
  'WhyChooseUs', 'Features', 'WorkingProcess', 
  'ShipmentTracking', 'Quote', 'ClientLogo', 
  'Testimonials', 'FAQ', 'Contact', 'Footer', 'FloatingButtons'
];

const homeHeroFiles = [
  'Hero.jsx', 'HeroContent.jsx', 'HeroImage.jsx', 'HeroButtons.jsx', 'HeroStats.jsx', 'Hero.css', 'index.js'
];

const homeServicesFiles = [
  'Services.jsx', 'ServiceCard.jsx', 'ServiceItem.jsx', 'ServiceIcon.jsx', 'ServiceButton.jsx', 'Services.css', 'index.js'
];

const homeNavbarFiles = [
  'Navbar.jsx', 'DesktopMenu.jsx', 'MobileMenu.jsx', 'NavLogo.jsx', 'NavLinks.jsx', 'NavButton.jsx', 'Navbar.css', 'index.js'
];

const homeTestimonialsFiles = [
  'Testimonials.jsx', 'TestimonialCard.jsx', 'Rating.jsx', 'CustomerImage.jsx', 'Testimonials.css', 'index.js'
];

const homeContactFiles = [
  'Contact.jsx', 'ContactForm.jsx', 'OfficeInfo.jsx', 'GoogleMap.jsx', 'SocialLinks.jsx', 'Contact.css', 'index.js'
];

const homeFooterFiles = [
  'Footer.jsx', 'FooterLinks.jsx', 'FooterBottom.jsx', 'FooterSocial.jsx', 'Footer.css', 'index.js'
];

const layouts = [
  'MainLayout', 'DashboardLayout', 'AuthLayout'
];

// Helper to create directory if not exists
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper to write file if not exists
function writeFileSync(filePath, content = '') {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
}

function generateComponentFiles(dir, name) {
  writeFileSync(path.join(dir, `${name}.jsx`), `import './${name}.css';\n\nconst ${name} = () => {\n  return (\n    <div className="${name.toLowerCase()}">\n      ${name} Component\n    </div>\n  );\n};\n\nexport default ${name};\n`);
  writeFileSync(path.join(dir, `${name}.css`), `.${name.toLowerCase()} {\n  /* ${name} styles */\n}\n`);
  writeFileSync(path.join(dir, 'index.js'), `export { default } from './${name}';\n`);
}

// 1. Create root directories
directories.forEach(dir => ensureDirSync(path.join(srcPath, dir)));

// 2. Create Common components
commonComponents.forEach(comp => {
  const compDir = path.join(srcPath, 'components', 'Common', comp);
  ensureDirSync(compDir);
  generateComponentFiles(compDir, comp);
});

// 3. Create layouts
layouts.forEach(layout => {
  const layoutDir = path.join(srcPath, 'layouts', layout);
  ensureDirSync(layoutDir);
  generateComponentFiles(layoutDir, layout);
});

// 4. Create Pages
pages.forEach(page => {
  const pageDir = path.join(srcPath, 'pages', page);
  ensureDirSync(pageDir);
  
  pageSubFolders.forEach(sub => ensureDirSync(path.join(pageDir, sub)));
  
  generateComponentFiles(pageDir, page);

  // Home specific sections
  if (page === 'Home') {
    homeSections.forEach(section => {
      const sectionDir = path.join(pageDir, 'components', section);
      ensureDirSync(sectionDir);
      
      let files = [];
      if (section === 'Hero') files = homeHeroFiles;
      else if (section === 'Services') files = homeServicesFiles;
      else if (section === 'Navbar') files = homeNavbarFiles;
      else if (section === 'Testimonials') files = homeTestimonialsFiles;
      else if (section === 'Contact') files = homeContactFiles;
      else if (section === 'Footer') files = homeFooterFiles;
      else files = [`${section}.jsx`, `${section}.css`, 'index.js'];

      files.forEach(file => {
        const filePath = path.join(sectionDir, file);
        if (file.endsWith('.jsx')) {
          const compName = file.replace('.jsx', '');
          let content = `const ${compName} = () => {\n  return (\n    <div>${compName} Component</div>\n  );\n};\n\nexport default ${compName};\n`;
          if (file === `${section}.jsx`) {
            content = `import './${section}.css';\n\nconst ${compName} = () => {\n  return (\n    <div className="${section.toLowerCase()}">\n      ${compName} Component\n    </div>\n  );\n};\n\nexport default ${compName};\n`;
          }
          writeFileSync(filePath, content);
        } else if (file.endsWith('.css')) {
          writeFileSync(filePath, `.${file.replace('.css', '').toLowerCase()} {\n  /* ${file} styles */\n}\n`);
        } else if (file === 'index.js') {
          writeFileSync(filePath, `export { default } from './${section}';\n`);
        }
      });
    });
  }
});

// 5. Create Routes
const routesDir = path.join(srcPath, 'routes');
writeFileSync(path.join(routesDir, 'AppRoutes.jsx'), `const AppRoutes = () => { return null; }; export default AppRoutes;\n`);
writeFileSync(path.join(routesDir, 'PublicRoutes.jsx'), `const PublicRoutes = () => { return null; }; export default PublicRoutes;\n`);
writeFileSync(path.join(routesDir, 'PrivateRoutes.jsx'), `const PrivateRoutes = () => { return null; }; export default PrivateRoutes;\n`);
writeFileSync(path.join(routesDir, 'index.js'), `export { default as AppRoutes } from './AppRoutes';\nexport { default as PublicRoutes } from './PublicRoutes';\nexport { default as PrivateRoutes } from './PrivateRoutes';\n`);

// 6. Add index.js to all root folders
directories.forEach(dir => {
  if (dir !== 'components/Common') {
    writeFileSync(path.join(srcPath, dir, 'index.js'), `// export ${dir}\n`);
  }
});

console.log('Project structure generated successfully!');
