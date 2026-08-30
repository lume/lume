import { Constructor } from 'lowclass/dist/Constructor.js';
/**
 * A class that allows tracking the DOM composed tree (Shadow DOM), ultimately
 * allowing consumers to write logic against the shape of the DOM flat tree.
 *
 * Native HTML/CSS engines track the DOM flat tree in order to render built-in
 * elements (<img>, <div>, <button>, etc) the way you expect after composing
 * them with Shadow DOM.
 *
 * An excellent explainer on Shadow DOM concepts:
 * https://hayatoito.github.io/2026/dom/
 *
 * This mixin allows tracking the flat tree just as native browser engines do,
 * but for scenarios such as custom rendering with canvas (e.g. with 2D, WebGL,
 * or WebGPU APIs). When the custom elements with custom rendering are composed
 * with Shadow DOM, their JavaScript implementation will want to know the shape
 * of the flat tree so that rendering can be implemented exactly as the
 * composition of the elements implies.
 *
 * As a concrete example, a library of custom elements could implement rendering
 * using a library like Playcanvas (https://playcanvas.com) that has its own
 * pure-JS concept of a tree of render objects. The custom element
 * implementation would want to ensure that it connects the Playcanvas render
 * objects into a render tree hierarchy that matches with the shape of the DOM
 * flat tree that is formed by composing the custom elements. This includes
 * child elements that are "slotted" to `<slot>` elements in a Shadow DOM, very
 * much similar to concepts such as props.children in React, Preact, and Solid,
 * slots in Vue and Svelte (loosely based on the same concept as Shadow DOM
 * slots), or transclusion in Angular.
 *
 * NOTE: This class exposes closed ShadowRoots and elements inside ShadowRoots.
 * Tracking the flat tree is not easy without access to ShadowRoots and their
 * DOM, so using `closed` roots with this mixin is counterintuitive. This class
 * adds a new `exposedShadowRoot` property that references an attached
 * ShadowRoot even if it is closed, and other properties such as `terminalSlottedParent`
 * that reference elements inside ShadowRoots even if they are closed.
 */
