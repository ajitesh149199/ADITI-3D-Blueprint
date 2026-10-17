import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="loader">
          <div className="loader-card glass-panel">
            <div className="kicker">Viewer error</div>
            <p className="err">{this.state.error.message || 'Failed to render 3D scene'}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
