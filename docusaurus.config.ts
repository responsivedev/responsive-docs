import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Responsive Documentation',
  tagline: 'Kafka Streams made Reliable, Scalable, and Automated',
  favicon: 'img/favicon.png',

  url: 'https://docs.responsive.dev',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'responsivedev',
  projectName: 'responsive-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './src/plugins/koala-plugin',
    './src/plugins/tailwind-config',
    'vercel-analytics'
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/responsivedev/responsive-docs/tree/main/',
          sidebarCollapsed: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-9GJEEDV70G',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false
    },
    image: 'img/open-graph-image.png',
    navbar: {
      logo: {
        alt: 'Responsive',
        src: 'img/logo.svg',
        href: 'https://responsive.dev', // logo should always point to main site
        target: '_blank',
        width: 120,
        height: 60,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Home',
        },
        {
          to: 'https://responsive.dev',
          label: 'Product',
          position: 'left',
          target: '_blank',
        },
        {
          to: 'https://responsive.dev/blog',
          label: 'Blog',
          position: 'left',
          target: '_blank',
        },
        {
          to: 'https://responsive.dev/talk-with-us',
          label: 'Talk With Us',
          position: 'right',
          className: 'navbar-talk'
        },
        {
          to: 'https://cloud.responsive.dev/login',
          label: 'Login',
          position: 'right',
          className: 'navbar-login'
        }
      ],
    },
    prism: {
      theme: prismThemes.github,
      additionalLanguages: ['bash', 'java', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
