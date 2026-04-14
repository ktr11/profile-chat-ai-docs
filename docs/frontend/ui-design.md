# フロントエンド UI 設計指針

## DaisyUI 採用の理由

### Tailwind CSS 単体の課題

Tailwind CSS は強力なユーティリティファーストフレームワークですが、チャット UI のような複雑なコンポーネントをゼロから組むと、クラス名が肥大化しやすい問題があります。

```html
<!-- Tailwind CSS 単体: クラス名が冗長 -->
<div class="flex flex-col max-w-xs rounded-2xl bg-blue-500 text-white px-4 py-2
            text-sm leading-relaxed shadow-md ml-auto mr-2 mt-1">
  こんにちは！
</div>
```

### DaisyUI の解決策：意味論的クラス名

DaisyUI は Tailwind CSS のプラグインとして動作し、**意味論的なコンポーネントクラス**を提供します。開発速度が向上し、コードの可読性も高まります。

```html
<!-- DaisyUI: シンプルで読みやすい -->
<div class="chat chat-end">
  <div class="chat-bubble chat-bubble-primary">こんにちは！</div>
</div>
```

### 採用メリット一覧

| 観点 | Tailwind 単体 | Tailwind + DaisyUI |
|-----|------------|-------------------|
| コンポーネント実装速度 | 遅い（ゼロから組む） | 速い（既製コンポーネント） |
| テーマ切り替え | 手動（CSS変数管理） | `data-theme` 1属性で切替 |
| ダークモード | `dark:` プレフィックス多用 | テーマに内包 |
| クラス名の可読性 | 低い（ユーティリティの羅列） | 高い（意味論的クラス） |
| カスタマイズ性 | 完全自由 | テーマ変数経由で柔軟 |

## チャット UI コンポーネント設計

### 基本構造

```tsx
// src/app/components/ChatBubble.tsx
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  avatar?: string;
  timestamp?: string;
}

export function ChatBubble({ message, isUser, avatar, timestamp }: ChatBubbleProps) {
  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      {avatar && (
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={avatar} alt="avatar" />
          </div>
        </div>
      )}
      <div className={`chat-bubble ${isUser ? "chat-bubble-primary" : ""}`}>
        {message}
      </div>
      {timestamp && <div className="chat-footer opacity-50 text-xs">{timestamp}</div>}
    </div>
  );
}
```

### ストリーミング対応チャット画面

```tsx
// src/app/chat/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "@/components/ChatBubble";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // SSE ストリーミング受信
  async function sendMessage(userInput: string) {
    setIsLoading(true);
    setStreamingText("");

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userInput, session_id: getSessionId() }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // SSE フォーマット: "data: {token}\n\n"
      const token = parseSSEChunk(chunk);
      setStreamingText((prev) => prev + token);
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* ヘッダー */}
      <div className="navbar bg-base-100 shadow-sm">
        <span className="navbar-start text-xl font-bold">AI Chat</span>
        <div className="navbar-end">
          <label className="swap swap-rotate">
            <input type="checkbox" className="theme-controller" value="dark" />
            {/* ダークモードアイコン */}
          </label>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}

        {/* ストリーミング中のバブル */}
        {streamingText && (
          <ChatBubble message={streamingText} isUser={false} />
        )}

        {/* ローディングインジケーター */}
        {isLoading && !streamingText && (
          <div className="chat chat-start">
            <div className="chat-bubble">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

### 入力コンポーネント

```tsx
// src/app/components/ChatInput.tsx
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-base-100 border-t border-base-300">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="input input-bordered flex-1"
          disabled={disabled}
        />
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {disabled ? <span className="loading loading-spinner loading-sm" /> : "送信"}
        </button>
      </div>
    </form>
  );
}
```

## テーマ設計

### DaisyUI テーマの設定

```js
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
};

export default config;
```

### テーマ切り替え（HTML 属性ベース）

```html
<!-- ライトモード -->
<html data-theme="light">

<!-- ダークモード -->
<html data-theme="dark">
```

```tsx
// src/app/layout.tsx でのテーマ永続化
"use client";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") ?? "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
    <html lang="ja" data-theme={theme}>
      <body>{children}</body>
    </html>
  );
}
```

## 使用する主要 DaisyUI コンポーネント

| コンポーネント | クラス | 用途 |
|-------------|-------|------|
| チャットバブル | `chat`, `chat-start`, `chat-end`, `chat-bubble` | メッセージ表示 |
| ボタン | `btn`, `btn-primary`, `btn-ghost` | 送信・操作 |
| 入力欄 | `input`, `input-bordered` | テキスト入力 |
| ナビゲーション | `navbar`, `navbar-start`, `navbar-end` | ヘッダー |
| ローディング | `loading`, `loading-dots`, `loading-spinner` | 待機状態 |
| アバター | `avatar` | ユーザー・AI アイコン |

## 関連ドキュメント

- [ストリーミング仕様](../api/streaming-spec.md)
- [システム全体構成](../architecture/overall.md)
