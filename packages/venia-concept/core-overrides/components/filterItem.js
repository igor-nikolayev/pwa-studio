const {Targetables} = require("@magento/pwa-buildpack");

module.exports = (targets) => {
    const targetables = Targetables.using(targets);

    const FilterItem = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterModal/FilterList/filterItem.js'
    );

    FilterItem.setJSXProps('FilterDefault', {
        group: '{group}'
    })
}
