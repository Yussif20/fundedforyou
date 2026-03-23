type LexicalNode = {
  type: string;
  text?: string;
  format?: number;
  style?: string;
  mode?: string;
  detail?: number;
  direction?: "ltr" | "rtl" | null;
  children?: LexicalNode[];
  tag?: string;
  url?: string;
  target?: string;
  rel?: string | null;
  title?: string | null;
  listType?: "bullet" | "number";
  value?: number;
  checked?: boolean;
  language?: string;
  // Table-specific fields
  headerState?: number;
  colSpan?: number;
  rowSpan?: number;
  width?: number | null;
  backgroundColor?: string | null;
};

export function lexicalToHtml(lexicalJson: string): string {
  try {
    const lexical = JSON.parse(lexicalJson);

    const processNode = (node: LexicalNode): string => {
      if (!node) return "";

      const styleAttr = node.style ? ` style="${node.style}"` : "";
      const dirAttr =
        node.direction === "rtl"
          ? ` dir="rtl"`
          : node.direction === "ltr"
            ? ` dir="ltr"`
            : "";

      switch (node.type) {
        case "root":
          return (node.children || []).map(processNode).join("");

        case "paragraph":
          return `<p${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</p>`;

        case "heading": {
          const tag = node.tag || "h1";
          return `<${tag}${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</${tag}>`;
        }

        case "text": {
          let text = node.text || "";

          if (node.format) {
            if (node.format & 1) text = `<strong>${text}</strong>`;
            if (node.format & 2) text = `<em>${text}</em>`;
            if (node.format & 4) text = `<s>${text}</s>`;
            if (node.format & 8) text = `<u>${text}</u>`;
            if (node.format & 16) text = `<code>${text}</code>`;
            if (node.format & 32) text = `<mark>${text}</mark>`;
          }

          if (node.style) {
            text = `<span style="${node.style}">${text}</span>`;
          }

          return text;
        }

        case "link":
          return `<a href="${node.url || "#"}"${
            node.target ? ` target="${node.target}"` : ""
          }${node.rel ? ` rel="${node.rel}"` : ""}${
            node.title ? ` title="${node.title}"` : ""
          }${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</a>`;

        case "list": {
          const listTag = node.listType === "number" ? "ol" : "ul";
          return `<${listTag}${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</${listTag}>`;
        }

        case "listitem": {
          const checkedAttr = node.checked ? " checked" : "";
          return `<li${checkedAttr}${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</li>`;
        }

        case "quote":
          return `<blockquote${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</blockquote>`;

        case "code": {
          const langAttr = node.language
            ? ` data-language="${node.language}"`
            : "";
          return `<pre${langAttr}${dirAttr}${styleAttr}><code>${(node.children || []).map(processNode).join("")}</code></pre>`;
        }

        case "linebreak":
          return "<br />";

        case "table":
          return `<table${dirAttr}${styleAttr}>${(node.children || []).map(processNode).join("")}</table>`;

        case "tablerow":
          return `<tr>${(node.children || []).map(processNode).join("")}</tr>`;

        case "tablecell": {
          const isHeader = (node.headerState ?? 0) !== 0;
          const cellTag = isHeader ? "th" : "td";
          const colSpanAttr =
            node.colSpan && node.colSpan > 1
              ? ` colspan="${node.colSpan}"`
              : "";
          const rowSpanAttr =
            node.rowSpan && node.rowSpan > 1
              ? ` rowspan="${node.rowSpan}"`
              : "";
          const widthAttr = node.width ? ` width="${node.width}"` : "";
          const bgStyle = node.backgroundColor
            ? `background-color:${node.backgroundColor};`
            : "";
          const combinedStyle = bgStyle + (node.style || "");
          const cellStyleAttr = combinedStyle
            ? ` style="${combinedStyle}"`
            : "";
          return `<${cellTag}${colSpanAttr}${rowSpanAttr}${widthAttr}${cellStyleAttr}>${(node.children || []).map(processNode).join("")}</${cellTag}>`;
        }

        default:
          return (node.children || []).map(processNode).join("");
      }
    };

    return (lexical.root && processNode(lexical.root)) || "";
  } catch (error) {
    console.error("Failed to convert Lexical JSON to HTML:", error);
    return "<p>Error rendering content</p>";
  }
}
