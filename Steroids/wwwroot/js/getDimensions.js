export function getDimensions(svgElement) {
    if (!svgElement) return { width: 0, height: 0 };
    const bbox = svgElement.getBBox();
    return {
        width: bbox.width,
        height: bbox.height
    };
}
