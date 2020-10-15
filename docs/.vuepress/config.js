module.exports = {
    title: 'Stargate docs',
    base: '/stargate/stargate/',
    dest: 'public',
    themeConfig: {
        navbar: false,
        sidebar: [
            '/',
            '/vocable',
            '/technologies',
            '/flux',
            '/setup',
            '/selinux',
            '/backend/state-machine',
        ]
    },
    locales: {
        '/': {
            lang: 'fr-FR',
        },
    },
};
