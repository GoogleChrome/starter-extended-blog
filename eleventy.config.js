import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from '@11ty/eleventy';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import i18n from 'eleventy-plugin-i18n';
import translations from './_data/i18n/translations.js';
import pluginFilters from './_config/filters.js';
import metadata from './_data/metadata.js';
import { locales, fallbackLocales } from './_data/locales.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
    if (data.draft) {
      data.title = `${data.title} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  // prettier-ignore-start
  eleventyConfig.addPassthroughCopy({
    './public/': '/',
    './node_modules/@google/genai/dist/web/': '/assets/js/google-genai/',
    './node_modules/@huggingface/transformers/dist/':
      '/assets/js/huggingface-transformers/',
    './node_modules/browser-fs-access/dist/': '/assets/js/browser-fs-access/',
    './node_modules/built-in-ai-task-apis-polyfills/dist/':
      '/assets/js/built-in-ai-task-apis-polyfills/',
    './node_modules/dompurify/dist/': '/assets/js/dompurify/',
    './node_modules/firebase/': '/assets/js/firebase/',
    './node_modules/input-switch-polyfill/':
      '/assets/js/input-switch-polyfill/',
    './node_modules/jszip/dist/': '/assets/js/jszip/',
    './node_modules/marked/lib/': '/assets/js/marked/',
    './node_modules/onnxruntime-web/dist/': '/assets/js/onnxruntime-web/',
    './node_modules/onnxruntime-common/dist/esm/':
      '/assets/js/onnxruntime-common/',
    './node_modules/openai/': '/assets/js/openai/',
    './node_modules/prismjs/': '/assets/js/prismjs/',
    './node_modules/prompt-api-polyfill/dist/':
      '/assets/js/prompt-api-polyfill/',
    './node_modules/turndown/dist/': '/assets/js/turndown/',
    './node_modules/xslt-polyfill/': '/assets/js/xslt-polyfill/',
  });
  // prettier-ignore-end

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch CSS files
  eleventyConfig.addWatchTarget('css/**/*.css');
  // Watch JS files
  eleventyConfig.addWatchTarget('js/**/*.js');
  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpg,jpeg,gif}');

  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  // Bundle <style> content and adds a {% css %} paired shortcode
  eleventyConfig.addBundle('css', {
    toFileDirectory: 'assets/css/',
    // Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
    // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: 'style',
  });

  // Bundle <script> content and adds a {% js %} paired shortcode
  eleventyConfig.addBundle('js', {
    toFileDirectory: 'assets/js/bundles/',
    // Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
    // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
    bundleHtmlContentFromSelector: 'script',
  });

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // Localized collections for feeds
  for (const lang of locales) {
    eleventyConfig.addCollection(`posts_${lang}`, function (collectionApi) {
      return collectionApi.getFilteredByTag('posts').filter((item) => {
        const itemLocale =
          item.data.locale || (item.url ? item.url.split('/')[1] : '');
        return itemLocale === lang;
      });
    });

    eleventyConfig.addPlugin(feedPlugin, {
      type: 'atom',
      outputPath: `/${lang}/feed/feed.xml`,
      inputPath: `eleventy-plugin-feed-${lang}-atom.njk`,
      stylesheet: '../../feed/pretty-atom-feed.xsl',
      script: '/assets/js/xslt-polyfill/xslt-polyfill.min.js',
      templateData: {
        locale: lang,
        eleventyNavigation: {
          key: 'feed',
          order: 4,
        },
      },
      collection: {
        name: `posts_${lang}`,
        limit: 10,
      },
      metadata: {
        language: lang,
        title: `${translations.posts[lang] || translations.posts[fallbackLocales[lang]] || 'Posts'} - ${metadata.title}`,
        subtitle: metadata.description,
        base: metadata.url,
        authors: metadata.authors,
        // Singular author for plugin compat (metadata.author.name expected by @11ty/eleventy-plugin-rss)
        author: {
          name: new Intl.ListFormat(lang, {
            style: 'long',
            type: 'conjunction',
          }).format(metadata.authors.map((a) => a.name)),
        },
      },
    });
  }

  eleventyConfig.addCollection('tagLocaleCombos', function (collectionApi) {
    const allItems = collectionApi.getAll();
    const tagsMap = new Map();
    for (const item of allItems) {
      let itemTags = item.data.tags || [];
      if (typeof itemTags === 'string') {
        itemTags = [itemTags];
      }
      for (const tag of itemTags) {
        if (tag && tag !== 'all' && tag !== 'posts') {
          const slug = tag.toLowerCase().replace(/\s+/g, '-');
          if (!tagsMap.has(slug)) {
            tagsMap.set(slug, tag);
          }
        }
      }
    }
    const tags = Array.from(tagsMap.values());
    const combos = [];
    for (const locale of locales) {
      for (const tag of tags) {
        if (tag && locale) {
          combos.push({ tag, locale });
        }
      }
    }
    return combos;
  });

  // Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // Output formats for each image.
    formats: ['avif', 'webp', 'auto'],

    // widths: ["auto"],

    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        // e.g. <img loading decoding> assigned on the HTML tag will override these values.
        loading: 'lazy',
        decoding: 'async',
      },
    },

    sharpOptions: {
      animated: true,
    },
  });

  // Filters
  eleventyConfig.addPlugin(pluginFilters);

  // Silence i18n warnings by programmatically expanding translations
  // for sub-locales so the plugin finds them and doesn't log a fallback warning.
  for (const values of Object.values(translations)) {
    for (const [locale, fallback] of Object.entries(fallbackLocales)) {
      if (!values[locale] && values[fallback]) {
        values[locale] = values[fallback];
      }
    }
  }

  eleventyConfig.addGlobalData('translations', translations);

  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      ...fallbackLocales,
      '*': metadata.language,
    },
  });

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // by default we use Eleventy’s built-in `slugify` filter:
    // slugify: eleventyConfig.getFilter("slugify"),
    // selector: "h1,h2,h3,h4,h5,h6", // default
  });

  eleventyConfig.addShortcode('currentBuildDate', () => {
    return new Date().toISOString();
  });

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
}

export const config = {
  // Control which files Eleventy will process
  // e.g.: *.md, *.njk, *.html, *.liquid
  templateFormats: ['md', 'njk', 'html', 'liquid', '11ty.js'],

  // Pre-process *.md files with: (default: `liquid`)
  markdownTemplateEngine: 'njk',

  // Pre-process *.html files with: (default: `liquid`)
  htmlTemplateEngine: 'njk',

  // These are all optional:
  dir: {
    input: 'content', // default: "."
    includes: '../_includes', // default: "_includes" (`input` relative)
    data: '../_data', // default: "_data" (`input` relative)
    output: '_site',
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  // pathPrefix: "/",
};
