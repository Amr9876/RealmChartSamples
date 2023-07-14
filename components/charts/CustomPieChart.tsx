import {Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';

interface Props {
  pieData: any[];
}

const CustomPieChart = ({pieData}: Props) => {
  return (
    <PieChart
      paddingLeft={'25'}
      backgroundColor={'transparent'}
      data={pieData}
      chartConfig={{color: opacity => `transparent`}}
      style={{
        marginLeft: 10,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      width={Dimensions.get('window').width - 10}
      height={Dimensions.get('window').height / 2.5}
      accessor="amount"
    />
  );
};

export default CustomPieChart;
