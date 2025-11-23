import {
  useEffect,
  useState,
} from "react";

const Test = () => {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const evtSource = new EventSource("http://localhost:3000/api/twilio");

    evtSource.onmessage = (event) => {
      console.log("Event: ", event);
      const data = event.data;
      setStatus(data);
      return () => evtSource.close();
    };
  }, []);

  return <div>{status}</div>;
};

export default Test;
