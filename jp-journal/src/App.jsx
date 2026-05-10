import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gsfdqaqxbyfwmestvakt.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZmRxYXF4Ynlmd21lc3R2YWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTk2OTUsImV4cCI6MjA5MzkzNTY5NX0.ccHGlNVLZr6ZqqrlNDQDs2WlQeGYt4mGaQM_B2BHWKM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

function formatDate(iso) {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[d.getDay()];
  return `${year}年${month}月${day}日（${weekday}）`;
}

// ── Auth Screen ────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth(data.user);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("確認メールを送信しました。メールをご確認ください。");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "#1c1a14",
    border: "1px solid #3a3520",
    borderRadius: "3px",
    padding: "13px 16px",
    fontSize: "15px",
    color: "#e8e0cc",
    fontFamily: "'Zen Kaku Gothic New', sans-serif",
    letterSpacing: "0.03em",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0e0c",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <div style={{
          width: "64px", height: "64px",
          border: "1px solid #b52929",
          borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: "28px",
          color: "#b52929",
          fontFamily: "'Shippori Mincho', serif",
        }}>記</div>
        <h1 style={{
          fontFamily: "'Shippori Mincho', serif",
          color: "#e8e0cc",
          fontSize: "22px",
          fontWeight: 400,
          letterSpacing: "0.15em",
          marginBottom: "6px",
        }}>日々の記録</h1>
        <p style={{
          color: "#5a5440",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
        }}>My Japanese Journal</p>
      </div>

      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "#161410",
        border: "1px solid #2a2820",
        borderRadius: "4px",
        padding: "32px",
      }}>
        <p style={{
          color: "#5a5440",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
        }}>{mode === "login" ? "ログイン" : "アカウント作成"}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#b52929", fontSize: "13px", marginBottom: "14px", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ color: "#6a9a6a", fontSize: "13px", marginBottom: "14px", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
            {message}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#2a2820" : "#b52929",
            color: loading ? "#5a5440" : "#fff",
            border: "none",
            borderRadius: "3px",
            padding: "13px",
            fontSize: "14px",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            letterSpacing: "0.1em",
            transition: "background 0.2s",
            marginBottom: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "…" : mode === "login" ? "入る →" : "登録する →"}
        </button>

        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
          style={{
            background: "none",
            border: "none",
            color: "#5a5440",
            fontSize: "12px",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            letterSpacing: "0.05em",
            width: "100%",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {mode === "login" ? "アカウントをお持ちでない方 →" : "すでにアカウントをお持ちの方 →"}
        </button>
      </div>

      <div style={{
        marginTop: "48px",
        color: "#1e1c16",
        fontSize: "13px",
        letterSpacing: "0.4em",
        fontFamily: "'Shippori Mincho', serif",
        userSelect: "none",
      }}>
        思・記・語・感・綴・写・述・誌
      </div>
    </div>
  );
}

