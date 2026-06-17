// These polyfills have a strict load order.
// Blank lines separate groups so "Organize Imports" does not reorder across group boundaries.
// This file is excluded from Prettier (.prettierignore) to preserve the order.

import "@formatjs/intl-getcanonicallocales/polyfill.js";

import "@formatjs/intl-locale/polyfill.js";

import "@formatjs/intl-pluralrules/polyfill-force.js";

import "@formatjs/intl-pluralrules/locale-data/en.js";
import "@formatjs/intl-pluralrules/locale-data/nl.js";

import "@formatjs/intl-numberformat/polyfill-force.js";

import "@formatjs/intl-numberformat/locale-data/en.js";
import "@formatjs/intl-numberformat/locale-data/nl.js";

import "@formatjs/intl-datetimeformat/polyfill-force.js";

import "@formatjs/intl-datetimeformat/locale-data/en.js";
import "@formatjs/intl-datetimeformat/locale-data/nl.js";

import "@formatjs/intl-datetimeformat/add-all-tz.js";
