import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { TrendingUpIcon, AwardIcon, CheckCircle2Icon, ActivityIcon } from "lucide-react";
import { apiRequest } from "../services/api.js";

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0]?.payload;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-header">
        <span className="chart-tooltip-title">{row?.rangeLabel || label}</span>
        {row?.attemptsCount != null && (
          <span className="badge badge-blue">{row.attemptsCount} Attempts</span>
        )}
      </div>
      <div className="chart-tooltip-list">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="chart-tooltip-item">
            <span className="chart-tooltip-dot" style={{ backgroundColor: entry.color }} />
            <span className="chart-tooltip-name">{entry.name}:</span>
            <strong className="chart-tooltip-value">{entry.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyPerformanceChart() {
  const [streamFilter, setStreamFilter] = useState("all");
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "streams"
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    currentWeekAvg: 0,
    weeklyDelta: 0,
    totalAttempts: 0,
    overallPassRate: 0,
    peakScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(`/analytics/weekly-performance?weeks=8&stream=${streamFilter}`)
      .then((res) => {
        if (!active) return;
        if (Array.isArray(res.weeklyTrends)) {
          setData(res.weeklyTrends);
        }
        if (res.summary) {
          setSummary(res.summary);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [streamFilter]);

  const deltaPositive = summary.weeklyDelta >= 0;

  return (
    <div className="panel weekly-chart-panel" style={{ marginBottom: 24 }}>
      <div className="panel-header weekly-chart-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUpIcon size={18} style={{ color: "var(--green)" }} />
            <span className="panel-title">Weekly Quiz Performance Trends</span>
          </div>
          <p className="weekly-chart-subtitle">
            8-week progression of student mock exam &amp; chapter quiz scores, accuracy, and pass rates
          </p>
        </div>

        <div className="weekly-chart-controls">
          <div className="filter-bar">
            {[
              { id: "all", label: "All Streams" },
              { id: "natural", label: "Natural Science" },
              { id: "social", label: "Social Science" }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                className={`btn btn-sm ${streamFilter === s.id ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setStreamFilter(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === "overview" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("overview")}
            >
              Score &amp; Pass Rate
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === "streams" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("streams")}
            >
              Stream Comparison
            </button>
          </div>
        </div>
      </div>

      <div className="panel-body">
        {/* KPI Summary Strip */}
        <div className="weekly-kpi-strip">
          <div className="weekly-kpi-item">
            <div className="weekly-kpi-icon icon-green">
              <TrendingUpIcon size={16} />
            </div>
            <div>
              <div className="weekly-kpi-label">This Week Avg Score</div>
              <div className="weekly-kpi-val-row">
                <span className="weekly-kpi-value">{summary.currentWeekAvg}%</span>
                <span className={`badge ${deltaPositive ? "badge-green" : "badge-amber"}`}>
                  {deltaPositive ? `+${summary.weeklyDelta}%` : `${summary.weeklyDelta}%`} vs last wk
                </span>
              </div>
            </div>
          </div>

          <div className="weekly-kpi-item">
            <div className="weekly-kpi-icon icon-blue">
              <CheckCircle2Icon size={16} />
            </div>
            <div>
              <div className="weekly-kpi-label">Overall Pass Rate</div>
              <div className="weekly-kpi-val-row">
                <span className="weekly-kpi-value">{summary.overallPassRate}%</span>
                <span className="weekly-kpi-meta">≥50% benchmark</span>
              </div>
            </div>
          </div>

          <div className="weekly-kpi-item">
            <div className="weekly-kpi-icon icon-purple">
              <AwardIcon size={16} />
            </div>
            <div>
              <div className="weekly-kpi-label">Peak Weekly Average</div>
              <div className="weekly-kpi-val-row">
                <span className="weekly-kpi-value">{summary.peakScore}%</span>
                <span className="weekly-kpi-meta">8-week high</span>
              </div>
            </div>
          </div>

          <div className="weekly-kpi-item">
            <div className="weekly-kpi-icon icon-amber">
              <ActivityIcon size={16} />
            </div>
            <div>
              <div className="weekly-kpi-label">Quizzes Completed</div>
              <div className="weekly-kpi-val-row">
                <span className="weekly-kpi-value">{summary.totalAttempts}</span>
                <span className="weekly-kpi-meta">Last 8 weeks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recharts LineChart Container */}
        <div className="weekly-chart-container" aria-label="Weekly quiz performance line chart">
          {loading && data.length === 0 ? (
            <div className="weekly-chart-skeleton">
              <div className="skeleton" style={{ height: 280, width: "100%", borderRadius: 10 }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={310}>
              <LineChart data={data} margin={{ top: 14, right: 20, left: -8, bottom: 6 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--text-3)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: "var(--text-3)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12.5, color: "var(--text-2)" }}
                />
                <ReferenceLine
                  y={50}
                  stroke="var(--amber)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.65}
                  label={{
                    value: "Pass Threshold (50%)",
                    position: "insideBottomRight",
                    fill: "var(--text-3)",
                    fontSize: 11
                  }}
                />
                {viewMode === "overview" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      name="Average Quiz Score"
                      stroke="#00c896"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#00c896", strokeWidth: 2, stroke: "var(--surface)" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#00c896" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="passRate"
                      name="Weekly Pass Rate"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      strokeDasharray="5 3"
                      dot={{ r: 3.5, fill: "#3b82f6", strokeWidth: 2, stroke: "var(--surface)" }}
                      activeDot={{ r: 5.5, strokeWidth: 0, fill: "#3b82f6" }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="naturalAvg"
                      name="Natural Science Avg"
                      stroke="#00c896"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#00c896", strokeWidth: 2, stroke: "var(--surface)" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#00c896" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="socialAvg"
                      name="Social Science Avg"
                      stroke="#a855f7"
                      strokeWidth={2.75}
                      dot={{ r: 4, fill: "#a855f7", strokeWidth: 2, stroke: "var(--surface)" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#a855f7" }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
