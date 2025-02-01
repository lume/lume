export const isMesh = (o) => 'isMesh' in o;
export function isRenderItem(obj) {
    return 'geometry' in obj && 'material' in obj;
}
export function isPerspectiveCamera(camera) {
    return !!camera.isPerspectiveCamera;
}
export function isOrthographicCamera(camera) {
    return !!camera.isOrthographicCamera;
}
//# sourceMappingURL=is.js.map