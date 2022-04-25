const { path } = require("@vuepress/utils");

module.exports = {
  locales: {
    "/": {
      lang: "en-US",
      title: "VuePress",
      description: "Vue-powered Static Site Generator",
    },
  },
 themeConfig: {
    navbar: [
      // NavbarItem
      {
        text: 'Foo',
        link: '/foo/',
      },
      // NavbarGroup
      {
        text: 'Group',
        children: ['/group/foo.md', '/group/bar.md'],
      },
      // string - page file path
      '/bar/README.md',
    ],
    sidebar:[
       // NavbarItem
      {
        text: 'Usage',
        link: '/usage/',
      },
      {
        text: 'Props',
        link: '/props/',
      },{
        text: 'Slots',
        link: '/slots/',
      },{
        text: 'Methods',
        link: '/methods/',
      },{
        text: 'Scoped slots',
        link: '/scoped-slots/',
      },{
        text: 'Demos',
        link: '/demos/',
      },{
        text: 'Playground',
        link: '/playground/',
      },
    ]
  },
  plugins: [
    [
      "@vuepress/register-components",
      {
        componentsDir: path.resolve(__dirname, "./components"),
      },
    ],
  ],
};