export declare function CompositionTracker<T extends Constructor<HTMLElement>>(Base: T): {
    new (...args: any[]): {
        attachShadow(options: ShadowRootInit): ShadowRoot;
        /**
         * The children of this element's ShadowRoot, if any, otherwise an empty
         * array.
         *
         * This is similar to `[...this.shadowRoot.children]`, except that it
         * gets the children even if the ShadowRoot is closed.
         */
        readonly shadowRootChildren: any[];
        /**
         * Elements that are slotted to a slot that is child of a ShadowRoot of
         * this element.
         */
        readonly shadowRootSlottedChildren: any[];
        /** @private */
        __composedParent: Element | null;
        /**
         * The parent this element is composed to, i.e. this element's parent in
         * the flat tree.
         */
        readonly composedParent: Element | null;
        /**
         * True when this element has a composed parent, i.e. when this element
         * is (has a parent) in the flat tree.
         */
        readonly isComposed: boolean;
        /**
         * @private
         *
         * Traverses to find the parent that this element renders relative to in
         * the flat tree, if any (no parent means this element is not in the
         * flat tree).
         */
        __getComposedParent(): HTMLElement | null;
        /**
         * Children that are composed to this element, i.e. that render as
         * children of this element in the flat tree. Flat tree children may be
         * regular children of a shadow root in the composed tree, or slotted
         * children (assigned nodes) of a <slot> element in a shadow root.
         */
        readonly composedChildren: any[];
        /**
         * This element's ShadowRoot, if any (even if it is a closed shadow
         * root, unlike the `shadowRoot` property).
         */
        exposedShadowRoot?: ShadowRoot;
        /**
         * When true, this element's parent has a ShadowRoot, which means this
         * element is possibly slotted into a slot in that parent's ShadowRoot.
         * This doesn't guarantee that this element is slotted, it may not be
         * slotted if there's no matching `<slot>` element to be slotted to.
         *
         * This is similar to `Boolean(this.parentElement.shadowRoot)`, except
         * this is accurate even if the ShadowRoot mode is closed.
         */
        isPossiblySlotted: boolean;
        /** @private */
        __prevAssignedNodes?: WeakMap<HTMLSlotElement, Element[]>;
        /**
         * A map of the slot elements that are children of this element and
         * their last-known assigned elements. When a slotchange happens while
         * this element is in a shadow root and has a slot child, we can detect
         * what the difference is between the last known assigned elements and
         * the new ones.
         * @private
         */
        readonly __previousSlotAssignedNodes: WeakMap<HTMLSlotElement, Element[]>;
        /**
         * If this element is slotted into a shadow tree, this will reference
         * the parent element of the <slot> element where this element is
         * slotted to. This element will render as a child of that parent
         * element in the flat tree (composed tree).
         *
         * This is similar to `this.assignedSlot.parentElement`, except this
         * returns a result even if the ShadowRoot mode is closed.
         */
        terminalSlottedParent: any | null;
        /**
         * If this element is a top-level child of a ShadowRoot, this points to
         * the ShadowRoot host. The ShadowRoot host is the prent element that
         * this element renders relative to (is a child of) in the flat tree.
         *
         * This is similar to `this.parentNode.host ?? null`.
         */
        shadowParent: any | null;
        /**
         * If this element has a child `<slot>` element while in a ShadowRoot,
         * this will be a Set of the nodes slotted into that `<slot>`, and that
         * Set of nodes render relative to (are children of) this element in the
         * flat tree. This is `null` if there are no slotted children.
         */
        terminalSlottedChildren: Set<any> | null;
        /**
         * The parent whose child <slot> this element is assigned to,
         * regardless of whether that slot itself is assigned to a
         * deeper slot. This is the direct slot parent.
         *
         * Compare with terminalSlottedParent, which follows slot
         * chaining to the final distributed parent.
         */
        slottedParent: any | null;
        /**
         * Elements directly assigned to this element's child <slot>,
         * regardless of whether this slot is assigned to a deeper slot.
         * These are the direct slotted children.
         *
         * Compare with terminalSlottedChildren, which only contains
         * children whose slot is NOT forwarded further down.
         */
        slottedChildren: Set<any> | null;
        /**
         * Called when a child is added to the ShadowRoot of this element to
         * establish composed relationships and trigger composedCallback.
         * @private
         */
        __shadowRootChildAdded(child: Element): void;
        /**
         * Called when a child is removed from the ShadowRoot of this element to
         * remove composed relationships and trigger uncomposedCallback.
         */
        __shadowRootChildRemoved(child: Element): void;
        /**
         * Called when a slot child of this element emits a slotchange event.
         */
        readonly __onChildSlotChange: (event: Event) => void;
        /** @private */
        __onChildSlotChange__?: (event: Event) => void;
        /**
         * Implement this method in a subclass to run logic when a child is
         * composed to this element in the flat tree.
         */
        childComposedCallback?(composedChild: Element, compositionType: CompositionType): void;
        /**
         * Implement this method in a subclass to run logic when a child is
         * uncomposed from this element in the flat tree.
         */
        childUncomposedCallback?(uncomposedChild: Element, compositionType: CompositionType): void;
        /**
         * Implement this method in a subclass to run logic when this element is
         * composed to a parent in the flat tree.
         */
        composedCallback?(composedParent: Element, compositionType: CompositionType): void;
        /**
         * Implement this method in a subclass to run logic when this element is
         * uncomposed from a parent in the flat tree.
         */
        uncomposedCallback?(uncomposedParent: Element, compositionType: CompositionType): void;
        /** @private */
        __lastComposedParent: any | null;
        /** @private */
        __lastCompositionType: CompositionType;
        /**
         * When we detect the slotchange ordering discrepancy (see __discrepancy
         * usage sites), regular composition callbacks will be skipped, and
         * special logic will run later to ensure we call composition methods in
         * correct order.
         * @private
         */
        __discrepancy: boolean;
        /** @private */
        __triggerChildComposedCallback(parent: any, child: any, compositionType: CompositionType): void;
        /** @private */
        __triggerChildUncomposedCallback(parent: any, child: any, compositionType: CompositionType): void;
        connectedCallback(): void;
        disconnectedCallback(): void;
        /**
         * This is called in certain cases when slotted children may have
         * changed, f.e. when a slot was added to this element, or when a child
         * slot of this element has had assigned nodes changed (slotchange).
         * @private
         */
        __handleSlottedChildren(slot: HTMLSlotElement): void;
        /**
         * Get the difference between the last assigned elements and current
         * assigned elements of a child slot of this element.
         *
         * This does a diff that allows us to run slotted/unslotted reactions
         * only for nodes that were detected to have been added or removed, but
         * it fails to detect nodes that were both removed and added within the
         * same tick synchronously because `slotchange` runs in the next
         * microtask and does not give us a way to see all slot assignment
         * change records (like we can with MutationObserver), we can only see
         * the current set of slotted nodes with slot.assignedNodes.
         *
         * @private
         */
        __getSlottedChildDifference(slot: HTMLSlotElement): SlotDiff;
        childConnectedCallback(child: Element): void;
        childDisconnectedCallback(child: Element): void;
        /**
         * Visit nodes in the DOM composed tree starting at this element in such
         * a way that nodes are visited as if the implicit flat tree were
         * traversed in pre-order. Essentially, traverse the flat tree.
         */
        traverseComposed(visitor: (el: any) => void, waitForUpgrade?: boolean): Promise<void> | void;
        awaitChildrenDefined: boolean;
        syncChildCallbacks: boolean;
        "__#12@#awaitedChildren": Set<Element>;
        "__#12@#runChildConnectedCallbacks"(): void;
        "__#12@#runChildConnect"(child: Element): void;
        "__#12@#runChildDisconnectedCallbacks"(): void;
        "__#12@#runChildDisconnect"(child: Element): void;
        "__#12@#unobserveChildren": (() => void) | null;
        "__#12@#createObserver"(): void;
        "__#12@#destroyObserver"(): void;
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
        readonly behaviors: import("packages/element-behaviors/dist/BehaviorMap.js").BehaviorMap;
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
        appendChild<T_1 extends Node>(node: T_1): T_1;
        cloneNode(deep?: boolean): Node;
        compareDocumentPosition(other: Node): number;
        contains(other: Node | null): boolean;
        getRootNode(options?: GetRootNodeOptions): Node;
        hasChildNodes(): boolean;
        insertBefore<T_1 extends Node>(node: T_1, child: Node | null): T_1;
        isDefaultNamespace(namespace: string | null): boolean;
        isEqualNode(otherNode: Node | null): boolean;
        isSameNode(otherNode: Node | null): boolean;
        lookupNamespaceURI(prefix: string | null): string | null;
        lookupPrefix(namespace: string | null): string | null;
        normalize(): void;
        removeChild<T_1 extends Node>(child: T_1): T_1;
        replaceChild<T_1 extends Node>(node: Node, child: T_1): T_1;
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
} & T;
export type AnyCompositionTracker = InstanceType<ReturnType<typeof CompositionTracker>>;
export declare function isAnyCompositionTracker(o: any): o is AnyCompositionTracker;
export type CompositionType = 'root' | 'slot' | 'terminal-slot' | 'actual';
export declare function hasShadow(el: Element): boolean;
export declare function getComposedParent(el: HTMLElement): HTMLElement | null;
type SlotDiff = {
    added: Node[];
    removed: Node[];
};
export {};
//# sourceMappingURL=CompositionTracker.d.ts.map