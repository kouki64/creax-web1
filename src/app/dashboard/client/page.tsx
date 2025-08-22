'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ダミーデータ
const dummyProjects = [
  {
    id: '1',
    title: 'YouTubeチャンネル用BGM制作',
    status: 'in_progress',
    statusLabel: '進行中',
    budget: '¥50,000 - ¥100,000',
    deadline: '2025/09/15',
    proposals: 5,
    unreadMessages: 2
  },
  {
    id: '2',
    title: 'ゲーム用サウンドエフェクト',
    status: 'open',
    statusLabel: '募集中',
    budget: '¥30,000 - ¥50,000',
    deadline: '2025/09/30',
    proposals: 8,
    unreadMessages: 0
  },
  {
    id: '3',
    title: 'ポッドキャスト用ジングル',
    status: 'completed',
    statusLabel: '完了',
    budget: '¥20,000',
    deadline: '2025/08/01',
    proposals: 3,
    unreadMessages: 0
  }
];

const dummyMessages = [
  {
    id: '1',
    sender: '山田クリエイター',
    avatar: '🎵',
    project: 'YouTubeチャンネル用BGM制作',
    message: 'デモ音源を送付しました。ご確認ください。',
    time: '10分前',
    unread: true
  },
  {
    id: '2',
    sender: '鈴木サウンド',
    avatar: '🎧',
    project: 'ゲーム用サウンドエフェクト',
    message: 'ご提案について質問があります。',
    time: '1時間前',
    unread: true
  },
  {
    id: '3',
    sender: '佐藤ミュージック',
    avatar: '🎹',
    project: 'ポッドキャスト用ジングル',
    message: 'ありがとうございました！',
    time: '昨日',
    unread: false
  }
];

export default function ClientDashboard() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = selectedTab === 'all' 
    ? dummyProjects 
    : dummyProjects.filter(p => p.status === selectedTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Creax"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard/client" className="text-creax-orange font-medium">
                  ダッシュボード
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  案件管理
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  メッセージ
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  支払い
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <span className="sr-only">通知</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">田中</span>
                </div>
                <span className="text-sm font-medium text-gray-700">田中様</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">こんにちは、田中様</h1>
          <p className="text-gray-600 mt-2">プロジェクトの進捗状況をご確認ください</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">進行中案件</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">提案受信</p>
                <p className="text-2xl font-semibold text-gray-900">16</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今月の支払</p>
                <p className="text-2xl font-semibold text-gray-900">¥125,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">未読メッセージ</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 案件一覧 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">案件一覧</h2>
                  <Link 
                    href="/projects/create"
                    className="bg-creax-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-creax-orange-dark transition"
                  >
                    新規案件作成
                  </Link>
                </div>
                <div className="flex space-x-4 mt-4">
                  {(['all', 'open', 'in_progress', 'completed'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        selectedTab === tab
                          ? 'bg-creax-orange text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab === 'all' && '全て'}
                      {tab === 'open' && '募集中'}
                      {tab === 'in_progress' && '進行中'}
                      {tab === 'completed' && '完了'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          {project.unreadMessages > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {project.unreadMessages} 新着
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{project.budget}</span>
                          <span>•</span>
                          <span>納期: {project.deadline}</span>
                          <span>•</span>
                          <span>{project.proposals} 件の提案</span>
                        </div>
                      </div>
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-gray-200">
                <Link href="#" className="text-sm text-creax-orange hover:text-creax-orange-dark font-medium">
                  全ての案件を見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 最近のメッセージ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">最近のメッセージ</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {dummyMessages.map((message) => (
                  <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 text-2xl">{message.avatar}</div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${message.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                            {message.sender}
                          </p>
                          <p className="text-xs text-gray-500">{message.time}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{message.project}</p>
                        <p className={`text-sm mt-1 ${message.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-gray-200">
                <Link href="#" className="text-sm text-creax-orange hover:text-creax-orange-dark font-medium">
                  全てのメッセージを見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}