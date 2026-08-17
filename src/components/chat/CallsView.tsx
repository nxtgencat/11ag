import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';
import { Avatar } from '../common/Avatar';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';

export const CallsView: React.FC = () => {
  const { contacts } = useChat();
  const { startCall } = useCall();

  const callHistory = [
    { contact: contacts[0], type: 'video' as const, time: 'Today at 10:40 AM', status: 'incoming' },
    { contact: contacts[1], type: 'voice' as const, time: 'Yesterday at 5:12 PM', status: 'outgoing' },
    { contact: contacts[3], type: 'voice' as const, time: 'Yesterday at 2:00 PM', status: 'missed' },
    { contact: contacts[5], type: 'video' as const, time: 'Monday at 8:30 PM', status: 'incoming' },
    { contact: contacts[6], type: 'voice' as const, time: 'Sunday at 11:20 AM', status: 'outgoing' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21] border-r border-[#e9edef] dark:border-[#222d34] overflow-y-auto select-none">
      <div className="p-4 border-b border-[#f0f2f5] dark:border-[#202c33] bg-[#f0f2f5] dark:bg-[#202c33]">
        <h2 className="font-bold text-lg text-[#111b21] dark:text-[#e9edef]">Calls</h2>
      </div>

      <div className="p-3 divide-y divide-[#f0f2f5] dark:divide-[#202c33]">
        {callHistory.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 px-2 hover:bg-[#f5f6f6] dark:hover:bg-[#202c33] rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Avatar src={item.contact.avatar} name={item.contact.name} size="md" />
              <div>
                <h4 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef]">
                  {item.contact.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#8696a0] mt-0.5">
                  {item.status === 'missed' ? (
                    <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                  ) : item.status === 'incoming' ? (
                    <PhoneIncoming className="w-3.5 h-3.5 text-wa-green" />
                  ) : (
                    <PhoneOutgoing className="w-3.5 h-3.5 text-wa-green" />
                  )}
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startCall(item.contact, item.type)}
              className="p-2 text-wa-green-deep dark:text-wa-green hover:bg-wa-green/10 rounded-full transition-colors"
            >
              {item.type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
