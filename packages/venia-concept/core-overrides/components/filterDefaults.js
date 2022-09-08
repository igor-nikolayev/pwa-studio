const {Targetables} = require("@magento/pwa-buildpack");

module.exports = (targets) => {

    const targetables = Targetables.using(targets);

    const FilterDefault = targetables.reactComponent(
        '@magento/venia-ui/lib/components/FilterModal/FilterList/filterDefault.js'
    );

    FilterDefault.addImport(
        'ColorFilter from \'@magento/venia-concept/src/components/ColorFilter\''
    );

    FilterDefault.insertAfterSource(
        'const { classes: propsClasses, isSelected, item,',
        ' group,'
    );

    FilterDefault.insertAfterSource(
       '              {\n' +
        '                  optionName: label\n' +
        '              }\n' +
        '          );\n' +
        '\n',
        'const FilterTypeComponent = group === \'color\' ? ColorFilter : Checkbox;'
    )

    FilterDefault.spliceSource({
        after: 'return (\n' +
            '        ',
        remove: 9,
        insert: '<FilterTypeComponent '
    })
}