// ── Journal ────────────────────────────────────────────────────
function Journal({ user, onSignOut }) {
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    setFetching(true);
    const { data } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setFetching(false);
  };

  const translate = async () => {
    if (!draft.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(draft.trim())}&langpair=en|ja`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseStatus !== 200) throw new Error();
      const japanese = data.responseData.translatedText;

      const { data: inserted, error: dbErr } = await supabase
        .from("entries")
        .insert({ user_id: user.id, english: draft.trim(), japanese })
        .select()
        .single();

      if (dbErr) throw dbErr;
      setEntries(prev => [inserted, ...prev]);
      setDraft("");
    } catch {
      setError("翻訳に失敗しました。もう一度お試しください。");
    }
    setLoading(false);
  };

  const deleteEntry = async (id) => {
    await supabase.from("entries").delete().eq("id", id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0e0c" }}>
      <header style={{
        background: "#0f0e0c",
        borderBottom: "1px solid #2a2820",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "32px", height: "32px",
            border: "1px solid #b52929",
            borderRadius: "3px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", color: "#b52929",
            fontFamily: "'Shippori Mincho', serif",
          }}>記</div>
          <h1 style={{
            fontFamily: "'Shippori Mincho', serif",
            color: "#e8e0cc",
            fontSize: "17px",
            fontWeight: 400,
            letterSpacing: "0.12em",
          }}>日々の記録</h1>
        </div>
        <button
          onClick={onSignOut}
          style={{
            background: "none",
            border: "1px solid #2a2820",
            borderRadius: "3px",
            color: "#5a5440",
            fontSize: "11px",
            letterSpacing: "0.1em",
            padding: "6px 14px",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            cursor: "pointer",
          }}
        >退出</button>
      </header>

      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Compose */}
        <div style={{
          background: "#161410",
          border: "1px solid #2a2820",
          borderRadius: "4px",
          padding: "24px",
          marginBottom: "48px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "3px", height: "18px", background: "#b52929", borderRadius: "2px" }} />
            <span style={{
              fontSize: "11px",
              color: "#5a5440",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
            }}>今日の記録 — Today's entry</span>
          </div>

          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") translate(); }}
            placeholder="Write anything in English…"
            rows={4}
            style={{
              width: "100%",
              background: "#0f0e0c",
              border: "1px solid #2a2820",
              borderRadius: "3px",
              padding: "14px",
              fontSize: "14px",
              color: "#c8c0aa",
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              resize: "vertical",
              lineHeight: "1.7",
              letterSpacing: "0.02em",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
            <span style={{ fontSize: "11px", color: "#3a3520", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
              {draft.length > 0 ? `${draft.length}文字` : "⌘↵ で投稿"}
            </span>
            <button
              onClick={translate}
              disabled={loading || !draft.trim()}
              style={{
                background: loading || !draft.trim() ? "#1c1a14" : "#b52929",
                color: loading || !draft.trim() ? "#3a3520" : "#fff",
                border: "none",
                borderRadius: "3px",
                padding: "10px 22px",
                fontSize: "13px",
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                letterSpacing: "0.1em",
                transition: "all 0.2s",
                cursor: loading || !draft.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "翻訳中…" : "投稿する →"}
            </button>
          </div>
          {error && (
            <p style={{ color: "#b52929", fontSize: "12px", marginTop: "10px", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
              {error}
            </p>
          )}
        </div>

        {/* Entries */}
        {fetching ? (
          <p style={{ color: "#3a3520", fontSize: "13px", textAlign: "center", fontFamily: "'Zen Kaku Gothic New', sans-serif", letterSpacing: "0.1em" }}>
            読み込み中…
          </p>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "32px", color: "#2a2820", fontFamily: "'Shippori Mincho', serif", marginBottom: "12px" }}>無</div>
            <p style={{ color: "#3a3520", fontSize: "12px", letterSpacing: "0.1em", fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
              まだ記録がありません
            </p>
          </div>
        ) : (
          <div>
            {entries.map(entry => (
              <article key={entry.id} style={{
                background: "#161410",
                border: "1px solid #2a2820",
                borderRadius: "4px",
                padding: "28px",
                marginBottom: "12px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <span style={{
                    fontSize: "12px",
                    color: "#5a5440",
                    fontFamily: "'Shippori Mincho', serif",
                    letterSpacing: "0.08em",
                  }}>
                    {formatDate(entry.created_at)}
                  </span>
                  <div style={{
                    width: "42px", height: "42px",
                    border: "1px solid #b5292930",
                    borderRadius: "3px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                    color: "#b52929",
                    fontFamily: "'Shippori Mincho', serif",
                    opacity: 0.5,
                    transform: "rotate(-4deg)",
                  }}>記</div>
                </div>

                <p style={{
                  fontFamily: "'Shippori Mincho', serif",
                  fontSize: "21px",
                  lineHeight: "2.0",
                  color: "#e8e0cc",
                  marginBottom: "20px",
                  letterSpacing: "0.05em",
                }}>
                  {entry.japanese}
                </p>

                <div style={{ borderTop: "1px solid #2a2820", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <p style={{
                    fontSize: "13px",
                    color: "#4a4434",
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    lineHeight: "1.6",
                    flex: 1,
                  }}>
                    {entry.english}
                  </p>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2a2820",
                      fontSize: "12px",
                      fontFamily: "'Zen Kaku Gothic New', sans-serif",
                      flexShrink: 0,
                      cursor: "pointer",
                      padding: "2px 4px",
                    }}
                  >削除</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#0f0e0c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#2a2820", fontFamily: "'Shippori Mincho', serif", fontSize: "24px" }}>記</span>
    </div>
  );

  return user
    ? <Journal user={user} onSignOut={signOut} />
    : <AuthScreen onAuth={setUser} />;
}
