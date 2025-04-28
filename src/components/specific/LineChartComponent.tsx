/**
 * 成绩折线图组件
 * 显示学生近期考试成绩趋势
 */

import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

interface LineChartComponentProps {
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
      legend?: string;
    }>;
    legend?: string[];
  };
  height?: number;
  width?: number;
  yAxisSuffix?: string;
  yAxisLabel?: string;
  chartDescription?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  title,
  data,
  height = 220,
  width = Dimensions.get('window').width - 56,
  yAxisSuffix = '',
  yAxisLabel = '',
  chartDescription = '',
}) => {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: '#0284c7',
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {chartDescription ? (
          <Text style={styles.description}>{chartDescription}</Text>
        ) : null}
      </View>
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={yAxisSuffix}
        yAxisLabel={yAxisLabel}
        fromZero
        segments={5}
        formatYLabel={value => Math.round(parseFloat(value)).toString()}
      />
      {data.legend && data.legend.length > 0 && (
        <View style={styles.legendContainer}>
          {data.legend.map((legend, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      data.datasets[index]?.color?.(1) || chartConfig.color(1),
                  },
                ]}
              />
              <Text style={styles.legendText}>{legend}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#4b5563',
  },
});

export default LineChartComponent;
