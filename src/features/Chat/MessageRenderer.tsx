import { clsx } from 'clsx';
import type { ChatMessage } from '../../store/store';
import ProposalCard from '../Cards/ProposalCard';
import PixPaymentCard from '../Cards/PixPaymentCard';
import DocumentCheckinCard from '../Cards/DocumentCheckinCard';
import CheckinFormCard from '../Cards/CheckinFormCard';
import SuccessCard from '../Cards/SuccessCard';
import StrategiesCard from '../Cards/StrategiesCard';

interface MessageRendererProps {
    message: ChatMessage;
}

export default function MessageRenderer({ message }: MessageRendererProps) {
    const isBot = message.sender === 'bot';
    // const isUser = message.sender === 'user'; // unused
    const isSystem = message.type === 'system' || message.type === 'divider';
    const isCard = message.type === 'card';

    if (isCard) {
        if (message.content === 'proposal') return <div className="w-full my-4"><ProposalCard /></div>;
        if (message.content === 'pix') return <div className="w-full my-4"><PixPaymentCard /></div>;
        if (message.content === 'docs') return <div className="w-full my-4"><DocumentCheckinCard /></div>;
        if (message.content === 'checkin-form') return <div className="w-full my-4"><CheckinFormCard /></div>;
        if (message.content === 'success') return <div className="w-full my-4"><SuccessCard /></div>;
        if (message.content === 'strategies') return <div className="w-full my-4"><StrategiesCard /></div>;
        return null; // This is inside the if(isCard) block
    }

    if (message.type === 'image') {
        return (
            <div className={clsx(
                "flex w-full message-enter",
                isBot ? "justify-start" : "justify-end"
            )}>
                <div className={clsx(
                    "max-w-[70%] p-2 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100",
                    isBot ? "rounded-tl-none" : "rounded-tr-none"
                )}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={message.content} alt="Uploaded Document" className="w-full h-auto rounded-lg object-cover" />
                </div>
            </div>
        );
    }

    if (isSystem) {
        return (
            <div className="w-full my-4" dangerouslySetInnerHTML={{ __html: message.content }} />
        );
    }

    return (
        <div className={clsx(
            "flex w-full message-enter",
            isBot ? "justify-start" : "justify-end"
        )}>
            <div className={clsx(
                "max-w-[85%] p-4 text-[15px] leading-relaxed relative",
                isBot ? "bubble-alfredo rounded-2xl rounded-tl-none text-[#2D4A3A]" : "bubble-user rounded-2xl rounded-tr-none text-[#132116] font-medium text-right"
            )}>
                {/* Safe HTML rendering for simple formatting like <b>, <i> */}
                <span dangerouslySetInnerHTML={{ __html: message.content }} />
            </div>
        </div>
    );
}
