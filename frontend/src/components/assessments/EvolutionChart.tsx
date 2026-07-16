import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { tokens } from '@/theme/tokens';

type EvolutionChartProps = {
  points: readonly { label: string; value: number }[];
  maxValue?: number;
};

/** Gráfico ilustrativo RF012 — dados mock até integração API. */
export function EvolutionChart({ points, maxValue = 90 }: EvolutionChartProps) {
  const width = 320;
  const height = 160;
  const padding = { top: 12, right: 12, bottom: 28, left: 28 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const coords = points.map((point, index) => {
    const x = padding.left + (index / Math.max(points.length - 1, 1)) * chartW;
    const y = padding.top + chartH - (point.value / maxValue) * chartH;
    return { x, y, ...point };
  });

  const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} accessibilityRole="image">
      {[0, 30, 60, 90].map((tick) => {
        const y = padding.top + chartH - (tick / maxValue) * chartH;
        return (
          <Line
            key={tick}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke={tokens.colors.border}
            strokeWidth={1}
          />
        );
      })}

      <Polyline
        points={polyline}
        fill="none"
        stroke={tokens.colors.primary}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {coords.map((point) => (
        <Circle key={point.label} cx={point.x} cy={point.y} r={4} fill={tokens.colors.primary} />
      ))}

      {coords.map((point) => (
        <SvgText
          key={`${point.label}-label`}
          x={point.x}
          y={height - 6}
          fontSize={10}
          fill={tokens.colors.textMuted}
          textAnchor="middle">
          {point.label}
        </SvgText>
      ))}
    </Svg>
  );
}
