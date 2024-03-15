// download.ts

import moment from "moment";

/*
 * Download data.
 */
export function download(
  data: string,
  filenameSuffix: string = "",
  format: string = "json"
) {
  const element: any = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/${format};charset=UTF-8,${encodeURIComponent(data)}`
  );
  const now = moment().format("YYYYMMDD_HHMMSS");
  element.setAttribute(
    "download",
    `nest-desktop-${filenameSuffix}-${now}.${format}`
  );
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Download svg image.
 */
export function downloadSVGImage(svg: any, filename: string): void {
  // Get svg source.
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  //  Add name spaces.
  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
  }

  // Add xml declaration.
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // Convert svg source to URI data scheme.
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

  // Create download link.
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  const now = moment().format("YYYYMMDD_HHMMSS");
  downloadLink.download = `nest_desktop-${filename}-${now}.svg`;
  document.body.appendChild(downloadLink);

  // Apply download.
  downloadLink.click();

  // Remove download link.
  document.body.removeChild(downloadLink);
}
