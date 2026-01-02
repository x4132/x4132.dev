import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class BubblechamberErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Bubblechamber simulation error:", error);
    console.error("Component stack:", info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundColor: "#0F131C",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <p>Simulation error. Reload to restart.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
