"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("strike")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={toggleBulletList}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onClick={toggleOrderedList}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Ordered List"
        >
          1. List
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={addLink}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            editor.isActive("link")
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
          title="Add Link"
        >
          🔗 Link
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="p-4 bg-white min-h-64">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none
            [&_p]:mb-3 [&_h2]:my-3 [&_ul]:list-disc [&_ul]:ml-4
            [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1
            [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
        />
      </div>
    </div>
  );
}
