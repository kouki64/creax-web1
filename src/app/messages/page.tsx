'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderRole: 'client' | 'creator'
  timestamp: string
  read: boolean
}

interface Thread {
  id: string
  projectId: string
  projectTitle: string
  otherUserName: string
  otherUserRole: 'client' | 'creator'
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'closed'
}

export default function MessagesPage() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: 'client' | 'creator' } | null>(null)

  useEffect(() => {
    // ユーザー情報を取得（モック）
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCurrentUser({
        id: userData.id || '1',
        name: userData.name || 'テストユーザー',
        role: userData.role || 'client'
      })
    }

    // スレッド一覧を取得
    fetchThreads()
  }, [])

  useEffect(() => {
    // メッセージ一覧の最下部にスクロール
    scrollToBottom()
  }, [messages])

  const fetchThreads = async () => {
    setLoading(true)
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      const mockThreads: Thread[] = [
        {
          id: '1',
          projectId: 'proj1',
          projectTitle: 'アイドルグループ新曲のアレンジ制作',
          otherUserName: 'RINGAX Records',
          otherUserRole: 'client',
          lastMessage: 'ありがとうございます。詳細を確認させていただきます。',
          lastMessageTime: '2025-04-22T10:30:00Z',
          unreadCount: 2,
          status: 'active'
        },
        {
          id: '2',
          projectId: 'proj2',
          projectTitle: 'CM用BGM制作（30秒）',
          otherUserName: '広告代理店A',
          otherUserRole: 'client',
          lastMessage: '修正依頼を送らせていただきました。',
          lastMessageTime: '2025-04-21T15:45:00Z',
          unreadCount: 0,
          status: 'active'
        },
        {
          id: '3',
          projectId: 'proj3',
          projectTitle: 'ポップス楽曲のミキシング',
          otherUserName: '山田太郎',
          otherUserRole: 'creator',
          lastMessage: '納品完了しました。ご確認ください。',
          lastMessageTime: '2025-04-20T09:00:00Z',
          unreadCount: 1,
          status: 'closed'
        }
      ]
      setThreads(mockThreads)
      setLoading(false)
      
      // 最初のスレッドを自動選択
      if (mockThreads.length > 0) {
        selectThread(mockThreads[0])
      }
    }, 1000)
  }

  const selectThread = (thread: Thread) => {
    setSelectedThread(thread)
    fetchMessages(thread.id)
    
    // 未読をクリア
    setThreads(prev => prev.map(t => 
      t.id === thread.id ? { ...t, unreadCount: 0 } : t
    ))
  }

  const fetchMessages = async (threadId: string) => {
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'はじめまして。アレンジの件でご連絡させていただきました。',
          senderId: '2',
          senderName: 'RINGAX Records',
          senderRole: 'client',
          timestamp: '2025-04-22T09:00:00Z',
          read: true
        },
        {
          id: '2',
          content: 'お世話になっております。提案内容を拝見しました。とても素晴らしい内容で、ぜひお願いしたいと思います。',
          senderId: '2',
          senderName: 'RINGAX Records',
          senderRole: 'client',
          timestamp: '2025-04-22T09:30:00Z',
          read: true
        },
        {
          id: '3',
          content: 'ありがとうございます！光栄です。早速制作に取り掛からせていただきます。',
          senderId: '1',
          senderName: 'あなた',
          senderRole: 'creator',
          timestamp: '2025-04-22T10:00:00Z',
          read: true
        },
        {
          id: '4',
          content: '初稿の提出予定日はいつ頃になりますでしょうか？',
          senderId: '2',
          senderName: 'RINGAX Records',
          senderRole: 'client',
          timestamp: '2025-04-22T10:15:00Z',
          read: true
        },
        {
          id: '5',
          content: '5月1日までには初稿を提出させていただく予定です。',
          senderId: '1',
          senderName: 'あなた',
          senderRole: 'creator',
          timestamp: '2025-04-22T10:20:00Z',
          read: true
        },
        {
          id: '6',
          content: 'ありがとうございます。詳細を確認させていただきます。',
          senderId: '2',
          senderName: 'RINGAX Records',
          senderRole: 'client',
          timestamp: '2025-04-22T10:30:00Z',
          read: false
        }
      ]
      setMessages(mockMessages)
    }, 500)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedThread || !currentUser) return
    
    setSending(true)
    
    // TODO: 実際のAPI呼び出しに置き換える
    setTimeout(() => {
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        content: newMessage,
        senderId: currentUser.id,
        senderName: 'あなた',
        senderRole: currentUser.role,
        timestamp: new Date().toISOString(),
        read: false
      }
      
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
      setSending(false)
      
      // スレッドの最終メッセージを更新
      setThreads(prev => prev.map(t => 
        t.id === selectedThread.id 
          ? { ...t, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
          : t
      ))
    }, 500)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days}日前`
    } else if (hours > 0) {
      return `${hours}時間前`
    } else {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes > 0 ? `${minutes}分前` : '今'
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6232] mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#ff6232]">
                Creax
              </Link>
              <nav className="hidden md:flex space-x-6">
                {currentUser?.role === 'client' ? (
                  <>
                    <Link href="/projects" className="text-gray-700 hover:text-[#ff6232]">
                      案件管理
                    </Link>
                    <Link href="/messages" className="text-[#ff6232] font-medium">
                      メッセージ
                    </Link>
                    <Link href="/payments" className="text-gray-700 hover:text-[#ff6232]">
                      決済管理
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/search" className="text-gray-700 hover:text-[#ff6232]">
                      案件を探す
                    </Link>
                    <Link href="/messages" className="text-[#ff6232] font-medium">
                      メッセージ
                    </Link>
                    <Link href="/earnings" className="text-gray-700 hover:text-[#ff6232]">
                      収益管理
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full">
          {/* 左側：スレッド一覧 */}
          <div className="w-80 bg-white border-r overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">メッセージ</h2>
              <p className="text-sm text-gray-500 mt-1">
                {threads.filter(t => t.unreadCount > 0).length}件の未読
              </p>
            </div>
            
            <div className="divide-y">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => selectThread(thread)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedThread?.id === thread.id ? 'bg-orange-50 border-l-4 border-[#ff6232]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {thread.otherUserName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(thread.lastMessageTime)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">
                    {thread.projectTitle}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 truncate flex-1">
                      {thread.lastMessage}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-[#ff6232] text-white text-xs rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {thread.status === 'closed' && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      完了
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 右側：メッセージ表示エリア */}
          {selectedThread ? (
            <div className="flex-1 flex flex-col">
              {/* スレッドヘッダー */}
              <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedThread.otherUserName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedThread.projectTitle}
                    </p>
                  </div>
                  <Link
                    href={`/projects/${selectedThread.projectId}`}
                    className="text-sm text-[#ff6232] hover:underline"
                  >
                    案件詳細を見る →
                  </Link>
                </div>
              </div>

              {/* メッセージ一覧 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((message) => {
                  const isOwn = message.senderId === currentUser?.id
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-lg ${isOwn ? 'order-2' : ''}`}>
                        <div className="flex items-end space-x-2">
                          {!isOwn && (
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                          )}
                          <div>
                            <div className={`px-4 py-2 rounded-2xl ${
                              isOwn 
                                ? 'bg-[#ff6232] text-white' 
                                : 'bg-white text-gray-900 border'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${
                              isOwn ? 'text-right' : 'text-left'
                            }`}>
                              {formatMessageTime(message.timestamp)}
                              {isOwn && !message.read && (
                                <span className="ml-2 text-gray-400">未読</span>
                              )}
                            </p>
                          </div>
                          {isOwn && (
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0 order-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* メッセージ入力 */}
              <form onSubmit={sendMessage} className="bg-white border-t p-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="ファイル添付"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6232] focus:border-transparent"
                    disabled={sending}
                  />
                  
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-2 bg-[#ff6232] text-white rounded-lg hover:bg-[#ff8a5b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      '送信'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">メッセージを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}