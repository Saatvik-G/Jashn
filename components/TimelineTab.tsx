"use client";

import { useState } from "react";
import { TimelineSummary, TimelineTaskData } from "@/lib/engine/types";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Check,
  CalendarCheck,
} from "lucide-react";

interface TimelineTabProps {
  summary: TimelineSummary;
  eventId: string;
}

export function TimelineTab({ summary, eventId }: TimelineTabProps) {
  const [tasks, setTasks] = useState<TimelineTaskData[]>(summary.allTasks);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const toggleTaskStatus = async (taskId?: string) => {
    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    setUpdatingTaskId(taskId);

    try {
      await fetch(`/api/events/${eventId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t))
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const tasksThisWeek = tasks.filter((t) => {
    if (t.status === "COMPLETED") return false;
    const due = new Date(t.dueDate);
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due <= oneWeek;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Countdown & Schedule Risk Banner */}
      <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-oxblood/10 text-oxblood">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Celebration Countdown
              </span>
              <h2 className="font-display text-2xl font-bold text-ink">
                {summary.daysRemaining} Days Remaining
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-ink-muted">Overall Progress</span>
              <p className="font-display text-lg font-bold text-oxblood">
                {summary.completionPercentage}% Done
              </p>
            </div>
            <div className="h-10 w-28 bg-parchment-100 rounded-xl overflow-hidden p-1">
              <div
                className="h-full bg-sage-600 rounded-lg transition-all duration-500"
                style={{ width: `${summary.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Schedule Risk Flag (Must-Have Feature 3) */}
        {summary.riskLevel === "HIGH_SCHEDULE_RISK" && (
          <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Compressed Timeline Risk Detected
              </h4>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {summary.riskReason}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* "This Week" Checklist Card (Must-Have Feature 3) */}
      <div className="rounded-2xl border border-marigold-300 bg-marigold-50/40 p-6 shadow-warm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-marigold-700" />
            <h3 className="font-display text-lg font-bold text-ink">
              This Week’s Priority Checklist
            </h3>
          </div>
          <span className="rounded-full bg-marigold-200/80 px-2.5 py-0.5 text-xs font-bold text-marigold-900">
            {tasksThisWeek.length} Action Items
          </span>
        </div>
        <p className="text-xs text-ink-secondary mb-4">
          Milestones due within the next 7 days or overdue. Check off tasks to mark progress.
        </p>

        {tasksThisWeek.length === 0 ? (
          <div className="rounded-xl border border-dashed border-marigold-300 p-6 text-center text-xs text-ink-muted">
            ✨ You are fully caught up for this week! No pending urgent items.
          </div>
        ) : (
          <div className="space-y-2">
            {tasksThisWeek.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-parchment-200 hover:border-marigold-400 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                      task.status === "COMPLETED"
                        ? "bg-sage-600 border-sage-600 text-white"
                        : "border-parchment-400 bg-white"
                    }`}
                  >
                    {task.status === "COMPLETED" && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-semibold ${
                        task.status === "COMPLETED" ? "line-through text-ink-muted" : "text-ink"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-muted">
                      <span>Due: {task.dueDate}</span>
                      <span>•</span>
                      <span className="font-medium text-oxblood">{task.category}</span>
                    </div>
                  </div>
                </div>

                {task.isCriticalPath && (
                  <span className="inline-flex items-center gap-1 rounded bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold">
                    <Flame className="h-3 w-3" />
                    Critical Path
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backward Schedule List */}
      <div className="rounded-2xl border border-parchment-200 bg-white p-6 shadow-warm">
        <h3 className="font-display text-lg font-bold text-ink mb-1">
          Complete Backward Celebration Schedule
        </h3>
        <p className="text-xs text-ink-muted mb-6">
          Tasks projected backward from celebration day. Critical path milestones are highlighted.
        </p>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-parchment-200">
          {tasks.map((task, index) => {
            const isCompleted = task.status === "COMPLETED";

            return (
              <div key={task.id || index} className="relative flex items-start gap-4 pl-1">
                {/* Checkbox Timeline Icon */}
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-sage-600 border-sage-600 text-white"
                      : "bg-white border-parchment-300 text-ink-muted hover:border-oxblood"
                  }`}
                  aria-label={`Toggle task ${task.title}`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                </button>

                {/* Task Details Card */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-parchment-50/50 border-parchment-200 opacity-60"
                      : "bg-white border-parchment-200 hover:border-parchment-300 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span
                      className={`font-display text-sm font-bold ${
                        isCompleted ? "line-through text-ink-muted" : "text-ink"
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-2">
                      {task.isCriticalPath && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 text-[10px] font-semibold">
                          <Flame className="h-3 w-3" />
                          Critical
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-ink-muted">
                        Due: {task.dueDate} (T{task.offsetDays}d)
                      </span>
                    </div>
                  </div>

                  {task.notes && (
                    <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                      {task.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
