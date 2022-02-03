import {Alert, AlertIcon, AlertTitle, Flex} from '@chakra-ui/react';
import {max, min} from 'd3';
import {add, differenceInCalendarDays, format, isAfter, sub} from 'date-fns';
import React, {Component} from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {AxisDomain} from 'recharts/types/util/types';
import styled, {css} from 'styled-components';
import {colors} from '../../common-styles/_colors';
import {defaultPadding} from '../../common-styles/_layout';
import {HistoryItem} from '../../typings';
import Loader from '../utils/loader';
import Chart from '@assets/images/chart.svg';

// #region STYLES ------------------------------------------
const GraphContainer = styled.div`
  &&& {
    ${(props: {active: boolean}) =>
      !props.active &&
      css`
        .recharts-surface {
          opacity: 0;
        }
        .recharts-wrapper {
          border-radius: ${defaultPadding(0.3)};
          background: ${colors.lightest};
          background-image: url(${Chart});
          background-size: 50%;
          background-repeat: no-repeat;
          background-position: center;
        }
      `};
  }
`;

const Button = styled.button`
  padding: ${defaultPadding(0.2)} ${defaultPadding(1)};

  cursor: pointer;
  border: 1px solid ${colors.light};
  margin: ${defaultPadding(0.5)};
  border-radius: ${defaultPadding(2)};
  &:hover {
    background-color: ${colors.brand.mid};
  }
  ${(props: {active: boolean}) =>
    props.active &&
    css`
      font-weight: 500;
      background-color: ${colors.brand.dark};
      color: ${colors.white};
      &:hover {
        background-color: ${colors.brand.dark};
      }
    `};
`;

const LoaderContainer = styled.div`
  height: 50%;
  align-items: center;
`;

// #endregion STYLES ------------------------------------------

/**
 * This component draws a grpah based on the passed exchange rate data
 */
export type TimeSeries = '1M' | '2W' | '1W';
interface State {
  data: HistoryItem[];
  timeSeries: TimeSeries;
  loading: boolean;
  error?: boolean;
}
interface Props {
  data: HistoryItem[];
  loading: boolean;
  error?: boolean;
}
export class Graph extends Component<Props, State> {
  startDate = new Date();
  endDate = new Date();
  ticksX: string[] = ['0'];
  ticksY: string[] = ['0'];
  maximumValue: number;
  minimumValue: number;
  changedTimeSeries: boolean;
  currentTimeSeries: TimeSeries;

  constructor(props: Props) {
    super(props);
    this.state = {
      data: this.props.data,
      timeSeries: '1M',
      loading: false,
    };
  }

  /**
   * Returns an interval of dates to draw the x axis tick labels
   * @param startDate
   * @param endDate
   * @param num
   * @returns
   */
  private getTicksX(startDate: any, endDate: any, num: any): string[] {
    const diffDays = differenceInCalendarDays(endDate, startDate);
    let current = startDate,
      velocity = Math.round(diffDays / (num - 1));
    const ticks = [startDate.getTime()];
    for (let i = 1; i < num - 1; i++) {
      ticks.push(add(current, {days: i * velocity}).getTime());
    }
    ticks.push(endDate.getTime());
    return ticks;
  }

  /**
   * Called when the graph props change.
   * @param props
   */
  private updateGraph(props: Props) {
    this.formatData(props.data, this.currentTimeSeries);

    this.setState({
      data: props.data,
      error: props.error,
      loading: props.loading,
    });
  }

