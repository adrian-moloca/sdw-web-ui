import { useEffect, useRef } from 'react';
import { createHighlighter, BundledTheme, BundledLanguage } from 'shiki';
import { styled } from 'styled-components';

type Props = {
  code: string;
  language: BundledLanguage;
  theme: BundledTheme;
  showLineNumbers?: boolean;
};

const StyledCodeBlock = styled.div`
  pre.shiki {
    overflow: auto;
    padding: 8px;
    font-size: 14px;
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.2;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .has-line-numbers {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: 10px;
  }

  .line-numbers-wrapper {
    display: flex;
    flex-direction: column;
    color: #888;
    white-space: pre;
    user-select: none;
  }
`;

export const CodeBlock = ({ code, language, theme, showLineNumbers }: Props) => {
  const codeRef = useRef<HTMLDivElement>(null);

  const addLineNumbers = (highlightedCode: string) => {
    if (codeRef.current) {
      codeRef.current.innerHTML = highlightedCode;

      const preElement = codeRef.current.querySelector('pre');
      const parentElement = codeRef.current.firstChild as HTMLDivElement | null;

      if (preElement && parentElement) {
        const lines = code.split('\n').length;

        let lineNumberHTML = '';
        for (let i = 0; i < lines; i++) {
          lineNumberHTML += `<span class="line-number">${i + 1}</span>`;
        }

        preElement.classList.add('has-line-numbers');
        parentElement.insertAdjacentHTML(
          'afterbegin',
          `<div class="line-numbers-wrapper">${lineNumberHTML}</div>`
        );
      }
    }
  };

  useEffect(() => {
    async function highlightCode() {
      if (codeRef?.current) {
        try {
          const highlighter = await createHighlighter({
            themes: [theme],
            langs: [language], // Only load the necessary language
          });
          const highlightedCode = highlighter.codeToHtml(code, {
            lang: language,
            theme,
          });

          if (showLineNumbers) {
            addLineNumbers(highlightedCode);
          } else {
            codeRef.current.innerHTML = highlightedCode;
          }
        } catch (error) {
          console.error('Error highlighting code:', error);
          codeRef.current.textContent = code; // Fallback to plain text
        }
      }
    }

    highlightCode();
  }, [code, language, theme]); // Re-run if code, language, or theme changes

  return (
    <StyledCodeBlock>
      <div ref={codeRef} className={`shiki ${theme}`} />
    </StyledCodeBlock>
  );
};
