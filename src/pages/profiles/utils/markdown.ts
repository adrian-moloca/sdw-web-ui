const normalizeId = (rawId: string, isPerson: boolean): string => {
  let cleanId = rawId.trim();
  // Remove leading / or person| if present
  cleanId = cleanId.replace(/^\/?persons\|?/, '').replace(/^\/?competitions\|?/, '');
  // If person and does not start with 'A', add 'A' at the beginning
  if (isPerson) {
    const match = RegExp(/^([A-Z]+)\|ID\|(.*)$/).exec(cleanId);
    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, prefix, innerId] = match;

      if (!innerId.startsWith('A')) {
        cleanId = `${prefix}|ID|A${innerId}`;
      }
    } else if (!cleanId.startsWith('A')) {
      cleanId = `A${cleanId}`;
    }
  }
  // If already in the form PREFIX|ID|something
  if (/^[A-Z]+\|ID\|/.test(cleanId)) {
    cleanId = cleanId.replace(/^OLYMPEDIA/, 'HORD');
  } else {
    // Wrap in HORD|ID|... if not already wrapped
    cleanId = `HORD|ID|${cleanId}`;
  }

  return encodeURIComponent(cleanId);
};
export function encodeLinks(text: string) {
  // Bold [Text](/definition/OLYMPEDIA|ID|xxx)
  text = text.replace(/\[([^\]]+)\]\(\/definition\/OLYMPEDIA\|ID\|[^)]+\)/g, (_, label) => {
    return `**${label}**`;
  });
  // Competitions: [Name](competitions/ID) → /competition/ID
  text = text.replace(/\[([^\]]+)\]\(competitions\/([^)]+)\)/g, (_, name, id) => {
    return `[${name}](/explorer/competitions/${normalizeId(id, false)})`;
  });
  // Markdown: [Name](persons/ID)
  text = text.replace(/\[([^\]]+)\]\(persons\/([^)]+)\)/g, (_, name, id) => {
    return `[${name}](/explorer/persons/${normalizeId(id, true)})`;
  });

  // HTML: <a href="persons/ID">
  text = text.replace(/<a\s+href="persons\/([^"]+)"/g, (_, id) => {
    return `<a href="/explorer/persons/${normalizeId(id, true)}"`;
  });

  // Markdown: [Name](/persons/ID or /persons|ID)
  text = text.replace(/\[([^\]]+)\]\(\/persons\/?([^)]+)\)/g, (_, name, id) => {
    return `[${name}](/explorer/persons/${normalizeId(id, true)})`;
  });
  // Markdown: [Name](/person/ID or /person|ID)
  text = text.replace(/\[([^\]]+)\]\(\/person\/?([^)]+)\)/g, (_, name, id) => {
    return `[${name}](/explorer/persons/${normalizeId(id, true)})`;
  });

  // HTML: <a href="/person/ID or /person|ID">
  text = text.replace(/<a\s+href="\/person\/?([^"]+)"/g, (_, id) => {
    return `<a href="/explorer/persons/${normalizeId(id, true)}"`;
  });
  return text;
}
export function containsUrl(text: string): boolean {
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  return urlRegex.test(text);
}
export function needsEncoding(text: string): boolean {
  const hasPersonsLinks =
    /\[([^\]]+)\]\(persons\/[^)]+\)/.test(text) || /<a\s+href="persons\/[^"]+"/.test(text);

  const hasPipesInPersonLinks =
    /\[([^\]]+)\]\(\/person\/[^)]+\|[^)]+\)/.test(text) ||
    /<a\s+href="\/person\/[^"]*\|[^"]*"/.test(text);

  const hasDefinitionOLYMPEDIA = /\[([^\]]+)\]\(\/definition\/OLYMPEDIA\|ID\|[^)]+\)/.test(text);

  const hasCompetitions =
    /\[([^\]]+)\]\(competitions\/[^)]+\)/.test(text) ||
    /<a\s+href="competitions\/[^"]+"/.test(text);
  const hasExternalLinks = /\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/.test(text);
  const hasMarkdownExternalLinks = /\[[^\]]*https?:\/\/[^\]]*\]\(https?:\/\/[^)]+\)/.test(text);
  return (
    hasPersonsLinks ||
    hasPipesInPersonLinks ||
    hasDefinitionOLYMPEDIA ||
    hasCompetitions ||
    hasExternalLinks ||
    hasMarkdownExternalLinks
  );
}
export function autoLinkUrls(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    const label = extractNiceLabel(url);
    return `[${label}](${url})`;
  });
}
function extractNiceLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, '');
    const params = new URLSearchParams(parsed.search);
    const competitorId =
      params.get('competitorid') ?? params.get('id') ?? params.get('personissfid');
    if (competitorId) {
      return `${domain} - ID ${competitorId}`;
    }
    const profileMatch = RegExp(/^\/profile\/(\d+)/).exec(parsed.pathname);
    if (profileMatch) {
      return `${domain} - ID ${profileMatch[1]}`;
    }
    return domain;
  } catch {
    return url;
  }
}

export function formatHeadingsAndQuotes(text: string): string {
  let value = text.replace(/["“”]([^"“”]+)["“”]/g, (_, quoted) => {
    return `*“${quoted}”*`;
  });

  value = value.replace(
    /([A-Z]{5,}(?:\s+[A-Z]{5,})*)(?=\s+[A-Z][a-z])/g,
    (match) => ` **${match}**`
  );

  return value.replaceAll('<BR/>', '\n').replaceAll('<br/>', '\n').replaceAll('<br/>', '\n');
}
export function convertQuotesToBlockquote(text: string): string {
  return text.replace(/"([^"]+)"/gs, (_, quoted) => {
    // Add `> ` at the start of each line inside the quote
    const e = quoted
      .split('\n')
      .map((line: string) => `> ${line.trim()}`)
      .join('\n');
    return `\n${e}\n`;
  });
}
