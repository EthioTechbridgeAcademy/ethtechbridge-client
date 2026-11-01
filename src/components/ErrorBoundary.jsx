import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 shadow-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">Something went wrong</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The application encountered an unexpected error. Please reload the page to continue.
            </p>
            {this.state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-700 font-mono overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

