# charcheck
charcheckはChrome拡張機能として動作するjavascriptプログラムであり、ブラウザで表示中のページに対して、コンテンツ中のテキストに含まれる全角英字・全角数字や、半角・全角スペースが挿入された箇所などを色分けしてハイライト表示する機能を提供します。charcheckの目的は、Webページのコーディング作業において、コンテンツの文章をブラウザ画面上でチェックする際に、全角・半角英数字の混在や表記ブレ、約物の前後に挿入された余分な半角スペースなど、目視では見分けにくい誤りの箇所を画面上で確認しやすくすることです。

## Installation
適当なディレクトリにリポジトリをcloneします。
```
$ git clone https://github.com/kazhashimoto/charcheck.git
```

Chromeを起動して、以下の手順でcharcheckを拡張機能として読み込みます。
1. ```chrome://extensions/```にアクセスし、拡張機能の管理ページを開く。（画面の詳細は[こちら](https://developer.chrome.com/docs/extensions/mv3/getstarted/)）
1. 「デベロッパーモード」をONにする。
1. 「パッケージ化されていない拡張機能を読み込む」をクリックする。
1. ファイル読み込みのダイアログで、cloneしたリポジトリの```./charcheck/extension```ディレクトリを選択する。

Chrome拡張機能を使わずに直接スクリプトを呼び出す方法については[Appendix](#Appendix)を参照してください。

## Usage
### ページのチェック
1. Chromeでチェックしたいページを表示する。
1. ブラウザ右上の「拡張機能」アイコンをクリックする。
1. 「このサイトに拡張機能がアクセスするのを許可するには、クリックしてください。」が表示されるので、「Charcheck」をクリックし、ピンで固定する。
1. アイコン（現状は文字"C"）に「ON」マークが付き、検索で見つかった文字がハイライト表示される。
1. アイコンを再びクリックすると文字のハイライト表示が消えて、アイコンが「OFF」マークに変わる。

Charcheckはタブごとに実行できます。

### 詳細設定

## Appendix
### Chrome拡張機能を使わずにスクリプトを呼び出す方法
FirefoxなどChrome以外のブラウザで使用する場合、```./extension/charcheck.js```をブラウザに直接読み込ませることも可能です。これには２つの方法があります。
いずれの方法もハイライト表示の背景色のカラーパレットはプリセットのものに固定です。プリセットの背景色を変更するには```/extension/charcheck.css```のスタイルを編集する必要があります。

#### A. ブラウザの開発者ツールから直接読み込む
表示中のコンテンツに対して、開発者ツールのコンソールからscriptタグを挿入してcharcheck.jsをロードする方法です。ただし、Content Security Policyが設定されたページの場合、scriptやstyleの埋め込みがブロックされるため、この方法では動作しません。ローカルのテスト環境でのみ使用してください。

例）
```
(function(url) {
  const s=document.createElement('script');
  s.src=url;
  document.body.appendChild(s);
})("http://localhost/charcheck/extension/charcheck.js");
```

#### B. 外部リソースとしてHTMLファイルに記述する
CSSファイルとjavascriptファイルのパスを指定します。
```
<link rel="stylesheet" href="/path/to/extension/charcheck.css">
<script src="/path/to/extension/charcheck.js"></script>
```
