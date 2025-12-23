module.exports = [
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
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
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [markdown, setMarkdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showMarkdown, setShowMarkdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let editor;
        const init = async ()=>{
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const EditorJS = undefined, Header = undefined, List = undefined, Quote = undefined, Embed = undefined, ImageTool = undefined, Code = undefined, Delimiter = undefined, DragDrop = undefined, Underline = undefined, InlineCode = undefined, Strikethrough = undefined, Superscript = undefined, Subscript = undefined, Marker = undefined;
        };
        init();
        return ()=>{
            editor?.destroy();
            editorRef.current = null;
        };
    }, []);
    const handleSave = async ()=>{
        const data = await editorRef.current?.save();
        if (data) {
            setMarkdown(convertToMarkdown(data));
            setShowMarkdown(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 40,
            maxWidth: 900,
            margin: "auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            showMarkdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_sass$40$1$2e$97$2e$1$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
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
}),
"[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.0_react@19.2.0__react@19.2.0_sass@1.97.1/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_0ffa2582._.js.map