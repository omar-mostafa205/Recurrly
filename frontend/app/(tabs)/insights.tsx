import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const { width } = Dimensions.get("window");

// ─── Real Data ───────────────────────────────────────────────────────────────

const WEEKS = [
  { label: "Week 1", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [45, 20, 38, 60, 25, 15, 8] },
  { label: "Week 2", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [30, 55, 22, 40, 36, 9, 18] },
  { label: "Week 3", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [18, 42, 30, 55, 28, 22, 14] },
  { label: "Week 4", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], values: [35, 30, 20, 40, 36, 9, 22] },
];

const MAX_VALUE = 65;

const UPCOMING_SUBSCRIPTIONS = [
  {
    id: "claude",
    name: "Claude Pro",
    date: "June 25, 12:00",
    amount: "$20.00",
    period: "per month",
    bg: "#E8C84A",
    category: "AI Tools",
  },
  {
    id: "canva",
    name: "Canva Pro",
    date: "June 30, 16:00",
    amount: "$43.89",
    period: "per month",
    bg: "#A8CBCA",
    category: "Design",
  },
  {
    id: "notion",
    name: "Notion Plus",
    date: "July 2, 09:00",
    amount: "$16.00",
    period: "per month",
    bg: "#D4C5F0",
    category: "Productivity",
  },
];

const HISTORY_SUBSCRIPTIONS = [
  {
    id: "netflix",
    name: "Netflix",
    date: "June 1, 00:00",
    amount: "$15.49",
    period: "per month",
    bg: "#F5C5B8",
    category: "Streaming",
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    date: "June 5, 08:00",
    amount: "$10.99",
    period: "per month",
    bg: "#B8E4C5",
    category: "Music",
  },
  {
    id: "github",
    name: "GitHub Pro",
    date: "June 10, 14:00",
    amount: "$4.00",
    period: "per month",
    bg: "#C5C5C5",
    category: "Dev Tools",
  },
  {
    id: "figma",
    name: "Figma Professional",
    date: "June 15, 10:00",
    amount: "$15.00",
    period: "per month",
    bg: "#F5D5A8",
    category: "Design",
  },
];

const EXPENSE_SUMMARY = {
  total: "-$424.63",
  change: "+12%",
  positive: false,
  month: "March 2026",
};

// ─── Sub Icons ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, { label: string; textColor: string; bgColor: string }> = {
  claude:  { label: "✳",  textColor: "#fff",    bgColor: "rgba(0,0,0,0.18)" },
  canva:   { label: "C",  textColor: "#fff",    bgColor: "#7D2AE8" },
  notion:  { label: "N",  textColor: "#fff",    bgColor: "#1a1a1a" },
  netflix: { label: "N",  textColor: "#fff",    bgColor: "#E50914" },
  spotify: { label: "♫",  textColor: "#fff",    bgColor: "#1DB954" },
  github:  { label: "GH", textColor: "#fff",    bgColor: "#24292F" },
  figma:   { label: "F",  textColor: "#fff",    bgColor: "#FF7262" },
};

