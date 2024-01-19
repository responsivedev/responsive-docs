// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Responsive',
  tagline: 'Managed, Cloud-native, Modern Kafka Streams',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://docs.responsive.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'responsivedev', // Usually your GitHub org/user name.
  projectName: 'responsive-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ['./plugins/src/koala-plugin.js'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarCollapsed: false,
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-9GJEEDV70G',
          anonymizeIP: true,
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/open-graph-image.png',
      navbar: {
        logo: {
          alt: 'Responsive Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-dark.svg',
          href: 'https://responsive.dev', // logo should always point to main site
          target: '_self' // tells the logo link to open in the same tab
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: 'https://responsive.dev', 
            label: 'Product', 
            position: 'left'
          },
          {
            to: 'https://responsive.dev/blog', 
            label: 'Blog', 
            position: 'left'
          },
          {
            to: 'http://discord.gg/jEk8JvjJrg',
            position: 'right',
            className: "header-discord-link",
          },
          {
            to: 'https://github.com/responsivedev',
            position: 'right',
            className: "header-github-link",
          },
          {
            to: 'https://responsive.dev/join-our-waitlist',
            label: 'Join our Waitlist',
            position: 'right',
            className: 'button button--secondary button--rg'
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Home',
                to: '/',
              },
              {
                label: 'Getting Started',
                to: '/category/getting-started',
              },
              {
                label: 'Concepts',
                to: '/category/concepts',
              },
              {
                label: 'API Reference',
                to: '/category/api-reference',
              },
            ],
          },
          {
            title: 'Social',
            items: [
             {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/responsivedev/',
              },
              {
                label: 'X / Twitter' ,
                href: 'https://twitter.com/responsive_apps',  
              },
              {
                label: 'Discord',
                href: 'http://discord.gg/jEk8JvjJrg'
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Product',
                href: 'https://responsive.dev',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/responsivedev',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Responsive Computing, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java', 'diff'],
      },
    }),
};

module.exports = config;
