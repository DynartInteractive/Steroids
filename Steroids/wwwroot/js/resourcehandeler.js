import { svgResources, audioResources } from './resources.js';
class ResourceHandler {
    constructor() {
        this.resources = {};
    }

    loadResource(url, id) {
        throw new Error('loadResource method must be implemented by subclasses');
    }

    getResource(id) {
        return this.resources[id];
    }
}

class AudioResourceHandler extends ResourceHandler {
    async loadResource(url, id) {
        const audio = new Audio(url);
        await new Promise((resolve) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
        });
        this.resources[id] = audio;
    }
}

class SvgResourceHandler extends ResourceHandler {
    async loadResource(url, id) {
        const response = await fetch(url);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        this.resources[id] = svgElement;
    }
}
class InitResources{
    async initializeResources(svgHandler, audioHandler) {
        // Load SVG resources
        for (const resource of svgResources) {
            await svgHandler.loadResource(resource.url, resource.id);
        }

        // Load audio resources
        for (const resource of audioResources) {
            await audioHandler.loadResource(resource.url, resource.id);
        }
    }
}

export { ResourceHandler, AudioResourceHandler, SvgResourceHandler, InitResources};