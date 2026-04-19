const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// babel-plugin-transform-import-meta converts import.meta.env.X → process.env.X
process.env.VITE_GOOGLE_API_KEY = "TEST_API_KEY";
