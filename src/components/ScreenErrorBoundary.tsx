import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from './ActionButton';
import { theme } from '../theme/theme';

type ScreenErrorBoundaryProps = {
  children: ReactNode;
  onGoHome: () => void;
  onResetLocalState: () => void;
};

type ScreenErrorBoundaryState = {
  hasError: boolean;
};

export class ScreenErrorBoundary extends Component<ScreenErrorBoundaryProps, ScreenErrorBoundaryState> {
  state: ScreenErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Axion screen crash', error, errorInfo);
  }

  componentDidUpdate(prevProps: ScreenErrorBoundaryProps) {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  private handleGoHome = () => {
    this.setState({ hasError: false });
    this.props.onGoHome();
  };

  private handleReset = async () => {
    this.setState({ hasError: false });
    await this.props.onResetLocalState();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.panel}>
        <Text style={styles.title}>Sessione ripristinata</Text>
        <Text style={styles.copy}>Ultima schermata ha generato un errore. Rientra in home o ripulisci dati locali.</Text>
        <ActionButton icon="home-outline" label="Vai alla home" onPress={this.handleGoHome} />
        <ActionButton icon="trash-outline" label="Reset dati locali" onPress={this.handleReset} variant="ghost" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  copy: {
    color: theme.colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
});
