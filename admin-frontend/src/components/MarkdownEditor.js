import React, { Suspense, lazy } from "react";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";

// MarkdownIt インスタンスの作成
const mdParser = new MarkdownIt(/* Markdown-it options */);

// react-markdown-editor-liteを動的にインポート
const MdEditor = lazy(() => import("react-markdown-editor-lite"));

const MarkdownEditor = ({ value, onChange }) => {
    const handleEditorChange = ({ text }) => {
        onChange(text);
    };

    const insertSyntax = (syntax) => {
        const textarea = document.querySelector(".rc-md-editor textarea");
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = value.substring(0, start);
        const after = value.substring(end);
        const newValue = before + syntax + after;
        onChange(newValue);
        // カーソル位置をsyntaxの後に移動
        setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + syntax.length, start + syntax.length);
        }, 0);
    };

    return (
        <div>
        {/* Markdownエディタ */}
        <Suspense fallback={<div>Loading Editor...</div>}>
            <MdEditor
            value={value}
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            />
        </Suspense>
        </div>
    );
};

export default MarkdownEditor;
