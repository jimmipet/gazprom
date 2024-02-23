import { CSSProperties, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { forceResizeCharts } from "./UtilsForCharts";

interface IOnEvents {
  type: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  func: Function;
}

export interface ReactEChartsProps {
  option: any;
  onEvents?: IOnEvents;
  style?: CSSProperties;
  settings?: echarts.SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
  forceResize?: boolean;
}

export interface ILegendselectchangedParams {
  name: string;
  selected: Record<string, boolean>;
  type: string;
}

const ReactEchatrs = ({
  option,
  onEvents,
  style,
  settings,
  loading,
  theme,
  forceResize = true,
}: ReactEChartsProps): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let chart: echarts.ECharts | undefined;

    if (chartRef.current !== null) {
      chart = echarts.init(chartRef.current, theme);
    }

    function resizeChart() {
      chart?.resize();
    }

    window.addEventListener("resize", resizeChart);
    
    // не разобрался где ошибка скорее всего упустил какой то момент
    let observer: MutationObserver | false | undefined = false;
    if (forceResize) observer = forceResizeCharts(resizeChart);


    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };  
  }, [forceResize, theme]);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      chart?.setOption(option, settings);
      if (onEvents && onEvents.type) {
        chart?.on(onEvents.type, function (params: any) {
          onEvents.func(params);
          chart?.setOption(option, settings);
        });
      }
    }
  }, [option, settings, onEvents, theme]);

  useEffect(() => {
    if (chartRef.current !== null) {
      const chart = echarts.getInstanceByDom(chartRef.current);
      loading === true ? chart?.showLoading() : chart?.hideLoading();
    }
  }, [loading, theme]);
  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%", ...style }} />
  );
};

export default ReactEchatrs;
