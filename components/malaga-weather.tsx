import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

const MALAGA_LAT = 36.7213;
const MALAGA_LON = -4.4214;

type WeatherData = {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
};

type Tint = "amber" | "blue" | "violet" | "emerald";

function describe(
  code: number,
  isDay: boolean,
): { Icon: LucideIcon; label: string; tint: Tint } {
  if (code === 0)
    return {
      Icon: isDay ? Sun : Moon,
      label: isDay ? "Clear sky" : "Clear night",
      tint: "amber",
    };
  if (code === 1)
    return {
      Icon: isDay ? Sun : Moon,
      label: "Mainly clear",
      tint: "amber",
    };
  if (code === 2)
    return {
      Icon: CloudSun,
      label: "Partly cloudy",
      tint: "amber",
    };
  if (code === 3) return { Icon: Cloudy, label: "Overcast", tint: "blue" };
  if (code === 45 || code === 48)
    return { Icon: CloudFog, label: "Foggy", tint: "blue" };
  if (code >= 51 && code <= 57)
    return { Icon: CloudDrizzle, label: "Drizzle", tint: "blue" };
  if (code >= 61 && code <= 67)
    return { Icon: CloudRain, label: "Rain", tint: "blue" };
  if (code >= 71 && code <= 77)
    return { Icon: CloudSnow, label: "Snow", tint: "blue" };
  if (code >= 80 && code <= 82)
    return { Icon: CloudRain, label: "Rain showers", tint: "blue" };
  if (code >= 85 && code <= 86)
    return { Icon: CloudSnow, label: "Snow showers", tint: "blue" };
  if (code >= 95)
    return { Icon: CloudLightning, label: "Thunderstorm", tint: "violet" };
  return { Icon: Cloud, label: "Cloudy", tint: "blue" };
}

async function fetchWeather(): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${MALAGA_LAT}&longitude=${MALAGA_LON}&current=temperature_2m,weather_code,is_day&timezone=Europe%2FMadrid`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        is_day?: number;
      };
    };
    const current = data.current;
    if (
      !current ||
      typeof current.temperature_2m !== "number" ||
      typeof current.weather_code !== "number"
    ) {
      return null;
    }
    return {
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
    };
  } catch {
    return null;
  }
}

export async function MalagaWeather() {
  const weather = await fetchWeather();
  if (!weather) return null;

  const { Icon, label, tint } = describe(weather.weatherCode, weather.isDay);

  return (
    <span
      className="malaga-weather"
      data-tint={tint}
      aria-label={`Current weather in Málaga: ${weather.temperature}°C, ${label}`}
    >
      <Icon
        aria-hidden="true"
        className="malaga-weather-icon"
        fill="currentColor"
        strokeWidth={1.5}
      />
      <span>
        <span className="malaga-weather-temp">{weather.temperature}°</span>{" "}
        {label}
      </span>
    </span>
  );
}
