/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

function localIntercept(targets) {
    targets.of("@magento/venia-ui").routes.tap((routes) => {
        routes.push(
            {
                name: "MyDemoPage",
                pattern: "/demo-page/",
                path: require.resolve("./src/components/DemoPage/DemoPage.js"),
            },
            {
                name: 'Comments Page',
                pattern: '/comments',
                path: require.resolve('./src/components/CommentsPage'),

            });
        return routes;
    });

    const FilterDefault = require('@magento/venia-concept/core-overrides/components/filterDefaults');
    FilterDefault(targets);

    const FilterItem = require('@magento/venia-concept/core-overrides/components/filterItem');
    FilterItem(targets);

    const FilterBlock = require('@magento/venia-concept/core-overrides/components/filterBlock');
    FilterBlock(targets)

}

module.exports = localIntercept;
