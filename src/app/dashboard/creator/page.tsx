'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ダミーデータ
const availableProjects = [
  {
    id: '1',
    title: 'EDM風のゲームBGM制作',
    client: '株式会社ゲームスタジオ',
    category: 'アレンジ',
    budget: '¥80,000 - ¥120,000',
    deadline: '2025/09/20',
    proposalCount: 3,
    description: 'アクションゲーム用のBGMを制作していただきたいです。EDM風で...',
    tags: ['EDM', 'ゲーム', '3分程度'],
    isNew: true
  },
  {
    id: '2',
    title: 'ポッドキャスト用ジングル作成',
    client: '個人',
    category: '作曲',
    budget: '¥20,000 - ¥30,000',
    deadline: '2025/09/10',
    proposalCount: 8,
    description: 'ビジネス系ポッドキャストのオープニングジングルを...',
    tags: ['ジングル', '15秒', 'ビジネス'],
    isNew: true
  },
  {
    id: '3',
    title: 'アコースティックアレンジ',
    client: 'シンガーソングライター田中',
    category: 'アレンジ',
    budget: '¥50,000 - ¥70,000',
    deadline: '2025/09/25',
    proposalCount: 5,
    description: '既存の楽曲をアコースティックバージョンにアレンジ...',
    tags: ['アコースティック', 'J-POP'],
    isNew: false
  }
];

const myProposals = [
  {
    id: '1',
    projectTitle: 'CM音楽制作',
    status: 'pending',
    statusLabel: '選考中',
    proposedAmount: '¥65,000',
    proposedDate: '2025/08/20',
    client: 'ABC広告代理店'
  },
  {
    id: '2',
    projectTitle: 'YouTubeチャンネル用BGM',
    status: 'accepted',
    statusLabel: '採用',
    proposedAmount: '¥45,000',
    proposedDate: '2025/08/18',
    client: '山田太郎'
  },
  {
    id: '3',
    projectTitle: 'ゲーム効果音制作',
    status: 'rejected',
    statusLabel: '不採用',
    proposedAmount: '¥30,000',
    proposedDate: '2025/08/15',
    client: 'ゲーム会社XYZ'
  }
];

const activeProjects = [
  {
    id: '1',
    title: 'YouTubeチャンネル用BGM',
    client: '山田太郎',
    deadline: '2025/09/05',
    progress: 60,
    nextMilestone: 'ミックス完了',
    payment: '¥45,000',
    unreadMessages: 2
  }
];

const earnings = {
  thisMonth: 125000,
  lastMonth: 98000,
  pending: 45000,
  available: 234000
};

export default function CreatorDashboard() {
  const [selectedTab, setSelectedTab] = useState<'available' | 'proposals' | 'active'>('available');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = categoryFilter === 'all' 
    ? availableProjects 
    : availableProjects.filter(p => p.category === categoryFilter);

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
                <Link href="/dashboard/creator" className="text-creax-orange font-medium">
                  ダッシュボード
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  案件を探す
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  提案管理
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  メッセージ
                </Link>
                <Link href="#" className="text-gray-700 hover:text-creax-orange transition">
                  収益管理
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
                  <span className="text-sm font-medium">🎵</span>
                </div>
                <span className="text-sm font-medium text-gray-700">クリエーター山田</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ウェルカムメッセージ */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">こんにちは、山田さん</h1>
          <p className="text-gray-600 mt-2">新しい案件をチェックしましょう</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今月の収益</p>
                <p className="text-2xl font-semibold text-gray-900">¥{earnings.thisMonth.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">進行中案件</p>
                <p className="text-2xl font-semibold text-gray-900">{activeProjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">提案中</p>
                <p className="text-2xl font-semibold text-gray-900">{myProposals.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">評価</p>
                <p className="text-2xl font-semibold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 案件リスト */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">案件</h2>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-creax-orange focus:border-creax-orange"
                  >
                    <option value="all">全カテゴリー</option>
                    <option value="作曲">作曲</option>
                    <option value="アレンジ">アレンジ</option>
                    <option value="ミックス">ミックス</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedTab('available')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      selectedTab === 'available'
                        ? 'bg-creax-orange text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    募集中案件
                  </button>
                  <button
                    onClick={() => setSelectedTab('proposals')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      selectedTab === 'proposals'
                        ? 'bg-creax-orange text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    提案済み
                  </button>
                  <button
                    onClick={() => setSelectedTab('active')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      selectedTab === 'active'
                        ? 'bg-creax-orange text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    進行中
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {/* 募集中案件 */}
                {selectedTab === 'available' && filteredProjects.map((project) => (
                  <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          {project.isNew && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <span className="text-gray-900 font-medium">{project.budget}</span>
                          <span className="text-gray-500">納期: {project.deadline}</span>
                          <span className="text-gray-500">{project.proposalCount}件の提案</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-creax-orange text-white text-sm rounded-lg hover:bg-creax-orange-dark transition">
                        提案する
                      </button>
                    </div>
                  </div>
                ))}

                {/* 提案済み案件 */}
                {selectedTab === 'proposals' && myProposals.map((proposal) => (
                  <div key={proposal.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {proposal.projectTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{proposal.client}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>提案額: {proposal.proposedAmount}</span>
                          <span>提案日: {proposal.proposedDate}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}

                {/* 進行中案件 */}
                {selectedTab === 'active' && activeProjects.map((project) => (
                  <div key={project.id} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                      </div>
                      {project.unreadMessages > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {project.unreadMessages} 新着
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">進捗</span>
                          <span className="text-gray-900 font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-creax-orange h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">次のマイルストーン:</span>
                        <span className="text-gray-900">{project.nextMilestone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">納期:</span>
                        <span className="text-gray-900">{project.deadline}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">報酬:</span>
                        <span className="text-gray-900 font-medium">{project.payment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-gray-200">
                <Link href="#" className="text-sm text-creax-orange hover:text-creax-orange-dark font-medium">
                  すべて見る →
                </Link>
              </div>
            </div>
          </div>

          {/* 右サイドバー */}
          <div className="space-y-6">
            {/* 収益サマリー */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">収益サマリー</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">利用可能残高</span>
                  <span className="text-lg font-semibold text-gray-900">¥{earnings.available.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">保留中</span>
                  <span className="text-sm text-gray-900">¥{earnings.pending.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">先月の収益</span>
                  <span className="text-sm text-gray-900">¥{earnings.lastMonth.toLocaleString()}</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-creax-orange text-white rounded-lg hover:bg-creax-orange-dark transition">
                  出金申請
                </button>
              </div>
            </div>

            {/* プロフィール完成度 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">プロフィール</h2>
              </div>
              <div className="px-6 py-4">
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">完成度</span>
                    <span className="text-gray-900 font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-creax-orange h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  プロフィールを完成させると案件の受注率が上がります
                </p>
                <Link href="#" className="text-sm text-creax-orange hover:text-creax-orange-dark font-medium">
                  プロフィールを編集 →
                </Link>
              </div>
            </div>

            {/* お知らせ */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">お知らせ</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">新機能リリース</p>
                  <p className="text-gray-600 text-xs mt-1">楽曲販売機能が追加されました</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">メンテナンスのお知らせ</p>
                  <p className="text-gray-600 text-xs mt-1">9/1 AM2:00-4:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}