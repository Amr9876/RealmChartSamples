import {Dimensions} from 'react-native';
import {chartConfig, checkOverlap} from '../../utils';
import {LineChart} from 'react-native-chart-kit';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';

interface Props {
  data: LineChartData;
  labels: string[];
}

const CustomLineChart = ({data, labels}: Props) => {
  return (
    <>
      <LineChart
        style={{
          marginLeft: checkOverlap(labels) ? 0 : 40,
          backgroundColor: 'blue',
        }}
        verticalLabelRotation={-50}
        chartConfig={{
          ...chartConfig,
          propsForVerticalLabels: {
            dy: 10,
            dx: -40,
            fontSize: labels.length >= 27 ? 8 : 11,
          },
        }}
        data={data}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height / 2}
        withShadow={false}
      />
    </>
  );
};

export default CustomLineChart;
