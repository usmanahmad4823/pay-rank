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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var allTimeEntries, dailyEntries, _i, _a, item, entry;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Seeding initial pay-to-rank competitive entries with categories...');
                    allTimeEntries = [
                        {
                            displayName: 'see.io · see your idea live',
                            targetUrl: 'https://see.io',
                            normalizedUrl: 'see.io',
                            tagline: 'Just describe your idea. AI turns it into a fully built, live website in minutes.',
                            currentBidCents: 1700100, // $17,001.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.ALL_TIME,
                            category: client_1.Category.AGENTS,
                            clickCount: 56713,
                        },
                        {
                            displayName: 'Tutti — Your all-in-one marketplace',
                            targetUrl: 'https://tutti.so',
                            normalizedUrl: 'tutti.so',
                            tagline: 'Join campaigns from real brands and get paid on effective exposure.',
                            currentBidCents: 1600000, // $16,000.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.ALL_TIME,
                            category: client_1.Category.MARKETING,
                            clickCount: 14097,
                        },
                        {
                            displayName: 'JONI | Your Personal AI Computer',
                            targetUrl: 'https://joni.ai',
                            normalizedUrl: 'joni.ai',
                            tagline: 'JONI is your personal AI computer. Chat once and a team of AI agents get to work.',
                            currentBidCents: 1402800, // $14,028.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.ALL_TIME,
                            category: client_1.Category.AGENTS,
                            clickCount: 22841,
                        },
                        {
                            displayName: 'Outrank - Grow Organic Traffic',
                            targetUrl: 'https://outrank.io',
                            normalizedUrl: 'outrank.io',
                            tagline: 'Get traffic and outrank competitors with Backlinks & SEO-optimized content.',
                            currentBidCents: 1300500, // $13,005.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.ALL_TIME,
                            category: client_1.Category.SEO,
                            clickCount: 18450,
                        },
                        {
                            displayName: 'VibeCode Studio',
                            targetUrl: 'https://vibecode.dev',
                            normalizedUrl: 'vibecode.dev',
                            tagline: 'Build web applications 10x faster with AI pair programmers',
                            currentBidCents: 750000, // $7,500.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.ALL_TIME,
                            category: client_1.Category.DEVELOPER,
                            clickCount: 8940,
                        },
                    ];
                    dailyEntries = [
                        {
                            displayName: 'Office Fitouts Sydney',
                            targetUrl: 'https://officefitouts.com.au',
                            normalizedUrl: 'officefitouts.com.au',
                            tagline: 'Commercial office fitouts and interior architecture in Sydney',
                            currentBidCents: 4000, // $40.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.DAILY,
                            category: client_1.Category.OTHER,
                            clickCount: 120,
                        },
                        {
                            displayName: 'INSERT.LINK: Intelligent Links',
                            targetUrl: 'https://insert.link',
                            normalizedUrl: 'insert.link',
                            tagline: 'Internal link building automated by AI keyword contextual matching',
                            currentBidCents: 3500, // $35.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.DAILY,
                            category: client_1.Category.SEO,
                            clickCount: 95,
                        },
                        {
                            displayName: 'Linkers',
                            targetUrl: 'https://linkers.io',
                            normalizedUrl: 'linkers.io',
                            tagline: 'High DR backlink outreach platform for SaaS startups',
                            currentBidCents: 3000, // $30.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.DAILY,
                            category: client_1.Category.MARKETING,
                            clickCount: 68,
                        },
                        {
                            displayName: 'Rapid Indexer',
                            targetUrl: 'https://rapidindexer.com',
                            normalizedUrl: 'rapidindexer.com',
                            tagline: 'Instant Google Search Console URL indexing API',
                            currentBidCents: 2600, // $26.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.DAILY,
                            category: client_1.Category.SEO,
                            clickCount: 42,
                        },
                        {
                            displayName: 'Social Media Scheduler',
                            targetUrl: 'https://socialsched.app',
                            normalizedUrl: 'socialsched.app',
                            tagline: 'Automated social media queue and cross-posting tool',
                            currentBidCents: 1500, // $15.00
                            status: client_1.EntryStatus.VERIFIED,
                            boardType: client_1.BoardType.DAILY,
                            category: client_1.Category.PRODUCTIVITY,
                            clickCount: 29,
                        },
                    ];
                    _i = 0, _a = __spreadArray(__spreadArray([], allTimeEntries, true), dailyEntries, true);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    item = _a[_i];
                    return [4 /*yield*/, prisma.entry.upsert({
                            where: {
                                boardType_normalizedUrl: {
                                    boardType: item.boardType,
                                    normalizedUrl: item.normalizedUrl,
                                },
                            },
                            update: {
                                displayName: item.displayName,
                                currentBidCents: item.currentBidCents,
                                tagline: item.tagline,
                                category: item.category,
                                status: item.status,
                            },
                            create: item,
                        })];
                case 2:
                    entry = _b.sent();
                    return [4 /*yield*/, prisma.bid.create({
                            data: {
                                entryId: entry.id,
                                amountCents: item.currentBidCents,
                                status: 'SUCCEEDED',
                                stripePaymentIntentId: "seed_pi_".concat(Math.random().toString(36).substring(7)),
                            },
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log('Seeding completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('Seeding error:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