  /**
   * Format the data to be usable by the graph, takes into account the time series passed as prop
   * @param data
   * @param timeSeries
   */
  private formatData(data: HistoryItem[], timeSeries: TimeSeries) {
    const filteredData = data.filter((d: HistoryItem) => {
      const date = new Date(d.date as string);
      let days = 30;
      switch (timeSeries) {
        case '1W':
          days = 7;
          break;
        case '2W':
          days = 15;
          break;
      }
      const duration: Duration = {
        days,
      };
      const minDate = sub(new Date(), duration);
      if (isAfter(date, minDate)) {
        d.dateObject = date;
        return true;
      }
      return false;
    });
    this.maximumValue = max(filteredData, (d: HistoryItem) => d.high)!;
    this.minimumValue = min(filteredData, (d: HistoryItem) => d.high)!;
    this.startDate = new Date(min(filteredData, (d: HistoryItem) => d.date)!);
    this.endDate = new Date(max(filteredData, (d: HistoryItem) => d.date)!);
    this.ticksX = this.getTicksX(this.startDate, this.endDate, 5);
  }

  /**
   * Format date object to string
   * @param date
   * @returns
   */
  private dateFormatter(date: number): string {
    if (date) {
      return format(new Date(date), 'dd/MMM');
    }
    return '';
  }

  /**
   * Limit decimals for y axis
   * @param value
   * @returns
   */
  private tickFormatter(value: number): string {
    if (value) {
      const sValue: string = value.toString();
      const limit = 5;
      if (sValue.length < limit) return sValue;
      return `${sValue.substring(0, limit)}...`;
    }
    return '';
  }

  private handleTimeSeriesClick(timeSeries: TimeSeries): void {
    this.changedTimeSeries = true;
    this.currentTimeSeries = timeSeries;
    this.setState({
      timeSeries: this.currentTimeSeries,
    });
  }

  shouldComponentUpdate(nextProps: Props) {
    if (
      this.state.data[0]?.high !== nextProps?.data[0]?.high ||
      this.state.loading !== nextProps.loading ||
      this.state.error !== nextProps.error ||
      this.changedTimeSeries
    ) {
      this.changedTimeSeries = false;
      this.updateGraph(nextProps);
      return true;
    }

    return false;
  }

  render() {
    const chart = (
      <GraphContainer active={this.state.data?.length > 0}>
        <ResponsiveContainer width="100%" height="80%" aspect={1.6}>
          <AreaChart data={this.state.data} margin={{top: 5, right: 30, left: 5, bottom: 5}}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.brand.dark} stopOpacity={0.1} />
                <stop offset="95%" stopColor={colors.white} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <ReferenceLine
              y={this.maximumValue}
              label={{value: this.maximumValue, position: 'bottom'}}
              stroke={colors.function.successDark}
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={this.minimumValue}
              label={{value: this.minimumValue, position: 'top'}}
              stroke={colors.function.successDark}
              strokeDasharray="3 3"
            />
            <YAxis
              dataKey="high"
              domain={['auto', 'auto']}
              tickLine={false}
              tickFormatter={this.tickFormatter}></YAxis>
            <XAxis
              dataKey="dateObject"
              type="number"
              scale="time"
              tickFormatter={this.dateFormatter}
              tickLine={false}
              domain={['auto', 'auto']}
              ticks={this.ticksX}></XAxis>
            <Tooltip wrapperStyle={{top: -50, left: -50}} />
            <Area
              fillOpacity={1}
              fill="url(#colorUv)"
              type="monotone"
              dataKey="high"
              stroke={colors.brand.dark}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GraphContainer>
    );
    if (this.props.loading) {
      return (
        <LoaderContainer>
          <Loader width={200} height={200} type="bar"></Loader>
        </LoaderContainer>
      );
    } else if (!this.props.error) {
      return (
        <Flex direction="column">
          {chart}
          <Flex justify="center">
            <Button
              active={this.state.timeSeries === '1W'}
              onClick={this.handleTimeSeriesClick.bind(this, '1W')}>
              1W
            </Button>
            <Button
              active={this.state.timeSeries === '2W'}
              onClick={this.handleTimeSeriesClick.bind(this, '2W')}>
              2W
            </Button>
            <Button
              active={this.state.timeSeries === '1M'}
              onClick={this.handleTimeSeriesClick.bind(this, '1M')}>
              1M
            </Button>
          </Flex>
        </Flex>
      );
    } else {
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error fetching Exchange Rate History</AlertTitle>
        </Alert>
      );
    }
  }
}
