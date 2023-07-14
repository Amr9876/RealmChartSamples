import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {chartConfig} from '../../utils';
import {ChartData} from 'react-native-chart-kit/dist/HelperTypes';

interface Props {
  data: ChartData;
  labels: string[];
}

const CustomBarChart = ({data, labels}: Props) => {
  return (
    <BarChart
      yAxisLabel=""
      yAxisSuffix=""
      verticalLabelRotation={-50}
      chartConfig={{...chartConfig, propsForVerticalLabels: {dy: 10, dx: -40}}}
      data={data}
      width={Dimensions.get('window').width - 15}
      height={Dimensions.get('window').height / 2}
      style={{marginLeft: labels.length > 4 ? 0 : 15}}
    />
  );
};

export default CustomBarChart;
