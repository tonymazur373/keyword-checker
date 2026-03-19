"use client";

import { useMemo, useState } from "react";

type ResultItem = {
  keyword: string;
  count: number;
  status: "Found" | "Missing";
};

export default function Page() {
  const [text, setText] = useState<string>("");
  const [keywordsInput, setKeywordsInput] = useState<string>("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const [missingOnly, setMissingOnly] = useState<boolean>(false);
  const [wholeWordSingleKeywords, setWholeWordSingleKeywords] =
    useState<boolean>(true);

  function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseKeywords(input: string): string[] {
    return Array.from(
      new Set(
        input
          .split(/[\n,;]+/)
          .map((item) => item.trim().replace(/\s+/g, " "))
          .filter(Boolean)
      )
    );
  }

  function countOccurrences(sourceText: string, keyword: string): number {
    if (!sourceText || !keyword) return 0;

    const normalizedText = sourceText.replace(/\s+/g, " ");
    const isSingleWord = !keyword.includes(" ");
    const escapedKeyword = escapeRegExp(keyword);
    const pattern =
      wholeWordSingleKeywords && isSingleWord
        ? `\\b${escapedKeyword}\\b`
        : escapedKeyword;

    const regex = new RegExp(pattern, "gi");
    const matches = normalizedText.match(regex);
    return matches ? matches.length : 0;
  }

  function handleCheck(): void {
    const normalizedText = text.trim();
    const keywords = parseKeywords(keywordsInput);

    const computedResults: ResultItem[] = keywords.map((keyword) => {
      const count = countOccurrences(normalizedText, keyword);
      return {
        keyword,
        count,
        status: count > 0 ? "Found" : "Missing",
      };
    });

    setResults(computedResults);
    setChecked(true);
  }

  function handleClear(): void {
    setText("");
    setKeywordsInput("");
    setResults([]);
    setChecked(false);
    setMissingOnly(false);
  }

  const summary = useMemo(() => {
    const total = results.length;
    const found = results.filter((item) => item.count > 0).length;
    const missing = total - found;
    return { total, found, missing };
  }, [results]);

  const missingFirstResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (a.count === 0 && b.count > 0) return -1;
      if (a.count > 0 && b.count === 0) return 1;
      return a.keyword.localeCompare(b.keyword);
    });
  }, [results]);

  const visibleResults = useMemo(() => {
    return missingOnly
      ? missingFirstResults.filter((item) => item.count === 0)
      : missingFirstResults;
  }, [missingFirstResults, missingOnly]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            SEO Keyword Checker
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Paste your text and keyword list to count exact phrase occurrences.
            Matching is case-insensitive, trims extra spaces, and supports
            keywords separated by new lines, commas, or semicolons.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Text to check
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article or text here..."
              className="min-h-[320px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Keywords
            </label>
            <textarea
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder={`Paste keywords here, for example:\nsoftware development company\ncustom software\nmobile app development`}
              className="min-h-[320px] w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCheck}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            Check keywords
          </button>

          <button
            onClick={handleClear}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Clear all
          </button>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={missingOnly}
              onChange={(e) => setMissingOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Missing only
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={wholeWordSingleKeywords}
              onChange={(e) => setWholeWordSingleKeywords(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Whole-word matching for single-word keywords
          </label>
        </div>

        {checked && (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">Total keywords</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {summary.total}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">Found</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {summary.found}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-slate-500">Missing</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {summary.missing}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Results</h2>
              </div>

              {visibleResults.length === 0 ? (
                <div className="px-5 py-8 text-sm text-slate-500">
                  {results.length === 0
                    ? "Add some keywords and run the check."
                    : "No keywords match the current filter."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-5 py-3 font-medium">Keyword</th>
                        <th className="px-5 py-3 font-medium">Occurrences</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleResults.map((item) => (
                        <tr key={item.keyword} className="border-t border-slate-200">
                          <td className="px-5 py-4 text-slate-900">{item.keyword}</td>
                          <td className="px-5 py-4 text-slate-700">{item.count}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                item.count > 0
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
