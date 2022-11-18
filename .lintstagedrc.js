export default {
  'src/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    "bash -c 'yarn tsc'",
    'yarn format',
  ],
  "*.{json,css,scss}'": ['yarn format'],
}
