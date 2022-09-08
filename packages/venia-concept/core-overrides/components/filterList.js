const {Targetables} = require("@magento/pwa-buildpack");

module.exports = (targets) => {

    const targetables = Targetables.using(targets);

    const FilterList = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterModal/FilterList/filterList.js'
    );

    FilterList.setJSXProps('ul', {
        style: '{ group===\'color\' ? {display: \'flex\'} : null}'
    })
}
