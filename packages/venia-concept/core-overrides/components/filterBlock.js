const {Targetables} = require("@magento/pwa-buildpack");

module.exports = (targets) => {
    const targetables = Targetables.using(targets);

    const FilterBlock = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterModal/filterBlock.js'
    );

    FilterBlock.spliceSource({
        after: 'import Icon from \'../Icon\';',
        remove: 39,
        insert: 'import FilterList from \'@magento/venia-concept/src/components/FilterList/filterList\';'
    })
}
