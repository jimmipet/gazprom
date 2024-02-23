import { useState, useEffect } from "react";
import "./App.scss";
import ReactEchatrs from "./Echarts/ReactEcharts";
import { Button } from "@consta/uikit/Button";
import axios from "axios";
import Tooltip from "./components/Tooltip";
import ReactDOMServer from "react-dom/server";

//тип обьекта данных
type CurrencyMapping = {
  label: string;
  icon: string;
};
// типизация item
interface DataItem {
  date: string;
  month: string;
  value: number;
}

const App = () => {
  // данные для заполнения title над графиком
  const currencyMappings: Record<string, CurrencyMapping> = {
    "Курс доллара": {
      label: "доллара",
      icon: "$",
    },
    "Курс евро": {
      label: "eвро",
      icon: "€",
    },
    "Курс юаня": {
      label: "юань",
      icon: "¥",
    },
  };
  //состояние компонента для изменения графика на другую валюту
  const [selectedCurrency, setSelectedCurrency] = useState("Курс доллара");
  //состояние на изменение данных
  const [chartData, setChartData] = useState([]);
  // состояние для срежнего значения
  const [average, setAverage] = useState(0);
  
  // ререндер компонента в зависимости от изменения графика
  useEffect(() => {
    fetchData(selectedCurrency);
  }, [selectedCurrency]);

  //запрос  к api для получения данных для вставки в график
  const fetchData = (currency: string) => {
    axios
      .get(`https://65d79f9127d9a3bc1d7b8248.mockapi.io/gazprom/dollar/dollar`)
      .then((response) => {
        const data = response.data[0][currency];
        setChartData(data);

        const averageValue = calculateAverage(
          data.map((item: DataItem) => item.value)
        );
        setAverage(averageValue);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // настройки echarts
  const chartOptions = {
    xAxis: {
      type: "category",
      data: chartData.map((item: DataItem) => item.month),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: chartData.map((item: DataItem) => item.value),
        type: "line",
        lineStyle: {
          color: "#F38B00",
        },
        symbol: "none",
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: function (params: any[]) {
        if (params[0]) {
          const dataIndex = params[0].dataIndex;
          const tooltipContent = ReactDOMServer.renderToStaticMarkup(
            <Tooltip
              month={(chartData[dataIndex] as { month: string }).month}
              value={(chartData[dataIndex] as { value: number }).value}
              name={selectedCurrency}
            />
          );
          return tooltipContent;
        }
        return "";
      },
      axisPointer: {
        animation: false,
      },
    },
  };

  const chartSettings = {
    // ... ваш код
  };

  //не придумал event поэтому написал так чтобы просто был ( тоесть при клике будет обновление)
  const chartEvents = {
    type: "click",
    func: (params: any[]) => {
      console.log("Chart clicked:", params);
    },
  };

  //функция изменения состояния по нажатию на кнопки валюты
  const handleButtonClick = (currency: string) => {
    setSelectedCurrency(currency);
  };

  // поиск среднего значения на графике
  const calculateAverage = (values: number[]) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  };

  return (
    <div id="content" className="container">
      <article>
        <div className="Gridster">
          <div className="title-button">
            <h1>
              {" "}
              Курс {currencyMappings[selectedCurrency].label},
              <span>{currencyMappings[selectedCurrency].icon}</span>/₽
            </h1>
            <div className="buttons">
              <Button
                label={`$`}
                onClick={() => handleButtonClick("Курс доллара")}
                style={{
                  width: "33%",
                  height: "100%",
                  backgroundColor:
                    selectedCurrency === "Курс доллара"
                      ? "rgba(0, 120, 210, 1)"
                      : "transparent",
                  borderRadius: "3px",
                }}
              />
              <hr className="currency-divider" />
              <Button
                label={`€`}
                onClick={() => handleButtonClick("Курс евро")}
                style={{
                  width: "33%",
                  height: "100%",
                  backgroundColor:
                    selectedCurrency === "Курс евро"
                      ? "rgba(0, 120, 210, 1)"
                      : "transparent",
                  borderRadius: "3px",
                }}
              />
              <hr className="currency-divider" />
              <Button
                label={`¥`}
                onClick={() => handleButtonClick("Курс юаня")}
                style={{
                  width: "33%",
                  height: "100%",
                  backgroundColor:
                    selectedCurrency === "Курс юаня"
                      ? "rgba(0, 120, 210, 1)"
                      : "transparent",
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>
          <div className="Gridster__Item">
            <ReactEchatrs
              option={chartOptions}
              settings={chartSettings}
              onEvents={chartEvents}
              loading={false}
              theme="light"
              forceResize={true}
            />
            <div className="average">
              <h2>Среднее за период</h2>
              <div className="average_price">
                <span className="average_sign">{average}</span>
                <span className="average_ruble">₽</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default App;
