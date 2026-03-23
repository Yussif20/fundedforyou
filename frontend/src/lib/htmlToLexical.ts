export function htmlToLexical(htmlString: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const getDir = (el: HTMLElement): "ltr" | "rtl" =>
      el.getAttribute("dir") === "rtl" ? "rtl" : "ltr";

    // Process nodes recursively
    const processNode = (node: Node): any => {
      // Handle text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent?.trim();
        if (!textContent) return null;

        return {
          type: "text",
          text: textContent,
          format: 0,
          style: "",
          mode: "normal",
          detail: 0,
        };
      }

      // Handle element nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        // Paragraph
        if (tagName === "p") {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          return {
            type: "paragraph",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children.length
              ? children
              : [{ type: "text", text: "", format: 0 }],
          };
        }

        // Headings
        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          return {
            type: "heading",
            tag: tagName,
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children.length
              ? children
              : [{ type: "text", text: "", format: 0 }],
          };
        }

        // Lists
        if (tagName === "ul" || tagName === "ol") {
          const children = Array.from(element.children)
            .filter((child) => child.tagName.toLowerCase() === "li")
            .map(processNode)
            .filter(Boolean);

          return {
            type: "list",
            listType: tagName === "ul" ? "bullet" : "number",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children,
          };
        }

        // List items
        if (tagName === "li") {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          return {
            type: "listitem",
            value: 1,
            checked: false,
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children.length
              ? children
              : [{ type: "text", text: "", format: 0 }],
          };
        }

        // Blockquotes
        if (tagName === "blockquote") {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          return {
            type: "quote",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children.length
              ? children
              : [{ type: "text", text: "", format: 0 }],
          };
        }

        // Links
        if (tagName === "a") {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          return {
            type: "link",
            url: element.getAttribute("href") || "",
            target: element.getAttribute("target") || "_self",
            rel: element.getAttribute("rel") || null,
            title: element.getAttribute("title") || null,
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children.length
              ? children
              : [{ type: "text", text: "", format: 0 }],
          };
        }

        // Code blocks
        if (tagName === "pre") {
          const codeElement = element.querySelector("code");
          const content = codeElement
            ? codeElement.textContent || ""
            : element.textContent || "";

          return {
            type: "code",
            language: element.getAttribute("data-language") || "javascript",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: [
              {
                type: "text",
                text: content,
                format: 16, // Code format flag
                style: "",
                mode: "normal",
                detail: 0,
              },
            ],
          };
        }

        // Line breaks
        if (tagName === "br") {
          return {
            type: "linebreak",
            version: 1,
          };
        }

        // Table
        if (tagName === "table") {
          const rows: Element[] = [];
          Array.from(element.children).forEach((child) => {
            const ct = child.tagName.toLowerCase();
            if (ct === "tr") {
              rows.push(child);
            } else if (["thead", "tbody", "tfoot"].includes(ct)) {
              Array.from(child.children).forEach((row) => {
                if (row.tagName.toLowerCase() === "tr") rows.push(row);
              });
            }
          });

          return {
            type: "table",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: rows.map(processNode).filter(Boolean),
          };
        }

        // Table row
        if (tagName === "tr") {
          const children = Array.from(element.children)
            .filter((child) =>
              ["td", "th"].includes(child.tagName.toLowerCase()),
            )
            .map(processNode)
            .filter(Boolean);

          return {
            type: "tablerow",
            format: "",
            indent: 0,
            direction: "ltr",
            children,
          };
        }

        // Table cell
        if (tagName === "td" || tagName === "th") {
          const isHeader = tagName === "th";
          let cellChildren = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          // Lexical table cells require block-level children — wrap bare text in a paragraph
          if (
            cellChildren.length === 0 ||
            cellChildren.some((c: any) => c.type === "text")
          ) {
            cellChildren = [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                direction: getDir(element),
                children:
                  cellChildren.length > 0
                    ? cellChildren
                    : [{ type: "text", text: "", format: 0 }],
              },
            ];
          }

          return {
            type: "tablecell",
            headerState: isHeader ? 1 : 0,
            colSpan: parseInt(element.getAttribute("colspan") || "1", 10),
            rowSpan: parseInt(element.getAttribute("rowspan") || "1", 10),
            width: null,
            backgroundColor: null,
            format: "",
            indent: 0,
            direction: getDir(element),
            children: cellChildren,
          };
        }

        // Formatting elements that wrap text
        const formatFlags: { [key: string]: number } = {
          strong: 1, // Bold
          b: 1, // Bold
          em: 2, // Italic
          i: 2, // Italic
          s: 4, // Strikethrough
          strike: 4, // Strikethrough
          u: 8, // Underline
          code: 16, // Code
          mark: 32, // Highlight
        };

        if (formatFlags.hasOwnProperty(tagName)) {
          const children = Array.from(element.childNodes)
            .map(processNode)
            .filter(Boolean);

          // Apply formatting to text nodes
          const applyFormatting = (nodes: any[]): any[] => {
            return nodes.map((node) => {
              if (node.type === "text") {
                return {
                  ...node,
                  format: node.format | formatFlags[tagName],
                };
              } else if (node.children) {
                return {
                  ...node,
                  children: applyFormatting(node.children),
                };
              }
              return node;
            });
          };

          return applyFormatting(children)[0] || null;
        }

        // For other elements, process children recursively
        const children = Array.from(element.childNodes)
          .map(processNode)
          .filter(Boolean);

        if (children.length > 0) {
          // Return first child if there's only one, otherwise wrap in paragraph
          if (children.length === 1) {
            return children[0];
          }

          // Default to paragraph for unhandled block elements
          return {
            type: "paragraph",
            format: "",
            indent: 0,
            direction: getDir(element),
            children: children,
          };
        }

        return null;
      }

      return null;
    };

    // Get the body content and process it
    const bodyChildren = Array.from(doc.body.childNodes)
      .map(processNode)
      .filter(Boolean);

    // Create the root structure
    const rootNode = {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: bodyChildren.length
        ? bodyChildren
        : [
            {
              type: "paragraph",
              format: "",
              indent: 0,
              direction: "ltr",
              children: [{ type: "text", text: "", format: 0 }],
            },
          ],
    };

    // Create the full Lexical state
    const lexicalState = {
      root: rootNode,
    };

    return JSON.stringify(lexicalState);
  } catch (error) {
    console.error("Failed to convert HTML to Lexical:", error);
    return JSON.stringify({
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            direction: "ltr",
            children: [
              {
                type: "text",
                text: "Error converting content",
                format: 0,
              },
            ],
          },
        ],
      },
    });
  }
}
