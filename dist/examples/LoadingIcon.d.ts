import { Element } from '@lume/element';
export type LoadingIconAttributes = 'color';
export declare class LoadingIcon extends Element {
    color: string;
    template: () => Node | Node[];
    css: string;
}
import type { ElementAttributes } from '@lume/element';
declare module '@lume/element' {
    namespace JSX {
        interface IntrinsicElements {
            'loading-icon': ElementAttributes<LoadingIcon, LoadingIconAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'loading-icon': LoadingIcon;
    }
}
//# sourceMappingURL=LoadingIcon.d.ts.map