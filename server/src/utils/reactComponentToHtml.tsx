import { render } from "@react-email/components";
import React from "react";

export const reactComponentToHtml = (
  Component: React.ComponentType<any>,
  props: any
) => {
  const html = render(<Component {...props} />);
  return html;
};
