import path from 'path'

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f))}`

export default {
  'src/*.{js,jsx,ts,tsx}': [
    buildEslintCommand,
    "bash -c 'yarn tsc'",
    'yarn format',
  ],
  "*.{json,css,scss}'": ['yarn format'],
}
