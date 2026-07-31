// @ts-check
import { definePlugin, ExpressiveCodeAnnotation } from '@expressive-code/core';
import { h } from '@expressive-code/core/hast';

class OutputCommentAnnotation extends ExpressiveCodeAnnotation {
  /** @param {import('@expressive-code/core').AnnotationRenderOptions} context */
  render({ nodesToTransform }) {
    return nodesToTransform.map((node) => {
      return h('span.hide-comment', node);
    });
  }
}

export const OutputCommentPlugin = () =>
  definePlugin({
    name: 'Output Comment Plugin',
    baseStyles: `
      .hide-comment {
        display: none;
      }
    `,
    hooks: {
      postprocessAnalyzedCode: (context) => {
        // Safe check to prevent crashes if meta is undefined
        if (!context.codeBlock.meta || !context.codeBlock.meta.includes('output')) return;

        context.codeBlock.getLines().forEach((line) => {
          // Find all lines that start with exactly "# "
          if (line.text === '#' || line.text.startsWith('# ')) {
            // Add a hide comment annotation (to hide the "# " prefix without disable no comment copy)
            line.addAnnotation(
              new OutputCommentAnnotation({
                inlineRange: {
                  columnStart: 0,
                  columnEnd: 2,
                },
              })
            );
          }
        });
      },
    },
  });
