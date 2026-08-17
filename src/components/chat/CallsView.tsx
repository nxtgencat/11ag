import React from 'react';
import { useCall } from '../../context/CallContext';
import { useChat } from '../../context/ChatContext';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const CallsView: React.FC = () => {
  const { startCall } = useCall();
  const { contacts } = useChat();

  const mockCalls = [
    {
      id: '1',
      contact: contacts[0] || { name: 'Sarah Jenkins', avatar: '', phone: '+1 555-0101' },
      type: 'voice' as const,
      direction: 'incoming' as const,
      time: 'Today, 2:45 PM',
      duration: '4m 12s',
      status: 'completed',
    },
    {
      id: '2',
      contact: contacts[1] || { name: 'David Chen', avatar: '', phone: '+1 555-0102' },
      type: 'video' as const,
      direction: 'missed' as const,
      time: 'Yesterday, 8:15 PM',
      duration: 'Missed',
      status: 'missed',
    },
    {
      id: '3',
      contact: contacts[2] || { name: 'Emily Watson', avatar: '', phone: '+1 555-0103' },
      type: 'voice' as const,
      direction: 'outgoing' as const,
      time: 'Sunday, 11:20 AM',
      duration: '12m 04s',
      status: 'completed',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-paper dark:bg-inkdark border-r border-line dark:border-linedark overflow-y-auto select-none transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-line dark:border-linedark bg-paper/85 dark:bg-inkdark/85 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-lg text-ink dark:text-paperdark tracking-tight">
              Calls & Audio
            </h2>
            <span className="ticket-tag text-[9px] py-0 px-2 font-mono">LOGS</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <span className="mini-tag px-1">RECENT TRANSMISSIONS</span>

        <div className="space-y-2">
          {mockCalls.map((call) => (
            <div
              key={call.id}
              className="card p-3.5 flex items-center justify-between gap-3 hover:border-cobalt transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={call.contact.avatar}
                  name={call.contact.name}
                  size="md"
                />
                <div className="min-w-0">
                  <h4 className="font-display font-medium text-xs text-ink dark:text-paperdark truncate">
                    {call.contact.name}
                  </h4>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate dark:text-slatedark mt-0.5">
                    {call.direction === 'incoming' && <PhoneIncoming className="w-3 h-3 text-mint" />}
                    {call.direction === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-cobalt" />}
                    {call.direction === 'missed' && <PhoneMissed className="w-3 h-3 text-rose" />}
                    <span>{call.time} · {call.duration}</span>
                  </div>
                </div>
              </div>

              {/* Quick Call Action */}
              <button
                onClick={() => startCall(call.contact as any, call.type)}
                className="btn-icon w-8 h-8 hover:border-cobalt hover:text-cobalt"
                title={`Call ${call.contact.name}`}
              >
                {call.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
