"use client";

import { useMemo, useState } from "react";

type ResultItem = {
  keyword: string;
  count: number;
  status: "Found" | "Missing";
};

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
  const pattern = escapeRegExp(keyword);
  const regex = new RegExp(pattern, "gi");
  const matches = normalizedText.match(regex);

  return matches ? matches.length : 0;
}

export default function Home() {
  const [text, setText] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [checked, setChecked] = useState(false);

  function handleCheck() {
    const normalizedText = text.trim();
    const keywords = parseKeywords(keywordsInput);

    const computedResults = keywords.map((keyword) => {
      const count = countOccurrences(normalizedText, keyword);

      return {
        keyword,
        count,
        status: count > 0 ? "Found" : "Missing",
      } as ResultItem;
    });

    setResults(computedResults);
    setChecked(true);
  }

  function handleClear() {
    setText("");
    setKeywordsInput("");
    setResults([]);
    setChecked(false);
  }

  const summary = useMemo(() => {
    const total = results.length;
    const found = results.filter((item) => item.count > 0).length;
    const missing = total - found;

    return { total, found, missing };
  }, [results]);

  const sortedResults = useMemo(() => {
    return results;
  }, [results]);

  return (
    <main className="page-shell">
      <div className="container">
        <header className="hero">
          <h1>Bulk Keyword Search</h1>
          <p>
            Paste your text and keyword list to count exact phrase occurrences.
            Matching is case-insensitive, trims extra spaces, and supports
            keywords separated by new lines, commas, or semicolons.
          </p>
        </header>

        <section className="input-grid">
          <div className="card">
            <label htmlFor="text-input">Text to check</label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article or text here..."
            />
          </div>

          <div className="card">
            <label htmlFor="keywords-input">Keywords</label>
            <textarea
              id="keywords-input"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder={"Paste keywords here, for example:\nsoftware development company\ncustom software\nmobile app development"}
            />
          </div>
        </section>

        <div className="actions">
          <button type="button" onClick={handleCheck}>
            Check keywords
          </button>
          <button type="button" onClick={handleClear}>
            Clear all
          </button>
          <span>Exact phrase matching only</span>
        </div>

        {checked && (
          <section className="results-stack">
            <div className="summary-grid">
              <div className="card summary-card">
                <div className="summary-label">Total keywords</div>
                <div className="summary-value">{summary.total}</div>
              </div>
              <div className="card summary-card">
                <div className="summary-label">Found</div>
                <div className="summary-value">{summary.found}</div>
              </div>
              <div className="card summary-card">
                <div className="summary-label">Missing</div>
                <div className="summary-value">{summary.missing}</div>
              </div>
            </div>

            <div className="card table-card">
              <div className="table-header">
                <h2>Results</h2>
              </div>

              {sortedResults.length === 0 ? (
                <div className="empty-state">Add some keywords and run the check.</div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Keyword</th>
                        <th>Occurrences</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((item) => (
                        <tr key={item.keyword}>
                          <td>{item.keyword}</td>
                          <td>{item.count}</td>
                          <td>
                            <span
                              className={
                                item.count > 0 ? "badge badge-found" : "badge badge-missing"
                              }
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
          </section>
        )}
      </div>
    </main>
  );
}
