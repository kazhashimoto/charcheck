# charcheck
charcheckはChrome拡張機能として動作するjavascriptプログラムであり、ブラウザで表示中のページに対して、コンテンツ中のテキストに含まれる全角英字・全角数字や、半角・全角スペースが挿入された箇所などを色分けしてハイライト表示する機能を提供します。charcheckの目的は、Webページのコーディング作業において、コンテンツの文章をブラウザ画面上でチェックする際に、全角・半角英数字の混在や表記ブレ、約物の前後に挿入された余分な半角スペースなど、目視では見分けにくい誤りの箇所を画面上で確認しやすくすることです。

## Installation
適当なディレクトリにリポジトリをcloneします。
```
$ git clone https://github.com/kazhashimoto/charcheck.git
```

Chromeを起動して、以下の手順でcharcheckを拡張機能として読み込みます。
1. ```chrome://extensions/```にアクセスし、拡張機能の管理ページを開きます。（画面の詳細は[こちら](https://developer.chrome.com/docs/extensions/mv3/getstarted/)）
1. 「デベロッパーモード」をONにします。
1. 「パッケージ化されていない拡張機能を読み込む」をクリックします。
1. ファイル読み込みのダイアログで、cloneしたリポジトリの```./charcheck/extension```ディレクトリを選択します。

Chrome拡張機能を使わずに直接スクリプトを呼び出す方法については[Appendix](#Appendix)を参照してください。

## Usage
### ページのチェック
1. Chromeでチェックしたいページを表示します。
1. ブラウザ右上の「拡張機能」アイコンをクリックします。
1. 「このサイトに拡張機能がアクセスするのを許可するには、クリックしてください。」が表示されるので、「Charcheck」をクリックし、ピンで固定します。
1. アイコン（現状は文字"C"）に「ON」マークが付き、検索で見つかった文字がハイライト表示されます。
1. アイコンを再びクリックすると文字のハイライト表示が消えて、アイコンが「OFF」マークに変わります。

Charcheckはタブごとに実行できます。

#### ハイライト表示される文字の種類
検索対象の文字は以下のカテゴリで色分けして表示されます。文字集合の詳細（Charcheckがマッチに使用する正規表現）については、詳細設定画面（[Options](#Options)）で確認できます。

- 半角スペース
- 全角スペース
- 全角数字
- 全角英字
- 約物括弧（全角）
- 句読点（全角）
- FULLWIDTH COMMA, FULLWIDTH YEN SIGN, FULLWIDTH HYPHEN-MINUS

注）  
- Charcheckは文字をハイライト表示させるために、対象の文字の前後に```<span>```タグを挿入して独自のCSSルールを適用しています。これがページの既存のCSSルールとの間で相互に影響を及ぼすことがあります。結果、ハイライト表示が無効化されたり、レイアウトが崩れる可能性があります。（[既知の問題](#Known Issues)参照

### Options
検索対象の文字の種類やハイライト表示の背景色を詳細設定画面から変更できます。

1. Charcheckアイコン（"C"）を右クリックし、メニューから「オプション」を選択します。詳細設定画面が開きます。
1. 検索対象の文字の種類を選択するには、「検索設定」セクションの表で各行の左側のチェックボックスにチェックを入れます。
1. ハイライト表示時の背景色を変更するには、「背景色」列のカラーピッカーをクリックして色を選びます。
1. 背景色を全体的に明るく・暗くするには、「色の調整」セクションの「背景色」項目で「+」「-」ボタンをクリックして調整します。色は上の表のカラーピッカーに反映されます。
1. 背景色のカラーパレットをインストール時の状態にリセットするには、「初期値に戻す」ボタンをクリックします。
1. ハイライト表示の背景色をすべての文字で同じ色に統一するには、「全て同じ色を使用」にチェックを入れて、右側のカラーピッカーで色を指定します。
1. 最後に「保存」ボタンをクリックして変更を確定します。

変更した設定は、現在表示中のタブには反映されません。設定を反映するには、ページを再読み込みしてから、Charcheckアイコンをクリックしてください。

## Known Issues
既知の問題があります。サンプルは```demo/issues.html```参照。
#1
#2
#3

- [Issue#1](https://github.com/kazhashimoto/charcheck/issues/1)
- [Issue#2](https://github.com/kazhashimoto/charcheck/issues/2)
- [Issue#3](https://github.com/kazhashimoto/charcheck/issues/3)
- [Issue#4](https://github.com/kazhashimoto/charcheck/issues/4)

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
