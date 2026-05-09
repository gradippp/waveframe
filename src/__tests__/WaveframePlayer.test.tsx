import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WaveframePlayer } from '../components/WaveframePlayer';
import React from 'react';

// Mocking canvas, audio, and ResizeObserver for testing
window.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
})) as any;

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserverMock as any;

describe('WaveframePlayer', () => {
  const defaultProps = {
    audioUrl: 'test.mp3',
    peaks: [0.1, 0.5, 0.2],
    title: 'Test Track',
    artist: 'Test Artist',
  };

  it('renders correctly with title and artist', () => {
    render(<WaveframePlayer {...defaultProps} />);
    expect(screen.getByText('Test Track')).toBeDefined();
    expect(screen.getByText('Test Artist')).toBeDefined();
  });

  it('renders with artwork when provided', () => {
    render(<WaveframePlayer {...defaultProps} artworkUrl="test.jpg" />);
    const artwork = screen.getByAltText('Test Track') as HTMLImageElement;
    expect(artwork.src).toContain('test.jpg');
  });

  it('renders the play button', () => {
    render(<WaveframePlayer {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('applies style variables', () => {
    const { container } = render(
      <WaveframePlayer
        {...defaultProps}
        style={{ '--wf-bg-color': '#111827' } as React.CSSProperties}
      />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.getPropertyValue('--wf-bg-color')).toBe('#111827');
  });
});
