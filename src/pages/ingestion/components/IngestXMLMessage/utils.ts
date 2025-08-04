import xmlFormatter from 'xml-formatter';

export function parseMixedJsonXml(input: string) {
  let json = null;
  let xmlDoc = null;
  let formattedXml = null;
  let jsonEndIndex = -1;

  // Try to detect JSON
  if (input.trim().startsWith('{')) {
    for (let i = 1; i < input.length; i++) {
      const candidate = input.substring(0, i);
      try {
        json = JSON.parse(candidate);
        jsonEndIndex = i;
        break;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Ignore JSON parse errors as we are searching for the valid JSON substring
        // Optionally, you can log the error for debugging:
        // console.debug('JSON parse error:', err);
        continue;
      }
    }
  }

  // Extract XML string
  const xmlString = jsonEndIndex !== -1 ? input.substring(jsonEndIndex).trim() : input.trim();

  if (xmlString.startsWith('<')) {
    try {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      // Check for XML parser errors
      if (xmlDoc.querySelector('parsererror')) {
        console.error('XML parsing error.');
        xmlDoc = null;
      } else {
        formattedXml = xmlFormatter(xmlString, {
          indentation: ' ',
          collapseContent: true,
          lineSeparator: '\n',
        });
      }
    } catch (err) {
      console.error('Error parsing XML:', err);
    }
  }

  return {
    json,
    xml: xmlDoc,
    formattedXml, // ✅ nicely formatted string
  };
}
