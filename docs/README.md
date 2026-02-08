# ts-playground ドキュメント

このリポジトリは「作品（アート）」をブラウザで閲覧できるギャラリーです。  
**作品は 1 ファイル = 1 作品**として追加していく前提で、`src/artworks/` にまとめています。

## 目的
- 作品をブラウザで表示するための最小構成を提供する
- 作品だけに集中できるよう、共通の基盤（ローダーや型定義）を分離する
- 作品は URL `/<slug>` で表示され、ホーム `/` から遷移できる

## ディレクトリ構成
```
src/
  artworks/          # 作品ファイル（1作品1ファイル）
    aurora-pulse.ts
    particle.ts
  core/              # 共通基盤（作品に共通の型・パレット・ローダー）
    p5-loader.ts
    palettes.ts
    types.ts
  registry.ts        # 作品一覧の登録
  main.ts            # ルーティングと描画の入口
  style.css          # ホーム画面と作品画面の見た目
  index.ts           # 実行案内のログ
```

## 主要な処理の流れ
1. **`src/main.ts`**  
   - URL を見て、ホーム画面か作品ページかを判断します。  
   - 作品ページでは `getArtworkBySlug()` で該当作品を探して `mount()` を実行します。  
   - 作品を表示している間はスクロールを無効化します。

2. **`src/registry.ts`**  
   - 作品ファイルをインポートし、一覧配列 `artworks` に登録します。  
   - `getArtworkBySlug()` で URL の slug と一致する作品を返します。

3. **`src/artworks/*.ts`**  
   - 1 作品 1 ファイルで完結するように実装します。  
   - `mount(container)` で描画を開始し、戻り値でクリーンアップ処理を返します。

4. **`src/core/*`**  
   - 作品間で共通化したい処理（型定義、パレット、p5 ローダーなど）をここにまとめます。  
   - 作品側は `core` を使うだけで、インフラ部分を意識しなくて済む構成です。

## 作品の追加方法（例）
1. `src/artworks/your-art.ts` を作成  
2. `registry.ts` に追加  

```ts
// src/registry.ts
import { yourArt } from "./artworks/your-art";

export const artworks = [
  ...,
  yourArt(),
];
```

## SEO について
この構成は **SEO を考慮しない** 前提で、シンプルさと制作体験を優先しています。
