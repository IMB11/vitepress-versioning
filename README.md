# Vitepress Versioning Example

This is an example of how to use vitepress to create a versioned documentation site.

## How it works

The `versions` directory contains directories per version.

Each version directory can contain an optional `sidebar.json5` file that can be used to store the sidebar that is used for that version.

_JSON5 is used so you can easily copy the current sidebar from the `config.mts` file and paste it into the `sidebar.json5` file when archiving/creating a version._

All links in the sidebar are relative to the version directory, you shouldn't include the version in any links, and when linking to a page in a different version, you should add the `process: false` attribute to the sidebar item.

**Example:**

```json5
// versions/0.1.0/sidebar.json5
[
  // ...
  {
    text: "Different Version Link",
    // Should remain as '/0.2.0/some-page' and should not be processed as '/0.1.0/0.2.0/some-page'
    link: "/0.2.0/some-page",
    process: false,
  },
  // ...
]
```

To tie it all together, the various methods in `data/versions.ts` are used in the `config.mts` file to generate the sidebar, rewrites for versioned pages to make the URLs more user friendly, and to generate the version dropdown in the navbar.

# Usage

1. Install the nessecary dependencies:

```sh
pnpm i json5
```

_(If you're using typescript, you may need to install `@types/node` as a dev dependency!)_

2. Copy the `data/versions.ts` file into your project.

3. Add the version switcher to your navbar in the theme config in `config.mts`:

```ts
// .vitepress/config.mts
themeConfig: {
  ...
  nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },

      // Version Switcher
      generateVersionSwitcher(),
  ],
}
```

4. Add the rewrites to your `config.mts` file.

```ts
export default defineConfig({
  title: "Blah Blah..."
  // ...
  rewrites: {

    // Using ... incase you already have rewrites or want to add manual rewrites later.
    ...generateVersionRewrites(),
  }
});
```

5. Add the versioned sidebar to your `config.mts` file.

```ts
sidebar: {
    // Latest Version Sidebar(s)
    '/': [
        {
            text: 'Test',
            link: '/',
        },
        {
            text: 'Sub Test',
            link: '/sub/test',
        }
    ],
    ...generateVersionSidebars()
},
```

5. Add the `versions` directory to your project!

Voila.

## Adding a new version.

When adding a new version, you should copy all of your pages into the new version directory, and then copy the current sidebar of the latest version into the new version's `sidebar.json5` file.

The `sidebar.json5` file can be either an array of `DefaultTheme.SidebarItem` or a `DefaultTheme.MultiSidebar` object.

**Example:**

Array of `DefaultTheme.SidebarItem`:

```json5
// versions/0.1.0/sidebar.json5
[
  {
    text: "Test",
    link: "/",
  },
  {
    text: "Sub Test",
    link: "/sub/test",
  },
];
```

`DefaultTheme.SidebarMulti` object:

```json5
// versions/0.1.0/sidebar.json5
{
  '/': [
    {
      text: "Test",
      link: "/",
    },
    {
      text: "Sub Test",
      link: "/sub/test",
    },
  ],
  '/something-else': [
    {
      text: "Test",
      link: "/something-else",
    },
    {
      text: "Sub Test",
      link: "/something-else/test",
    },
  ],
}
```

As usual, the root links for the multisidebar should be relative to the version directory, it will be processed into the correct URL automatically during the generation of the sidebar.

*Example, the `/something-else` root link will be processed into `/0.1.0/something-else`.*

That's it! Any issues, please report them, much appreciated.