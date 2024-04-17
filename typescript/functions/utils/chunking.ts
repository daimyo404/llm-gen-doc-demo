// TikTokenの初期化
// TypeScriptでは、tiktokenライブラリが存在しないため、適切なライブラリや手段を用いてトークン化を行う必要があります。
let tiktoken_encoding = "gpt-3.5-turbo";

// コンテンツをチャンクに分割する
function chunkContent(
    content: string,
    maxChunkTokenSize: number,  // ex) 4096
    overlapTokenRate: number,  // ex) 0.1
    overlapType: string,  // PREPOST | PRE | POST | NONE
): string[] {
    // 全チャンクが最大サイズを超えなくなるまで H1, H2, Tableタグでチャンクを分割する
    let chunks = [content];
    for (let tag of ["h1", "h2", "table"]) {
        let stagingChunks = [];
        for (let chunk of chunks) {
            if (__calcTokens(chunk) > maxChunkTokenSize) {
                stagingChunks = stagingChunks.concat(__splitContentByHtmlTag(chunk, tag));
            } else {
                stagingChunks.push(chunk);
            }
        }
        chunks = stagingChunks;
    }

    // 全チャンクが最大サイズを超えなくなるまで 改行、句点、読点、スペースでチャンクを分割する
    for (let tag of ["\n", "。", "、", " "]) {
        let stagingChunks = [];
        for (let chunk of chunks) {
            if (__calcTokens(chunk) > maxChunkTokenSize) {
                stagingChunks = stagingChunks.concat(__splitContentByDelimiter(chunk, tag));
            } else {
                stagingChunks.push(chunk);
            }
        }
        chunks = stagingChunks;
    }

    // 分割したチャンクを定義したチャンクサイズとオーバラップ設定に合わせて結合する
    chunks = __mergeChunks(chunks, maxChunkTokenSize, overlapTokenRate, overlapType);

    return chunks;
}