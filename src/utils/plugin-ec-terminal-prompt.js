// @ts-check
import { definePlugin, ExpressiveCodeAnnotation } from '@expressive-code/core';
import { h } from '@expressive-code/core/hast';

class TerminalPromptLineAnnotation extends ExpressiveCodeAnnotation {
  /** @param {import('@expressive-code/core').AnnotationRenderOptions} context */
  render({ nodesToTransform }) {
    // Wraps the valid line content to attach the CSS ::before prompt
    return [h('span.terminal-prompt-line', nodesToTransform)];
  }
}

export function TerminalPromptPlugin() {
  return definePlugin({
    name: 'Terminal Prompt Plugin',
    baseStyles: `
      .terminal-prompt-line::before {
        content: "$ ";
        color: var(--color-info);
        user-select: none;
      }
    `,
    hooks: {
      postprocessAnalyzedCode: (context) => {
        // Target terminal languages
        const terminalLangs = ['bash', 'sh', 'shell', 'ps', 'powershell'];
        if (!terminalLangs.includes(context.codeBlock.language)) return;

        context.codeBlock.getLines().forEach((line) => {
          // 1. Ignore entirely empty lines or lines with only whitespace
          if (!line.text || line.text.trim() === '') return;

          // 2. Ignore lines that act as full comments
          // Checks standard shell comment character '#'
          if (line.text.trim().startsWith('#')) return;

          // 3. Ignore if the line structure maps completely to an existing code comment scope
          const formsCommentScope = line.addAnnotation === undefined;

          // Extra protection: Skip lines explicitly marked as comments or meta annotations
          if (formsCommentScope) return;

          // Add the terminal prompt to valid executable command lines
          line.addAnnotation(
            new TerminalPromptLineAnnotation({
              inlineRange: {
                columnStart: 0,
                columnEnd: line.text.length,
              },
            })
          );
        });
      },
    },
  });
}
