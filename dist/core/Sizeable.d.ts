import { TreeNode } from './TreeNode.js';
import { XYZSizeModeValues } from '../xyz-values/XYZSizeModeValues.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import { type XYZNonNegativeNumberValuesProperty, type XYZNonNegativeNumberValuesPropertyFunction, type XYZSizeModeValuesProperty } from './PropertyAnimator.js';
export type SizeableAttributes = 'sizeMode' | 'size';
declare const Sizeable_base: {
    new (...a: any[]): {
        _setPropertyXYZ<K extends keyof any, V>(name: K, xyz: import("../xyz-values/XYZValues.js").XYZValues, newValue: V): void;
        _setPropertySingle<K extends keyof any, V>(name: K, setter: (newValue: any[K]) => void, newValue: V): void;
        "__#16@#propertyFunctions": Map<string, import("./Motor.js").RenderTask> | null;
        "__#16@#settingValueFromPropFunction": boolean;
        "__#16@#handleXYZPropertyFunction"(fn: import("./PropertyAnimator.js").XYZNumberValuesPropertyFunction, name: keyof any, xyz: import("../xyz-values/XYZValues.js").XYZValues): void;
        "__#16@#handleSinglePropertyFunction"(fn: import("./PropertyAnimator.js").SinglePropertyFunction, name: keyof any): void;
        "__#16@#removePropertyFunction"(name: keyof any): void;
        removeAllPropertyFunctions(): void;
        disconnectedCallback(): void;
        connectedCallback?(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
} & {
    new (...a: any[]): {
        isScene: boolean;
        isElement3D: boolean;
        skipShadowObservation: boolean;
        attachShadow(options: ShadowRootInit): ShadowRoot;
        readonly _hasShadowRoot: boolean;
        readonly _isPossiblyDistributedToShadowRoot: boolean;
        readonly _shadowRootParent: any | null;
        readonly _shadowRootChildren: any[];
        readonly _distributedShadowRootChildren: any[];
        readonly _distributedParent: any | null;
        readonly _distributedChildren: any[] | null;
        __composedParent: Element | null;
        readonly composedParent: Element | null;
        readonly __isComposed: Element | null;
        readonly isComposed: Element | null;
        __getComposedParent(): HTMLElement | null;
        readonly _composedChildren: any[];
        exposedShadowRoot?: ShadowRoot;
        isPossiblySlotted: boolean;
        "__#12@#prevAssignedNodes"?: WeakMap<HTMLSlotElement, Element[]>;
        readonly __previousSlotAssignedNodes: WeakMap<HTMLSlotElement, Element[]>;
        slottedParent: any | null;
        shadowParent: any | null;
        slottedChildren: Set<any> | null;
        "__#12@#this": any;
        "__#12@#shadowRootChildAdded"(child: Element): void;
        "__#12@#shadowRootChildRemoved"(child: Element): void;
        readonly __onChildSlotChange: (event: Event) => void;
        __onChildSlotChange__?: ((event: Event) => void) | undefined;
        childComposedCallback?(composedChild: Element, compositionType: import("./CompositionTracker.js").CompositionType): void;
        childUncomposedCallback?(uncomposedChild: Element, compositionType: import("./CompositionTracker.js").CompositionType): void;
        composedCallback?(composedParent: Element, compositionType: import("./CompositionTracker.js").CompositionType): void;
        uncomposedCallback?(uncomposedParent: Element, compositionType: import("./CompositionTracker.js").CompositionType): void;
        "__#12@#discrepancy": boolean;
        __handleSlottedChildren(slot: HTMLSlotElement): void;
        __getSlottedChildDifference(slot: HTMLSlotElement): {
            added: Node[];
            removed: Node[];
        };
        "__#12@#getCurrentAssignedNodes"(slot: HTMLSlotElement): Element[];
        traverseComposed(visitor: (el: any) => void, waitForUpgrade?: boolean): Promise<void> | void;
        connectedCallback?(): void;
        disconnectedCallback?(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
        accessKey: string;
        readonly accessKeyLabel: string;
        autocapitalize: string;
        dir: string;
        draggable: boolean;
        hidden: boolean;
        inert: boolean;
        innerText: string;
        lang: string;
        readonly offsetHeight: number;
        readonly offsetLeft: number;
        readonly offsetParent: Element | null;
        readonly offsetTop: number;
        readonly offsetWidth: number;
        outerText: string;
        popover: string | null;
        spellcheck: boolean;
        title: string;
        translate: boolean;
        attachInternals(): ElementInternals;
        click(): void;
        hidePopover(): void;
        showPopover(): void;
        togglePopover(force?: boolean): boolean;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        readonly attributes: NamedNodeMap;
        readonly classList: DOMTokenList;
        className: string;
        readonly clientHeight: number;
        readonly clientLeft: number;
        readonly clientTop: number;
        readonly clientWidth: number;
        id: string;
        innerHTML: string;
        readonly localName: string;
        readonly namespaceURI: string | null;
        onfullscreenchange: ((this: Element, ev: Event) => any) | null;
        onfullscreenerror: ((this: Element, ev: Event) => any) | null;
        outerHTML: string;
        readonly ownerDocument: Document;
        readonly part: DOMTokenList;
        readonly prefix: string | null;
        readonly scrollHeight: number;
        scrollLeft: number;
        scrollTop: number;
        readonly scrollWidth: number;
        readonly shadowRoot: ShadowRoot | null;
        slot: string;
        readonly tagName: string;
        checkVisibility(options?: CheckVisibilityOptions): boolean;
        closest<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
        closest<K extends keyof SVGElementTagNameMap>(selector: K): SVGElementTagNameMap[K] | null;
        closest<K extends keyof MathMLElementTagNameMap>(selector: K): MathMLElementTagNameMap[K] | null;
        closest<E extends Element = Element>(selectors: string): E | null;
        computedStyleMap(): StylePropertyMapReadOnly;
        getAttribute(qualifiedName: string): string | null;
        getAttributeNS(namespace: string | null, localName: string): string | null;
        getAttributeNames(): string[];
        getAttributeNode(qualifiedName: string): Attr | null;
        getAttributeNodeNS(namespace: string | null, localName: string): Attr | null;
        getBoundingClientRect(): DOMRect;
        getClientRects(): DOMRectList;
        getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
        getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
        getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
        getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
        getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
        getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1999/xhtml", localName: string): HTMLCollectionOf<HTMLElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/2000/svg", localName: string): HTMLCollectionOf<SVGElement>;
        getElementsByTagNameNS(namespaceURI: "http://www.w3.org/1998/Math/MathML", localName: string): HTMLCollectionOf<MathMLElement>;
        getElementsByTagNameNS(namespace: string | null, localName: string): HTMLCollectionOf<Element>;
        getHTML(options?: GetHTMLOptions): string;
        hasAttribute(qualifiedName: string): boolean;
        hasAttributeNS(namespace: string | null, localName: string): boolean;
        hasAttributes(): boolean;
        hasPointerCapture(pointerId: number): boolean;
        insertAdjacentElement(where: InsertPosition, element: Element): Element | null;
        insertAdjacentHTML(position: InsertPosition, string: string): void;
        insertAdjacentText(where: InsertPosition, data: string): void;
        matches(selectors: string): boolean;
        releasePointerCapture(pointerId: number): void;
        removeAttribute(qualifiedName: string): void;
        removeAttributeNS(namespace: string | null, localName: string): void;
        removeAttributeNode(attr: Attr): Attr;
        requestFullscreen(options?: FullscreenOptions): Promise<void>;
        requestPointerLock(options?: PointerLockOptions): Promise<void>;
        scroll(options?: ScrollToOptions): void;
        scroll(x: number, y: number): void;
        scrollBy(options?: ScrollToOptions): void;
        scrollBy(x: number, y: number): void;
        scrollIntoView(arg?: boolean | ScrollIntoViewOptions): void;
        scrollTo(options?: ScrollToOptions): void;
        scrollTo(x: number, y: number): void;
        setAttribute(qualifiedName: string, value: string): void;
        setAttributeNS(namespace: string | null, qualifiedName: string, value: string): void;
        setAttributeNode(attr: Attr): Attr | null;
        setAttributeNodeNS(attr: Attr): Attr | null;
        setHTMLUnsafe(html: string): void;
        setPointerCapture(pointerId: number): void;
        toggleAttribute(qualifiedName: string, force?: boolean): boolean;
        webkitMatchesSelector(selectors: string): boolean;
        readonly baseURI: string;
        readonly childNodes: NodeListOf<ChildNode>;
        readonly firstChild: ChildNode | null;
        readonly isConnected: boolean;
        readonly lastChild: ChildNode | null;
        readonly nextSibling: ChildNode | null;
        readonly nodeName: string;
        readonly nodeType: number;
        nodeValue: string | null;
        readonly parentElement: HTMLElement | null;
        readonly parentNode: ParentNode | null;
        readonly previousSibling: ChildNode | null;
        textContent: string | null;
        appendChild<T extends Node>(node: T): T;
        cloneNode(deep?: boolean): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node | null): boolean;
        getRootNode(options?: GetRootNodeOptions): Node;
        hasChildNodes(): boolean;
        insertBefore<T extends Node>(node: T, child: Node | null): T;
        isDefaultNamespace(namespace: string | null): boolean;
        isEqualNode(otherNode: Node | null): boolean;
        isSameNode(otherNode: Node | null): boolean;
        lookupNamespaceURI(prefix: string | null): string | null;
        lookupPrefix(namespace: string | null): string | null;
        normalize(): void;
        removeChild<T extends Node>(child: T): T;
        replaceChild<T extends Node>(node: Node, child: T): T;
        readonly ELEMENT_NODE: 1;
        readonly ATTRIBUTE_NODE: 2;
        readonly TEXT_NODE: 3;
        readonly CDATA_SECTION_NODE: 4;
        readonly ENTITY_REFERENCE_NODE: 5;
        readonly ENTITY_NODE: 6;
        readonly PROCESSING_INSTRUCTION_NODE: 7;
        readonly COMMENT_NODE: 8;
        readonly DOCUMENT_NODE: 9;
        readonly DOCUMENT_TYPE_NODE: 10;
        readonly DOCUMENT_FRAGMENT_NODE: 11;
        readonly NOTATION_NODE: 12;
        readonly DOCUMENT_POSITION_DISCONNECTED: 1;
        readonly DOCUMENT_POSITION_PRECEDING: 2;
        readonly DOCUMENT_POSITION_FOLLOWING: 4;
        readonly DOCUMENT_POSITION_CONTAINS: 8;
        readonly DOCUMENT_POSITION_CONTAINED_BY: 16;
        readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32;
        dispatchEvent(event: Event): boolean;
        ariaAtomic: string | null;
        ariaAutoComplete: string | null;
        ariaBrailleLabel: string | null;
        ariaBrailleRoleDescription: string | null;
        ariaBusy: string | null;
        ariaChecked: string | null;
        ariaColCount: string | null;
        ariaColIndex: string | null;
        ariaColSpan: string | null;
        ariaCurrent: string | null;
        ariaDescription: string | null;
        ariaDisabled: string | null;
        ariaExpanded: string | null;
        ariaHasPopup: string | null;
        ariaHidden: string | null;
        ariaInvalid: string | null;
        ariaKeyShortcuts: string | null;
        ariaLabel: string | null;
        ariaLevel: string | null;
        ariaLive: string | null;
        ariaModal: string | null;
        ariaMultiLine: string | null;
        ariaMultiSelectable: string | null;
        ariaOrientation: string | null;
        ariaPlaceholder: string | null;
        ariaPosInSet: string | null;
        ariaPressed: string | null;
        ariaReadOnly: string | null;
        ariaRequired: string | null;
        ariaRoleDescription: string | null;
        ariaRowCount: string | null;
        ariaRowIndex: string | null;
        ariaRowSpan: string | null;
        ariaSelected: string | null;
        ariaSetSize: string | null;
        ariaSort: string | null;
        ariaValueMax: string | null;
        ariaValueMin: string | null;
        ariaValueNow: string | null;
        ariaValueText: string | null;
        role: string | null;
        animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions): Animation;
        getAnimations(options?: GetAnimationsOptions): Animation[];
        after(...nodes: (Node | string)[]): void;
        before(...nodes: (Node | string)[]): void;
        remove(): void;
        replaceWith(...nodes: (Node | string)[]): void;
        readonly nextElementSibling: Element | null;
        readonly previousElementSibling: Element | null;
        readonly childElementCount: number;
        readonly children: HTMLCollection;
        readonly firstElementChild: Element | null;
        readonly lastElementChild: Element | null;
        append(...nodes: (Node | string)[]): void;
        prepend(...nodes: (Node | string)[]): void;
        querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
        querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
        querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K] | null;
        querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K] | null;
        querySelector<E extends Element = Element>(selectors: string): E | null;
        querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
        querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
        querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
        querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
        querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
        replaceChildren(...nodes: (Node | string)[]): void;
        readonly assignedSlot: HTMLSlotElement | null;
        behaviors: import("packages/element-behaviors/dist/BehaviorMap.js").BehaviorMap;
        readonly attributeStyleMap: StylePropertyMap;
        readonly style: CSSStyleDeclaration;
        contentEditable: string;
        enterKeyHint: string;
        inputMode: string;
        readonly isContentEditable: boolean;
        onabort: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onanimationcancel: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationend: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationiteration: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onanimationstart: ((this: GlobalEventHandlers, ev: AnimationEvent) => any) | null;
        onauxclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onbeforeinput: ((this: GlobalEventHandlers, ev: InputEvent) => any) | null;
        onbeforetoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onblur: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        oncancel: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncanplaythrough: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onclose: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncontextlost: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncontextmenu: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        oncontextrestored: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncopy: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        oncuechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oncut: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        ondblclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        ondrag: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragend: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragenter: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragleave: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragover: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondragstart: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondrop: ((this: GlobalEventHandlers, ev: DragEvent) => any) | null;
        ondurationchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onemptied: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onended: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onerror: OnErrorEventHandler;
        onfocus: ((this: GlobalEventHandlers, ev: FocusEvent) => any) | null;
        onformdata: ((this: GlobalEventHandlers, ev: FormDataEvent) => any) | null;
        ongotpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        oninput: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        oninvalid: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onkeydown: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeypress: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onkeyup: ((this: GlobalEventHandlers, ev: KeyboardEvent) => any) | null;
        onload: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadeddata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadedmetadata: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onloadstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onlostpointercapture: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseenter: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseleave: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmousemove: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseout: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseover: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onmouseup: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
        onpaste: ((this: GlobalEventHandlers, ev: ClipboardEvent) => any) | null;
        onpause: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplay: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onplaying: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onpointercancel: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerenter: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerleave: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointermove: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerout: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerover: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onpointerup: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;
        onprogress: ((this: GlobalEventHandlers, ev: ProgressEvent) => any) | null;
        onratechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onreset: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onresize: ((this: GlobalEventHandlers, ev: UIEvent) => any) | null;
        onscroll: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onscrollend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsecuritypolicyviolation: ((this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any) | null;
        onseeked: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onseeking: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselect: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectionchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onselectstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onslotchange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onstalled: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onsubmit: ((this: GlobalEventHandlers, ev: SubmitEvent) => any) | null;
        onsuspend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontimeupdate: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontoggle: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        ontouchcancel?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchend?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchmove?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontouchstart?: ((this: GlobalEventHandlers, ev: TouchEvent) => any) | null | undefined;
        ontransitioncancel: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionend: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionrun: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        ontransitionstart: ((this: GlobalEventHandlers, ev: TransitionEvent) => any) | null;
        onvolumechange: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwaiting: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwebkitanimationend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwebkitanimationiteration: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwebkitanimationstart: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwebkittransitionend: ((this: GlobalEventHandlers, ev: Event) => any) | null;
        onwheel: ((this: GlobalEventHandlers, ev: WheelEvent) => any) | null;
        onbeforexrselect: ((this: GlobalEventHandlers, ev: XRSessionEvent) => any) | null;
        autofocus: boolean;
        readonly dataset: DOMStringMap;
        nonce?: string;
        tabIndex: number;
        blur(): void;
        focus(options?: FocusOptions): void;
    };
    observedAttributes?: string[];
} & typeof TreeNode;
/**
 * @class Sizeable - Provides features for defining the size volume of an object in 3D space.
 *
 * The properties of `Sizeable` all follow a common usage pattern,
 * described in the [`Common Attributes`](../../guide/common-attributes) doc.
 *
 * @extends TreeNode
 */
