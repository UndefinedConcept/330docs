/**
 * @fileoverview This module defines a custom remark plugin for processing blockquotes in Markdown files.
 * @usage Converts [!{tag}] => <data-blockquote-type={tag} .
 */
import type { Blockquote, Paragraph, Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

type BlockquoteData = NonNullable<Blockquote['data']> & {
  hProperties?: Record<string, string>;
};

export const remarkCustomBlockquotes: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // Explicitly scope the visit iterator to 'blockquote' nodes
    visit(tree, 'blockquote', (node: Blockquote) => {
      const firstChild = node.children[0] as Paragraph | undefined;
      if (!firstChild || firstChild.type !== 'paragraph') return;

      const firstTextNode = firstChild.children[0] as Text | undefined;
      if (!firstTextNode || firstTextNode.type !== 'text') return;

      const textValue = firstTextNode.value;

      // Type-safe matching for bracket tags like [!NOTE]
      const match = textValue.match(/^\[!(NOTE|TIP|WARNING)\]\s*(.*)/i);

      if (match) {
        const type = match[1];
        const remainingText = match[2];

        // Clean up text within mdast safely
        if (remainingText) {
          firstTextNode.value = remainingText;
        } else {
          firstChild.children.shift();
        }

        // Initialize custom property storage on the mdast node safely
        const data = (node.data ??= {}) as BlockquoteData;
        data.hProperties ??= {};

        // Pass dynamic data strings cleanly down the unified render pipeline
        data.hProperties['data-blockquote-type'] = type;
      }
    });
  };
};

export default remarkCustomBlockquotes;
