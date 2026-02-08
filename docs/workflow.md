# 処理フローと拡張手順

## 処理フロー
1. `main.ts` が URL を読み取り、ホーム (`/`) か作品ページ (`/<slug>`) かを判定する
2. 作品ページであれば `registry.ts` の `getArtworkBySlug()` を呼ぶ
3. 該当作品があれば `mount(container)` で描画を開始
4. ページ遷移時は `mount()` が返したクリーンアップ関数で描画を停止

## 作品を追加する手順
1. `src/artworks/your-art.ts` を作成
2. 作品として `mount(container)` を実装
3. `src/registry.ts` に作品を登録

```ts
// src/registry.ts
import { yourArt } from "./artworks/your-art";

export const artworks = [
  ...,
  yourArt(),
];
```

## 作品実装の最小形
```ts
import type { Artwork } from "../core/types";

export const yourArt = (): Artwork => ({
  title: "Your Art",
  slug: "your-art",
  description: "短い説明。",
  mount: (container) => {
    const element = document.createElement("div");
    element.textContent = "Hello Art";
    container.appendChild(element);

    return () => {
      element.remove();
    };
  },
});
```
