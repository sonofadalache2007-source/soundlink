import React, { useState, useEffect, useRef } from 'react';
import { Order, SharedFile, Milestone } from '../../types/order';
import { studioAudio, formatTime } from '../../utils/audioEngine';
import { RevisionModal } from '../modals/RevisionModal';
import { ApproveReleaseModal } from '../modals/ApproveReleaseModal';
import { AddStemsModal } from '../modals/AddStemsModal';
import { MilestoneModal } from '../modals/MilestoneModal';
import { QuickReplyModal } from '../modals/QuickReplyModal';

interface OrderWorkspaceProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
  onNavigateToChat: () => void;
  allOrders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrderWorkspace: React.FC<OrderWorkspaceProps> = ({
  order,
  onUpdateOrder,
  onNavigateToChat,
  allOrders,
  onSelectOrder,
}) => {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState<'raw' | 'master'>('master');
  const [currentTime, setCurrentTime] = useState(102); // 01:42
  const [totalDuration] = useState(210); // 03:30
  const [refIsPlaying, setRefIsPlaying] = useState(false);
  const [refTime, setRefTime] = useState(45); // 00:45

  // Modals & Sheets
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showAddStemsModal, setShowAddStemsModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showQuickReply, setShowQuickReply] = useState(false);
  const [showOrderSelector, setShowOrderSelector] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Sync player position with audio engine
  useEffect(() => {
    return () => {
      studioAudio.pause();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      studioAudio.pause();
      setIsPlaying(false);
      showToast('Master preview paused');
    } else {
      studioAudio.play(
        (time) => setCurrentTime(time),
        () => setIsPlaying(false)
      );
      setIsPlaying(true);
      showToast(`Playing ${order.deliverable.title} (${audioMode === 'master' ? 'Mastered A/B' : 'Raw Dry Track'})`);
    }
  };

  const handleSetMode = (mode: 'raw' | 'master') => {
    setAudioMode(mode);
    studioAudio.setMode(mode);
    showToast(
      mode === 'raw'
        ? 'Switched to: Raw Dry Vocal Track (Pre-Master)'
        : 'Switched to: Mastered Vocal Mix (Analog Polish & Limiting)'
    );
  };

  const handleSeekRelative = (delta: number) => {
    const nextTime = Math.max(0, Math.min(totalDuration, currentTime + delta));
    setCurrentTime(nextTime);
    studioAudio.seek(nextTime);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * totalDuration;
    setCurrentTime(newTime);
    studioAudio.seek(newTime);
    showToast(`Jumped to ${formatTime(newTime)}`);
  };

  const handleToggleRefAudio = () => {
    const nextState = !refIsPlaying;
    setRefIsPlaying(nextState);
    if (nextState) {
      if (isPlaying) {
        studioAudio.pause();
        setIsPlaying(false);
      }
      showToast('Previewing Reference Mix: Instrumental_Reference_Mix.mp3');
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = order.tasks.map((task) => {
      if (task.id === taskId) {
        const nextCompleted = !task.completed;
        showToast(
          nextCompleted
            ? `Task completed: ${task.title}`
            : `Task reopened: ${task.title}`
        );
        return { ...task, completed: nextCompleted };
      }
      return task;
    });
    onUpdateOrder({ ...order, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    const taskName = prompt('Enter studio task or plugin chain item:');
    if (!taskName) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskName,
      tool: 'Custom Chain',
      completed: false,
    };
    onUpdateOrder({ ...order, tasks: [...order.tasks, newTask] });
    showToast(`Added studio task: ${taskName}`);
  };

  const handleAddFile = (newFile: SharedFile) => {
    onUpdateOrder({ ...order, sharedFiles: [newFile, ...order.sharedFiles] });
    showToast(`Uploaded ${newFile.name} to shared workspace`);
  };

  const handleDownloadFile = (file: SharedFile) => {
    showToast(`Downloading ${file.name} (${file.size})`);
  };

  const handleRevisionSubmit = ({ timecode, stems, notes }: { timecode: string; stems: string[]; notes: string }) => {
    setShowRevisionModal(false);
    const updatedRevisions = Math.max(0, order.revisionsRemaining - 1);
    onUpdateOrder({
      ...order,
      revisionsRemaining: updatedRevisions,
      status: 'revision_requested',
      statusLabel: 'Revision Requested',
    });
    showToast(`Revision round submitted at ${timecode}. ${updatedRevisions} left.`);
  };

  const handleApproveConfirm = ({ rating, tip, review }: { rating: number; tip: number; review: string }) => {
    setShowApproveModal(false);
    onUpdateOrder({
      ...order,
      status: 'completed',
      statusLabel: 'Completed & Released',
      milestones: order.milestones.map((m) => ({ ...m, status: 'done', subtext: 'Done' })),
    });
    showToast(
      `Escrow Confirmed: $${order.escrow.amount.toFixed(2)} released to ${order.producer.name} (Rated ${rating}★)`
    );
  };

  // Progress calculations
  const completedTasksCount = order.tasks.filter((t) => t.completed).length;
  const playPercent = (currentTime / totalDuration) * 100;

  // Waveform bars profile: 25 distinct amplitude levels
  const waveformHeights = [
    12, 20, 32, 48, 24, 36, 44, 56, 28, 40, 32, 48, 52, 24, 40, 48, 32, 56, 28, 44, 36, 20, 48, 40, 16,
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#10131a]">
      <div className="max-w-md mx-auto w-full space-y-4 px-3 sm:px-4">
        
        {/* Order Switcher Bar (Quickly test other studio orders) */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#bccbb9] px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[#869585]">Active Workspace:</span>
            <button
              onClick={() => setShowOrderSelector(!showOrderSelector)}
              className="flex items-center gap-1 font-semibold text-white bg-[#191c22] hover:bg-[#272a31] px-2 py-1 rounded-md border border-white/10 transition-colors"
            >
              <span>#{order.orderNumber}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>
          <span className="text-[11px] text-[#53e076] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#53e076] animate-pulse"></span>
            Escrow Protected
          </span>
        </div>

        {/* Order Selector Dropdown */}
        {showOrderSelector && (
          <div className="bg-[#191c22] rounded-xl border border-white/10 shadow-2xl p-2 space-y-1 animate-in fade-in duration-150">
            <p className="text-[10px] font-bold text-[#869585] uppercase tracking-wider px-2 py-1">Switch Studio Order</p>
            {allOrders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  onSelectOrder(ord);
                  setShowOrderSelector(false);
                  showToast(`Loaded Order #${ord.orderNumber}: ${ord.title}`);
                }}
                className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                  ord.id === order.id ? 'bg-[#1db954]/20 border border-[#53e076]/30 text-white' : 'hover:bg-[#272a31] text-[#bccbb9]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold truncate">{ord.title}</p>
                  <p className="text-[10px] text-[#869585]">#{ord.orderNumber} • ${ord.escrow.amount.toFixed(2)} USD</p>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#53e076] font-medium whitespace-nowrap">
                  {ord.statusLabel}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Top Order Meta Header Card */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-xl relative overflow-hidden border border-white/5">
          {/* Glow ambient backdrop */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#53e076]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#1db954]/20 text-[#53e076] font-bold tracking-wider">
                  {order.statusLabel}
                </span>
                <span className="text-xs text-[#869585] font-mono">#{order.orderNumber}</span>
              </div>
              <h2 className="font-headline font-bold text-lg text-white tracking-tight leading-snug">
                {order.title}
              </h2>
              <div className="flex items-center gap-2 pt-1">
                <div className="relative">
                  <img
                    alt={order.client.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                    src={order.client.avatar}
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#53e076] rounded-full ring-2 ring-[#191c22]"></span>
                </div>
                <p className="text-xs text-[#bccbb9]">
                  Client: <span className="text-white font-semibold">{order.client.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQuickReply(true)}
              className="w-10 h-10 rounded-full bg-[#272a31] text-[#53e076] hover:bg-[#32353c] flex items-center justify-center active:scale-95 transition-transform shadow-md"
              aria-label="Open chat"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
          </div>

          {/* Financial Escrow Snapshot Bar */}
          <div className="mt-4 pt-3 bg-[#1d2026]/70 rounded-lg p-3 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#53e076]/15 text-[#53e076] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <p className="text-[11px] text-[#bccbb9]">SoundLink Escrow</p>
                <p className="text-sm font-bold text-white">
                  ${order.escrow.amount.toFixed(2)} USD{' '}
                  <span className="text-[#53e076] font-normal text-xs">({order.escrow.status})</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#bccbb9]">Est. Delivery</p>
              <p className="text-xs font-semibold text-[#4cd7f6]">{order.delivery.estimate}</p>
            </div>
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#53e076] text-[18px]">timeline</span>
              <span className="font-headline font-bold text-sm text-white">Milestone Tracker</span>
            </div>
            <div className="flex items-center gap-1 bg-[#32353c] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[#53e076] text-[14px]">alarm</span>
              <span className="text-[11px] text-[#53e076] font-bold">{order.delivery.remaining}</span>
            </div>
          </div>

          {/* Stepper Line and Nodes */}
          <div className="relative pt-2 pb-1">
            {/* Connecting Bar Track */}
            <div className="absolute top-5 left-4 right-4 h-0.5 bg-[#32353c]"></div>
            <div className="absolute top-5 left-4 w-1/3 h-0.5 bg-[#53e076] transition-all duration-500"></div>

            <div className="grid grid-cols-4 relative z-10 gap-1 text-center">
              {order.milestones.map((milestone) => {
                const isDone = milestone.status === 'done';
                const isActive = milestone.status === 'active';

                return (
                  <div
                    key={milestone.id}
                    onClick={() => setSelectedMilestone(milestone)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${
                        isDone
                          ? 'bg-[#53e076] text-[#003914]'
                          : isActive
                          ? 'bg-[#1db954] text-[#004118] ring-4 ring-[#53e076]/25 animate-pulse'
                          : 'bg-[#32353c] text-[#bccbb9] opacity-70'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] font-bold">
                        {isDone ? 'check' : milestone.icon}
                      </span>
                    </div>
                    <span className="text-[11px] text-white font-bold mt-1.5 leading-tight truncate w-full px-1">
                      {milestone.name}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isDone || isActive ? 'text-[#53e076]' : 'text-[#869585]'
                      }`}
                    >
                      {milestone.subtext}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deliverable A/B Interactive Player Preview Box */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-xl relative overflow-hidden space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#53e076] animate-ping' : 'bg-[#53e076]'}`}></span>
              <span className="font-headline font-bold text-sm text-white">Latest Deliverable Preview</span>
            </div>
            <span className="text-[11px] bg-[#571bc1]/40 text-[#d0bcff] px-2 py-0.5 rounded-full font-medium">
              {order.deliverable.version}
            </span>
          </div>

          <div className="p-3.5 bg-[#1d2026] rounded-xl space-y-3 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="font-headline font-bold text-sm text-white truncate">{order.deliverable.title}</p>
                <p className="text-[11px] text-[#bccbb9]">{order.deliverable.specs}</p>
              </div>

              {/* A/B Comparison Pill Toggle */}
              <div className="bg-[#32353c] p-1 rounded-full flex items-center shrink-0">
                <button
                  onClick={() => handleSetMode('raw')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    audioMode === 'raw'
                      ? 'bg-[#53e076] text-[#003914] font-bold shadow-sm'
                      : 'text-[#bccbb9] hover:text-white'
                  }`}
                >
                  Raw
                </button>
                <button
                  onClick={() => handleSetMode('master')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    audioMode === 'master'
                      ? 'bg-[#53e076] text-[#003914] font-bold shadow-sm'
                      : 'text-[#bccbb9] hover:text-white'
                  }`}
                >
                  Master A/B
                </button>
              </div>
            </div>

            {/* Dynamic Studio Waveform Player */}
            <div className="space-y-2 pt-1">
              <div
                onClick={handleWaveformClick}
                className="h-14 bg-[#0b0e14]/90 rounded-lg p-2 flex items-end justify-between gap-1 overflow-hidden relative cursor-pointer group"
                title="Click waveform to seek audio position"
              >
                {/* Neon Scrubber Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#53e076] shadow-[0_0_12px_#53e076] z-20 pointer-events-none transition-all"
                  style={{ left: `${playPercent}%` }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#53e076] -translate-x-[3px] -translate-y-1 shadow-[0_0_8px_#53e076]"></div>
                </div>

                {/* Waveform Bars */}
                {waveformHeights.map((h, i) => {
                  const barProgress = (i / waveformHeights.length) * 100;
                  const isPlayed = barProgress <= playPercent;
                  const animatedHeight = isPlaying && isPlayed
                    ? Math.max(8, Math.min(56, h + Math.sin(Date.now() / 150 + i) * 12))
                    : h;

                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayed ? 'bg-[#53e076]' : 'bg-[#32353c]'
                      }`}
                      style={{ height: `${animatedHeight}px` }}
                    />
                  );
                })}
              </div>

              {/* Player Controls Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#53e076] font-mono font-bold">
                  {formatTime(currentTime)}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSeekRelative(-10)}
                    className="text-[#bccbb9] hover:text-white active:scale-95 transition-transform"
                    aria-label="Replay 10 seconds"
                  >
                    <span className="material-symbols-outlined text-[22px]">replay_10</span>
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`w-11 h-11 rounded-full bg-[#1db954] text-[#003914] flex items-center justify-center active:scale-95 transition-all shadow-[0_0_16px_rgba(29,185,84,0.35)] ${
                      isPlaying ? 'ring-4 ring-[#53e076]/40 scale-105' : 'hover:brightness-110'
                    }`}
                    aria-label={isPlaying ? 'Pause master audio' : 'Play master audio'}
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleSeekRelative(10)}
                    className="text-[#bccbb9] hover:text-white active:scale-95 transition-transform"
                    aria-label="Forward 10 seconds"
                  >
                    <span className="material-symbols-outlined text-[22px]">forward_10</span>
                  </button>
                </div>

                <span className="text-xs text-[#869585] font-mono font-medium">
                  {formatTime(totalDuration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Workspace Files Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#53e076] text-[18px]">folder_open</span>
              <h3 className="font-headline font-bold text-base text-white">Shared Files</h3>
            </div>
            <button
              onClick={() => setShowAddStemsModal(true)}
              className="text-xs text-[#53e076] font-semibold flex items-center gap-1 active:opacity-75 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span> Add Stems
            </button>
          </div>

          <div className="space-y-2">
            {order.sharedFiles.map((file) => {
              if (file.type === 'reference') {
                return (
                  <div
                    key={file.id}
                    className="bg-[#191c22] rounded-xl p-3 shadow-sm space-y-2 border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#53e076]/15 text-[#53e076] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">music_note</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                          <p className="text-[11px] text-[#bccbb9]">{file.size} • {file.meta}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleToggleRefAudio}
                        className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform shrink-0 ml-2 ${
                          refIsPlaying ? 'bg-[#53e076] text-[#003914]' : 'bg-[#32353c] text-[#53e076] hover:bg-[#272a31]'
                        }`}
                        aria-label="Toggle preview audio"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {refIsPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    </div>

                    {/* Compact mini player bar */}
                    <div className="bg-[#1d2026] rounded-md px-3 py-1.5 flex items-center gap-2">
                      <span className="text-[11px] text-[#869585] font-mono">{formatTime(refTime)}</span>
                      <div className="flex-1 h-1 bg-[#32353c] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#53e076] rounded-full transition-all ${
                            refIsPlaying ? 'w-2/3 animate-pulse' : 'w-1/4'
                          }`}
                        ></div>
                      </div>
                      <span className="text-[11px] text-[#869585] font-mono">{file.duration || '03:12'}</span>
                    </div>
                  </div>
                );
              }

              const isZip = file.type === 'zip';
              return (
                <div
                  key={file.id}
                  className="bg-[#191c22] rounded-xl p-3 flex items-center justify-between shadow-sm hover:bg-[#1d2026] transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isZip
                          ? 'bg-[#00b0cd]/20 text-[#4cd7f6]'
                          : 'bg-[#571bc1]/20 text-[#d0bcff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isZip ? 'folder_zip' : 'mic'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                      <p className="text-[11px] text-[#bccbb9]">{file.size} • {file.meta}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(file)}
                    className="w-8 h-8 rounded-full bg-[#32353c] hover:bg-[#272a31] text-[#bccbb9] hover:text-white flex items-center justify-center active:scale-90 transition-transform shrink-0 ml-2"
                    aria-label={`Download ${file.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engineering Checklist Progress */}
        <div className="bg-[#191c22] rounded-xl p-4 shadow-lg space-y-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#53e076] text-[18px]">check_circle</span>
              <h3 className="font-headline font-bold text-sm text-white">Studio Task Checklist</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-[#53e076]/10 text-[#53e076] font-bold px-2 py-0.5 rounded-full">
                {completedTasksCount} of {order.tasks.length} Done
              </span>
              <button
                onClick={handleAddTask}
                className="text-xs text-[#53e076] hover:text-white flex items-center"
                title="Add task"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {order.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className="flex items-center justify-between bg-[#1d2026]/70 hover:bg-[#1d2026] p-2.5 rounded-lg cursor-pointer transition-colors border border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 transition-colors ${
                      task.completed ? 'text-[#53e076]' : 'text-[#869585]'
                    }`}
                  >
                    {task.completed ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span
                    className={`text-xs truncate ${
                      task.completed
                        ? 'text-[#bccbb9] line-through opacity-80'
                        : 'text-white font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <span
                  className={`text-[11px] shrink-0 ${
                    task.isRendering ? 'text-[#4cd7f6] font-medium' : 'text-[#869585]'
                  }`}
                >
                  {task.tool}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Team & Producer Insight Card */}
        <div className="bg-[#191c22] rounded-xl p-3 flex items-center justify-between shadow-md border border-white/5">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <img
              alt={order.producer.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/10"
              src={order.producer.avatar}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">{order.producer.name}</p>
                <span className="text-[10px] bg-[#d0bcff] text-[#3c0091] px-1.5 rounded font-bold">
                  {order.producer.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#bccbb9] truncate">{order.producer.note}</p>
            </div>
          </div>
          <button
            onClick={() => setShowQuickReply(true)}
            className="p-2 rounded-full text-[#bccbb9] hover:text-[#53e076] hover:bg-white/5 active:scale-95 transition-all shrink-0"
            aria-label="Reply to producer note"
          >
            <span className="material-symbols-outlined text-[20px]">reply</span>
          </button>
        </div>

        {/* Persistent Workspace Action Deck */}
        <div className="pt-2 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Request Revision Button */}
            <button
              onClick={() => setShowRevisionModal(true)}
              className="h-12 px-3 rounded-full bg-[#272a31] hover:bg-[#32353c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>
                Revision <span className="text-[#869585] text-xs">({order.revisionsRemaining} left)</span>
              </span>
            </button>

            {/* Approve & Release Funds Button */}
            <button
              onClick={() => setShowApproveModal(true)}
              className="h-12 px-3 rounded-full bg-gradient-to-r from-[#1db954] to-[#53e076] text-[#003914] text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#1db954]/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>Approve & Release</span>
            </button>
          </div>
          <p className="text-center text-[11px] text-[#869585]">
            Funds will be immediately released from escrow to the producer
          </p>
        </div>

      </div>

      {/* Interactive Modal Sheets */}
      <RevisionModal
        isOpen={showRevisionModal}
        onClose={() => setShowRevisionModal(false)}
        onSubmit={handleRevisionSubmit}
        revisionsRemaining={order.revisionsRemaining}
      />

      <ApproveReleaseModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        escrowAmount={order.escrow.amount}
        producerName={order.producer.name}
      />

      <AddStemsModal
        isOpen={showAddStemsModal}
        onClose={() => setShowAddStemsModal(false)}
        onAddFile={handleAddFile}
      />

      <MilestoneModal
        milestone={selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
      />

      <QuickReplyModal
        isOpen={showQuickReply}
        onClose={() => setShowQuickReply(false)}
        onSend={(msg) => {
          showToast(`Sent note to ${order.producer.name}: "${msg.slice(0, 35)}..."`);
          onNavigateToChat();
        }}
        producerName={order.producer.name}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 bg-[#32353c]/95 backdrop-blur-xl border border-white/10 p-3.5 rounded-xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="material-symbols-outlined text-[#53e076] text-[20px] shrink-0">check_circle</span>
            <p className="text-xs text-white font-medium truncate">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[#bccbb9] hover:text-white text-[10px] font-bold uppercase tracking-wider shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
