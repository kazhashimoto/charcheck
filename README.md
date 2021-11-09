# charcheck
charcheckは、ブラウザで表示中のページに対して、コンテンツ中のテキストに含まれる全角英字・全角数字や、半角・全角スペースが挿入された箇所などを色分けしてハイライト表示するjavascriptプログラムです。Chrome拡張機能として動作します。charcheckの目的は、Webページのコーディング作業において、コンテンツの文章をブラウザ画面上でチェックする際に、全角・半角英数字の混在や表記ブレ、約物の前後に挿入された余分な半角スペースなど、目視では見分けにくい誤りを見つけるのに役立つツールを提供することです。

## Installation
charcheckをブラウザで使用するには３つの方法があります。

### Chrome拡張機能としてインストールする(推奨)
適当なディレクトリにリポジトリをcloneします。
```
$ git clone https://github.com/kazhashimoto/charcheck.git
```

Chromeを起動して、以下の手順でcharcheckを拡張機能として読み込みます。※画面の詳細は[こちら](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
1. ```chrome://extensions/```にアクセスし、拡張機能の管理ページを開く。
1. 「デベロッパーモード」をONにする。
1. 「パッケージ化されていない拡張機能を読み込む」をクリックする。
1. ファイル読み込みのダイアログで、cloneしたリポジトリの```./charcheck/extension```ディレクトリを選択する。

### ブラウザの開発者ツールから直接読み込む
FirefoxなどChrome以外のブラウザで使用する場合、表示中のコンテンツに対して、開発者ツールのコンソールからcharcheck.jsを直接読み込ませて実行することができます。この方法は、Content Security Policyが設定されたページではscriptやstyleの埋め込みがブロックされるため適用できません。ローカルのテスト環境でのみ使用してください。

```
(function(url) {
  const s=document.createElement('script');
  s.src=url;
  document.body.appendChild(s);
})("http://localhost/charcheck/extension/charcheck.js");
```

### 外部スクリプトとしてHTMLファイルに埋め込む
HTMLファイルに埋め込んで使用するには、CSSファイルとjsファイルを指定します。
```
<link rel="stylesheet" href="/path/to/extension/charcheck.css">
<script src="/path/to/extension/charcheck.js"></script>
```
