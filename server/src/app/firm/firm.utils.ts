export function lexicalToHtml(contentString: string): string {
  try {
    const serializedState = JSON.parse(contentString);
    const root = serializedState.root;

    const processNode = (node: any): string => {
      if (!node) return "";

      if (node.type === "root") {
        return node.children.map(processNode).join("");
      }

      if (node.type === "paragraph") {
        const content = node.children?.map(processNode).join("") || "";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<p${style}>${content}</p>`;
      }

      if (node.type === "heading") {
        const content = node.children?.map(processNode).join("") || "";
        const tag = node.tag || "h1";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<${tag}${style}>${content}</${tag}>`;
      }

      if (node.type === "text") {
        let text = node.text || "";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";

        if (node.format & 1) text = `<strong${style}>${text}</strong>`;
        if (node.format & 2) text = `<em${style}>${text}</em>`;
        if (node.format & 4) text = `<s${style}>${text}</s>`;
        if (node.format & 8) text = `<u${style}>${text}</u>`;
        if (node.format & 16) text = `<code${style}>${text}</code>`;

        // If no formatting, wrap in span to apply style
        if (!(node.format & 31) && style) {
          text = `<span${style}>${text}</span>`;
        }

        return text;
      }

      if (node.type === "linebreak") {
        return "<br>";
      }

      if (node.type === "list") {
        const content = node.children?.map(processNode).join("") || "";
        const tag = node.listType === "bullet" ? "ul" : "ol";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<${tag}${style}>${content}</${tag}>`;
      }

      if (node.type === "listitem") {
        const content = node.children?.map(processNode).join("") || "";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<li${style}>${content}</li>`;
      }

      if (node.type === "link") {
        const content = node.children?.map(processNode).join("") || "";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<a href="${node.url}" target="${
          node.target || "_self"
        }"${style}>${content}</a>`;
      }

      if (node.type === "code") {
        const content = node.children?.map(processNode).join("") || "";
        const style = node.textStyle ? ` style="${node.textStyle}"` : "";
        return `<pre${style}><code>${content}</code></pre>`;
      }

      return "";
    };

    return processNode(root);
  } catch (error) {
    console.error("Failed to parse content:", error);
    return "<p>Error displaying content</p>";
  }
}
