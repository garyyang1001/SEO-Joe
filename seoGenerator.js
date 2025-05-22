"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch"); // 如果在 Node.js v18 之前的版本或環境中需要
// --- 2. OpenRouter API 互動核心函數 ---
var OPENROUTER_API_KEY = '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'; // <--- 在此處填入您的 OpenRouter API 金鑰
var OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
var MODEL_NAME = 'google/gemma-3-27b-it:free';
function callOpenRouter(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var response, errorData, data, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(OPENROUTER_API_URL, {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(OPENROUTER_API_KEY),
                                'Content-Type': 'application/json',
                                // 'HTTP-Referer': 'YOUR_SITE_URL', // 建議填寫，參考 OpenRouter 文件
                                // 'X-Title': 'YOUR_APP_NAME',    // 建議填寫
                            },
                            body: JSON.stringify({
                                model: MODEL_NAME,
                                messages: [{ role: 'user', content: prompt }],
                                // max_tokens: 1024, // 您可以根據需要調整
                                // temperature: 0.7, // 您可以根據需要調整
                            }),
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    errorData = _b.sent();
                    console.error("OpenRouter API Error Response:", errorData);
                    throw new Error("OpenRouter API \u932F\u8AA4: ".concat(response.status, " - ").concat(((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || JSON.stringify(errorData)));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _b.sent();
                    // 確保 data.choices 存在且不為空，並且 message.content 存在
                    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                        return [2 /*return*/, data.choices[0].message.content.trim()];
                    }
                    else {
                        throw new Error("OpenRouter API 回應格式不符預期或內容為空。");
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("調用 OpenRouter 時發生錯誤:", error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// --- 3. 各部分內容生成函數 ---
// 根據截圖中的提示詞進行調整
function generateTitle(keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u6839\u64DA\u4EE5\u4E0B\u95DC\u9375\u5B57\u300C".concat(keywords, "\u300D\uFF0C\u7522\u751F\u4E00\u500B\u5438\u5F15\u4EBA\u7684 SEO \u6A19\u984C\u3002\u6A19\u984C\u9577\u5EA6\u5EFA\u8B70\u5728 5 \u5230 15 \u500B\u5B57\u4E4B\u9593\uFF0C\u8ACB\u5728\u6A19\u984C\u4E2D\u767C\u63EE\u5275\u610F\uFF0C\u53EF\u4EE5\u8003\u616E\u52A0\u5165\u6578\u5B57\u3001\u5E74\u4EFD\u6216\u5F15\u4EBA\u6CE8\u76EE\u7684\u8A5E\u5F59\u3002\u8ACB\u53EA\u56DE\u50B3\u6A19\u984C\u672C\u8EAB\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateOutline(keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u91DD\u5C0D\u4E3B\u8981\u95DC\u9375\u5B57\u300C".concat(keywords, "\u300D\uFF0C\u8ACB\u7522\u751F\u4E00\u4EFD\u8A73\u7D30\u7684 SEO \u6587\u7AE0\u5927\u7DB1\u3002\u5927\u7DB1\u61C9\u5305\u542B\u4E00\u500B H1 \u6A19\u984C\uFF0C\u4EE5\u53CA\u591A\u500B H2 \u6A19\u984C\u3002\u6BCF\u500B H2 \u6A19\u984C\u4E0B\u65B9\u53EF\u4EE5\u6709\u6578\u500B H3 \u6A19\u984C\u4F5C\u70BA\u5B50\u9805\u76EE\u3002\u8ACB\u7528\u4EE5\u4E0B\u683C\u5F0F\u6E05\u6670\u5730\u5217\u51FA\u5927\u7DB1\uFF1A\nH1: [\u60A8\u7684 H1 \u6A19\u984C]\nH2: [\u60A8\u7684 H2 \u6A19\u984C 1]\nH3: [H3 \u5B50\u6A19\u984C A]\nH3: [H3 \u5B50\u6A19\u984C B]\nH2: [\u60A8\u7684 H2 \u6A19\u984C 2]\nH3: [H3 \u5B50\u6A19\u984C C]\nH3: [H3 \u5B50\u6A19\u984C D]\n\u4EE5\u6B64\u985E\u63A8\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateIntroduction(keywords, articleTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u570D\u7E5E\u4E3B\u8981\u95DC\u9375\u5B57\u300C".concat(keywords, "\u300D\u548C\u6587\u7AE0\u6A19\u984C\u300C").concat(articleTitle, "\u300D\uFF0C\u64B0\u5BEB\u4E00\u6BB5\u5F15\u4EBA\u5165\u52DD\u7684\u6587\u7AE0\u524D\u8A00\u3002\u76EE\u6A19\u662F\u5438\u5F15\u8B80\u8005\u9EDE\u64CA\u4E26\u7E7C\u7E8C\u95B1\u8B80\u3002\u524D\u8A00\u9577\u5EA6\u8ACB\u63A7\u5236\u5728 200 \u5B57\u4EE5\u5167\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateH2Narrative(h2Title, keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u91DD\u5C0D H2 \u6A19\u984C\uFF1A\u300C".concat(h2Title, "\u300D\uFF0C\u4E26\u53C3\u8003\u4E3B\u8981\u95DC\u9375\u5B57\u300C").concat(keywords, "\u300D\uFF0C\u8ACB\u64B0\u5BEB\u4E00\u6BB5\u7D04 200 \u5B57\u7684\u6558\u8FF0\u5F0F\u5167\u6587\u3002\u5167\u5BB9\u9700\u6D41\u66A2\u4E14\u8CC7\u8A0A\u8C50\u5BCC\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateH2BulletPoints(h2Title, keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u91DD\u5C0D H2 \u6A19\u984C\uFF1A\u300C".concat(h2Title, "\u300D\uFF0C\u4E26\u53C3\u8003\u4E3B\u8981\u95DC\u9375\u5B57\u300C").concat(keywords, "\u300D\uFF0C\u8ACB\u7522\u751F\u4E00\u6BB5\u7D04 200 \u5B57\u7684\u5217\u9EDE\u5F0F\u5167\u5BB9\u3002\u8ACB\u4F7F\u7528\u9805\u76EE\u7B26\u865F (\u4F8B\u5982 -, *, \u6216 \u2022) \u6E05\u6670\u5448\u73FE\u5404\u500B\u8981\u9EDE\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateH2Table(h2Title, keywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u91DD\u5C0D H2 \u6A19\u984C\uFF1A\u300C".concat(h2Title, "\u300D\uFF0C\u4E26\u53C3\u8003\u4E3B\u8981\u95DC\u9375\u5B57\u300C").concat(keywords, "\u300D\uFF0C\u8ACB\u7522\u751F\u4E00\u500B\u5305\u542B\u76F8\u95DC\u8CC7\u8A0A\u7684\u8868\u683C\u3002\u8ACB\u4F7F\u7528 Markdown \u8868\u683C\u683C\u5F0F\u8F38\u51FA\u3002\u8868\u683C\u61C9\u5305\u542B\u8868\u982D\u548C\u81F3\u5C11\u5169\u884C\u6578\u64DA\u3002");
            // Gemma 可能不擅長直接輸出複雜的 Markdown 表格，可以引導它先思考欄位和內容
            // 例如: "請先思考表格需要哪些欄位，然後用 Markdown 格式呈現包含這些欄位和範例數據的表格。"
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
function generateCTA(brandProductKeywords) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt;
        return __generator(this, function (_a) {
            prompt = "\u6839\u64DA\u54C1\u724C/\u7522\u54C1\u95DC\u9375\u5B57\u300C".concat(brandProductKeywords, "\u300D\uFF0C\u64B0\u5BEB\u4E00\u6BB5\u7D04 200 \u5B57\u4EE5\u5167\u7684\u884C\u52D5\u547C\u7C72 (CTA) \u6587\u6848\u3002\u76EE\u6A19\u662F\u5F15\u5C0E\u8B80\u8005\u9EDE\u64CA\u9023\u7D50\u3001\u52A0\u5165 LINE \u6216\u63A1\u53D6\u5176\u4ED6\u60A8\u5E0C\u671B\u7684\u7279\u5B9A\u884C\u52D5\u3002\u8ACB\u8B93 CTA \u660E\u78BA\u4E14\u5177\u8AAA\u670D\u529B\u3002");
            return [2 /*return*/, callOpenRouter(prompt)];
        });
    });
}
// --- 4. Markdown 表格轉 HTML (簡化版) ---
function isMarkdownTable(content) {
    var lines = content.trim().split('\n');
    // 至少要有標頭、分隔線、一行內容才算基本表格
    return lines.length >= 3 && lines[1].includes('|') && lines[1].includes('-');
}
function convertMarkdownTableToHtml(markdown) {
    var lines = markdown.trim().split('\n');
    var html = '<table>\n';
    // 處理表頭
    var headerLine = lines[0];
    var headers = headerLine.split('|').map(function (s) { return s.trim(); }).filter(function (s) { return s; }); // 過濾空字串
    if (headers.length > 0) {
        html += '  <thead>\n    <tr>\n';
        headers.forEach(function (header) { return html += "      <th>".concat(header, "</th>\n"); });
        html += '    </tr>\n  </thead>\n';
    }
    // 處理表格內容 (跳過分隔線 lines[1])
    html += '  <tbody>\n';
    for (var i = 2; i < lines.length; i++) {
        var cells = lines[i].split('|').map(function (s) { return s.trim(); }).filter(function (s) { return s; });
        if (cells.length > 0 && cells.length === headers.length) { // 確保儲存格數量與表頭一致
            html += '    <tr>\n';
            cells.forEach(function (cell) { return html += "      <td>".concat(cell, "</td>\n"); });
            html += '    </tr>\n';
        }
        else if (cells.length > 0) { // 如果數量不一致，還是嘗試渲染，但可能會有問題
            html += '    <tr>\n';
            cells.forEach(function (cell) { return html += "      <td>".concat(cell, "</td>\n"); });
            // 補齊不足的 td
            for (var k = 0; k < headers.length - cells.length; k++) {
                html += "      <td></td>\n";
            }
            html += '    </tr>\n';
        }
    }
    html += '  </tbody>\n';
    html += '</table>\n';
    return html;
}
// --- 5. 合併與格式化為最終 HTML ---
function formatArticleToHtml(article) {
    var output = "";
    // 標題 (H1)
    if (article.title) {
        output += "<h1>".concat(article.title.replace(/\n/g, '<br>'), "</h1>\n\n");
    }
    // 前言
    if (article.introduction) {
        // 將多個換行符轉為段落，單個換行符轉為 <br>
        var introParagraphs = article.introduction.split(/\n\s*\n/).map(function (p) { return "<p>".concat(p.replace(/\n/g, '<br>'), "</p>"); }).join('\n');
        output += "".concat(introParagraphs, "\n\n");
    }
    // H2 各段落
    article.h2Sections.forEach(function (section) {
        output += "<h2>".concat(section.h2Title.replace(/\n/g, '<br>'), "</h2>\n");
        var sectionContentHtml = "";
        switch (section.contentType) {
            case 'narrative':
                // 將多個換行符轉為段落，單個換行符轉為 <br>
                sectionContentHtml = section.content.split(/\n\s*\n/).map(function (p) { return "<p>".concat(p.replace(/\n/g, '<br>'), "</p>"); }).join('\n');
                break;
            case 'bullet':
                var items = section.content.split('\n').map(function (item) { return item.trim().replace(/^[\*\-\•]\s*/, ''); }).filter(function (item) { return item; });
                if (items.length > 0) {
                    sectionContentHtml = "<ul>\n";
                    items.forEach(function (item) {
                        sectionContentHtml += "  <li>".concat(item, "</li>\n");
                    });
                    sectionContentHtml += "</ul>";
                }
                else {
                    sectionContentHtml = "<p>".concat(section.content.replace(/\n/g, '<br>'), "</p>"); // 降級處理
                }
                break;
            case 'table':
                if (isMarkdownTable(section.content)) {
                    sectionContentHtml = convertMarkdownTableToHtml(section.content);
                }
                else {
                    // 如果不是標準 Markdown 表格，或者模型直接返回了類似 HTML 的結構 (儘管不建議)
                    // 則直接輸出，或用 <p> 包裹
                    console.warn("H2 \"".concat(section.h2Title, "\" \u7684\u8868\u683C\u5167\u5BB9\u53EF\u80FD\u4E0D\u662F\u6A19\u6E96 Markdown \u683C\u5F0F\uFF0C\u5C07\u76F4\u63A5\u8F38\u51FA\u3002\u5167\u5BB9:"), section.content);
                    sectionContentHtml = "<div>".concat(section.content, "</div>"); // 使用 div 包裹以防意外
                }
                break;
        }
        output += "".concat(sectionContentHtml, "\n\n");
    });
    // CTA
    if (article.cta) {
        output += "<h3>CTA</h3>\n"; // CTA 通常作為一個小節標題
        var ctaParagraphs = article.cta.split(/\n\s*\n/).map(function (p) { return "<p>".concat(p.replace(/\n/g, '<br>'), "</p>"); }).join('\n');
        output += "".concat(ctaParagraphs, "\n");
    }
    return output.trim();
}
// --- 6. 主應用程式邏輯 (範例) ---
var SEOContentGenerator = /** @class */ (function () {
    function SEOContentGenerator() {
        this.article = {
            title: "",
            rawOutline: "",
            introduction: "",
            h2Sections: [],
            cta: "",
        };
    }
    SEOContentGenerator.prototype.setTitle = function (keywords) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("\u6B63\u5728\u751F\u6210\u6A19\u984C (\u95DC\u9375\u5B57: ".concat(keywords, ")..."));
                        _a = this.article;
                        return [4 /*yield*/, generateTitle(keywords)];
                    case 1:
                        _a.title = _b.sent();
                        console.log("標題已生成:", this.article.title);
                        return [2 /*return*/];
                }
            });
        });
    };
    SEOContentGenerator.prototype.setOutline = function (keywords) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("\u6B63\u5728\u751F\u6210\u5927\u7DB1 (\u95DC\u9375\u5B57: ".concat(keywords, ")..."));
                        _a = this.article;
                        return [4 /*yield*/, generateOutline(keywords)];
                    case 1:
                        _a.rawOutline = _b.sent();
                        console.log("大綱已生成:\n", this.article.rawOutline);
                        return [2 /*return*/];
                }
            });
        });
    };
    SEOContentGenerator.prototype.setIntroduction = function (keywords) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.article.title) {
                            console.warn("請先生成標題，前言生成需要標題資訊。");
                            return [2 /*return*/];
                        }
                        console.log("\u6B63\u5728\u751F\u6210\u524D\u8A00 (\u95DC\u9375\u5B57: ".concat(keywords, ", \u6A19\u984C: ").concat(this.article.title, ")..."));
                        _a = this.article;
                        return [4 /*yield*/, generateIntroduction(keywords, this.article.title)];
                    case 1:
                        _a.introduction = _b.sent();
                        console.log("前言已生成:", this.article.introduction);
                        return [2 /*return*/];
                }
            });
        });
    };
    SEOContentGenerator.prototype.addH2Section = function (h2TitleFromUser, type, keywords) {
        return __awaiter(this, void 0, void 0, function () {
            var content, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("\u6B63\u5728\u70BA H2 \"".concat(h2TitleFromUser, "\" \u751F\u6210 ").concat(type, " \u5167\u5BB9 (\u95DC\u9375\u5B57: ").concat(keywords, ")..."));
                        content = "";
                        _a = type;
                        switch (_a) {
                            case 'narrative': return [3 /*break*/, 1];
                            case 'bullet': return [3 /*break*/, 3];
                            case 'table': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, generateH2Narrative(h2TitleFromUser, keywords)];
                    case 2:
                        content = _b.sent();
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, generateH2BulletPoints(h2TitleFromUser, keywords)];
                    case 4:
                        content = _b.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, generateH2Table(h2TitleFromUser, keywords)];
                    case 6:
                        content = _b.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        this.article.h2Sections.push({ h2Title: h2TitleFromUser, contentType: type, content: content });
                        console.log("H2 \"".concat(h2TitleFromUser, "\" (").concat(type, ") \u5167\u5BB9\u5DF2\u751F\u6210\u3002"));
                        return [2 /*return*/];
                }
            });
        });
    };
    SEOContentGenerator.prototype.setCTA = function (brandProductKeywords) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("\u6B63\u5728\u751F\u6210 CTA (\u54C1\u724C/\u7522\u54C1\u95DC\u9375\u5B57: ".concat(brandProductKeywords, ")..."));
                        _a = this.article;
                        return [4 /*yield*/, generateCTA(brandProductKeywords)];
                    case 1:
                        _a.cta = _b.sent();
                        console.log("CTA 已生成:", this.article.cta);
                        return [2 /*return*/];
                }
            });
        });
    };
    SEOContentGenerator.prototype.generateFinalHtml = function () {
        console.log("正在合併所有內容並格式化為 HTML...");
        this.article.finalHtmlOutput = formatArticleToHtml(this.article);
        console.log("最終 HTML 已生成。");
        return this.article.finalHtmlOutput;
    };
    SEOContentGenerator.prototype.getArticle = function () {
        return this.article;
    };
    return SEOContentGenerator;
}());
// --- 7. 如何使用 (範例執行流程) ---
function runSEOToolDemo() {
    return __awaiter(this, void 0, void 0, function () {
        var generator, mainKeywords, h2Title1FromOutline, h2Title2FromOutline, h2Title3ForTable, finalHtml, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    generator = new SEOContentGenerator();
                    mainKeywords = "TypeScript 高效能程式設計";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    // 1. 生成標題
                    return [4 /*yield*/, generator.setTitle(mainKeywords)];
                case 2:
                    // 1. 生成標題
                    _a.sent();
                    // 2. 生成大綱 (用戶可以參考這個大綱來決定 H2 標題)
                    return [4 /*yield*/, generator.setOutline(mainKeywords)];
                case 3:
                    // 2. 生成大綱 (用戶可以參考這個大綱來決定 H2 標題)
                    _a.sent();
                    h2Title1FromOutline = "TypeScript 的靜態類型優勢";
                    h2Title2FromOutline = "提升 TypeScript 應用效能的技巧";
                    h2Title3ForTable = "常用 TypeScript 效能工具比較";
                    // 3. 生成前言
                    return [4 /*yield*/, generator.setIntroduction(mainKeywords)];
                case 4:
                    // 3. 生成前言
                    _a.sent();
                    // 4. 為 H2 生成內容 (用戶可以為大綱中的每個 H2 或自訂 H2 選擇類型並生成)
                    return [4 /*yield*/, generator.addH2Section(h2Title1FromOutline, 'narrative', mainKeywords)];
                case 5:
                    // 4. 為 H2 生成內容 (用戶可以為大綱中的每個 H2 或自訂 H2 選擇類型並生成)
                    _a.sent();
                    return [4 /*yield*/, generator.addH2Section(h2Title2FromOutline, 'bullet', mainKeywords)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, generator.addH2Section(h2Title3ForTable, 'table', mainKeywords)];
                case 7:
                    _a.sent(); // 表格類型
                    // 5. 生成 CTA
                    return [4 /*yield*/, generator.setCTA("我的 TypeScript 線上課程")];
                case 8:
                    // 5. 生成 CTA
                    _a.sent();
                    finalHtml = generator.generateFinalHtml();
                    console.log("\n--- 最終產生的 HTML (可直接貼至 Google Docs / WordPress HTML 編輯器) ---");
                    console.log(finalHtml);
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _a.sent();
                    console.error("SEO 工具演示過程中發生錯誤:", error_2);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// 執行範例 (在 Node.js 環境中)
runSEOToolDemo();
