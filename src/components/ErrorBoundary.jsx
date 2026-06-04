import { Component } from "react";

// Catches any render/runtime error in the tree and shows a recoverable fallback
// instead of a blank screen. Production safety net.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[mlbb] render error:", error, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", color: "#eef2f8", fontFamily: "'Rajdhani',system-ui,sans-serif" }}>
          <div style={{ fontSize: 44 }}>⚠️</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 10, color: "#f0b232" }}>Something went wrong</div>
          <div style={{ fontSize: 13, color: "#8899b3", marginTop: 8, maxWidth: 320 }}>The app hit an unexpected error. Your saved data is safe. Reload to continue.</div>
          <button
            type="button"
            onClick={() => { this.setState({ error: null }); if (typeof location !== "undefined") location.reload(); }}
            style={{ marginTop: 18, padding: "11px 22px", background: "#f0b232", border: "none", borderRadius: 10, color: "#0a0a0a", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Oxanium',sans-serif" }}
          >
            ↻ Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
