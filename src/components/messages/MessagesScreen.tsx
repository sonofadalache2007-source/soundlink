import React, { useState } from 'react';
import { Order } from '../../types/order';

interface MessagesScreenProps {
  order: Order;
  onNavigateToWorkspace: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'client' | 'producer';
  name: string;
  avatar: string;
  time: string;
  text: string;
  timecode?: string;
  hasAudio?: boolean;
  audioDuration?: string;
  attachment?: {
    name: string;
    size: string;
  };
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ order, onNavigateToWorkspace }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'client',
      name: 'Jaxson Drake',
      avatar: order.client.avatar,
      time: 'Yesterday 2:30 PM',
      text: 'Hey Marcus! Just sent over the 24-bit raw lead stems and harmonies. Really wanting that big punchy Billboard vocal sound like The Weeknd / Post Malone.',
    },
    {
      id: 'm2',
      sender: 'producer',
      name: 'Marcus Vance',
      avatar: order.producer.avatar,
      time: 'Yesterday 3:15 PM',
      text: 'Stems received! Running them through the Neve 1073 preamp and LA-2A optical compressor now. The pitch on the bridge is already sounding smooth with Melodyne.',
      attachment: {
        name: 'Vocal_Chain_Preset_Neve.fxp',
        size: '1.2 MB',
      },
    },
    {
      id: 'm3',
      sender: 'producer',
      name: 'Marcus Vance',
      avatar: order.producer.avatar,
      time: 'Today 10:14 AM',
      text: 'Just uploaded v2.4 master deliverable into the workspace. Tightened the high end transients on the chorus vocal hook with the Weiss DS1-MK3.',
      timecode: '01:24',
      hasAudio: true,
      audioDuration: '00:28',
    },
    {
      id: 'm4',
      sender: 'client',
      name: 'Jaxson Drake',
      avatar: order.client.avatar,
      time: 'Today 11:20 AM',
      text: 'Listening now on the studio monitors. The high shelf presence is crazy good! Testing in the car next.',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      name: 'Jaxson Drake',
      avatar: order.client.avatar,
      time: 'Just now',
      text: inputText,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Producer simulated smart auto-response after 1.2s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-reply-${Date.now()}`,
          sender: 'producer',
          name: 'Marcus Vance',
          avatar: order.producer.avatar,
          time: 'Just now',
          text: 'Got it, Jaxson! Checking that section on the console right now. Let me know if you want another pass before final sign-off.',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#10131a]">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col px-3 sm:px-4">
        {/* Order Context Top Bar */}
        <div className="py-2.5 px-3 bg-[#191c22] rounded-xl border border-white/5 flex items-center justify-between shadow-md mb-3">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="relative">
              <img
                alt={order.producer.name}
                className="w-9 h-9 rounded-full object-cover"
                src={order.producer.avatar}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#53e076] rounded-full ring-2 ring-[#191c22]"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate">{order.producer.name}</p>
                <span className="text-[9px] bg-[#d0bcff] text-[#3c0091] px-1 rounded font-bold">PRO</span>
              </div>
              <p className="text-[10px] text-[#53e076]">Order #{order.orderNumber} • In Production</p>
            </div>
          </div>
          <button
            onClick={onNavigateToWorkspace}
            className="px-2.5 py-1.5 rounded-lg bg-[#272a31] text-[#53e076] text-xs font-semibold hover:bg-[#32353c] transition-colors whitespace-nowrap"
          >
            Workspace
          </button>
        </div>

        {/* Message Thread List */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {messages.map((msg) => {
            const isClient = msg.sender === 'client';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isClient ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  alt={msg.name}
                  className="w-7 h-7 rounded-full object-cover mt-1 shrink-0"
                  src={msg.avatar}
                />
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs space-y-1.5 shadow-md ${
                    isClient
                      ? 'bg-[#1db954] text-[#003914] rounded-tr-none'
                      : 'bg-[#191c22] text-[#e1e2eb] border border-white/5 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 font-medium">
                    <span className="font-bold">{msg.name}</span>
                    <span>{msg.time}</span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio Voice Note preview */}
                  {msg.hasAudio && (
                    <div className="bg-black/30 rounded-lg p-2 flex items-center justify-between gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                        className="w-6 h-6 rounded-full bg-[#53e076] text-[#003914] flex items-center justify-center shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isPlayingVoice ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#53e076] ${isPlayingVoice ? 'w-2/3 animate-pulse' : 'w-1/3'}`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-[#53e076]">{msg.audioDuration}</span>
                    </div>
                  )}

                  {/* Attachment */}
                  {msg.attachment && (
                    <div className="bg-black/20 rounded-lg p-2 flex items-center justify-between gap-2 mt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">attachment</span>
                        <span className="truncate font-mono text-[11px]">{msg.attachment.name}</span>
                      </div>
                      <span className="text-[10px] text-white/70 whitespace-nowrap">{msg.attachment.size}</span>
                    </div>
                  )}

                  {/* Timecode Pin button */}
                  {msg.timecode && (
                    <button
                      type="button"
                      onClick={onNavigateToWorkspace}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 text-[#53e076] text-[10px] font-mono font-bold hover:bg-black/60"
                    >
                      <span className="material-symbols-outlined text-[12px]">timer</span>
                      Jump to {msg.timecode} in Player
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Bar */}
        <form onSubmit={handleSendMessage} className="pt-2">
          <div className="bg-[#191c22] rounded-xl p-1.5 border border-white/10 flex items-center gap-2 shadow-xl">
            <button
              type="button"
              onClick={() => setInputText((prev) => `${prev} [Pin: 01:24] `)}
              className="p-1.5 text-[#869585] hover:text-[#53e076] transition-colors rounded-lg"
              title="Add timecode pin"
            >
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </button>
            <button
              type="button"
              className="p-1.5 text-[#869585] hover:text-[#53e076] transition-colors rounded-lg"
              title="Attach audio stem"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message or engineering notes..."
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-[#869585] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-lg bg-[#1db954] disabled:opacity-40 text-[#003914] flex items-center justify-center transition-all hover:bg-[#53e076] active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