export declare class Sizeable extends Sizeable_base {
    #private;
    /**
     * @property {string | [x?: string, y?: string, z?: string] | {x?: string, y?: string, z?: string} | XYZSizeModeValues | null} sizeMode -
     *
     * *attribute*
     *
     * Default: <code>new [XYZSizeModeValues](../xyz-values/XYZSizeModeValues)('literal', 'literal', 'literal')</code>
     *
     * Set the size mode for each axis. Possible values are `"literal"` (or `"l"` for short) and
     * `"proportional"` (or `"p"` for short). For example,
     *
     * ```html
     * <lume-element3d size-mode="proportional literal"></lume-element3d>
     * <lume-element3d size-mode="p l"></lume-element3d>
     * ```
     *
     * The value of `.sizeMode` for a particular axis dictates how the respective
     * [`.size`](#size) value along the same axis will behave:
     *
     * - A value of `"literal"` for an axis means the `.size` value along that
     * axis will be literally as specified.
     * - A value of `"proportional"` for an axis means the `.size`
     * value along that axis will be a proportion of the object's parent's size
     * along that axis.
     */
    set sizeMode(newValue: XYZSizeModeValuesProperty);
    get sizeMode(): XYZSizeModeValues;
    /**
     * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNonNegativeValues | null} size -
     *
     * *attribute*
     *
     * Default: <code>new [XYZNonNegativeValues](../xyz-values/XYZNonNegativeValues)(0, 0, 0)</code>
     *
     * Set the size of the object along each axis. The meaning of a size value for a particular axis depends on the
     * [`.sizeMode`](#sizemode) value for the same axis.
     *
     * All size values must be positive numbers or an error is thrown.
     *
     * Literal sizes can be any positive value (the literal size that you want).
     * Proportional size along an axis represents a proportion of the parent
     * size on the same axis. `0` means 0% of the parent size, and `1.0` means
     * 100% of the parent size.
     *
     * For example, if `.sizeMode` is set to `el.sizeMode = ['literal',
     * 'proportional', 'literal']`, then setting `el.size = [20, 0.5, 30]` means
     * the X size is a literal value of `20`, the Y size is 50% of the parent Y
     * size, and the Z size is a literal value of `30`. It is easy this way to
     * mix literal and proportional sizes for the different axes.
     */
    set size(newValue: XYZNonNegativeNumberValuesProperty | XYZNonNegativeNumberValuesPropertyFunction);
    get size(): XYZNonNegativeValues;
    /**
     * @property {{x: number, y: number, z: number}} calculatedSize -
     *
     * *readonly*, *signal*
     *
     * Get the actual size of an element as an object with `x`, `y`, and `z`
     * properties, each property containing the computed size along its
     * respective axis.
     *
     * This can be useful when size is proportional, as the actual size of the
     * an element will depend on the size of its parent, and otherwise looking
     * at the `.size` value won't tell us the actual size.
     */
    get calculatedSize(): {
        x: number;
        y: number;
        z: number;
    };
    get composedLumeParent(): Sizeable | null;
    get composedLumeChildren(): Sizeable[];
    /**
     * @property {{x: number, y: number, z: number}} parentSize
     *
     * *signal* *readonly*
     *
     * Returns an object with `x`, `y`, and `z` properties containing the size
     * dimensions of the composed LUME parent. If there is no composed LUME
     * parent, the size is 0,0,0.
     */
    get parentSize(): {
        x: number;
        y: number;
        z: number;
    };
    _calcSize(): void;
}
export {};
//# sourceMappingURL=Sizeable.d.ts.map