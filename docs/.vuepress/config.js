module.exports = {
    title: 'Stargate docs',
    base: '/stargate/stargate/',
    dest: 'public',
    plugins: [
        'vuepress-plugin-mermaidjs'
    ],
    themeConfig: {
        navbar: false,
        sidebar: [
            '/',
            '/vocable',
            '/technologies',
            '/setup',
            '/selinux',
            '/mindef-connect',
            '/backend/state-machine',
        ]
    },
    locales: {
        '/': {
            lang: 'fr-FR',
        },
    },
};