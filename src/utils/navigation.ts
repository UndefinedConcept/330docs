/**
 * @fileoverview Generates a hierarchical tree structure from a flat list of documentation links for use in the sidebar navigation.
 * @usage import { type TreeNode, docsTree, docsList } from '@utils/navigation';
 * - TreeNode = Type definition for nodes in the tree structure.
 * - docsTree:TreeNode = A tree structure representing the hierarchy of documentation links.
 * - docsList:TreeNode = A flat list of all documentation links for easy access.
 */
import { SITE_BASE } from '@src/consts';
import { getCollection } from 'astro:content';

interface SidebarLink {
  href: string;
  title: string;
  segments: string[];
}

export type TreeNode = { title: string; href: string } | { title: string; children: TreeNode[] };

// Get all posts from the 'docs' collection, sort them by publication date, and map them to SidebarLink objects
const posts: SidebarLink[] = (await getCollection('docs'))
  .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf())
  .map((post) => ({
    href: `${SITE_BASE}/docs/${post.id}`,
    title: post.data.title,
    segments: post.id.split('/'),
  }));

/** @description Build a tree structure from the flat list of links */
function buildTree(nodes: SidebarLink[]): TreeNode[] {
  const tree: TreeNode[] = [];
  const map: Record<string, TreeNode> = {};

  for (const link of nodes) {
    const segments = link.segments;
    let currentLevel = tree;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLastSegment = i === segments.length - 1;

      if (!map[segment]) {
        const newNode: TreeNode = isLastSegment
          ? { title: link.title, href: link.href }
          : { title: segment, children: [] };

        map[segment] = newNode;
        currentLevel.push(newNode);
      }

      if (!isLastSegment) {
        currentLevel = (map[segment] as { children: TreeNode[] }).children;
      }
    }
  }
  return tree;
}

/** @description Flatten the tree structure into a flat list of links */
function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];

  for (const node of nodes) {
    if ('href' in node) {
      result.push({ href: node.href, title: node.title });
    } else if ('children' in node) {
      result.push(...flattenTree(node.children));
    }
  }

  return result;
}

// Export the tree structure for use in other parts of the application
export const docsTree = buildTree(posts);
export const docsList = flattenTree(docsTree);
