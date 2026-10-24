import { useState } from 'react'
import {
  Send,
  MessageSquare,
  Shield,
  Clock,
  User,
  ArrowLeft,
  CheckCheck,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useReports } from '../context/ReportsContext'
import { formatRelativeTime } from '../lib/utils'

interface MockMessage {
  id: string
  sender_id: string
  sender_name: string
  body: string
  created_at: string
}

interface MockConversation {
  id: string
  item_name: string
  other_user_name: string
  last_message: string
  last_message_at: string
  unread: boolean
  messages: MockMessage[]
}

const INITIAL_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv-1',
    item_name: 'Black Wireless Earbuds',
    other_user_name: 'Aravind K. (Finder)',
    last_message: 'Yes! They are currently stored at the college central library reception desk.',
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread: false,
    messages: [
      {
        id: 'm1',
        sender_id: 'other',
        sender_name: 'Aravind K.',
        body: 'Hello! I found a pair of black earbuds near the 2nd floor library reading area.',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'm2',
        sender_id: 'me',
        sender_name: 'Me',
        body: 'Hi Aravind, thank you so much! Does the charging case have a tiny scratch on the top corner?',
        created_at: new Date(Date.now() - 5400000).toISOString(),
      },
      {
        id: 'm3',
        sender_id: 'other',
        sender_name: 'Aravind K.',
        body: 'Yes! They are currently stored at the college central library reception desk.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'conv-2',
    item_name: 'Blue College Backpack',
    other_user_name: 'Campus Security',
    last_message: 'Please bring your student ID card to room 101 between 9 AM and 4 PM.',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    unread: false,
    messages: [
      {
        id: 'm4',
        sender_id: 'other',
        sender_name: 'Campus Security',
        body: 'A blue Wildcraft backpack was handed in from Classroom 204.',
        created_at: new Date(Date.now() - 90000000).toISOString(),
      },
      {
        id: 'm5',
        sender_id: 'other',
        sender_name: 'Campus Security',
        body: 'Please bring your student ID card to room 101 between 9 AM and 4 PM.',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
]

export function MessagesPage() {
  const { user, demoLoggedIn } = useAuth()
  const [conversations, setConversations] = useState<MockConversation[]>(INITIAL_CONVERSATIONS)
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id)
  const [textInput, setTextInput] = useState('')

  const activeConversation = conversations.find((c) => c.id === activeConvId)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!textInput.trim() || !activeConversation) return

    const newMessage: MockMessage = {
      id: `m-${Date.now()}`,
      sender_id: 'me',
      sender_name: 'Me',
      body: textInput.trim(),
      created_at: new Date().toISOString(),
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            last_message: newMessage.body,
            last_message_at: newMessage.created_at,
            messages: [...c.messages, newMessage],
          }
        }
        return c
      })
    )

    setTextInput('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">Private Messages</h1>
        <p className="text-sm text-brand-muted mt-1">
          Secure, authenticated in-app messaging to coordinate item verifications and handovers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[550px]">
        {/* Conversation List */}
        <div className="border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 font-semibold text-sm text-brand-navy">
            Conversations ({conversations.length})
          </div>
          <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
            {conversations.map((c) => {
              const isActive = c.id === activeConvId
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-pale-blue/60' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.other_user_name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy truncate">
                        {c.other_user_name}
                      </span>
                      <span className="text-[10px] text-brand-muted">
                        {formatRelativeTime(c.last_message_at)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary-blue block truncate">
                      Re: {c.item_name}
                    </span>
                    <p className="text-xs text-brand-muted truncate mt-0.5">{c.last_message}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2 flex flex-col h-[550px]">
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-brand-navy">
                    {activeConversation.other_user_name}
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Regarding item:{' '}
                    <span className="font-semibold text-primary-blue">
                      {activeConversation.item_name}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <Shield className="w-3.5 h-3.5" /> End-to-End Private
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {activeConversation.messages.map((m) => {
                  const isMe = m.sender_id === 'me'
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-primary-blue text-white rounded-br-xs'
                            : 'bg-white text-brand-text border border-gray-200 rounded-bl-xs shadow-sm'
                        }`}
                      >
                        {m.body}
                      </div>
                      <span className="text-[10px] text-brand-muted mt-1 px-1">
                        {formatRelativeTime(m.created_at)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a safe message (coordinate handover time, verify details)..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="input-base text-xs py-2.5 flex-1"
                />
                <Button type="submit" variant="primary" size="sm" className="px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-brand-muted text-sm">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
