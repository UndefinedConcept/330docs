/**
 * @fileoverview Generates a hierarchical tree structure from a flat list of documentation links for use in the sidebar navigation.
 * @usage import { type MapNode, docsMap: Record<string, Record<string, MapNode[]>>, getDirectoryPath } from '@utils/navigation';
 */
import { SITE_BASE } from '@src/consts';
import { getCollection } from 'astro:content';

interface SidebarLink {
  href: string;
  title: string;
  category: string;
}

interface NavMap {
  title: string;
  href: string;
  items: Record<string, MapNode[]>; // An array containing only strings
}

export type MapNode =
  { title: string; href: string; mapString?: never } | { title: string; mapString: string; href?: never };

export function getDirectoryPath(href: string): string {
  const lastSlashIndex = href.lastIndexOf('/');
  return href.substring(0, lastSlashIndex);
}

// Get all posts from the 'docs' collection, sort them by publication date, and map them to SidebarLink objects
const posts: SidebarLink[] = (await getCollection('docs'))
  .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
  .map((post) => ({
    href: `${SITE_BASE}/docs/${post.id}`,
    title: post.data.title,
    category: post.data.category,
  }));

/**
 * @description builds a directory map of a categorized tree structure from a flat list of documentation links
 * 1. Group by node.directory (use getDirectoryPath(node.href) to get it)
 *   a. If node end with '_index' (should be a .md file), then it is a directory node (points to a directory)
 *   b. If node does not end with '_index', then it is a leaf node (just a link)
 * 2. Categorize by the node.category for each directory node and leaf node
 * */
function buildMap(nodes: SidebarLink[]): NavMap[] {
  function addToMap(path: string, category: string, node: MapNode) {
    if (!map[path]) {
      map[path] = {};
    }
    if (!map[path][category]) {
      map[path][category] = [];
    }
    map[path][category].push(node);
  }

  // Initialize the map with a base directory (for the default nav menu)
  const map: Record<string, Record<string, MapNode[]>> = {};
  const mapTitles: Record<string, string> = {};

  for (const node of nodes) {
    const directoryPath = getDirectoryPath(node.href);
    if (node.href.endsWith('/_index')) {
      // If it's a directory node, add it to the map with its title and href
      const folderPath = getDirectoryPath(directoryPath); // Get the parent directory path
      addToMap(folderPath, node.category, { title: node.title, mapString: directoryPath });
      mapTitles[directoryPath] = node.title; // Store the title for the directory path
    } else {
      // If it's a leaf node, add it to the map with its title and href
      addToMap(directoryPath, node.category, { title: node.title, href: node.href });
    }
  }

  // Sort by directory name (key) and organized by category (value) for each directory node and leaf node
  const sortedMap: NavMap[] = [];
  for (const directory of Object.keys(map).sort()) {
    sortedMap.push({
      title: mapTitles[directory] || directory,
      href: directory,
      items: map[directory],
    });
  }
  return sortedMap;
}

// Export the tree structure for use in other parts of the application
export const docsMap = buildMap(posts);
