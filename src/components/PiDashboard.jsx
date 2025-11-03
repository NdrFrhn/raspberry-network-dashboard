import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const myIp = "192.168.4.1";

function PiDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://${myIp}:5000/api/status`); // replace with your Pi IP
        const json = await res.json();
        setData(json);

        // Update history for charts (keep last 10 points)
        setHistory((prev) => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            temp: json.temperature,
            load: json.cpuLoad,
          },
        ]);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="center">
        <h1>Welcome</h1>
        <h2>Raspberry Pi Dashboard</h2>
        <p>System Info: {data.systemInfo}</p>
        <p>OS: {data.operativeSystem}</p>
        <p>Temperature: {data.temperature}°C</p>
        <p>CPU Load: {data.cpuLoad.toFixed(1)}%</p>
        <p>
          Memory Used: {(data.memory.used / 1024 ** 2).toFixed(1)} MB /{" "}
          {(data.memory.total / 1024 ** 2).toFixed(1)} MB
        </p>
      </div>

      <div className="block center">
        <h3>Disks:</h3>
        <ul>
          {data.disk.map((d) => (
            <li key={d.fs}>
              {d.fs}: {(d.used / 1024 ** 3).toFixed(2)} GB /{" "}
              {(d.size / 1024 ** 3).toFixed(2)} GB ({d.use}%)
            </li>
          ))}
        </ul>
      </div>

      <div className="block center">
        <h3>Temperature & CPU Load (last 10 readings)</h3>
        <LineChart width={500} height={200} data={history}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#ff7300"
            name="Temp (°C)"
          />
          <Line
            type="monotone"
            dataKey="load"
            stroke="#387908"
            name="CPU Load (%)"
          />
        </LineChart>
      </div>

      <div className="block center">
        <h3>Network:</h3>
        <p>IP Address: {myIp}</p>
        <ul>
          {data.net.map((n) => (
            <li key={n.iface}>
              {n.iface} - {n.ip4} / {n.mac}
            </li>
          ))}
        </ul>
      </div>
      <div className="block center">
        <h3>Users</h3>
        <ul>
          {data.users.map((user) => (
            <li key={user.user}>
              <p>User: {user.user}</p>
              <p>Date: {user.date}</p>
              <p>IP: {user.ip}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PiDashboard;
