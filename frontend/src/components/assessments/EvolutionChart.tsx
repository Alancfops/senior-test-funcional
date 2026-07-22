import { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { formatDurationMs } from '@/features/assessments/display-result';
import { buildYAxisTicks } from '@/features/assessments/chart-config';
import { tokens } from '@/theme/tokens';

export type EvolutionChartPoint = {
  id: string;
  label: string;
  value: number;
  scoreSummary: string;
  durationMs?: number;
};

type EvolutionChartProps = {
  points: readonly EvolutionChartPoint[];
  maxValue: number;
  /** Bolinha do teste aberto (detalhe/resultado atual). */
  highlightedPointId?: string;
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 180;
/** Área de toque invisível — maior que o ponto visível (WCAG ~44dp). */
const HIT_RADIUS = 18;

/** RF012 — gráfico de linha com bolinhas interativas (tooltip + destaque). */
export function EvolutionChart({ points, maxValue, highlightedPointId }: EvolutionChartProps) {
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [layoutWidth, setLayoutWidth] = useState(CHART_WIDTH);

  const padding = { top: 16, right: 12, bottom: 32, left: 36 };
  const chartW = CHART_WIDTH - padding.left - padding.right;
  const chartH = CHART_HEIGHT - padding.top - padding.bottom;
  const yTicks = buildYAxisTicks(maxValue);

  const coords = useMemo(
    () =>
      points.map((point, index) => {
        const x = padding.left + (index / Math.max(points.length - 1, 1)) * chartW;
        const y = padding.top + chartH - (point.value / maxValue) * chartH;
        return { x, y, ...point };
      }),
    [chartH, chartW, maxValue, padding.left, padding.top, points],
  );

  const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ');
  const lineColor = tokens.colors.text;
  const activePoint = coords.find((point) => point.id === activePointId);

  function handleLayout(event: LayoutChangeEvent) {
    setLayoutWidth(event.nativeEvent.layout.width);
  }

  function togglePoint(pointId: string) {
    setActivePointId((current) => (current === pointId ? null : pointId));
  }

  const scale = layoutWidth / CHART_WIDTH;

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
      <Svg
        width="100%"
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        accessibilityRole="image"
        accessibilityLabel={`Gráfico de evolução com ${points.length} avaliações. Toque nas bolinhas para ver detalhes.`}>
        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxValue) * chartH;
          return (
            <Line
              key={`grid-${tick}`}
              x1={padding.left}
              y1={y}
              x2={CHART_WIDTH - padding.right}
              y2={y}
              stroke={tokens.colors.border}
              strokeWidth={1}
            />
          );
        })}

        {yTicks.map((tick) => {
          const y = padding.top + chartH - (tick / maxValue) * chartH;
          return (
            <SvgText
              key={`tick-${tick}`}
              x={padding.left - 6}
              y={y + 4}
              fontSize={10}
              fill={tokens.colors.textMuted}
              textAnchor="end">
              {String(tick)}
            </SvgText>
          );
        })}

        {coords.length >= 2 ? (
          <Polyline
            points={polyline}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}

        {coords.map((point) => {
          const isHighlighted = point.id === highlightedPointId;
          const isActive = point.id === activePointId;
          const radius = isHighlighted ? 8 : isActive ? 7 : 5;

          return (
            <G
              key={`${point.id}-hit`}
              onPress={() => togglePoint(point.id)}
              accessibilityRole="button"
              accessibilityLabel={`Avaliação ${point.label}, pontuação ${point.scoreSummary}`}
              accessibilityHint="Toque para ver resumo desta avaliação">
              <Circle cx={point.x} cy={point.y} r={HIT_RADIUS} fill="transparent" />
              <Circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill={isHighlighted ? tokens.colors.primary : lineColor}
                stroke={
                  isHighlighted
                    ? tokens.colors.onPrimary
                    : isActive
                      ? tokens.colors.primary
                      : 'transparent'
                }
                strokeWidth={isHighlighted ? 2.5 : isActive ? 2 : 0}
              />
            </G>
          );
        })}

        {coords.map((point) => (
          <SvgText
            key={`${point.id}-label`}
            x={point.x}
            y={CHART_HEIGHT - 8}
            fontSize={10}
            fill={point.id === highlightedPointId ? tokens.colors.primary : tokens.colors.textMuted}
            fontWeight={point.id === highlightedPointId ? '700' : '400'}
            textAnchor="middle">
            {point.label}
          </SvgText>
        ))}
      </Svg>

      {activePoint ? (
        <Pressable
          accessibilityRole="summary"
          accessibilityLabel={`Pontuação ${activePoint.scoreSummary}. Tempo de aplicação ${activePoint.durationMs ? formatDurationMs(activePoint.durationMs) : 'indisponível'}.`}
          onPress={() => setActivePointId(null)}
          style={[
            styles.tooltip,
            {
              left: activePoint.x * scale,
              top: Math.max(8, activePoint.y * scale - 72),
              transform: [{ translateX: -72 }],
            },
          ]}>
          <Text style={styles.tooltipTitle}>Avaliação {activePoint.label}</Text>
          <Text style={styles.tooltipLine}>Pontuação: {activePoint.scoreSummary}</Text>
          <Text style={styles.tooltipLine}>
            Tempo:{' '}
            {activePoint.durationMs && activePoint.durationMs > 0
              ? formatDurationMs(activePoint.durationMs)
              : '—'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    minHeight: CHART_HEIGHT,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    width: 144,
    backgroundColor: tokens.colors.text,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 2,
  },
  tooltipTitle: {
    ...tokens.typography.caption,
    color: tokens.colors.onPrimary,
    fontWeight: '700',
  },
  tooltipLine: {
    ...tokens.typography.caption,
    color: tokens.colors.onPrimary,
  },
});
