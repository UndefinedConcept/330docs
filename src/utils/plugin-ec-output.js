import { AttachedPluginData, definePlugin } from '@expressive-code/core';
import { h } from '@expressive-code/core/hast';

const outputData = new AttachedPluginData(() => ({ output: [] }));

export function CodeOutputPlugin() {
  return definePlugin({
    name: 'Code Output Splitter',
    baseStyles: ` 
    .expressive-code .frame pre.output {
      display: flex;
      flex-direction: column;
      border-top: none;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      padding: 0.5rem 0;
      font-size: 0.85rem;

      span {
        width: fit-content;
        padding: 0 var(--ec-codePadInl);
      }
    }
    `,
    hooks: {
      preprocessCode: (context) => {
        // Skip terminal windows if you only want this targeting editor frames
        if (!context.codeBlock.meta || !context.codeBlock.meta.includes('output')) return;

        const lines = context.codeBlock.getLines();

        // Find the index of the line that reads exactly '=== OUTPUT ==='
        const outputStart = lines.findIndex((line) => line.text === '=== OUTPUT ===');
        if (outputStart === -1) return;

        const blockData = outputData.getOrCreateFor(context.codeBlock);

        // Gather all lines starting *after* the '=== OUTPUT ===' marker
        context.codeBlock.getLines(outputStart + 1).forEach((line) => {
          blockData.output.push(line.text);
        });

        // Safely delete the output lines and the marker line in reverse order
        for (let i = lines.length; i > outputStart; i--) {
          context.codeBlock.deleteLine(i - 1);
        }
      },
      postprocessRenderedBlock: async (context) => {
        if (!context.codeBlock.meta || !context.codeBlock.meta.includes('output')) return;

        const blockData = outputData.getOrCreateFor(context.codeBlock);
        if (!blockData.output.length) return;

        const lastPre = context.renderData.blockAst.children.findLastIndex(
          (child) => child.type === 'element' && child.tagName === 'pre'
        );
        if (lastPre === -1) return;

        const currentChildren = context.renderData.blockAst.children;
        const newChildren = [
          ...currentChildren.slice(0, lastPre + 1),
          h(
            'pre.output',
            blockData.output.map((line) => h('span', line))
          ),
          ...currentChildren.slice(lastPre + 1),
        ];
        context.renderData.blockAst.children = newChildren;
      },
    },
  });
}