function SubIcon({ id }: { id: string }) {
  const cfg = ICON_MAP[id] ?? { label: "?", textColor: "#fff", bgColor: "#999" };
  return (
    <View
      className="w-11 h-11 rounded-xl items-center justify-center"
      style={{ backgroundColor: cfg.bgColor }}
    >
      <Text style={{ color: cfg.textColor, fontSize: 16, fontWeight: "700" }}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ─── Subscription Card ────────────────────────────────────────────────────────

function SubscriptionCard({
  id, name, date, amount, period, bg, category,
}: {
  id: string; name: string; date: string; amount: string;
  period: string; bg: string; category: string;
}) {
  return (
    <View
      className="rounded-2xl p-3.5 flex-row items-center mb-2.5"
      style={{ backgroundColor: bg, gap: 14 }}
    >
      <SubIcon id={id} />
      <View className="flex-1">
        <Text className="text-base font-semibold text-dark">{name}</Text>
        <Text className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.5)" }}>
          {date}
        </Text>
        <View
          className="mt-1.5 self-start rounded-full px-2 py-0.5"
          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
        >
          <Text className="text-xs font-medium" style={{ color: "rgba(0,0,0,0.6)" }}>
            {category}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold text-dark">{amount}</Text>
        <Text className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.5)" }}>
          {period}
        </Text>
      </View>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ weekIndex }: { weekIndex: number }) {
  const week = WEEKS[weekIndex];
  const activeDay = week.values.indexOf(Math.max(...week.values));
  const CHART_HEIGHT = 110;

  return (
    <View style={{ height: 150, position: "relative" }}>
      {/* Grid lines */}
      {[MAX_VALUE, 50, 30, 10, 0].map((label) => {
        const top = (1 - label / MAX_VALUE) * CHART_HEIGHT;
        return (
          <View
            key={label}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ width: 20, fontSize: 10, color: "#999", textAlign: "right" }}>
              {label}
            </Text>
            <View
              style={{
                flex: 1,
                height: 0.5,
                borderStyle: "dashed",
                borderWidth: 0.5,
                borderColor: "rgba(0,0,0,0.15)",
              }}
            />
          </View>
        );
      })}

      {/* Bars */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 26,
          right: 0,
          flexDirection: "row",
          alignItems: "flex-end",
          height: 130,
          gap: 4,
        }}
      >
        {week.days.map((day, i) => {
          const isActive = i === activeDay;
          const barH = Math.round((week.values[i] / MAX_VALUE) * CHART_HEIGHT);
          return (
            <View key={day} className="flex-1 items-center" style={{ justifyContent: "flex-end" }}>
              <View style={{ alignItems: "center", justifyContent: "flex-end", height: CHART_HEIGHT }}>
                {isActive && (
                  <View
                    className="rounded-lg px-2 py-0.5 mb-1"
                    style={{ backgroundColor: "#E8634A" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                      ${week.values[i]}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    width: 22,
                    height: barH,
                    borderRadius: 6,
                    backgroundColor: isActive ? "#E8634A" : "#1E2128",
                  }}
                />
              </View>
              <Text style={{ fontSize: 10, color: "#888", fontWeight: "500", marginTop: 4 }}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MonthlyInsights() {
  const [activeWeek, setActiveWeek] = useState(3);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#F5F2E8" }} edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.12)" }}
        >
          <Text className="text-lg font-medium text-dark">‹</Text>
        </Pressable>
        <Text className="text-base font-semibold text-dark">Monthly Insights</Text>
        <Pressable
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.12)" }}
        >
          <Text className="text-lg font-medium text-dark">•••</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Section */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-semibold text-dark">Upcoming</Text>
          <Pressable
            className="rounded-full px-3.5 py-1"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.15)" }}
          >
            <Text className="text-xs font-medium text-dark">View all</Text>
          </Pressable>
        </View>

        {/* Chart Card */}
        <View
          className="rounded-2xl p-4 mb-3"
          style={{ backgroundColor: "rgba(255,255,255,0.55)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.08)" }}
        >
          {/* Week Selector */}
          <View className="flex-row gap-2 mb-4">
            {WEEKS.map((w, i) => (
              <Pressable
                key={i}
                onPress={() => setActiveWeek(i)}
                className="flex-1 items-center py-1 rounded-full"
                style={{
                  backgroundColor: activeWeek === i ? "#1E2128" : "rgba(0,0,0,0.06)",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: activeWeek === i ? "#fff" : "#888",
                  }}
                >
                  {w.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <BarChart weekIndex={activeWeek} />
        </View>

        {/* Expense Summary Card */}
        <View
          className="rounded-2xl p-4 mb-5 flex-row justify-between items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.55)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.08)" }}
        >
          <View>
            <Text className="text-sm font-semibold text-dark">Expenses</Text>
            <Text className="text-xs mt-0.5" style={{ color: "#888" }}>{EXPENSE_SUMMARY.month}</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-semibold text-dark">{EXPENSE_SUMMARY.total}</Text>
            <Text className="text-xs mt-0.5" style={{ color: "#E8634A" }}>
              {EXPENSE_SUMMARY.change} vs last month
            </Text>
          </View>
        </View>

        {/* Upcoming Subscriptions */}
        {UPCOMING_SUBSCRIPTIONS.map((sub) => (
          <SubscriptionCard key={sub.id} {...sub} />
        ))}

        {/* History Section */}
        <View className="flex-row justify-between items-center mb-3 mt-3">
          <Text className="text-base font-semibold text-dark">History</Text>
          <Pressable
            className="rounded-full px-3.5 py-1"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", borderWidth: 0.5, borderColor: "rgba(0,0,0,0.15)" }}
          >
            <Text className="text-xs font-medium text-dark">View all</Text>
          </Pressable>
        </View>

        {HISTORY_SUBSCRIPTIONS.map((sub) => (
          <SubscriptionCard key={sub.id} {...sub} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}