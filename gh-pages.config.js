// https://github.com/tschaub/gh-pages

const ghpages = require("gh-pages");

/**
 * This task pushes to the `gh-pages` branch of the configured `repo`.
 */
ghpages.publish(
  ".",
  {
    branch: "gh-pages",
    repo: "https://github.com/Sliqric7053/enaio-webclient-demo-dashlet.git",
  },
  callback
);
