import fs from "node:fs"
import path from "node:path"
import JSON5 from 'json5'
import { DefaultTheme } from "vitepress/theme"
import util from "node:util"

export const LATEST_VERSION = '1.0.0'

export interface VersionInformation {
  name: string,
  sidebar: DefaultTheme.SidebarItem,

}

function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];

  function traverseDirectory(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = `${currentDir}/${entry.name}`;

      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  traverseDirectory(dir);

  return files;
}

/**
 * Generates vitepress rewrites for all versions in the "versions" folder.
 * The rewrites are used to format the URLs in `versions` to be more user-friendly.
 * @returns {Record<string, string>} A map of rewrite sources to their destinations.
 */
export function generateVersionRewrites(): Record<string, string> {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)
  const rewrites = {};

  // Generate rewrites for each version's files.
  for (const version of versions) {
    // Get all files recursively in the version folder
    const files = getFilesRecursively(path.resolve(versionsDir, version));
    const rewriteSources = files.map(filePath => filePath.replace(versionsDir, 'versions'));

    for (const rewriteSource of rewriteSources) {
      rewrites[rewriteSource] = rewriteSource.replace(`versions/`, '');
    }
  }

  console.log(rewrites)

  return rewrites
}

export function generateVersionSwitcher(): DefaultTheme.NavItem {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)

  const versionSwitcher: DefaultTheme.NavItem = {
    text: 'Switch Version',
    items: [
      {
        text: `${LATEST_VERSION} (latest)`,
        link: `/`
      }
    ]
  }

  for (const version of versions) {
    versionSwitcher.items.push({
      text: version,
      link: `/versions/${version}/`
    })
  }

  return versionSwitcher;
}

function replaceLinksRecursive(sidebar: DefaultTheme.SidebarItem[], version: string): DefaultTheme.SidebarItem[] {
  // Prepend the version to all links. `{VERSION}/$link`
  const versionedSidebar = sidebar.map(item => {
    if (item.link) {
      item.link = `/${version}${item.link}`
    }

    if (item.items) {
      item.items = replaceLinksRecursive(item.items, version)
    }

    return item
  })

  return versionedSidebar
}

export function getSidebar(version: string): DefaultTheme.SidebarItem[] {
  const versionDir = path.resolve(__dirname, `../../versions/${version}`)
  const sidebarPath = path.resolve(versionDir, 'sidebar.json5')

  if (fs.existsSync(sidebarPath)) {
    const sidebar = JSON5.parse(fs.readFileSync(sidebarPath, 'utf-8'))

    // Replace all links in the sidebar with their versioned equivalents.
    return replaceLinksRecursive(sidebar, version)
  }

  return []
}

export function generateVersionSidebars(): DefaultTheme.SidebarMulti {
  const versionsDir = path.resolve(__dirname, '../../versions')
  const versions = fs.readdirSync(versionsDir)

  const versionSidebars: DefaultTheme.SidebarMulti = {}

  for (const version of versions) {
    versionSidebars[`/${version}/`] = getSidebar(version)
  }

  console.log(util.inspect(versionSidebars, false, null, true))

  return versionSidebars
}