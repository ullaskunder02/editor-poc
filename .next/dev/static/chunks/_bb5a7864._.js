(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const EDITOR_HOLDER_ID = "editorjs";
// --- MEDIA TOOL (VIDEO/AUDIO) ---
class LiveMediaTool {
    static get toolbox() {
        return {
            title: "Video/Audio",
            icon: "🎥"
        };
    }
    data;
    wrapper;
    descriptionField = null;
    constructor({ data }){
        this.data = data || {
            url: "",
            type: "",
            name: "",
            description: ""
        };
        this.wrapper = document.createElement("div");
    }
    render() {
        this.wrapper.innerHTML = "";
        this.wrapper.style.padding = "15px";
        this.wrapper.style.border = "1px solid #eee";
        this.wrapper.style.borderRadius = "10px";
        if (this.data.url) {
            this.renderPlayer(this.data.url, this.data.type);
        } else {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "video/*,audio/*";
            input.onchange = (e)=>{
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ()=>{
                    const type = file.type.startsWith("video") ? "video" : "audio";
                    this.data = {
                        ...this.data,
                        url: reader.result,
                        type
                    };
                    this.renderPlayer(reader.result, type);
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
        return this.wrapper;
    }
    renderPlayer(url, type) {
        this.wrapper.innerHTML = "";
        const media = document.createElement(type);
        media.src = url;
        media.controls = true;
        media.style.width = "100%";
        const desc = document.createElement("div");
        desc.contentEditable = "true";
        desc.innerText = this.data.description || "";
        desc.style.marginTop = "10px";
        desc.oninput = ()=>this.data.description = desc.innerText;
        this.descriptionField = desc;
        this.wrapper.append(media, desc);
    }
    save() {
        return this.data;
    }
}
// --- MARKDOWN CONVERTER ---
const convertToMarkdown = (data)=>{
    let md = "";
    data.blocks.forEach((block)=>{
        switch(block.type){
            case "header":
                md += `${"#".repeat(block.data.level)} ${block.data.text}\n\n`;
                break;
            case "paragraph":
                md += `${block.data.text}\n\n`;
                break;
            case "list":
                block.data.items.forEach((i)=>md += `- ${i}\n`);
                md += "\n";
                break;
            case "code":
                md += `\`\`\`\n${block.data.code}\n\`\`\`\n\n`;
                break;
            case "media":
                md += `<${block.data.type} src="${block.data.url}" controls></${block.data.type}>\n\n`;
                break;
        }
    });
    return md.trim();
};
function Page() {
    _s();
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [markdown, setMarkdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showMarkdown, setShowMarkdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            let editor;
            const init = {
                "Page.useEffect.init": async ()=>{
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const [{ default: EditorJS }, { default: Header }, { default: List }, { default: Quote }, { default: Embed }, { default: ImageTool }, { default: Code }, { default: Delimiter }, { default: DragDrop }, { default: Underline }, { default: InlineCode }, { default: Strikethrough }, { default: Superscript }, { default: Subscript }, { default: Marker }] = await Promise.all([
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+editorjs@2.31.0/node_modules/@editorjs/editorjs/dist/editorjs.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+header@2.8.8/node_modules/@editorjs/header/dist/header.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+list@2.0.9/node_modules/@editorjs/list/dist/editorjs-list.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+quote@2.7.6/node_modules/@editorjs/quote/dist/quote.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+embed@2.8.0/node_modules/@editorjs/embed/dist/embed.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+image@2.10.3/node_modules/@editorjs/image/dist/image.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+code@2.9.3/node_modules/@editorjs/code/dist/code.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+delimiter@1.4.2/node_modules/@editorjs/delimiter/dist/delimiter.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/editorjs-drag-drop@1.1.16/node_modules/editorjs-drag-drop/dist/bundle.js [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+underline@1.2.1/node_modules/@editorjs/underline/dist/underline.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+inline-code@1.5.2/node_modules/@editorjs/inline-code/dist/inline-code.mjs [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/editorjs-strikethrough@1.0.0/node_modules/editorjs-strikethrough/dist/bundle.js [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/editorjs-superscript@1.0.0/node_modules/editorjs-superscript/dist/bundle.js [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/editorjs-subscript@0.0.5/node_modules/editorjs-subscript/dist/bundle.js [app-client] (ecmascript, async loader)"),
                        __turbopack_context__.A("[project]/node_modules/.pnpm/@editorjs+marker@1.4.0/node_modules/@editorjs/marker/dist/marker.mjs [app-client] (ecmascript, async loader)")
                    ]);
                    editor = new EditorJS({
                        holder: EDITOR_HOLDER_ID,
                        placeholder: "Type '/' for commands...",
                        inlineToolbar: true,
                        onReady: {
                            "Page.useEffect.init": ()=>new DragDrop(editor)
                        }["Page.useEffect.init"],
                        tools: {
                            header: Header,
                            list: List,
                            quote: Quote,
                            embed: Embed,
                            image: ImageTool,
                            code: Code,
                            delimiter: Delimiter,
                            underline: Underline,
                            inlineCode: InlineCode,
                            strikethrough: Strikethrough,
                            superscript: Superscript,
                            subscript: Subscript,
                            marker: Marker,
                            media: LiveMediaTool
                        }
                    });
                    editorRef.current = editor;
                }
            }["Page.useEffect.init"];
            init();
            return ({
                "Page.useEffect": ()=>{
                    editor?.destroy();
                    editorRef.current = null;
                }
            })["Page.useEffect"];
        }
    }["Page.useEffect"], []);
    const handleSave = async ()=>{
        const data = await editorRef.current?.save();
        if (data) {
            setMarkdown(convertToMarkdown(data));
            setShowMarkdown(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 40,
            maxWidth: 900,
            margin: "auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: EDITOR_HOLDER_ID,
                style: {
                    border: "1px solid #ddd",
                    padding: 30,
                    borderRadius: 16,
                    minHeight: 500
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleSave,
                style: {
                    marginTop: 30,
                    padding: "14px 28px",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer"
                },
                children: "Generate CMS Output"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            showMarkdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                style: {
                    marginTop: 40,
                    background: "#111",
                    color: "#80cbc4",
                    padding: 20,
                    borderRadius: 12,
                    overflowX: "auto"
                },
                children: markdown
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
_s(Page, "RrRa68ALhogzFq7fVUeUlHbjVs0=");
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_bb5a7864._.js.map