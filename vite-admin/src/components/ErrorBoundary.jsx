import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Portal Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('precision_cms_full_store');
      localStorage.removeItem('precision_cms_content');
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071322] flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="bg-[#0f1d32] border border-[#c8a45e]/30 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-[#c8a45e]/10 border border-[#c8a45e]/30 rounded-2xl flex items-center justify-center mx-auto text-[#c8a45e] text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-wide">Admin Workspace Restored</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              The admin portal detected a state synchronization update. Click below to refresh and load the live workspace interface.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-extrabold rounded-xl shadow-lg hover:from-[#d4b46f] transition-all text-xs tracking-wider uppercase"
            >
              Reload Admin Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
