import { React } from "../common/dep.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: any;
      div: any;
      h1: any;
      p: any;
    }
  }
}

const App = () => {
  const log = console.log;
  const fetchWrapper = (url: string, method?: string) =>
    fetch(url, {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        log(data);
        return data;
      });

  const { useState } = React as any;

  const [counter, setCounter]: [number, Function] = useState(0);

  const updateCounter = (result: any) => {
    const countRes: number = result && result.counter ? result.counter : 0;
    setCounter(countRes);
  };

  const handleIncrement = async (e: Event) => {
    e.preventDefault();
    log();
    const result: any = await fetchWrapper(`http://localhost:3003/increment`);
    updateCounter(result);
  };

  return (
    <div>
      <h1>Hello Deno!</h1>
      <button onClick={handleIncrement}>Count the 🦕</button>
      <p>You clicked the 🦕 {counter} times</p>
    </div>
  );
};

export default App;
